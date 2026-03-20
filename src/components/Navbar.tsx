import kasiLogo from "@/assets/kasi-logo.png";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border/40">
      <div className="container mx-auto flex items-center justify-between py-6 px-6">
        <Link to="/">
          <img src={kasiLogo} alt="Kasi SA Streetwear" className="h-24 hover:opacity-80 transition-opacity" />
        </Link>
        <div className="hidden md:flex items-center gap-10 text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link to="/shop" className="hover:text-foreground transition-colors">Shop</Link>
          <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
          <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/cart"
            className="relative p-2 hover:bg-secondary rounded-lg transition-colors hidden md:flex items-center justify-center"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {totalItems}
              </Badge>
            )}
          </Link>

          {/* Auth Menu */}
          <div className="hidden md:flex items-center gap-2">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm" className="text-xs">
                  Login
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm" className="text-xs">
                  Sign Up
                </Button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton afterSignOutUrl="/" />
            </Show>
          </div>

          <button className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border px-6 py-6 flex flex-col gap-4 text-sm font-medium tracking-[0.15em] uppercase bg-background">
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/shop" onClick={() => setOpen(false)}>Shop</Link>
          <Link to="/about" onClick={() => setOpen(false)}>About</Link>
          <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
          <Link
            to="/cart"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 pt-4 border-t border-border"
          >
            <ShoppingCart size={16} />
            Cart {totalItems > 0 && `(${totalItems})`}
          </Link>
          
          <Show when="signed-in">
            <div className="pt-4 border-t border-border">
              <UserButton afterSignOutUrl="/" showName />
            </div>
          </Show>
          <Show when="signed-out">
            <div className="pt-4 border-t border-border flex gap-2">
              <SignInButton mode="modal">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setOpen(false)}
                >
                  Login
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => setOpen(false)}
                >
                  Sign Up
                </Button>
              </SignUpButton>
            </div>
          </Show>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
