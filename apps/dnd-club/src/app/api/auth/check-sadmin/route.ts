import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  return new Response(null, { status: session?.user?.role === "sadmin" ? 200 : 401 })
}
