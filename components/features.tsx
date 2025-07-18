import Marquee from "react-fast-marquee";
import {
  BadgeEuro,
  BadgePercent,
  BellOff,
  BotMessageSquare,
  HeartHandshake,
  LucideProps,
  MailX,
  MessageCircleHeart,
  ShieldCheck,
} from "lucide-react";
import { ForwardRefExoticComponent } from "react";
import { Button } from "./ui/button";
import Link from "next/link";

type Feature = {
  title: string;
  text?: string;
  icon: ForwardRefExoticComponent<LucideProps>;
};

const features: Feature[] = [
  {
    title: "Instant Gift Discovery",
    text: "Start finding perfect gifts immediately! No lengthy forms or account creation. Just tell us about the recipient and occasion.",
    icon: MailX,
  },
  {
    title: "Always Free to Use",
    text: "Giftable AI is completely free! No subscription fees or hidden charges. Only pay when you buy the perfect gift we help you find.",
    icon: BadgeEuro,
  },
  {
    title: "Distraction-Free Shopping",
    text: "Focus purely on gift-giving! No banner ads or pop-ups. Clean, seamless experience designed for thoughtful gift selection.",
    icon: BellOff,
  },
  {
    title: "AI-Powered Personalization",
    text: "Get custom gift recommendations in seconds! Our AI considers personality, interests, budget, and cultural preferences for perfect matches.",
    icon: MessageCircleHeart,
  },
  {
    title: "Chat-Based Simplicity",
    text: "No complex filters or endless scrolling. Simply chat with our AI like talking to a friend who knows everything about gifts.",
    icon: BotMessageSquare,
  },
  {
    title: "Secure & Private",
    text: "Your gift plans stay private! We don't store conversations or personal data. Your thoughtful surprises remain secret.",
    icon: ShieldCheck,
  },
];

export default function Features() {
  return (
    <div>
      <div>
        <Marquee
          className="border-y-2 border-y-black bg-white py-3 font-space sm:py-5"
          direction="left"
          autoFill
          pauseOnHover
        >
          {features.slice(0, 3).map((feature) => {
            return (
              <div
                className="flex items-center"
                key={"feature-top-" + feature.title}
              >
                <span className="mx-10 text-lg font-heading sm:text-xl lg:text-2xl">
                  {feature.title}
                </span>
                <feature.icon size={30} strokeWidth={3} absoluteStrokeWidth />
              </div>
            );
          })}
        </Marquee>
      </div>
      <section className="bg-main py-20 font-base lg:py-[100px]">
        <header className="mb-14 lg:mb-20 text-pretty">
          <h2 className="px-5 text-center text-white text-3xl font-space font-heading md:text-3xl lg:text-4xl">
            Your Personal AI Advisor for Perfect Gift Ideas
          </h2>
        </header>

        <div className="mx-auto grid w-container max-w-full grid-cols-1 gap-8 px-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            return (
              <div
                className="relative flex flex-col gap-3 rounded-base border-2 border-black bg-white p-5 shadow-base"
                key={i}
              >
                <div className="text-white text-xl md:text-2xl absolute top-0 right-0 -mt-4 mr-4 rounded-xl bg-mainAccent p-3 border-2 border-black">
                  <feature.icon className="size-7 md:size-8" />
                </div>
                <h3 className="text-xl font-space font-heading pr-24">
                  {feature.title}
                </h3>
                <p className="text-base font-normal">{feature.text}</p>
              </div>
            );
          })}
        </div>
        <div className="mx-auto w-container max-w-full flex mt-14 lg:mt-20 text-center justify-center px-5">
          <Button size="lg" theme="mint" asChild>
            <Link href="/chat">Start chatting and get surprised</Link>
          </Button>
        </div>
      </section>
      <div>
        <Marquee
          className="border-y-2 border-y-black bg-white py-3 font-space sm:py-5"
          direction="left"
          autoFill
          pauseOnHover
        >
          {features.slice(3, 6).map((feature) => {
            return (
              <div
                className="flex items-center"
                key={"feature-top-" + feature.title}
              >
                <span className="mx-10 text-lg font-heading sm:text-xl lg:text-2xl">
                  {feature.title}
                </span>
                <feature.icon size={30} strokeWidth={3} absoluteStrokeWidth />
              </div>
            );
          })}
        </Marquee>
      </div>
    </div>
  );
}
