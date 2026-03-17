import Anthropic from "@anthropic-ai/sdk"
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: Request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        let { url } = await req.json()

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 })
        }

        // Add https:// if missing
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = "https://" + url
        }

        // Fetch the job page content
        const pageRes = await fetch(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
        })

        if (!pageRes.ok) {
            return NextResponse.json(
                { error: "Failed to fetch job page" },
                { status: 400 }
            )
        }

        const html = await pageRes.text()

        // Strip HTML tags to get plain text
        const text = html
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 8000)

        // Send to Claude
        const message = await client.messages.create({
            model: "claude-sonnet-4-5",
            max_tokens: 1024,
            messages: [
                {
                    role: "user",
                    content: `Extract job application details from the following job posting text and return ONLY a JSON object with no explanation, no markdown, no code blocks — just raw JSON.

The JSON must have exactly these fields:
{
  "company": "company name or empty string",
  "role": "job title or empty string",
  "location": "location or empty string",
  "salary": "salary range or empty string",
  "notes": "2-3 sentence summary of key requirements or empty string"
}

Job posting text:
${text}`,
                },
            ],
        })

        const content = message.content[0]
        if (content.type !== "text") {
            return NextResponse.json(
                { error: "Unexpected response from AI" },
                { status: 500 }
            )
        }

        // Parse the JSON response
        // Parse the JSON response — strip markdown code blocks if present
        const raw = content.text
            .trim()
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/```\s*$/i, "")
            .trim()

        const parsed = JSON.parse(raw)

        return NextResponse.json(parsed)
    } catch (error) {
        console.error("Parse job error:", error)
        return NextResponse.json(
            { error: "Failed to parse job posting" },
            { status: 500 }
        )
    }
}