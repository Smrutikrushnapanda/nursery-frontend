"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, X, Sparkles } from "lucide-react";
import { Reveal, RevealStagger, RevealItem } from "@/src/components/Reveal";
import Link from "next/link";
import { plansApi } from "@/src/utils/api/api";
import { useRouter, useSearchParams } from "next/navigation";

const ALL_FEATURES = [
  { key: "INVENTORY", text: "Inventory Management" },
  { key: "BILLING", text: "Billing" },
  { key: "POS", text: "Point of Sale (POS)" },
  { key: "REPORTS", text: "Reports" },
  { key: "PAYMENTS", text: "Payments" },
  { key: "QR", text: "QR Code Generation" },
  { key: "ANALYTICS", text: "Analytics" },
];

const getPlanDescription = (name: string) => {
  if (!name) return "Tailored for your business needs.";
  switch(name.toLowerCase()) {
    case 'basic': return "Perfect for small local nurseries just transitioning to digital.";
    case 'standard': return "The complete toolkit for growing & high-volume nurseries.";
    case 'premium': return "Built for massive operations requiring dedicated support and scale.";
    default: return "Tailored for your business needs.";
  }
}

export default function PricingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (searchParams.get("alert") === "purchase-plan") {
      alert("Purchase a plan to access the dashboard");
      router.replace("/pricing");
    }
  }, [router, searchParams]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await plansApi.getAllPlans();
        
        let plansArray = [];
        if (Array.isArray(response)) {
          plansArray = response;
        } else if (response?.data && Array.isArray(response.data)) {
          plansArray = response.data;
        } else if (response?.plans && Array.isArray(response.plans)) {
          plansArray = response.plans;
        } else {
          console.error("Unexpected plans data format:", response);
        }
        
        const formattedPlans = plansArray.map((plan: any) => {
          const priceNum = parseFloat(plan.price);
          const formattedPrice = isNaN(priceNum) ? `₹${plan.price}` : `₹${priceNum.toLocaleString('en-IN')}`;

          const mappedFeatures = ALL_FEATURES.map(f => ({
            text: f.text,
            included: plan.features?.includes(f.key) || false
          }));

          const planName = plan.name ? plan.name.charAt(0).toUpperCase() + plan.name.slice(1).toLowerCase() : 'Unknown';

          return {
            id: plan.id,
            name: planName,
            description: getPlanDescription(plan.name),
            price: formattedPrice,
            duration: "per month",
            popular: planName.toLowerCase() === 'standard',
            ctaText: "Get Started",
            features: mappedFeatures
          };
        });
        
        setPlans(formattedPlans);
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-[#FAFAFA] font-outfit flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 2xl:pt-48 2xl:pb-32 bg-[#FAFAFA] font-outfit">
      
      {/* Background Decor */}
      <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-brand-100/50 to-transparent pointer-events-none" />
      
      <div className="mx-auto max-w-7xl 2xl:max-w-[1600px] px-6 lg:px-10 relative z-10">
        
        {/* Header Section */}
        <Reveal className="text-center max-w-3xl 2xl:max-w-5xl mx-auto mb-20 2xl:mb-32">
          <h1 className="text-4xl sm:text-5xl xl:text-7xl 2xl:text-8xl font-semibold text-brand-800 tracking-tight mb-6 2xl:mb-10 leading-tight">
            Simple, transparent pricing for <span className="text-primary relative whitespace-nowrap">
              every nursery.
              <svg className="absolute -bottom-2 w-full h-3 text-brand-200 opacity-60 left-0" viewBox="0 0 100 20" preserveAspectRatio="none">
                 <path d="M0 15 Q 50 0 100 15" fill="none" stroke="currentColor" strokeWidth="4" />
              </svg>
            </span>
          </h1>
          <p className="text-lg xl:text-xl 2xl:text-3xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Whether you are managing a small backyard greenhouse or a multi-location commercial nursery, we have a plan perfectly scaled for your growth.
          </p>
        </Reveal>

        {/* Pricing Cards Grid */}
        <RevealStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10 2xl:gap-16 items-start">
          {plans.map((plan, index) => (
            <RevealItem key={index}>
              <div 
                className={`relative flex flex-col h-full bg-white rounded-3xl 2xl:rounded-[2.5rem] p-8 xl:p-10 2xl:p-16 border transition-all duration-300 ${
                  plan.popular 
                  ? "border-brand-500 shadow-[0_20px_60px_-15px_rgba(22,163,74,0.15)] ring-1 ring-brand-500" 
                  : "border-gray-200 shadow-sm hover:shadow-xl hover:border-brand-200"
                }`}
              >
                {/* Popular Tag */}
                {plan.popular && (
                  <div className="absolute -top-4 inset-x-0 flex justify-center">
                    <span className="bg-brand-600 text-white text-sm 2xl:text-lg font-semibold tracking-wide py-1 px-4 2xl:py-2 2xl:px-8 border border-brand-500 rounded-full flex items-center gap-1.5 shadow-md">
                      <Sparkles size={14} className="fill-white 2xl:size-6" /> Most Popular
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-8 2xl:mb-12">
                  <h3 className="text-2xl 2xl:text-4xl font-semibold text-brand-800 mb-2 2xl:mb-4">{plan.name}</h3>
                  <p className="text-sm 2xl:text-xl text-muted-foreground h-10 2xl:h-14 leading-relaxed">{plan.description}</p>
                </div>

                {/* Price Display */}
                <div className="mb-8 2xl:mb-12 flex items-end gap-2">
                  <span className="text-5xl 2xl:text-7xl font-bold text-brand-900 tracking-tight">{plan.price}</span>
                  <span className="text-brand-600/70 text-sm 2xl:text-xl font-medium mb-2">/ {plan.duration}</span>
                </div>

                {/* CTA Button */}
                <button 
                  className={`w-full py-4 2xl:py-6 px-6 rounded-xl 2xl:rounded-2xl font-semibold text-[15px] 2xl:text-2xl transition-all duration-300 mb-10 2xl:mb-14 border-2 ${
                    plan.popular
                    ? "bg-brand-600 text-white border-brand-600 hover:bg-brand-700 shadow-[0_8px_20px_-6px_rgba(22,163,74,0.4)]"
                    : "bg-white text-brand-800 border-gray-200 hover:border-brand-300 hover:bg-brand-50"
                  }`}
                >
                  {plan.ctaText}
                </button>

                {/* Features List */}
                <div className="space-y-4 2xl:space-y-8 flex-1">
                  <p className="text-sm 2xl:text-lg font-medium tracking-wide text-brand-800/60 uppercase mb-4 2xl:mb-8">What's included</p>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 2xl:gap-5">
                      {feature.included ? (
                        <div className="bg-brand-100 flex-shrink-0 w-6 h-6 2xl:w-10 2xl:h-10 rounded-full flex items-center justify-center mt-0.5">
                          <Check size={14} className="text-brand-600 2xl:size-6" />
                        </div>
                      ) : (
                        <div className="bg-gray-100 flex-shrink-0 w-6 h-6 2xl:w-10 2xl:h-10 rounded-full flex items-center justify-center mt-0.5">
                          <X size={14} className="text-gray-400 2xl:size-6" />
                        </div>
                      )}
                      <span className={`text-[15px] 2xl:text-xl leading-relaxed ${feature.included ? 'text-brand-800 font-medium' : 'text-gray-400'}`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>


      </div>
    </div>
  );
}
