import { Button } from "@/components/ui/button";
import Link from "next/link";

// bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:80px_80px]

export default function Header() {
  return (
    <header className="inset-0 flex min-h-[80dvh] w-full flex-col items-center justify-center">
      <div className="mx-auto w-container max-w-3xl px-5 py-[100px] text-center lg:py-[120px]0">
        <h1 className="font-space text-5xl font-heading md:text-5xl lg:text-6xl text-pretty">
          Find the perfect gift in seconds! 🎁
        </h1>
        <p className="my-12 mt-8 text-md font-normal leading-relaxed md:text-lg lg:text-xl lg:leading-relaxed">
          Skip the gift-hunting stress! Our smart AI understands Indian festivals,
          personal preferences, and budgets to suggest meaningful gifts that truly delight.
          From Diwali hampers to birthday surprises - we've got you covered!
        </p>

        <Button size="lg" theme="mint" asChild>
          <Link href="/chat">Start Finding Gifts with AI</Link>
        </Button>
      </div>
    </header>
  );
}
