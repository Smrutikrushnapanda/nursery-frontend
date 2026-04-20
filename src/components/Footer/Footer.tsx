import { Leaf, Mail, Phone, MapPin } from "lucide-react";
import { TbBrandFacebook, TbBrandInstagram } from "react-icons/tb";
import { BsTwitterX } from "react-icons/bs";
import footerLeaves from "@/public/images/footer-leaves.png"
import footerPlant from "@/public/images/footer-plant.png"
export default function Footer() {
  return (
    <footer className="bg-[#151c1a] text-background pt-32 pb-10 relative overflow-hidden">
      <img src={footerLeaves.src} alt="" aria-hidden className="absolute right-0 bottom-0 w-80 opacity-30 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-4 gap-12 relative text-center lg:text-left">

        {/* BRAND */}
        <div className="flex flex-col items-center lg:items-start">
          <div className="flex items-center gap-2 mb-4 text-white">
            <Leaf />
            <span className="font-outfit text-2xl font-semibold">Plant</span>
          </div>

          <p className="text-sm text-white/70 max-w-xs">
            A smart SaaS platform helping nurseries manage inventory, billing,
            and customer experience effortlessly.
          </p>

          <img src={footerPlant.src} alt="" className="w-32 mt-4" />

          <div className="mt-4 flex gap-3">
            {[TbBrandFacebook, TbBrandInstagram, BsTwitterX].map((Icon, i) => (
              <a key={i} href="#" className="text-white w-9 h-9 rounded-full border border-white flex items-center justify-center hover:bg-primary hover:border-green-400 transition">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* PRODUCT */}
        <div className="flex flex-col items-center lg:items-start">
          <h3 className="text-white font-semibold mb-4">Product</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li><a href="#" className="hover:text-white">Inventory Management</a></li>
            <li><a href="#" className="hover:text-white">POS Billing</a></li>
            <li><a href="#" className="hover:text-white">QR System</a></li>
            <li><a href="#" className="hover:text-white">Reports & Analytics</a></li>
          </ul>
        </div>

        {/* COMPANY */}
        <div className="flex flex-col items-center lg:items-start">
          <h3 className="text-white font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li><a href="#" className="hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:text-white">Pricing</a></li>
            <li><a href="#" className="hover:text-white">Blog</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* NEWSLETTER / CONTACT */}
        <div className="flex flex-col items-center lg:items-start">
          <h3 className="text-white font-semibold mb-4">Stay Updated</h3>

          <p className="text-sm text-white/70 mb-4">
            Get updates about new features and offers.
          </p>

          <div className="flex gap-2 mb-4 w-full max-w-xs">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 bg-gray-400/40 rounded-md px-3 py-2 text-sm outline-none placeholder:text-white/60"
            />
            <button className="bg-primary px-4 rounded-md text-sm">
              Join
            </button>
          </div>

          <div className="space-y-2 text-xs text-white/70">
            <div className="flex items-center gap-2">
              <Mail size={12} /> hello@plant.com
            </div>
            <div className="flex items-center gap-2">
              <Phone size={12} /> +1 234 567
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={12} /> Bhubaneswar
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="mx-auto max-w-7xl px-6 lg:px-10 mt-12 pt-6 border-t border-white/20 flex flex-col sm:flex-row gap-4 justify-between items-center text-xs text-white relative">
        <p>© {new Date().getFullYear()} Plant. All rights reserved.</p>

        <div className="flex gap-4">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms</a>
        </div>
      </div>
    </footer>
  )
}