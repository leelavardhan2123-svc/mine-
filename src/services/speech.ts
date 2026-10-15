export function speakText(
  text: string,
  lang: 'en-IN' | 'te-IN' = 'en-IN',
  onEnd?: () => void,
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false
  try {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.96
    if (onEnd) {
      utterance.onend = () => onEnd()
      utterance.onerror = () => onEnd()
    }
    window.speechSynthesis.speak(utterance)
    return true
  } catch {
    return false
  }
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}

export function speechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

type SpeechRecognitionLike = {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  start: () => void
  stop: () => void
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onerror: ((event?: { error?: string }) => void) | null
  onend: (() => void) | null
}

type RecognitionCtor = new () => SpeechRecognitionLike

export function voiceInputSupported(): boolean {
  if (typeof window === 'undefined') return false
  const w = window as unknown as Record<string, unknown>
  return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition)
}

export function startVoiceInput(options: {
  lang: 'en-IN' | 'te-IN'
  onResult: (text: string) => void
  onEnd?: () => void
  onError?: () => void
}): (() => void) | null {
  const w = window as unknown as Record<string, unknown>
  const Ctor = (w.SpeechRecognition ?? w.webkitSpeechRecognition) as
    | RecognitionCtor
    | undefined
  if (!Ctor) return null
  try {
    const recognition = new Ctor()
    recognition.lang = options.lang
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? ''
      if (transcript) options.onResult(transcript)
    }
    recognition.onerror = (event) => {
      if (event?.error && event.error !== 'no-speech') options.onError?.()
      options.onEnd?.()
    }
    recognition.onend = () => options.onEnd?.()
    recognition.start()
    return () => recognition.stop()
  } catch {
    return null
  }
}
