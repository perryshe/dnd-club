import path from "path"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateCharacterPdf } from "@/lib/pdf-generator"

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  const character = await prisma.character.findUnique({
    where: { id },
  })

  if (!character) {
    return new NextResponse("Character not found", { status: 404 })
  }

  const pdfTemplatePath = path.join(process.cwd(), "public", "5E_CharacterSheet_Fillable.pdf")

  const pdfBytes = await generateCharacterPdf(
    {
      name: character.name,
      race: character.race,
      class: character.class,
      level: character.level,
      background: character.background,
      alignment: character.alignment,
      experiencePoints: character.experiencePoints,
      hp: character.hp,
      maxHp: character.maxHp,
      tempHp: character.tempHp,
      ac: character.ac,
      initiative: character.initiative,
      speed: character.speed,
      proficiencyBonus: character.proficiencyBonus,
      inspiration: character.inspiration,
      hitDice: character.hitDice,
      hitDiceTotal: character.hitDiceTotal,
      equipment: character.equipment,
      backstory: character.backstory,
      notes: character.notes,
      stats: character.stats as Record<string, number>,
      sheet: character.sheet as Record<string, any>,
    },
    pdfTemplatePath,
  )

  return new NextResponse(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${character.name.replace(/[^a-zA-Z0-9а-яА-Я]/g, "_")}.pdf"`,
    },
  })
}
