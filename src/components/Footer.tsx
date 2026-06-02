import React from 'react';
import { Link } from 'react-router-dom';
import { Landmark, ShieldCheck } from 'lucide-react';

const PaymentBadge = ({ children, label }: { children: React.ReactNode; label: string }) => (
  <div className="flex flex-col items-center gap-1.5 group" title={label}>
    <div className="w-14 h-9 bg-gray-800 border border-gray-700 rounded-md flex items-center justify-center transition-all duration-300 group-hover:border-gray-500 group-hover:bg-gray-750">
      {children}
    </div>
    <span className="text-[10px] text-gray-500 group-hover:text-gray-400 transition-colors">{label}</span>
  </div>
);

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-12 sm:mt-16">
      <div className="container max-w-7xl py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">Kasi SA Streetwear</h3>
            <p className="text-gray-400">
              Celebrating authentic township fashion and urban African style.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Shop</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Returns</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m4.441 16.892c-2.102.144-6.784.144-8.883 0C5.282 16.736 5.017 15.622 5 12c.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0C18.718 7.264 18.982 8.378 19 12c-.018 3.629-.285 4.736-2.559 4.892z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className="border-t border-gray-800 pt-8 pb-8">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <ShieldCheck size={16} className="text-green-500" />
              <span className="font-medium tracking-wide uppercase text-xs">Secure Payment Methods</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              {/* Visa */}
              <PaymentBadge label="Visa">
                <svg viewBox="0 0 48 32" className="w-9 h-6">
                  <rect width="48" height="32" rx="4" fill="#1A1F71" />
                  <text x="24" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="Arial, sans-serif" fontStyle="italic">VISA</text>
                </svg>
              </PaymentBadge>

              {/* Mastercard */}
              <PaymentBadge label="Mastercard">
                <svg viewBox="0 0 48 32" className="w-9 h-6">
                  <rect width="48" height="32" rx="4" fill="#2D2D2D" />
                  <circle cx="19" cy="16" r="8" fill="#EB001B" />
                  <circle cx="29" cy="16" r="8" fill="#F79E1B" />
                  <path d="M24 9.5a8 8 0 0 1 0 13" fill="#FF5F00" />
                </svg>
              </PaymentBadge>

              {/* American Express */}
              <PaymentBadge label="Amex">
                <svg viewBox="0 0 48 32" className="w-9 h-6">
                  <rect width="48" height="32" rx="4" fill="#2E77BC" />
                  <text x="24" y="18" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="Arial, sans-serif">AMEX</text>
                </svg>
              </PaymentBadge>

              {/* Instant EFT */}
              <PaymentBadge label="Instant EFT">
                <Landmark size={18} className="text-emerald-400" />
              </PaymentBadge>

              {/* SnapScan */}
              <PaymentBadge label="SnapScan">
                <svg viewBox="0 0 48 32" className="w-9 h-6">
                  <rect width="48" height="32" rx="4" fill="#E63B2E" />
                  <text x="24" y="18" textAnchor="middle" fill="white" fontSize="6.5" fontWeight="bold" fontFamily="Arial, sans-serif">SNAPSCAN</text>
                </svg>
              </PaymentBadge>

              {/* Payfast */}
              <PaymentBadge label="Payfast">
                <svg viewBox="0 0 48 32" className="w-9 h-6">
                  <rect width="48" height="32" rx="4" fill="#00457C" />
                  <text x="24" y="18" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="Arial, sans-serif">PAYFAST</text>
                </svg>
              </PaymentBadge>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Kasi SA Streetwear. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}