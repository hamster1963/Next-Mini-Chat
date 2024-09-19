import Image from 'next/image'
import avatar from 'app/avatar.webp'

export default async function Page() {
  return (
    <section className="flex items-center justify-center p-8 pt-48">
      <section className="text-center">
        <Image
          alt={'Hamster1963'}
          src={avatar}
          height={64}
          width={64}
          sizes="33vw"
          placeholder="blur"
          className="mx-auto mb-6 h-14 w-14 rounded-full border border-neutral-200 dark:border-neutral-700"
          priority
        />
        <h1 className="mb-1 text-xl font-medium tracking-tighter">
          {process.env.SITE_TITLE || `Hamster1963's Chatbot`}
        </h1>
      </section>
    </section>
  )
}
