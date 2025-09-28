import { createBrowserClient } from "@supabase/ssr"

export const createClient = () =>
  createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export interface AuthUser {
  id: string
  email: string
  created_at: string
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return { data, error }
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  return { user, error }
}

export async function onAuthStateChange(callback: (user: any) => void) {
  const supabase = createClient()
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null)
  })
  return { data }
}

export interface User {
  id: string
  email: string
  created_at: string
  last_login?: string
}

export interface Cliente {
  id: number
  created_at: string
  nome: string | null
  telefone: string | null
  trava: boolean
  follow_up: number
  interessado: boolean
  last_followup: string | null
  produto_interesse: string | null
  followup_status: string
}

const TABLE_NAME = process.env.NEXT_PUBLIC_TABLE_NAME!;

export async function getClientes(): Promise<Cliente[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from(TABLE_NAME).select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar clientes:", error)
    return []
  }

  return data || []
}

export async function updateClienteStatus(id: number, trava: boolean): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase.from(TABLE_NAME).update({ trava }).eq("id", id)

  if (error) {
    console.error("Erro ao atualizar status do cliente:", error)
    return false
  }

  return true
}
