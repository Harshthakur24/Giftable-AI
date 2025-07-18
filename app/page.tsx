import Features from "@/components/features";
import Header from "@/components/header";

export const metadata = {
  //   title: "Giftable AIo",
};

export default async function IndexPage() {
  return (
    <>
      <Header />
      <Features />
    </>
  );
}
