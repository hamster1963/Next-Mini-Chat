'use client'

import { useRef, useState, useEffect } from 'react'
import { Loader } from '../components/loader-spin'
import { type CoreMessage } from 'ai'
import { continueConversation } from './actions'
import { readStreamableValue } from 'ai/rsc'
import { motion } from 'framer-motion'
import { KeyboardEvent } from 'react'
import Markdown from '../components/markdown'
import AnimatedShinyText from 'app/components/animated-shiny-text'

export default function Chat() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const formRef = useRef<HTMLFormElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<CoreMessage[]>(() => {
    if (typeof window !== 'undefined') {
      const savedMessages = localStorage.getItem('chatMessages')
      return savedMessages ? JSON.parse(savedMessages) : []
    }
    return []
  })

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault()
      formRef.current?.requestSubmit()
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  useEffect(scrollToBottom, [messages])

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages))
    }
  }, [messages])

  return (
    <>
      <MessageArea messages={messages} />
      {loading && (
        <AnimatedShinyText className="ml-0 text-sm">
          Processing...
        </AnimatedShinyText>
      )}
      <div ref={messagesEndRef} />
      <form
        className="relative"
        ref={formRef}
        onSubmit={async (e) => {
          e.preventDefault()
          setLoading(true)
          const newMessages: CoreMessage[] = [
            ...messages,
            { content: input, role: 'user' },
          ]
          setMessages(newMessages)
          setInput('')
          localStorage.setItem('chatMessages', JSON.stringify(newMessages))
          try {
            const result = await continueConversation(newMessages)
            for await (const content of readStreamableValue(result)) {
              const updatedMessages = [
                ...newMessages,
                {
                  role: 'assistant',
                  content: content as string,
                },
              ]
              setMessages(updatedMessages as CoreMessage[])
              localStorage.setItem(
                'chatMessages',
                JSON.stringify(updatedMessages)
              )
            }
          } catch (error) {
            alert(error)
          } finally {
            setLoading(false)
          }
        }}
      >
        <textarea
          aria-label="Your message"
          placeholder="Message... (Shift+Enter to submit)"
          name="entry"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          required
          className="mb-4 mt-2 block min-h-[60px] w-full resize-none rounded-lg border-neutral-300 bg-neutral-100 py-4 pl-4 pr-32 text-[14px] text-neutral-900 placeholder-neutral-400 outline-none dark:bg-neutral-800 dark:text-neutral-100"
          rows={3}
        />
        <SubmitButton loading={loading} />
        {messages.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setMessages([])
              localStorage.removeItem('chatMessages')
            }}
            className="txt-compact-small-plus absolute bottom-2 left-2 inline-flex w-fit items-center justify-center gap-x-1 overflow-hidden rounded-md bg-red-500 px-1 py-0.5 text-[12px] text-ui-fg-on-inverted outline-none transition-fg after:button-inverted-gradient hover:after:button-inverted-hover-gradient active:after:button-inverted-pressed-gradient after:absolute after:inset-0 after:transition-fg after:content-[''] hover:bg-red-400 focus-visible:!shadow-buttons-inverted-focus active:bg-ui-button-inverted-pressed disabled:border-ui-border-base disabled:bg-ui-bg-disabled disabled:text-ui-fg-disabled disabled:shadow-buttons-neutral disabled:after:hidden dark:text-white"
          >
            Clear
          </button>
        )}
      </form>
    </>
  )
}

const MessageArea = ({ messages }: { messages: CoreMessage[] }) => {
  return messages.map((m, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-4 flex flex-col"
    >
      {m.role !== 'user' && (
        <div className="w-full break-words text-sm">
          <span className="mr-1 text-neutral-600 dark:text-neutral-400">
            AI:
          </span>
          <article className="prose prose-sm prose-neutral prose-quoteless max-w-none dark:prose-invert">
            <Markdown content={m.content as string} />
          </article>
        </div>
      )}
      {m.role === 'user' && (
        <motion.div
          initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex justify-end"
        >
          <div className="mt-3 max-w-[90%] rounded-lg bg-neutral-100 p-2 text-left text-xs text-neutral-800 dark:bg-neutral-800 dark:text-neutral-400">
            {m.content as string}
          </div>
        </motion.div>
      )}
    </motion.div>
  ))
}

const SubmitButton = ({ loading }: { loading: boolean }) => {
  return (
    <button
      disabled={loading}
      type="submit"
      className="txt-compact-small-plus absolute bottom-2 right-2 inline-flex w-fit items-center justify-center gap-x-1 overflow-hidden rounded-md bg-ui-button-inverted px-2 py-1 text-ui-fg-on-inverted shadow-buttons-inverted outline-none transition-fg after:button-inverted-gradient hover:after:button-inverted-hover-gradient active:after:button-inverted-pressed-gradient after:absolute after:inset-0 after:transition-fg after:content-[''] hover:bg-ui-button-inverted-hover focus-visible:!shadow-buttons-inverted-focus active:bg-ui-button-inverted-pressed disabled:border-ui-border-base disabled:bg-ui-bg-disabled disabled:text-ui-fg-disabled disabled:shadow-buttons-neutral disabled:after:hidden dark:text-white"
    >
      {loading && <Loader visible={true} />}
      Submit
    </button>
  )
}
