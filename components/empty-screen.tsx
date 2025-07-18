export function EmptyScreen() {
  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-white sm:p-8 p-4 text-sm sm:text-base shadow-base border-2 border-black">
      <h1 className="text-pretty text-2xl font-space sm:text-3xl tracking-tight font-semibold max-w-fit inline-block">
        Let&apos;s find the perfect gift together!
      </h1>
      <p className="leading-snug text-zinc-900">
        Just tell me what you&apos;re looking for, and I&apos;ll instantly create
        personalized gift ideas. No endless lists, no stress – just cool
        suggestions just for you. Let&apos;s start and find the ideal gift!
      </p>
    </div>
  );
}
