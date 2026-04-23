"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, ArrowRight, CheckCircle2 } from "lucide-react";
import { Reveal, RevealStagger, RevealItem } from "@/src/components/Reveal";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen pt-32 pb-24 2xl:pt-48 2xl:pb-32 bg-[#FAFAFA] font-outfit relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-b from-brand-300/20 to-brand-100/5 blur-[120px] opacity-80" />
        <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-primary/15 to-brand-200/10 blur-[100px] opacity-80" />
        <div className="absolute bottom-[-10%] right-[20%] w-[40%] h-[40%] rounded-full bg-gradient-to-bl from-green-300/15 to-emerald-100/5 blur-[100px] opacity-60" />
      </div>

      <div className="mx-auto max-w-6xl 2xl:max-w-[1600px] px-6 lg:px-10 relative z-10">

        {/* Header Section */}
        <Reveal className="text-center max-w-2xl 2xl:max-w-4xl mx-auto mb-16 lg:mb-20 2xl:mb-32">
          <div className="inline-flex items-center justify-center p-3.5 2xl:p-5 mb-6 2xl:mb-10 rounded-2xl bg-white/60 backdrop-blur-md border border-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] group hover:scale-105 transition-transform duration-300">
            <MessageSquare className="text-brand-600 w-6 h-6 2xl:w-10 2xl:h-10 group-hover:animate-bounce" />
          </div>
          <h1 className="text-4xl sm:text-5xl xl:text-7xl 2xl:text-8xl font-semibold text-gray-900 tracking-tight mb-6 2xl:mb-10">
            Let's start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400 relative whitespace-nowrap">
              conversation.
              <svg className="absolute -bottom-3 w-full h-4 text-brand-200/60 left-0" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0 15 Q 50 0 100 15" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="text-lg xl:text-xl 2xl:text-3xl text-gray-500 leading-relaxed max-w-2xl 2xl:max-w-4xl mx-auto opacity-80">
            Have questions about our pricing, features, or need help migrating your nursery? Our dedicated team is here to help you every step of the way.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 2xl:gap-12 items-stretch max-w-5xl 2xl:max-w-[1400px] mx-auto">

          {/* Contact Information (Left) */}
          <div className="lg:col-span-5">
            <RevealStagger className="space-y-6 2xl:space-y-10 h-full flex flex-col">
              <RevealItem className="flex-1 flex flex-col">
                <div className="bg-white/80 backdrop-blur-xl p-7 2xl:p-12 rounded-[1.5rem] 2xl:rounded-[2.5rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group flex-1 flex flex-col justify-center">
                  <div className="flex flex-col gap-8 2xl:gap-14">
                    {/* Email Section */}
                    <div className="flex items-start gap-5 2xl:gap-8">
                      <div className="w-14 h-14 2xl:w-20 2xl:h-20 bg-gradient-to-br from-brand-50 to-brand-100/50 text-brand-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:from-brand-500 group-hover:to-brand-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                        <Mail size={26} className="2xl:size-36" strokeWidth={1.5} />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="text-xl 2xl:text-3xl font-semibold text-gray-900 mb-1 2xl:mb-3">Email Us</h3>
                        <p className="text-gray-500 mb-3 2xl:mb-5 text-[15px] 2xl:text-xl leading-relaxed">Our friendly team is here to help.</p>
                        <a href="mailto:hello@plantscan.com" className="inline-flex items-center gap-2 2xl:gap-4 text-brand-600 font-medium hover:text-brand-700 transition-colors group/link text-[15px] 2xl:text-xl">
                          hello@plantscan.com
                          <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300 2xl:size-6" />
                        </a>
                      </div>
                    </div>

                    <div className="h-px bg-gray-100 w-full" />

                    {/* Call Section */}
                    <div className="flex items-start gap-5 2xl:gap-8">
                      <div className="w-14 h-14 2xl:w-20 2xl:h-20 bg-gradient-to-br from-brand-50 to-brand-100/50 text-brand-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:from-brand-500 group-hover:to-brand-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                        <Phone size={26} className="2xl:size-36" strokeWidth={1.5} />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="text-xl 2xl:text-3xl font-semibold text-gray-900 mb-1 2xl:mb-3">Call Us</h3>
                        <p className="text-gray-500 mb-3 2xl:mb-5 text-[15px] 2xl:text-xl leading-relaxed">Mon-Fri from 9am to 6pm.</p>
                        <a href="tel:+919876543210" className="inline-flex items-center gap-2 2xl:gap-4 text-brand-600 font-medium hover:text-brand-700 transition-colors group/link text-[15px] 2xl:text-xl">
                          +91 98765 43210
                          <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300 2xl:size-6" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </RevealItem>

              <RevealItem className="flex-1 flex flex-col">
                <div className="bg-white/80 backdrop-blur-xl p-7 2xl:p-12 rounded-[1.5rem] 2xl:rounded-[2.5rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group flex-1 flex flex-col justify-center">
                  <div className="w-14 h-14 2xl:w-20 2xl:h-20 bg-gradient-to-br from-brand-50 to-brand-100/50 text-brand-600 rounded-2xl flex items-center justify-center mb-6 2xl:mb-10 group-hover:from-brand-500 group-hover:to-brand-600 group-hover:text-white group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 shadow-sm">
                    <MapPin size={26} className="2xl:size-36" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl 2xl:text-3xl font-semibold text-gray-900 mb-2 2xl:mb-4">Visit Us</h3>
                  <p className="text-gray-500 mb-5 2xl:mb-8 leading-relaxed text-[15px] 2xl:text-xl">
                    Drop by our office for a chat. We'd love to see you.
                  </p>
                  <span className="text-gray-800 font-medium leading-relaxed block text-[15px] 2xl:text-xl">
                    123 Innovation Drive, Tech Park,<br />
                    Bangalore, Karnataka 560001
                  </span>
                </div>
              </RevealItem>
            </RevealStagger>
          </div>

          {/* Contact Form (Right) */}
          <div className="lg:col-span-7">
            <Reveal className="h-full">
              <div className="bg-white/90 backdrop-blur-2xl rounded-[2rem] 2xl:rounded-[3rem] p-7 sm:p-10 2xl:p-16 border border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden h-full flex flex-col">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-100/40 to-transparent rounded-bl-full -z-0 opacity-50" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-primary/5 to-transparent rounded-tr-full -z-0 opacity-50" />

                <div className="relative z-10 mb-10 2xl:mb-16">
                  <h3 className="text-2xl sm:text-3xl 2xl:text-5xl font-semibold text-gray-900 mb-3 2xl:mb-6">Send us a message</h3>
                  <p className="text-gray-500 text-[15px] 2xl:text-xl leading-relaxed">Fill out the form below and we'll get back to you as soon as possible.</p>
                </div>

                {isSubmitted ? (
                  <div className="bg-gradient-to-br from-brand-50 to-white border border-brand-100 rounded-3xl 2xl:rounded-[2.5rem] p-10 2xl:p-20 text-center animate-in fade-in zoom-in duration-500 relative z-10 shadow-sm flex-1 flex flex-col justify-center">
                    <div className="w-20 h-20 2xl:w-32 2xl:h-32 bg-brand-100/50 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-6 2xl:mb-10 relative">
                      <div className="absolute inset-0 border-4 border-white rounded-full"></div>
                      <CheckCircle2 size={36} className="2xl:size-48" strokeWidth={2} />
                    </div>
                    <h4 className="text-2xl 2xl:text-4xl font-semibold text-gray-900 mb-3 2xl:mb-6">Message Sent!</h4>
                    <p className="text-gray-600 leading-relaxed max-w-sm 2xl:max-w-xl mx-auto 2xl:text-xl">
                      Thank you for reaching out. Our team will review your message and get back to you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6 2xl:space-y-10 relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 2xl:gap-10">
                      <div className="space-y-2.5 2xl:space-y-4">
                        <label htmlFor="name" className="text-sm 2xl:text-lg font-medium text-gray-700 ml-1">First Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-4 2xl:px-8 2xl:py-6 bg-gray-50/50 border border-gray-200/80 rounded-2xl 2xl:rounded-3xl focus:bg-white focus:ring-[3px] focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all duration-300 text-gray-900 placeholder:text-gray-400 shadow-sm text-base 2xl:text-xl"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2.5 2xl:space-y-4">
                        <label htmlFor="email" className="text-sm 2xl:text-lg font-medium text-gray-700 ml-1">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-4 2xl:px-8 2xl:py-6 bg-gray-50/50 border border-gray-200/80 rounded-2xl 2xl:rounded-3xl focus:bg-white focus:ring-[3px] focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all duration-300 text-gray-900 placeholder:text-gray-400 shadow-sm text-base 2xl:text-xl"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2.5 2xl:space-y-4">
                      <label htmlFor="subject" className="text-sm 2xl:text-lg font-medium text-gray-700 ml-1">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 2xl:px-8 2xl:py-6 bg-gray-50/50 border border-gray-200/80 rounded-2xl 2xl:rounded-3xl focus:bg-white focus:ring-[3px] focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all duration-300 text-gray-900 placeholder:text-gray-400 shadow-sm text-base 2xl:text-xl"
                        placeholder="How can we help?"
                      />
                    </div>

                    <div className="space-y-2.5 2xl:space-y-4">
                      <label htmlFor="message" className="text-sm 2xl:text-lg font-medium text-gray-700 ml-1">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-5 py-4 2xl:px-8 2xl:py-6 bg-gray-50/50 border border-gray-200/80 rounded-2xl 2xl:rounded-3xl focus:bg-white focus:ring-[3px] focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all duration-300 text-gray-900 placeholder:text-gray-400 resize-none shadow-sm text-base 2xl:text-xl"
                        placeholder="Tell us a little more about your needs..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="relative w-full py-4 px-6 2xl:py-8 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white rounded-2xl 2xl:rounded-3xl font-medium text-[16px] 2xl:text-2xl transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(22,163,74,0.4)] hover:shadow-[0_15px_25px_-6px_rgba(22,163,74,0.5)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group overflow-hidden mt-8 2xl:mt-14"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Sending Message...</span>
                          </>
                        ) : (
                          <>
                            <span>Send Message</span>
                            <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                          </>
                        )}
                      </span>
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
