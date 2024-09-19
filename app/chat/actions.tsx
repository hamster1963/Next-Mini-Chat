'use server'

import { createStreamableValue } from 'ai/rsc'
import { CoreMessage, streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

const openai = createOpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
})

export async function continueConversation(messages: CoreMessage[]) {
  const result = await streamText({
    model: openai(process.env.OPENAI_MODEL || 'gpt-4o-mini'),
    messages,
  })

  const stream = createStreamableValue(result.textStream)
  return stream.value
}
