import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (session?.user?.role !== "admin" && session?.user?.role !== "sadmin") {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const { title, author, status, eventDate, badge, month, description } = body

  const data: Record<string, unknown> = {}
  if (title !== undefined) data.title = title
  if (author !== undefined) data.author = author
  if (status !== undefined) data.status = status
  if (badge !== undefined) data.badge = badge
  if (month !== undefined) data.month = month
  if (description !== undefined) data.description = description
  if (eventDate !== undefined) data.eventDate = eventDate ? new Date(eventDate) : null

  const book = await prisma.book.update({
    where: { id: params.id },
    data,
  })

  return Response.json(book)
}
