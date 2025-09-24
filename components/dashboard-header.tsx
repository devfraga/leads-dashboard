"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, MessageCircle, RefreshCw } from "lucide-react"
import { signOut } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface DashboardHeaderProps {
  user?: any
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [whatsappStatus, setWhatsappStatus] = useState<"connected" | "disconnected">("connected")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleLogout = async () => {
    try {
      const { error } = await signOut()

      if (error) {
        toast({
          title: "Erro ao sair",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Logout realizado",
          description: "Você foi desconectado com sucesso",
        })
        router.push("/")
      }
    } catch (error) {
      toast({
        title: "Erro ao sair",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      })
    }
  }

  const handleWhatsAppRefresh = async () => {
    setIsRefreshing(true)

    // Simula verificação do status do WhatsApp
    setTimeout(() => {
      // Simula uma chance de 90% de estar conectado
      const isConnected = Math.random() > 0.1
      setWhatsappStatus(isConnected ? "connected" : "disconnected")
      setIsRefreshing(false)
    }, 1500)
  }

  useEffect(() => {
    handleWhatsAppRefresh()
  }, [])

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-whatsapp" />
            <h1 className="text-2xl font-bold text-foreground">Dashboard WhatsApp</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handleWhatsAppRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                title="Status do WhatsApp - Clique para atualizar"
              >
                <div
                  className={`w-3 h-3 rounded-full ${whatsappStatus === "connected" ? "bg-green-500" : "bg-red-500"}`}
                />
                <span className="text-sm text-muted-foreground">
                  {whatsappStatus === "connected" ? "Conectado" : "Desconectado"}
                </span>
                {isRefreshing ? <RefreshCw className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
              </button>
            </div>
            <span className="text-sm text-muted-foreground">Olá, {user?.email || "Usuário"}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
