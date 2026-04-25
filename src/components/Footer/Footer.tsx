import { Leaf, Mail, Phone, MapPin } from "lucide-react";
import { TbBrandFacebook, TbBrandInstagram } from "react-icons/tb";
import { BsTwitterX } from "react-icons/bs";
import footerLeaves from "@/public/images/footer-leaves.png"
import footerPlant from "@/public/images/footer-plant.png"
export default function Footer() {
  return (
    <footer className="bg-[#151c1a] text-background pt-32 pb-16 2xl:pt-48 2xl:pb-24 relative overflow-hidden">
      <img src={footerLeaves.src} alt="" aria-hidden className="absolute right-0 bottom-0 w-80 2xl:w-[500px] opacity-30 pointer-events-none" />
      <img src={footerLeaves.src} alt="" aria-hidden className="absolute left-0 bottom-0 w-80 2xl:w-[500px] opacity-30 pointer-events-none scale-x-[-1]" />

      <div className="mx-auto max-w-7xl 2xl:max-w-[1600px] px-6 lg:px-12 grid lg:grid-cols-4 gap-12 2xl:gap-24 relative text-center lg:text-left">

        {/* BRAND */}
        <div className="flex flex-col items-center lg:items-start">
          <div className="flex items-center gap-3 mb-6 text-white">
            <Leaf className="w-6 h-6 2xl:w-8 2xl:h-8" />
            <span className="font-outfit text-2xl 2xl:text-4xl font-bold tracking-tight">PlantScan</span>
          </div>

          <p className="text-base 2xl:text-xl text-white/70 max-w-xs 2xl:max-w-sm leading-relaxed">
            A smart SaaS platform helping nurseries manage inventory, billing,
            and customer experience effortlessly.
          </p>

          <img src={footerPlant.src} alt="" className="w-32 2xl:w-48 mt-8" />

          <div className="mt-8 flex gap-4">
            {[TbBrandFacebook, TbBrandInstagram, BsTwitterX].map((Icon, i) => (
              <a key={i} href="#" className="text-white w-10 h-10 2xl:w-14 2xl:h-14 rounded-full border border-white/20 flex items-center justify-center hover:bg-primary hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-primary/20">
                <Icon size={20} className="2xl:size-28" />
              </a>
            ))}
          </div>
        </div>

        {/* PRODUCT */}
        <div className="flex flex-col items-center lg:items-start">
          <h3 className="text-white text-lg 2xl:text-2xl font-bold mb-6 2xl:mb-10">Product</h3>
          <ul className="space-y-3 2xl:space-y-5 text-base 2xl:text-xl text-white/70">
            <li><a href="#" className="hover:text-white transition-colors">Inventory Management</a></li>
            <li><a href="#" className="hover:text-white transition-colors">POS Billing</a></li>
            <li><a href="#" className="hover:text-white transition-colors">QR System</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Reports & Analytics</a></li>
          </ul>
        </div>

        {/* COMPANY */}
        <div className="flex flex-col items-center lg:items-start">
          <h3 className="text-white text-lg 2xl:text-2xl font-bold mb-6 2xl:mb-10">Company</h3>
          <ul className="space-y-3 2xl:space-y-5 text-base 2xl:text-xl text-white/70">
            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>

        {/* NEWSLETTER / CONTACT */}
        <div className="flex flex-col items-center lg:items-start">
          <h3 className="text-white text-lg 2xl:text-2xl font-bold mb-6 2xl:mb-10">Stay Updated</h3>

          <p className="text-base 2xl:text-xl text-white/70 mb-6 2xl:mb-10">
            Get updates about new features and offers.
          </p>

          <div className="flex gap-2 mb-8 2xl:mb-12 w-full max-w-sm">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 bg-white/10 rounded-xl px-4 py-3 2xl:px-6 2xl:py-5 text-base 2xl:text-xl outline-none placeholder:text-white/40 border border-white/10 focus:border-primary/50 transition-all"
            />
            <button className="bg-primary px-6 2xl:px-10 rounded-xl text-base 2xl:text-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
              Join
            </button>
          </div>

          <div className="space-y-3 2xl:space-y-5 text-sm 2xl:text-lg text-white/70">
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-primary" /> hello@plantscan.com
            </div>
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-primary" /> +91 98765 43210
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-primary" /> Bangalore, India
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="mx-auto max-w-7xl 2xl:max-w-[1600px] px-6 lg:px-12 mt-20 2xl:mt-32 pt-10 border-t border-white/10 flex flex-col sm:flex-row gap-6 justify-between items-center text-sm 2xl:text-lg text-white/50 relative">
        <p>© {new Date().getFullYear()} PlantScan. All rights reserved.</p>

        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  )
}