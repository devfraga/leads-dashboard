"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ChevronLeft, ChevronRight, Lock, Unlock, Filter, MessageCircle, Phone } from "lucide-react"
import { getClientes, updateClienteStatus, type Cliente } from "@/lib/supabase"
import { allMockClientes } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

const ITEMS_PER_PAGE = 20

export function LeadsTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [clientes, setClientes] = useState<Cliente[]>(allMockClientes)
  const [showFollowUpFilter, setShowFollowUpFilter] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

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

  const filteredClientes = showFollowUpFilter ? clientes.filter((cliente) => cliente.follow_up >= 1) : clientes
  const totalPages = Math.ceil(filteredClientes.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentClientes = filteredClientes.slice(startIndex, endIndex)

  const handleToggleConversation = async (clienteId: number, clienteName: string | null) => {
    const cliente = clientes.find((c) => c.id === clienteId)
    if (!cliente) return

    const newTravaStatus = !cliente.trava

    // Try to update in Supabase first
    const success = await updateClienteStatus(clienteId, newTravaStatus)

    if (success) {
      // Update local state
      setClientes((prevClientes) => prevClientes.map((c) => (c.id === clienteId ? { ...c, trava: newTravaStatus } : c)))

      const action = newTravaStatus ? "travada" : "destravada"
      toast({
        title: `Conversa ${action}`,
        description: `A conversa com ${clienteName} foi ${action} com sucesso.`,
      })
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status da conversa.",
        variant: "destructive",
      })
    }
  }

  const toggleFollowUpFilter = () => {
    setShowFollowUpFilter(!showFollowUpFilter)
    setCurrentPage(1)
  }

  const clearFilter = () => {
    setShowFollowUpFilter(false)
    setCurrentPage(1)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--whatsapp-green)] text-white">
              <MessageCircle className="h-4 w-4" />
            </div>
            <span>Clientes do WhatsApp</span>
          </div>
          <div className="flex items-center gap-2">
            {!showFollowUpFilter ? (
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFollowUpFilter}
                className="flex items-center gap-2 bg-transparent"
              >
                <Filter className="h-4 w-4" />
                Follow Up
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="default" size="sm" onClick={toggleFollowUpFilter} className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Follow Up
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilter}
                  className="flex items-center gap-2 bg-transparent"
                >
                  Mostrar Todos
                </Button>
              </div>
            )}
            <Badge variant="secondary">
              {filteredClientes.length} {showFollowUpFilter ? "com follow up" : "clientes"}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Carregando clientes...</div>
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Interessado</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Follow Up</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentClientes.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell className="font-medium">{cliente.nome || "Sem nome"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-[var(--whatsapp-green)]" />
                          <span className="text-sm">{cliente.telefone || "Sem telefone"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={cliente.interessado ? "default" : "secondary"}>
                          {cliente.interessado ? "Sim" : "Não"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[150px] truncate" title={cliente.produto_intere || ""}>
                          {cliente.produto_intere || "Não informado"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={!cliente.trava ? "default" : "secondary"}
                          className={!cliente.trava ? "text-white" : "text-orange-500"}
                        >
                          {!cliente.trava ? "Ativo" : "Travado"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={cliente.follow_up > 1 ? "default" : "outline"}>{cliente.follow_up}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 bg-transparent hover:bg-[var(--whatsapp-green)] hover:text-white cursor-pointer"
                            onClick={() => {
                              const phoneNumber = cliente.telefone?.replace(/\D/g, "") // Remove non-digits
                              if (phoneNumber) {
                                const waLink = `https://wa.me/55${phoneNumber}`
                                window.open(waLink, "_blank")
                              }
                            }}
                            title="Conversar no WhatsApp"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent cursor-pointer">
                                {cliente.trava ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{cliente.trava ? "Destravar" : "Travar"} conversa</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja {cliente.trava ? "destravar" : "travar"} a conversa com{" "}
                                  {cliente.nome}?
                                  {cliente.trava
                                    ? " A automação do WhatsApp voltará a funcionar normalmente."
                                    : " A automação do WhatsApp será pausada para este cliente."}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleToggleConversation(cliente.id, cliente.nome)}>
                                  {cliente.trava ? "Destravar" : "Travar"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Paginação */}
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredClientes.length)} de {filteredClientes.length}{" "}
                {showFollowUpFilter ? "clientes com follow up > 1" : "clientes do WhatsApp"}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber
                    if (totalPages <= 5) {
                      pageNumber = i + 1
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i
                    } else {
                      pageNumber = currentPage - 2 + i
                    }

                    return (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNumber)}
                        className="h-8 w-8 p-0"
                      >
                        {pageNumber}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
