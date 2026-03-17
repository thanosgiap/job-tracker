"use client"

import { useEffect } from "react"
import { useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

const TIMEOUT_MS = 60 * 60 * 1000  // 60 minutes

export function useInactivityTimeout() {
  const { signOut } = useClerk()
  const router = useRouter()

  useEffect(() => {
    let timer: NodeJS.Timeout

    function resetTimer() {
      clearTimeout(timer)
      timer = setTimeout(async () => {
        await signOut()
        window.location.href = "/sign-in"
      }, TIMEOUT_MS)
    }

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"]
    events.forEach((e) => window.addEventListener(e, resetTimer))

    resetTimer()

    return () => {
      clearTimeout(timer)
      events.forEach((e) => window.removeEventListener(e, resetTimer))
    }
  }, [signOut, router])
}