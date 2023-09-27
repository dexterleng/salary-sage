import { TypographyH1, TypographyH2 } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { CheckCircledIcon } from "@radix-ui/react-icons";

export default async function Index() {
  const prices = [
    {
      price: "$10",
      name: "Weekly",
      description: "Billed weekly",
    },
    {
      price: "$30",
      name: "Monthly",
      description: "Billed monthly (save $10/mo)",
      main: true,
    },
    {
      price: "$240",
      name: "Yearly",
      description: "Billed yearly (save $20/mo)",
    },
  ];

  const workflowItems = [
    {
      subtitle: "AI-Driven mock negotiations",
      description: (
        <>
          Practice with our AI-driven mock negotiations, designed to simulate
          authentic and realistic salary negotiation scenarios.
        </>
      ),
      imageSrc: "/og-twitter.png",
    },
    {
      subtitle: "Real-time coaching",
      description: (
        <>
          Not sure what to say? Our AI coach will provide hints during mock
          negotiations to ace the interview and maximize your total
          compensation.
        </>
      ),
      imageSrc: "/og-twitter.png",
    },
    {
      subtitle: "Personalized Feedback",
      description: (
        <>
          Get tailored feedback aligned with your target company’s expectations.
          Our AI coach will suggest improvements to enhance your negotiation
          prowess.
        </>
      ),
      imageSrc: "/og-twitter.png",
    },
  ];

  return (
    <div className="w-full flex flex-col justify-center text-center items-center bg-emerald-50">
      <div className="my-36 w-full px-4 max-w-6xl">
        <h1 className="mt-8 font-bold text-4xl sm:text-6xl lg:text-7xl text-neutral-900">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0E8365] via-[#15B57B] to-[#0C7C76]">
            Salary Negotiation
          </span>
          <br></br>made easier with AI
        </h1>
        <p className="mt-6 font-normal text-lg sm:text-2xl text-neutral-500">
          Personalized coaching from remarkably realistic AI hiring managers
        </p>
        <div className="w-full mt-8 flex flex-col items-center gap-2 sm:gap-6">
          <Link
            href="#pricing"
            className="max-w-xs border border-emerald-400 bg-emerald-600 hover:bg-emerald-600/80 rounded-xl text-white font-semibold text-lg py-3 px-8 shadow-2xl"
          >
            Get Started
          </Link>
        </div>
      </div>

      <div className="py-32 w-full bg-white">
        <h2 className="font-bold text-3xl sm:text-5xl text-neutral-900">
          Maximizing your total compensation<br></br> has never been easier
        </h2>
        <div className="mt-20 flex justify-center">
          <div className="flex flex-col gap-y-32  px-4 max-w-6xl">
            {workflowItems.map((workflow, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-center gap-y-8 md:gap-x-16"
              >
                <div className="md:basis-[calc(50%-2rem)]">
                  {workflow.imageSrc ? (
                    <Image
                      alt=""
                      src={workflow.imageSrc}
                      width={1200}
                      height={630}
                      className="rounded-xl shadow-md"
                    />
                  ) : null}
                </div>
                <div
                  className={`w-full flex flex-col items-center md:items-start text-center md:text-left md:basis-[calc(50%-2rem)] ${
                    index % 2 === 0 ? "md:order-last" : "md:order-first"
                  }`}
                >
                  <h3 className="mt-6 font-semibold text-2xl sm:text-3xl text-neutral-900">
                    {workflow.subtitle}
                  </h3>
                  <p className="mt-6 max-w-lg font-normal text-md text-neutral-500">
                    {workflow.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="pricing" className="py-32 w-full bg-white flex justify-center">
        <div className="w-full px-4 max-w-7xl">
          <h2 className="font-bold text-3xl sm:text-5xl text-neutral-900">
            Pricing
          </h2>

          <div className="mt-20 flex flex-row flex-wrap justify-center gap-8 ">
            {prices.map((price) => (
              <div
                key={price.name}
                className={`basis-full sm:basis-[calc(50%-1rem)] lg:basis-[calc(33.33%-2.66rem)] rounded-lg p-8 sm:p-12 bg-white border ${
                  price.main
                    ? "ring-4 ring-opacity-50 ring-emerald-100 border-emerald-500"
                    : "border border-[rgb(0,0,0,0.08)] shadow"
                } drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]`}
              >
                <h3 className="text-xl sm:text-2xl font-semibold text-neutral-900">
                  {price.name}
                </h3>
                <p className="mt-4 text-4xl sm:text-4xl font-bold text-neutral-900">
                  {price.price}
                </p>
                <p className="mt-4 text-base font-normal text-neutral-500 h-10">
                  {price.description}
                </p>
                <ul className="mt-8">
                  <li className="mt-2 flex flex-row items-center">
                    <CheckCircledIcon
                      className="text-neutral-600 inline"
                      width={21}
                      height={21}
                    />
                    <span className="ml-2 text-base font-normal text-neutral-900">
                      Unlimited AI Mock Interviews
                    </span>
                  </li>
                  <li className="mt-2 flex flex-row items-center">
                    <CheckCircledIcon
                      className="text-neutral-600 inline"
                      width={21}
                      height={21}
                    />
                    <span className="ml-2 text-base font-normal text-neutral-900">
                      Real-time coaching
                    </span>
                  </li>
                  <li className="mt-2 flex flex-row items-center">
                    <CheckCircledIcon
                      className="text-neutral-600 inline"
                      width={21}
                      height={21}
                    />
                    <span className="ml-2 text-base font-normal text-neutral-900">
                      Personalized Feedback
                    </span>
                  </li>
                </ul>
                <Link
                  href="#pricing"
                  className="inline-block mt-8 sm:mt-12 w-full text-center border border-emerald-400 bg-emerald-600 hover:bg-emerald-600/80 text-white font-semibold text-md py-3 px-6 rounded-lg"
                >
                  Subscribe
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="my-28 w-full px-4 max-w-6xl">
        <h1 className="font-bold text-3xl sm:text-4xl lg:text-6xl text-neutral-900">
          Start improving your salary negotiating skills now
        </h1>
        <div className="w-full mt-16 flex flex-col items-center gap-2 sm:gap-6">
          <Link
            href="#pricing"
            className="max-w-xs border border-emerald-400 bg-emerald-600 hover:bg-emerald-600/80 rounded-xl text-white font-semibold text-lg py-3 px-8 shadow-2xl"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>

    // <div className="w-full flex flex-col items-center">
    //   <div className="flex h-[calc(100vh-55px)] justify-center gap-8">
    //     <div className="animate-in flex flex-col gap-8 px-3 py-16 lg:py-24 justify-center">
    //       <TypographyH1>
    //         <div className="text-[64px] leading-tight">
    //           <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#0E8365] via-[#15B57B] to-[#0C7C76]">Salary Negotiation</div>
    //           made easier with AI
    //         </div>
    //       </TypographyH1>
    //       <TypographyH2>Practice negotiation to get the pay you deserve.</TypographyH2>
    //       <Link href="/sign-up"><Button size="lg" className="w-fit">Get Started</Button></Link>
    //     </div>
    //   </div>
    // </div>
  );
}
