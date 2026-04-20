"use client";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import monstera from "@/public/images/monstera-leaves.png";
// import heroPlants from "@/public/images/hero-plants.png";
import heroImage from "@/public/images/hero-image.jpg"
import {CountUp} from "@/components/CountUp";
import {  ArrowRight, ShoppingBag  } from "lucide-react";
import best1 from "@/public/images/best-1.png"
import best2 from "@/public/images/best-2.png"
import best3 from "@/public/images/best-3.png"
import plantChina from "@/public/images/plant-china.png";
import plantFittonia from "@/public/images/plant-fittonia.png";
import plantSucculent from "@/public/images/plant-succulent.png";
import {Reveal, RevealStagger, RevealItem} from "@/src/components/Reveal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const trending = [
  { name: "Chinese Plant", price: "$45.00", img: plantChina },
  { name: "Fittonia Plant", price: "$50.00", img: plantFittonia },
  { name: "Succulent Plant", price: "$30.00", img: plantSucculent },
  { name: "Chinese Plant", price: "$45.00", img: plantChina },
  { name: "Fittonia Plant", price: "$50.00", img: plantFittonia },
  { name: "Succulent Plant", price: "$30.00", img: plantSucculent },
  { name: "Chinese Plant", price: "$45.00", img: plantChina },
  { name: "Fittonia Plant", price: "$50.00", img: plantFittonia },
  { name: "Succulent Plant", price: "$30.00", img: plantSucculent },
];

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

const best = [best1, best2, best3];

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
   <section ref={ref} className="relative pt-28 pb-16 lg:pt-24 lg:pb-20 overflow-hidden">
      <motion.img
        src={monstera.src}
        alt=""
        aria-hidden
        style={{ y: monsteraY, rotate: monsteraRotate }}
        className="hidden md:block absolute right-0 top-32 w-[280px] lg:w-[420px] opacity-90 pointer-events-none will-change-transform"
      />
      <div className="mx-auto max-w-6xl px-6 lg:px-10 grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative order-2 lg:order-1">
          <div className="bg-brand-100 rounded-[2rem] p-8 sm:p-8 relative overflow-hidden">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-brand-700 rounded-tl-3xl" />
            <motion.img
              src={heroImage.src}
              alt="Bird of paradise and snake plant in modern pots"
              width={768}
              height={896}
              style={{ y: heroY, scale: heroScale }}
              className="relative w-full max-w-md mx-auto will-change-transform"
            />
          </div>
        </div>
     <div className="relative z-10 order-1 lg:order-2">
  <h1 className="font-outfit text-4xl sm:text-5xl font-semibold leading-[1.1] text-black">
    Run Your Nursery <br /> Smarter, Faster & <br /> <span className="text-primary">Paperless.</span>
  </h1>

  <p className="mt-6 text-base text-accent max-w-md leading-relaxed">
    Manage inventory, automate billing, and transform every plant into a smart product with QR technology — all from one powerful platform built for modern nurseries.
  </p>

  <div className="mt-8 flex flex-wrap gap-4">
    <button className="bg-primary text-primary-foreground rounded-full px-7 py-3 font-medium hover:bg-white transition flex items-center gap-2 border-2 border-primary hover:text-primary">
      Get Started <ArrowRight size={18} />
    </button>

    <button className="border-2 border-primary text-primary rounded-full px-7 py-3 font-medium hover:bg-primary hover:text-primary-foreground transition">
      View Demo
    </button>
  </div>

  <div className="mt-12 grid grid-cols-3 gap-4 max-w-md">
    {([[5000, "Plants Managed"], [1000, "Invoices Generated"], [300, "Nurseries Using"]] as const).map(([n, l]) => (
      <div key={l}>
        <div className="font-outfit text-2xl font-bold text-brand-700">
          <CountUp end={n} suffix="+" />
        </div>
        <div className="text-xs text-muted-foreground mt-1">{l}</div>
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
    <div className="text-center mb-12">
      {kicker && <p className="text-primary text-sm font-medium tracking-wider uppercase mb-2">{kicker}</p>}
      <h2 className="font-outfit text-3xl sm:text-4xl font-semibold text-brand-700">{children}</h2>
    </div>
  );
}

function Trending() {
  return (
   <section className="py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        
        <div className="flex items-center justify-between mb-8">
          <Reveal>
            <SectionTitle>Trending Products</SectionTitle>
          </Reveal>
        </div>

        <Carousel
          autoplay
          autoplayDelay={1500}
          opts={{
            align: "start",
            loop: true, // Optional: allows infinite scrolling
          }}
          className="w-full pb-16 lg:pb-0"
        >
          {/* -ml-6 offsets the pl-6 padding on items to create the gap */}
          <CarouselContent className="-ml-6">
            {trending.map((p, index) => (
              <CarouselItem 
                key={`${p.name}-${index}`} 
                className="pl-6 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <RevealItem className="bg-brand-100 rounded-3xl p-6 group hover:-translate-y-2 transition-transform duration-300 h-full flex flex-col">
                  <div className="bg-accent rounded-2xl p-6 mb-4 flex-shrink-0">
                    <img 
                      src={p.img.src} 
                      alt={p.name} 
                      loading="lazy" 
                      width={512} 
                      height={512} 
                      className="w-full h-56 object-contain" 
                    />
                  </div>
                  <h3 className="font-outfit text-xl font-semibold text-brand-700">
                    {p.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 flex-grow">
                    Lorem ipsum is simply dummy text of the printing.
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-outfit text-lg font-bold text-primary">
                      {p.price}
                    </span>
                    <button className="bg-primary text-primary-foreground rounded-full px-5 py-2 text-sm font-medium hover:bg-brand-700 transition flex items-center gap-2">
                      <ShoppingBag size={14} /> Add to cart
                    </button>
                  </div>
                </RevealItem>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-3 lg:hidden">
            <CarouselPrevious className="relative left-auto top-auto translate-x-0 translate-y-0 bg-primary text-primary-foreground hover:bg-brand-700" />
            <CarouselNext className="relative right-auto top-auto translate-x-0 translate-y-0 bg-primary text-primary-foreground hover:bg-brand-700" />
          </div>

          <div className="hidden lg:block">
            <CarouselPrevious className="-left-12 bg-primary text-primary-foreground hover:bg-brand-700" />
            <CarouselNext className="-right-12 bg-primary text-primary-foreground hover:bg-brand-700" />
          </div>
        </Carousel>

      </div>
    </section>
  );
}

function HowToOrder() {
  return (
    <section className="py-20 bg-brand-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal><SectionTitle>Features</SectionTitle></Reveal>
        <div className="relative grid md:grid-cols-2 lg:grid-cols-[1fr_auto_1fr] gap-10 items-center">
          <RevealStagger className="space-y-10">
            {steps.slice(0, 2).map((s) => (
              <RevealItem key={s.n}><Step {...s} align="right" /></RevealItem>
            ))}
          </RevealStagger>
          <Reveal className="relative flex items-center justify-center order-first lg:order-none">
            <img src={monstera.src} alt="" aria-hidden className="w-72 h-72 object-contain opacity-80" />
            <button className="absolute bg-primary text-primary-foreground rounded-full w-28 h-28 flex items-center justify-center font-outfit font-semibold shadow-xl hover:bg-brand-700 transition">
              Shop Now
            </button>
          </Reveal>
          <RevealStagger className="space-y-10">
            {steps.slice(2).map((s) => (
              <RevealItem key={s.n}><Step {...s} align="left" /></RevealItem>
            ))}
          </RevealStagger>
        </div>
      </div>
    </section>
  );
}

function Step({ n, title, desc, align }: { n: string; title: string; desc: string; align: "left" | "right" }) {
  return (
    <div className={`flex items-start gap-4 ${align === "right" ? "lg:flex-row-reverse lg:text-right" : ""}`}>
      <div className="shrink-0 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-outfit font-semibold">{n}</div>
      <div>
        <h3 className="font-outfit text-lg font-semibold text-brand-700">{title}</h3>
        <p className="text-sm text-green-700 mt-1 max-w-xs">{desc}</p>
      </div>
    </div>
  );
}

function BestProducts() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="flex items-end justify-between mb-12">
          <h2 className="font-outfit text-3xl sm:text-4xl font-semibold text-brand-700">Our Best Products</h2>
          <button className="border border-primary text-primary rounded-full px-5 py-2 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition">See All</button>
        </Reveal>
        <RevealStagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {best.map((src, i) => (
            <RevealItem key={i} className="bg-brand-100 rounded-3xl p-8 hover:-translate-y-2 transition-transform">
              <img src={src.src} alt={`Best plant ${i + 1}`} loading="lazy" width={512} height={512} className="w-full h-64 object-contain" />
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}

export default function Index() {
  return (
    <div className=" min-h-screen">
      <main>
        <Home />
        <Trending />
        <HowToOrder/>
        <BestProducts/>
      </main>
    </div>
  );
}
