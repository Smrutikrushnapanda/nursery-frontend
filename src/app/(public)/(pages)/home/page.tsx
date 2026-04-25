"use client";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import monstera from "@/public/images/monstera-leaves.png";
import featureImage from "@/public/images/features.jpg";
import heroImage from "@/public/images/hero-image.jpg"
import { CountUp } from "@/components/CountUp";
import { ArrowRight, ShoppingBag, Quote } from "lucide-react";
import Link from "next/link";
import best1 from "@/public/images/best-1.png"
import best2 from "@/public/images/best-2.png"
import best3 from "@/public/images/best-3.png"
import { Reveal, RevealStagger, RevealItem } from "@/src/components/Reveal";
import { CustomCursorArea } from "@/src/components/CustomCursorArea";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import AutoScroll from "embla-carousel-auto-scroll";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/acordion";

const steps = [
  {
    n: "01",
    title: "Smart Inventory Control",
    desc: "Effortlessly manage plants, pots, and accessories with real-time tracking, batch management, and instant updates — all in one place.",
  },
  {
    n: "02",
    title: "Lightning-Fast Billing",
    desc: "Scan, bill, and checkout in seconds with a mobile-first POS system designed for speed, accuracy, and a seamless customer experience.",
  },
  {
    n: "03",
    title: "Automated Payments & Invoices",
    desc: "Accept UPI, cards, and digital payments while generating GST-ready invoices that can be shared instantly via WhatsApp or email.",
  },
  {
    n: "04",
    title: "QR-Powered Plant Experience",
    desc: "Transform every plant into a smart product — customers can scan QR codes to view care tips, pricing, and details instantly.",
  },
];

const faqs = [
  {
    question: "What equipment do I need to run PlantScan?",
    answer: "PlantScan is designed to be hardware-agnostic. You can run it on any modern smartphone, tablet, or computer. Our POS system works seamlessly with standard barcode/QR scanners and thermal printers.",
  },
  {
    question: "Is my inventory data secure and backed up?",
    answer: "Absolutely. PlantScan is cloud-based, meaning your data is securely encrypted and automatically synced in real-time. Even if a device breaks, your data remains safe.",
  },
  {
    question: "Can I print custom QR codes for my plants?",
    answer: "Yes! You can generate and print custom QR codes directly from the app. Customers can scan these to view plant care instructions, pricing, and make quick purchases.",
  },
  {
    question: "Does the billing system support GST?",
    answer: "Yes, our billing and invoicing system automatically calculates GST and generates compliant receipts that can be shared instantly via WhatsApp or email.",
  },
  {
    question: "How long does it take to set up?",
    answer: "You can be fully operational in minutes. Simply import your existing inventory list via CSV, or start scanning and adding items directly using your mobile camera.",
  },
];

  const testimonials = [
  {
    quote: "PlantScan has completely transformed our operations. We've reduced billing time by 70% and our customers love the QR care tips.",
    author: "Rahul Sharma",
    role: "Owner, Green Earth Nursery",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul"
  },
  {
    quote: "The inventory tracking is a lifesaver. I no longer have to guess what's in stock. The data-driven insights are a game changer for my growth.",
    author: "Anita Desai",
    role: "Manager, Bloom & Grow",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anita"
  },
  {
    quote: "Setup was incredibly easy. Within 20 minutes, we were scanning and billing. It's the smartest investment we've made this year.",
    author: "Vikram Singh",
    role: "Founder, Urban Jungle",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram"
  },
  {
    quote: "The best part is the care tips. Our customers are much more confident buying exotic plants when they can just scan a code and get expert advice.",
    author: "Sanjay Gupta",
    role: "Owner, Paradise Plants",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sanjay"
  },
  {
    quote: "Finally, a solution that understands the nursery business. The offline mode is a lifesaver when the Wi-Fi acts up in the back greenhouse.",
    author: "Meera Nair",
    role: "Director, Green Soul",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meera"
  }
];

const best = [best1, best2, best3, best1, best2, best3, best1, best2, best3, best1, best2, best3];

const Home = () => {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const monsteraY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);
  const monsteraRotate = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -8]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.05]);

  return (
    <section ref={ref} className="relative pt-28 pb-16 lg:pt-32 lg:pb-24 xl:pt-40 xl:pb-32 overflow-hidden lg:h-screen lg:min-h-[90vh] flex items-center">
      <motion.img
        src={monstera.src}
        alt=""
        aria-hidden
        style={{ y: monsteraY, rotate: monsteraRotate }}
        className="hidden md:block absolute right-0 top-32 w-[280px] lg:w-[420px] 2xl:w-[500px] opacity-90 pointer-events-none will-change-transform"
      />
      <div className="mx-auto max-w-6xl xl:max-w-7xl 2xl:max-w-[1400px] px-6 lg:px-10 grid lg:grid-cols-2 gap-16 lg:gap-12 2xl:gap-20 items-center w-full">
        <div className="hidden lg:block relative order-2 lg:order-1 w-full max-w-md sm:max-w-lg 2xl:max-w-2xl mx-auto">
          <div className="bg-brand-100 rounded-[2rem] 2xl:rounded-[3rem] p-6 sm:p-8 2xl:p-12 relative overflow-hidden">
            <div className="absolute -top-6 -left-6 w-24 h-24 2xl:w-32 2xl:h-32 bg-brand-700 rounded-tl-3xl 2xl:rounded-[3rem] grid place-items-center" />
            <img
              src={heroImage.src}
              alt="Bird of paradise and snake plant in modern pots"
              width={768}
              height={896}
              className="relative w-full max-w-sm sm:max-w-md 2xl:max-w-lg mx-auto will-change-transform"
            />
          </div>
        </div>
        <div className="relative z-10 order-1 lg:order-2 flex flex-col items-center lg:items-start text-center lg:text-left">
          <h1 className="font-outfit text-4xl sm:text-5xl xl:text-6xl 2xl:text-7xl font-semibold leading-[1.1] sm:leading-[1.1] text-black">
            Run Your Nursery <br className="hidden sm:block" /> Smarter, Faster & <br className="hidden lg:block" /> <span className="text-primary">Paperless.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg xl:text-lg 2xl:text-xl text-primary max-w-sm sm:max-w-md xl:max-w-lg 2xl:max-w-xl leading-relaxed mx-auto lg:mx-0">
            Manage inventory, automate billing, and transform every plant into a smart product with QR technology — all from one powerful platform built for modern nurseries.
          </p>

          <div className="mt-8 2xl:mt-10 flex flex-wrap justify-center lg:justify-start gap-4 2xl:gap-6">
            <button className="bg-primary text-primary-foreground rounded-lg px-6 py-3 sm:px-7 sm:py-3 2xl:px-10 2xl:py-4 xl:text-lg font-medium hover:bg-white transition flex items-center gap-2 border-2 border-primary hover:text-primary">
              Get Started <ArrowRight size={18} className="2xl:w-6 2xl:h-6" />
            </button>

            <button className="border-2 border-primary text-primary rounded-lg px-6 py-3 sm:px-7 sm:py-3 2xl:px-10 2xl:py-4 xl:text-lg font-medium hover:bg-primary hover:text-primary-foreground transition">
              View Demo
            </button>
          </div>

          <div className="mt-12 2xl:mt-16 grid grid-cols-3 gap-3 sm:gap-6 2xl:gap-8 max-w-sm sm:max-w-md xl:max-w-lg 2xl:max-w-xl mx-auto lg:mx-0">
            {([[5000, "Plants Managed"], [1000, "Invoices Generated"], [300, "Nurseries Using"]] as const).map(([n, l]) => (
              <div key={l}>
                <div className="font-outfit text-2xl sm:text-3xl 2xl:text-4xl font-bold text-brand-700">
                  <CountUp end={n} suffix="+" />
                </div>
                <div className="text-[10px] sm:text-xs xl:text-sm 2xl:text-base text-muted-foreground mt-1 2xl:mt-2 leading-tight">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

//Section titles
function SectionTitle({ kicker, children }: { kicker?: string; children: React.ReactNode }) {
  return (
    <div className="text-center mb-12 2xl:mb-16">
      {kicker && <p className="text-primary text-sm 2xl:text-base font-medium tracking-wider uppercase mb-2">{kicker}</p>}
      <h2 className="font-outfit text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-semibold text-brand-700">{children}</h2>
    </div>
  );
}

function Features() {
  return (
    <CustomCursorArea
      className="features-section-wrapper"
      cursorContent={
        <div className="w-[88px] h-[88px] bg-brand-600/70 backdrop-blur-md text-white rounded-full flex items-center justify-center font-outfit font-bold text-[13px] shadow-2xl tracking-widest border border-white/20 shadow-brand-600/30">
          EXPLORE
        </div>
      }
    >
      <section className="py-24 bg-gradient-to-b from-white to-brand-50/30 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-100/50 blur-[100px] rounded-full pointer-events-none transform translate-x-1/2 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none transform -translate-x-1/2 translate-y-1/4" />

        <div className="mx-auto max-w-7xl 2xl:max-w-[1400px] px-6 lg:px-10 relative z-10">
          <Reveal>
            <div className="text-center mb-16 sm:mb-20">
              <span className="text-brand-600 font-semibold tracking-wide uppercase text-sm mb-4 inline-block bg-brand-50 px-5 py-2 rounded-full border border-brand-100 shadow-sm">Why PlantScan</span>
              <h2 className="font-outfit text-4xl sm:text-5xl xl:text-6xl font-semibold text-brand-800 mt-2 tracking-tight">Everything you need to <span className="text-primary relative inline-block">grow
                <svg className="absolute -bottom-2 w-full h-3 text-brand-200 opacity-60 left-0" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0 15 Q 50 0 100 15" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
              </span></h2>
            </div>
          </Reveal>

          <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-16 items-center">
            <RevealStagger className="space-y-6 sm:space-y-8">
              {steps.slice(0, 2).map((s) => (
                <RevealItem key={s.n}><Step {...s} align="right" /></RevealItem>
              ))}
            </RevealStagger>

            <Reveal className="hidden lg:flex relative items-center justify-center py-10 lg:py-0 w-full lg:flex order-first lg:order-none mb-10 lg:mb-0">
              <div className="relative w-64 h-64 overflow-hidden sm:w-72 sm:h-72 lg:w-[350px] lg:h-[350px] rounded-full bg-gradient-to-br from-brand-50 to-white shadow-2xl flex items-center justify-center border-[12px] border-white p-0 group transition-transform duration-700 hover:scale-105">
                <div className="absolute inset-0 rounded-full bg-brand-200/30 animate-pulse opacity-50" />
                <img src={featureImage.src} alt="Feature presentation" aria-hidden className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 z-10" />
                <div className="absolute bg-white/90 backdrop-blur-sm text-brand-700 rounded-full w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center font-outfit font-bold shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-brand-100 z-20 cursor-default uppercase tracking-wider text-sm sm:text-base">
                  Features
                </div>
              </div>
            </Reveal>

            <RevealStagger className="space-y-6 sm:space-y-8">
              {steps.slice(2).map((s) => (
                <RevealItem key={s.n}><Step {...s} align="left" /></RevealItem>
              ))}
            </RevealStagger>
          </div>
        </div>
      </section>
    </CustomCursorArea>
  );
}

function Step({ n, title, desc, align }: { n: string; title: string; desc: string; align: "left" | "right" }) {
  return (
    <div className={`group bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-brand-500/10 hover:border-brand-200 transition-all duration-300 relative overflow-hidden flex flex-col gap-4 sm:gap-5 ${align === "right" ? "lg:items-end lg:text-right" : "lg:items-start lg:text-left"}`}>
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-50/50 rounded-full opacity-50 group-hover:scale-[2] transition-transform duration-700 ease-out" />
      <div className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-outfit font-bold text-2xl group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300 shadow-sm border border-brand-100 group-hover:border-transparent">
        {n}
      </div>
      <div className="relative z-10 space-y-2">
        <h3 className="font-outfit text-xl sm:text-2xl font-semibold text-brand-800 group-hover:text-brand-700 transition-colors tracking-tight">{title}</h3>
        <p className="text-muted-foreground leading-relaxed text-[15px] sm:text-base">{desc}</p>
      </div>
    </div>
  );
}

function TrustedBy() {
  return (
    <section className="py-24 2xl:py-32 bg-gray-50/50 relative overflow-hidden">
      {/* Background decor */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] bg-brand-100/30 blur-[100px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl 2xl:max-w-[1400px] px-6 lg:px-10 2xl:px-16 relative z-10">
        <Reveal className="text-center mb-16 sm:mb-20">
          <span className="text-brand-600 font-semibold tracking-wide uppercase text-sm mb-4 inline-block bg-brand-50 px-5 py-2 rounded-full border border-brand-100 shadow-sm">Global Trust</span>
          <h2 className="font-outfit text-4xl sm:text-5xl xl:text-6xl font-semibold text-brand-800 tracking-tight">Trusted by leading <span className="text-primary relative inline-block">nurseries
            <svg className="absolute -bottom-2 w-full h-3 text-brand-200 opacity-60 left-0" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0 15 Q 50 0 100 15" fill="none" stroke="currentColor" strokeWidth="4" />
            </svg>
          </span></h2>
          <p className="mt-6 text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Powering the digital transformation of 300+ botanical businesses across the country with smart inventory and billing.
          </p>
        </Reveal>

        <Reveal className="select-none">
          <Carousel
            opts={{ align: "start", loop: true }}
            plugins={[
              AutoScroll({
                speed: 1,
                stopOnInteraction: false,
                stopOnMouseEnter: false,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {best.map((src, i) => (
                <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="p-2 group">
                    <div className="bg-white rounded-[2rem] p-10 2xl:p-14 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-brand-500/5 hover:-translate-y-2 transition-all duration-500 flex items-center justify-center h-56 2xl:h-72">
                      <img
                        src={src.src}
                        alt={`Trusted by ${i + 1}`}
                        loading="lazy"
                        width={512}
                        height={512}
                        className="w-full h-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </Reveal>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="py-24 2xl:py-32 bg-white border-t border-brand-100">
      <div className="mx-auto max-w-7xl 2xl:max-w-[1400px] px-6 lg:px-10 2xl:px-16">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 2xl:gap-24 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-32 2xl:top-40">
            <Reveal>
              <span className="text-brand-600 font-semibold tracking-wide uppercase text-sm mb-4 inline-block bg-brand-50 px-5 py-2 rounded-full border border-brand-100 shadow-sm">Support Center</span>
              <h2 className="font-outfit text-4xl xl:text-5xl 2xl:text-6xl font-semibold text-brand-800 leading-[1.1] mt-2">
                Frequently Asked <br className="hidden lg:block" /> Questions
              </h2>
              <div className="mt-8 2xl:mt-12 p-8 bg-brand-50 rounded-3xl border border-brand-100 shadow-sm">
                <p className="text-base 2xl:text-lg text-brand-800 font-medium mb-4">Still have questions? We're here to help you grow.</p>
                <Link href="/contact" className="w-full bg-brand-800 text-brand-100 font-medium px-6 py-4 rounded-xl hover:bg-primary transition-all duration-300 border border-brand-200/50 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                  Contact our team <ArrowRight size={18} />

                </Link>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <Reveal>
              <Accordion type="single" collapsible className="w-full space-y-4 2xl:space-y-6">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="group bg-white shadow-sm rounded-2xl border border-gray-100 data-[state=open]:bg-white data-[state=open]:border-brand-200 data-[state=open]:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] transition-all duration-500 ease-out px-4 sm:px-8 2xl:px-10 overflow-hidden"
                  >
                    <AccordionTrigger className="text-left font-outfit text-lg sm:text-xl 2xl:text-2xl font-semibold text-brand-800 hover:text-primary hover:no-underline py-6 2xl:py-8 group-data-[state=open]:text-primary transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-base sm:text-lg 2xl:text-xl leading-relaxed pb-8 2xl:pb-10 animate-in fade-in slide-in-from-top-2 duration-500">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-24 2xl:py-40 bg-gray-50/50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-100/30 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="mx-auto max-w-7xl 2xl:max-w-[1600px] px-6 lg:px-10 2xl:px-16 relative z-10">
        <Reveal className="text-center mb-16 2xl:mb-32">
          <span className="text-brand-600 font-semibold tracking-wide uppercase text-sm 2xl:text-base mb-4 inline-block bg-brand-50 px-5 py-2 rounded-full border border-brand-100">Success Stories</span>
          <h2 className="font-outfit text-4xl sm:text-5xl xl:text-6xl 2xl:text-8xl font-semibold text-brand-800 tracking-tight">Voices from the <span className="text-primary italic">greenhouse.</span></h2>
        </Reveal>

        <div className="relative px-12 2xl:px-20">
          <Carousel 
            opts={{
              align: "start",
              loop: true,
            }}
            autoplay={true}
            autoplayDelay={5000}
            className="w-full"
          >
            <CarouselContent className="-ml-4 2xl:-ml-6 py-3">
              {testimonials.map((t, i) => (
                <CarouselItem key={i} className="pl-4 2xl:pl-6 md:basis-1/2 lg:basis-1/3 2xl:basis-1/4">
                  <Reveal delay={i * 0.1}>
                    <div className="bg-white p-6 2xl:p-10 rounded-[2rem] 2xl:rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-brand-500/5 transition-all duration-500 flex flex-col h-[320px] 2xl:h-[420px] relative group">
                      <div className="absolute top-6 right-6 text-brand-100 group-hover:text-brand-200 transition-colors duration-500">
                        <Quote size={32} className="2xl:size-48 opacity-20" fill="currentColor" />
                      </div>
                      
                      <p className="text-gray-700 text-base 2xl:text-xl leading-relaxed italic mb-8 2xl:mb-12 flex-1 relative z-10 line-clamp-5">
                        "{t.quote}"
                      </p>
                      
                      <div className="flex items-center gap-3 2xl:gap-5 relative z-10 mt-auto">
                        <div className="w-10 h-10 2xl:w-14 2xl:h-14 rounded-full overflow-hidden border-2 border-brand-50 shadow-inner">
                          <img src={t.avatar} alt={t.author} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-bold text-brand-900 text-base 2xl:text-lg">{t.author}</h4>
                          <p className="text-xs 2xl:text-base text-muted-foreground">{t.role}</p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-10 2xl:mt-16 gap-4">
               <CarouselPrevious className="static translate-y-0 w-10 h-10 2xl:w-16 2xl:h-16 bg-white border-brand-100 text-brand-600 hover:bg-brand-600 hover:text-white transition-all shadow-md" />
               <CarouselNext className="static translate-y-0 w-10 h-10 2xl:w-16 2xl:h-16 bg-white border-brand-100 text-brand-600 hover:bg-brand-600 hover:text-white transition-all shadow-md" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}

export default function Index() {
  return (
    <div className=" min-h-screen">
      <main>
        <Home />
        <Features />
        <TrustedBy />
        <FAQ />
        <Testimonials />
      </main>
    </div>
  );
}
