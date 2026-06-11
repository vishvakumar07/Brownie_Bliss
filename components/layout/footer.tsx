import Link from "next/link"
import { Instagram, Mail, Phone, MapPin } from "lucide-react"

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
    <footer className="bg-cocoa text-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold">Brownie Bliss</h3>
            <p className="text-cream/70 leading-relaxed">
              Handcrafted with love, our brownies bring joy to every bite. 
              Premium ingredients, homemade perfection.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://instagram.com/browniebliss"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-cream/10 rounded-full hover:bg-cream/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@browniebliss.com"
                className="p-2 bg-cream/10 rounded-full hover:bg-cream/20 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/70 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Policies</h4>
            <ul className="space-y-3">
              {footerLinks.policies.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-cream/70 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-cream/70">
                <Phone className="w-5 h-5 mt-0.5 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-3 text-cream/70">
                <Mail className="w-5 h-5 mt-0.5 shrink-0" />
                <span>contact@browniebliss.com</span>
              </li>
              <li className="flex items-start gap-3 text-cream/70">
                <MapPin className="w-5 h-5 mt-0.5 shrink-0" />
                <span>100 Feet Road, Indiranagar, Bengaluru, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-cream/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-cream/60 text-sm">
            &copy; {new Date().getFullYear()} Brownie Bliss. All rights reserved.
          </p>
          <p className="text-cream/60 text-sm">
            Made with love in India
          </p>
        </div>
      </div>
    </footer>
  )
}
