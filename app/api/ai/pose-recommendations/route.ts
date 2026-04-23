import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/)
  if (!match) return null
  return { mimeType: match[1], base64: match[2] }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      imageDataUrl?: string
      context?: string
    }

    if (!body.imageDataUrl) {
      return NextResponse.json({ error: 'imageDataUrl wajib diisi.' }, { status: 400 })
    }

    const parsed = parseDataUrl(body.imageDataUrl)
    if (!parsed) {
      return NextResponse.json({ error: 'Format imageDataUrl tidak valid.' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY belum diset di .env.local' },
        { status: 500 },
      )
    }

    const model =
      process.env.GEMINI_VISION_MODEL?.trim() ??
      process.env.GEMINI_TEXT_MODEL?.trim() ??
      'gemini-2.5-flash'

    const userContext = body.context?.trim() || 'Tidak ada catatan khusus.'

    const ai = new GoogleGenAI({ apiKey })
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: [
                'Kamu melihat image photo strip (beberapa potret sekaligus) sebagai referensi gaya, komposisi, dan jumlah orang di frame.',
                'Tugas: beri rekomendasi pose photobooth/photo strip yang bagus, natural, dan cocok dengan konteks user.',
                '',
                'Konteks dari user (Bahasa Indonesia):',
                userContext,
                '',
                'Aturan output:',
                '- Hanya gunakan Bahasa Indonesia.',
                '- Maksimal 7 poin.',
                '- Setiap poin: satu kalimat singkat, actionable (pose konkret, misal: "Bahu sedikit miring, berat di satu kaki").',
                '- Format: bullet dimulai "- ".',
                '- Tanpa pembuka, tanpa penutup, tanpa heading markdown.',
                '- Sesuaikan saran dengan jumlah orang jika kelihatan di foto; jika tidak yakin, beri saran general.',
              ].join('\n'),
            },
            {
              inlineData: {
                mimeType: parsed.mimeType,
                data: parsed.base64,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['TEXT'],
      },
    })

    const parts = response.candidates?.flatMap((c) => c.content?.parts ?? []) ?? []
    const textPart = parts.find((p) => p.text?.trim())
    if (textPart?.text) {
      return NextResponse.json({ text: textPart.text, usedModel: model })
    }

    return NextResponse.json({ error: 'Gemini tidak mengembalikan teks.' }, { status: 500 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
