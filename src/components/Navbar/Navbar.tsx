"use client";
import Link from 'next/link'
import { Menu, X } from "lucide-react";
import { useState } from 'react'

const Navbar = () => {

    const [open, setOpen] = useState(false);
  const links = ["Home", "Pricing", "Contact"];

  return (
     <header className="absolute top-0 left-0 right-0 z-30">
      <div className="mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between">
        <div className="flex items-center gap-2  bg-brand-700 text-primary-foreground rounded px-5 py-3 -ml-4 sm:-ml-6">
          <Leaf />
          <span className="font-outfit text-xl font-semibold">Plant</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground/80">
          {links.map((l, i) => (
            <a key={l} href="#" className={`${i === 0 ? "text-brand-700 font-semibold" : "hover:text-primary text-gray-500"} `}>{l}</a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <Link href="/signin" className="text-sm font-medium text-primary hover:text-brand-700">Login</Link>
          <Link href="/signup" className="bg-primary text-primary-foreground rounded-full px-5 py-2 text-sm font-medium hover:bg-brand-700 transition">Sign Up</Link>
        </div>
        <button className="md:hidden p-2 text-primary" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 md:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
      />
      
      {/* Mobile Menu Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-primary border-r border-border shadow-xl transform transition-transform duration-300 ease-in-out md:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-6 py-4 space-y-6">
          {/* Logo in sidebar */}
          <div className="flex items-center gap-2 text-primary-foreground pb-4 border-b border-accent/20">
            <Leaf />
            <span className="font-outfit text-xl font-semibold">Plant</span>
          </div>
          
          {/* Links */}
          <nav className="space-y-3">
            {links.map((l) => (
              <a 
                key={l} 
                href="#" 
                className="block text-accent text-sm font-medium hover:text-accent/80 transition py-2"
                onClick={() => setOpen(false)}
              >
                {l}
              </a>
            ))}
          </nav>
          
          {/* Buttons */}
          <div className="space-y-3 pt-4">
            <Link href="/signin" className='w-full my-2 border border-accent rounded-full py-2 text-sm text-accent hover:bg-accent/10 transition' onClick={() => setOpen(false)} >
                Login
            </Link>
            <Link href="/signup" className='w-full my-2 border-accent border bg-accent text-primary rounded-full py-2 text-sm hover:bg-accent/90 transition' onClick={() => setOpen(false)} >

                Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar

function Leaf() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12c4-8 12-8 20-8-4 8-4 16-12 16-4 0-8-4-8-8z" />
      <path d="M2 22c4-4 8-8 12-12" />
    </svg>
  );
}