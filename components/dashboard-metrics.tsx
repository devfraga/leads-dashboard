"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, MessageSquareCode as MessageSquareCheck, Clock, MessageSquareX, Phone } from "lucide-react"
import { getClientes, type Cliente } from "@/lib/supabase"
import { allMockClientes } from "@/lib/mock-data"

const calculateMetrics = (clientes: Cliente[]) => {
  const totalLeads = clientes.length
  const interestedLeads = clientes.filter((cliente) => cliente.interessado).length
  const leadsLast7Days = clientes.filter((cliente) => {
    const clienteDate = new Date(cliente.created_at)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    return clienteDate >= sevenDaysAgo
  }).length
  const conversasTravadas = clientes.filter((cliente) => cliente.trava).length

  return {
    totalLeads,
    interestedLeads,
    leadsLast7Days,
    conversasTravadas,
  }
}

export function DashboardMetrics() {
  const [clientes, setClientes] = useState<Cliente[]>(allMockClientes)
  const [loading, setLoading] = useState(false)

  const loadClientes = async () => {
    setLoading(true)
    try {
      const data = await getClientes()
      if (data.length > 0) {
        setClientes(data)
      }
    } catch (error) {
      console.error("Erro ao carregar clientes:", error)
      // Keep using mock data if Supabase fails
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClientes()
  }, [])

  const metrics = calculateMetrics(clientes)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--whatsapp-green)] text-white">
          <MessageCircle className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Dashboard WhatsApp</h2>
          <p className="text-muted-foreground">Automação de Leads e Conversas</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-[var(--whatsapp-green)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
            <Phone className="h-4 w-4 text-[var(--whatsapp-green)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : metrics.totalLeads.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Contatos no WhatsApp</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Interessados</CardTitle>
            <MessageSquareCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{loading ? "..." : metrics.interestedLeads}</div>
            <p className="text-xs text-muted-foreground">Responderam positivamente</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos (7 dias)</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{loading ? "..." : metrics.leadsLast7Days}</div>
            <p className="text-xs text-muted-foreground">Novos contatos esta semana</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversas Travadas</CardTitle>
            <MessageSquareX className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{loading ? "..." : metrics.conversasTravadas}</div>
            <p className="text-xs text-muted-foreground">Conversas pausadas/travadas</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
