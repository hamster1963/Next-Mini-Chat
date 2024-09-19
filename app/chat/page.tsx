import Chat from './chat'

export const metadata = {
  title: 'Chat',
  description: 'Chat with AI.',
}

export default function ChatPage() {
  return (
    <section className="sm:px-14 sm:pt-6">
      <h1 className="mb-2 text-2xl font-medium tracking-tighter">Chat</h1>
      <Chat />
    </section>
  )
}
