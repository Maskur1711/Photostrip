import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      prompt?: string
    }

    const prompt = body.prompt?.trim()
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt wajib diisi.' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY belum diset di .env.local' },
        { status: 500 },
      )
    }

    const model = process.env.GEMINI_TEXT_MODEL?.trim() ?? 'gemini-2.5-flash'
    if (!model) {
      return NextResponse.json(
        { error: 'GEMINI_TEXT_MODEL belum diset di .env.local' },
        { status: 500 },
      )
    }

    const ai = new GoogleGenAI({ apiKey })

    const requestPayload = {
      contents: [
        {
          role: 'user' as const,
          parts: [
            {
              text: [
                'Rangkum jawaban menjadi poin penting saja.',
                'Aturan output:',
                '- Gunakan Bahasa Indonesia.',
                '- Maksimal 6 poin.',
                '- Setiap poin maksimal 1 kalimat singkat.',
                '- Gunakan format bullet dengan awalan "- ".',
                '- Tanpa paragraf pembuka atau penutup.',
                '',
                `Pertanyaan user: ${prompt}`,
              ].join('\n'),
            },
          ],
        },
      ],
      config: {
        responseModalities: ['TEXT'],
      },
    }

    try {
      const response = await ai.models.generateContent({
        model,
        ...requestPayload,
      })

      const parts = response.candidates?.flatMap((candidate) => candidate.content?.parts ?? []) ?? []
      const textPart = parts.find((part) => part.text?.trim())
      if (textPart?.text) {
        return NextResponse.json({
          text: textPart.text,
          usedModel: model,
        })
      }

      return NextResponse.json({ error: 'Gemini tidak mengembalikan teks.' }, { status: 500 })
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Gagal generate teks dari Gemini.' },
        { status: 500 },
      )
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
