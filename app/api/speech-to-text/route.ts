import { type NextRequest, NextResponse } from "next/server"

export const maxDuration = 30 // Set max duration to 30 seconds

export async function POST(req: NextRequest) {
  try {
    // Get the audio file from the request
    const formData = await req.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    // Convert the file to a Buffer
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer())

    // Create a FormData object to send to Groq
    const groqFormData = new FormData()
    const audioBlob = new Blob([audioBuffer], { type: audioFile.type })
    groqFormData.append("file", audioBlob, "audio.webm")
    groqFormData.append("model", "whisper-large-v3-turbo")

    // Call Groq's Whisper API
    const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: groqFormData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Groq Whisper API error:", errorText)
      return NextResponse.json(
        { error: `Groq API error: ${response.status} ${response.statusText}` },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Speech-to-text error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
