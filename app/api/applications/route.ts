import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { db } from "../../../lib/db"
import { ApplicationSchema } from "../../../lib/validations"

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const applications = await db.application.findMany({
      where: { userId: user.id },
      orderBy: { appliedAt: "desc" },
    })

    return NextResponse.json(applications)
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await req.json()
    const validated = ApplicationSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.flatten() },
        { status: 400 }
      )
    }

    const application = await db.application.create({
      data: {
        ...validated.data,
        userId: user.id,
      },
    })

    return NextResponse.json(application, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}