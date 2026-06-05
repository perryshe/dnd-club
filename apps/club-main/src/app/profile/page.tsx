import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import PasswordChangeForm from "@/components/password-change-form"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition">
          <ArrowLeft size={20} />
          На главную
        </Link>
        <h1 className="text-3xl font-bold">Профиль</h1>
        <p className="text-slate-400 mt-1">{session.user.email}</p>
      </header>
      <main className="container mx-auto px-4 pb-16">
        <section>
          <h2 className="text-xl font-bold mb-4">Сменить пароль</h2>
          <PasswordChangeForm />
        </section>
      </main>
    </div>
  )
}
