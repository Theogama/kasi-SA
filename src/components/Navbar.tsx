import kasiLogo from "@/assets/kasi-logo.png";
import { Menu, X, ShoppingCart, LogOut } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { totalItems } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden md:flex">
                  {user?.firstName || user?.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/" className="cursor-pointer">Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/" className="cursor-pointer">Account Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                  <LogOut size={14} className="mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/login")}
                className="text-xs"
              >
                Login
              </Button>
              <Button
                size="sm"
                onClick={() => navigate("/register")}
                className="text-xs"
              >
                Sign Up
              </Button>
            </div>
          )}

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
          
          {isAuthenticated ? (
            <>
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-3">{user?.email}</p>
                <Link to="/" className="block mb-2 text-xs">Orders</Link>
                <Link to="/" className="block mb-3 text-xs">Account Settings</Link>
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <div className="pt-4 border-t border-border flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  navigate("/login");
                  setOpen(false);
                }}
              >
                Login
              </Button>
              <Button
                size="sm"
                className="flex-1"
                onClick={() => {
                  navigate("/register");
                  setOpen(false);
                }}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
