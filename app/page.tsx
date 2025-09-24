import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Leads Dashboard</h1>
          <p className="text-muted-foreground mt-2">Faça login para acessar o painel de leads</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
