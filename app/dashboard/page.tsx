import { UserButton } from "@clerk/nextjs"

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen items-center justify-center gap-4">
      <h1 className="text-2xl font-medium">Dashboard coming soon</h1>
      <UserButton />
    </main>
  )
}