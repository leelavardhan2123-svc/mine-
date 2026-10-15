export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const apiKey = process.env.AI_API_KEY
  const baseUrl = process.env.AI_BASE_URL ?? 'https://api.openai.com/v1'
  const model = process.env.AI_MODEL ?? 'gpt-4o-mini'

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'AI service not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const body = await request.json().catch(() => null)
  if (!body || typeof body.question !== 'string') {
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const system = [
    'You are Sahara, a helpful assistant for Indian government schemes.',
    'Answer ONLY from the scheme record provided in the user message.',
    'Never invent benefit amounts, deadlines, eligibility rules or URLs.',
    'If the record does not contain the answer, say so and point to the official source.',
    'Never promise approval of benefits. Keep the answer concise.',
    'Reply in the language given by the "lang" field of the user message:',
    'en=English, te=Telugu, hi=Hindi, ta=Tamil, bn=Bengali, mr=Marathi, gu=Gujarati,',
    'kn=Kannada, ml=Malayalam, pa=Punjabi, or=Odia. If unsure, reply in English.',
  ].join(' ')

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: JSON.stringify(body) },
        ],
      }),
    })

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Upstream AI error' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const data = await response.json()
    const text = data?.choices?.[0]?.message?.content ?? ''
    return new Response(
      JSON.stringify({
        text,
        sources: body.schemeId
          ? [{ label: 'Official scheme record', url: `#${body.schemeId}` }]
          : [],
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    )
  } catch {
    return new Response(JSON.stringify({ error: 'AI request failed' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
