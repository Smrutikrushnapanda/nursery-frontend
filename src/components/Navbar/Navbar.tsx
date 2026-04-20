"use client";
import Link from 'next/link'
import { Menu, X } from "lucide-react";
import { useState } from 'react'

const Navbar = () => {

    const [open, setOpen] = useState(false);
  const links = ["Home", "Products", "About", "Blog"];

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
          <button className="text-sm font-medium text-primary hover:text-brand-700">Login</button>
          <button className="bg-primary text-primary-foreground rounded-full px-5 py-2 text-sm font-medium hover:bg-brand-700 transition">Sign Up</button>
        </div>
        <button className="md:hidden p-2 text-primary" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-background border-t border-border px-6 py-4 space-y-3">
          {links.map((l) => <a key={l} href="#" className="block text-sm font-medium">{l}</a>)}
          <div className="flex gap-3 pt-3">
            <Link href="/signin"><button className="flex-1 border border-border rounded-full py-2 text-sm text-primary">Login</button></Link>
            <Link href="/signup"><button className="flex-1 bg-primary text-primary-foreground rounded-full py-2 text-sm">Sign Up</button></Link>
          </div>
        </div>
      )}
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