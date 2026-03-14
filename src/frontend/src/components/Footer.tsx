import { Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { SiFacebook, SiInstagram, SiTiktok, SiX } from "react-icons/si";
import { useGetSocialLinks } from "../hooks/useQueries";

export default function Footer() {
  const { data: socialLinks } = useGetSocialLinks();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img
                src="/assets/generated/hassane-logo-transparent.dim_200x200.png"
                alt="HASSANé Collections"
                className="h-8 w-8"
              />
              <span className="text-lg font-semibold">HASSANé Collections</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Premium fashion for the modern individual. Elegance redefined.
            </p>
            <div className="flex space-x-4">
              {socialLinks?.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Facebook"
                >
                  <SiFacebook className="h-5 w-5" />
                </a>
              )}
              {socialLinks?.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Instagram"
                >
                  <SiInstagram className="h-5 w-5" />
                </a>
              )}
              {socialLinks?.x && (
                <a
                  href={socialLinks.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="X (Twitter)"
                >
                  <SiX className="h-5 w-5" />
                </a>
              )}
              {socialLinks?.tiktok && (
                <a
                  href={socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="TikTok"
                >
                  <SiTiktok className="h-5 w-5" />
                </a>
              )}
              {socialLinks?.email && (
                <a
                  href={`mailto:${socialLinks.email}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Email"
                >
                  <Mail className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/shop"
                  search={{ category: "Men" }}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Men
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  search={{ category: "Women" }}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Women
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  search={{ category: "Kids" }}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Kids
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  search={{ category: "Unisex" }}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Unisex
                </Link>
              </li>
              <li>
                <Link
                  to="/promotions"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Sales & Promotions
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping-returns"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  to="/size-guide"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 flex justify-center">
          <p className="text-sm text-muted-foreground">
            © 2025 HASSANé Collections. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
