import Link from "next/link"
import { Instagram, Mail, Phone, MapPin, Twitter, Facebook } from "lucide-react"

const footerLinks = {
  quickLinks: [
    { href: "/products", label: "Our Brownies" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/reviews", label: "Reviews" },
  ],
  policies: [
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms of Service" },
    { href: "#", label: "Refund Policy" },
    { href: "#", label: "Shipping Info" },
  ],
}

export function Footer() {
  return (
    <footer style={{ background: "#2D1B14", color: "#FFF8F0" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">

        {/* Mobile: Brand + social row */}
        <div className="flex items-start justify-between mb-5 md:hidden">
          <div>
            <h3 className="font-serif text-xl font-bold mb-1">Brownie Bliss</h3>
            <p className="text-cream/60 text-xs leading-relaxed max-w-[200px]">
              Handcrafted with love. Premium ingredients, homemade perfection.
            </p>
          </div>

          {/* Social icons row */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <a href="https://instagram.com/browniebliss" target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ background: "rgba(255,248,240,0.10)" }}
              aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ background: "rgba(255,248,240,0.10)" }}
              aria-label="Twitter">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="mailto:contact@browniebliss.com"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ background: "rgba(255,248,240,0.10)" }}
              aria-label="Email">
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Mobile: 2-column quick links grid */}
        <div className="md:hidden mb-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-0">
            {/* Quick Links */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#D4A373] mb-2">
                Quick Links
              </p>
              <ul className="space-y-2">
                {footerLinks.quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-cream/65 text-xs hover:text-[#D4A373] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Policies */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#D4A373] mb-2">
                Policies
              </p>
              <ul className="space-y-2">
                {footerLinks.policies.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-cream/65 text-xs hover:text-[#D4A373] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile: Contact info compact */}
        <div className="md:hidden mb-5 pt-4" style={{ borderTop: "1px solid rgba(255,248,240,0.08)" }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#D4A373] mb-2">Contact</p>
          <div className="flex flex-col gap-1.5">
            <a href="tel:+919876543210" className="flex items-center gap-2 text-cream/65 text-xs hover:text-[#D4A373] transition-colors">
              <Phone className="w-3.5 h-3.5 flex-shrink-0" />
              +91 98765 43210
            </a>
            <a href="mailto:contact@browniebliss.com" className="flex items-center gap-2 text-cream/65 text-xs hover:text-[#D4A373] transition-colors">
              <Mail className="w-3.5 h-3.5 flex-shrink-0" />
              contact@browniebliss.com
            </a>
            <div className="flex items-center gap-2 text-cream/65 text-xs">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>100 Feet Rd, Indiranagar, Bengaluru</span>
            </div>
          </div>
        </div>

        {/* Desktop grid layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold">Brownie Bliss</h3>
            <p className="text-cream/70 leading-relaxed text-sm">
              Handcrafted with love, our brownies bring joy to every bite.
              Premium ingredients, homemade perfection.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {[
                { href: "https://instagram.com/browniebliss", icon: Instagram, label: "Instagram" },
                { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
                { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
                { href: "mailto:contact@browniebliss.com", icon: Mail, label: "Email" },
              ].map(({ href, icon: Icon, label }) => (
                <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:bg-cream/20 transition-colors"
                  style={{ background: "rgba(255,248,240,0.10)" }}
                  aria-label={label}>
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-base mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-cream/70 hover:text-[#D4A373] transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-base mb-4">Policies</h4>
            <ul className="space-y-3">
              {footerLinks.policies.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-cream/70 hover:text-[#D4A373] transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-base mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-cream/70 text-sm"><Phone className="w-4 h-4 mt-0.5 shrink-0" /><span>+91 98765 43210</span></li>
              <li className="flex items-start gap-3 text-cream/70 text-sm"><Mail className="w-4 h-4 mt-0.5 shrink-0" /><span>contact@browniebliss.com</span></li>
              <li className="flex items-start gap-3 text-cream/70 text-sm"><MapPin className="w-4 h-4 mt-0.5 shrink-0" /><span>100 Feet Road, Indiranagar, Bengaluru, India</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4"
          style={{ borderTop: "1px solid rgba(255,248,240,0.08)" }}
        >
          <p className="text-cream/50 text-[11px]">
            © {new Date().getFullYear()} Brownie Bliss. All rights reserved.
          </p>
          <p className="text-cream/50 text-[11px]">Made with ♥ in India</p>
        </div>
      </div>
    </footer>
  )
}
