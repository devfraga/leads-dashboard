export interface Cliente {
  id: number
  created_at: string
  nome: string | null
  telefone: string | null
  trava: boolean
  follow_up: number
  interessado: boolean
  last_followup: string | null
  produto_intere: string | null
  followup_statu: string
}

// Mock data that matches the real database structure
export const mockClientes: Cliente[] = [
  {
    id: 1,
    created_at: "2024-01-15T10:30:00Z",
    nome: "João Silva",
    telefone: "(11) 99999-1111",
    trava: false,
    follow_up: 2,
    interessado: true,
    last_followup: "2024-01-14T15:20:00Z",
    produto_intere: "Curso de Marketing Digital",
    followup_statu: "active",
  },
  {
    id: 2,
    created_at: "2024-01-14T09:15:00Z",
    nome: "Maria Santos",
    telefone: "(11) 99999-2222",
    trava: false,
    follow_up: 0,
    interessado: false,
    last_followup: null,
    produto_intere: "Consultoria Empresarial",
    followup_statu: "inactive",
  },
  {
    id: 3,
    created_at: "2024-01-13T14:45:00Z",
    nome: "Pedro Oliveira",
    telefone: "(11) 99999-3333",
    trava: true,
    follow_up: 3,
    interessado: true,
    last_followup: "2024-01-12T11:30:00Z",
    produto_intere: "Curso de Vendas",
    followup_statu: "paused",
  },
  {
    id: 4,
    created_at: "2024-01-12T16:20:00Z",
    nome: "Ana Costa",
    telefone: "(11) 99999-4444",
    trava: false,
    follow_up: 1,
    interessado: true,
    last_followup: "2024-01-11T13:45:00Z",
    produto_intere: "Mentoria Individual",
    followup_statu: "active",
  },
  {
    id: 5,
    created_at: "2024-01-11T08:30:00Z",
    nome: "Carlos Ferreira",
    telefone: "(11) 99999-5555",
    trava: false,
    follow_up: 4,
    interessado: false,
    last_followup: "2024-01-10T17:15:00Z",
    produto_intere: "Curso de Marketing Digital",
    followup_statu: "active",
  },
]

// Generate more mock data for testing
const nomes = ["João", "Maria", "Pedro", "Ana", "Carlos", "Lucia", "Roberto", "Fernanda", "Marcos", "Juliana"]
const sobrenomes = [
  "Silva",
  "Santos",
  "Oliveira",
  "Costa",
  "Ferreira",
  "Rodrigues",
  "Lima",
  "Alves",
  "Pereira",
  "Souza",
]
const produtos = ["Curso de Marketing Digital", "Consultoria Empresarial", "Curso de Vendas", "Mentoria Individual"]

const generateMoreClientes = (): Cliente[] => {
  const additionalClientes: Cliente[] = []

  for (let i = 6; i <= 50; i++) {
    const nome = nomes[Math.floor(Math.random() * nomes.length)]
    const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)]
    const produto = produtos[Math.floor(Math.random() * produtos.length)]
    const interessado = Math.random() > 0.6
    const trava = Math.random() > 0.8
    const follow_up = Math.floor(Math.random() * 7)
    const hasLastFollowup = Math.random() > 0.3

    additionalClientes.push({
      id: i,
      created_at: new Date(2024, 0, Math.floor(Math.random() * 15) + 1).toISOString(),
      nome: `${nome} ${sobrenome}`,
      telefone: `(11) 99999-${i.toString().padStart(4, "0")}`,
      trava,
      follow_up,
      interessado,
      last_followup: hasLastFollowup ? new Date(2024, 0, Math.floor(Math.random() * 10) + 1).toISOString() : null,
      produto_intere: produto,
      followup_statu: trava ? "paused" : follow_up > 0 ? "active" : "inactive",
    })
  }

  return additionalClientes
}

export const allMockClientes = [...mockClientes, ...generateMoreClientes()]
