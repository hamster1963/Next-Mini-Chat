'use client'
import ReactMarkdown from 'react-markdown'

export default function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        p: ({ node, ...props }) => <p className="my-1" {...props} />,
        ul: ({ node, ...props }) => (
          <ul className="my-1 list-disc pl-4" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="my-1 list-decimal pl-4" {...props} />
        ),
        li: ({ node, ...props }) => <li className="my-0.5" {...props} />,
        h1: ({ node, ...props }) => (
          <h1 className="my-2 text-2xl font-bold" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="my-2 text-xl font-bold" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="my-2 text-lg font-bold" {...props} />
        ),
        code: ({
          node,
          inline,
          className,
          ...props
        }: {
          node?: any
          inline?: boolean
          className?: string
        } & React.HTMLAttributes<HTMLElement>) =>
          inline ? (
            <code
              className={`rounded px-1 text-neutral-800 dark:text-neutral-200 ${className}`}
              {...props}
            />
          ) : (
            <code
              className={`my-1 block rounded p-2 text-neutral-800 dark:text-neutral-200 ${className}`}
              {...props}
            />
          ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
