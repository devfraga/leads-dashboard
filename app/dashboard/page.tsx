"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardMetrics } from "@/components/dashboard-metrics"
import { LeadsTable } from "@/components/leads-table"
import { getCurrentUser, onAuthStateChange } from "@/lib/supabase"

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user, error } = await getCurrentUser()

        if (user && !error) {
          setIsAuthenticated(true)
          setUser(user)
        } else {
          router.push("/")
        }
      } catch (error) {
        console.error("[error]", error)
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    let subscription: any = null

    const setupAuthListener = async () => {
      try {
        const { data } = await onAuthStateChange((user) => {
          if (user) {
            setIsAuthenticated(true)
            setUser(user)
          } else {
            setIsAuthenticated(false)
            setUser(null)
            router.push("/")
          }
        })
        subscription = data.subscription
      } catch (error) {
        console.error("[v0] Auth listener setup failed:", error)
      }
    }

    setupAuthListener()

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <DashboardMetrics />
          <LeadsTable />
        </div>
      </main>
    </div>
  )
}
