import { type NextRequest, NextResponse } from "next/server"

export const maxDuration = 30 // Set max duration to 30 seconds

export async function POST(req: NextRequest) {
  try {
    const { text, voice = "alloy" } = await req.json()

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 })
    }

    // We're not actually using this API anymore since we're using Web Speech API directly
    // But we'll keep it for potential future use
    return NextResponse.json({ success: true, message: "Using Web Speech API instead" })
  } catch (error) {
    console.error("Text-to-speech error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}

// Add support for GET requests for the HTML5 audio player
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const text = searchParams.get("text")
    const voice = searchParams.get("voice") || "alloy"

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 })
    }

    // Limit text length to prevent timeouts
    const truncatedText = text.length > 1000 ? text.substring(0, 1000) + "..." : text

    console.log(`TTS API GET: Converting text to speech with voice ${voice}`)
    console.log(`Text length: ${truncatedText.length} characters`)

    // Call Groq's PlayAI TTS API
    const response = await fetch("https://api.groq.com/openai/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "playai-tts",
        input: truncatedText,
        voice,
        response_format: "mp3",
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Groq TTS API error:", errorText)
      return NextResponse.json(
        { error: `Groq API error: ${response.status} ${response.statusText}` },
        { status: response.status },
      )
    }

    // Get the audio data as an array buffer
    const audioData = await response.arrayBuffer()
    console.log(`Received ${audioData.byteLength} bytes of audio data`)

    if (audioData.byteLength === 0) {
      return NextResponse.json({ error: "Received empty audio data from Groq" }, { status: 500 })
    }

    // Return the audio data with explicit headers
    return new Response(audioData, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioData.byteLength.toString(),
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("Text-to-speech error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
