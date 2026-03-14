import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingCart, User } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerFavorites } from "../hooks/useQueries";
import { useCartStore } from "../lib/cartStore";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export default function Header() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const cartItems = useCartStore((state) => state.items);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { clear, loginStatus, identity } = useInternetIdentity();
  const { data: favorites } = useGetCallerFavorites();

  const isAuthenticated = !!identity;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const favoritesCount = favorites?.length || 0;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      navigate({ to: "/login" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-area-inset-top">
      <div className="container flex h-14 md:h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/assets/generated/hassane-logo-transparent.dim_200x200.png"
            alt="HASSANé Collections"
            className="h-8 w-8 md:h-10 md:w-10"
          />
          <span className="text-base md:text-xl font-semibold tracking-tight hidden sm:inline">
            HASSANé Collections
          </span>
          <span className="text-base md:text-xl font-semibold tracking-tight sm:hidden">
            HASSANé
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link
                  to="/"
                  className="px-4 py-2 text-sm font-medium transition-colors hover:text-primary tap-target"
                >
                  Home
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="tap-target">
                  Shop
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          to="/shop"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md tap-target"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            All Products
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Browse our complete collection
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/shop"
                          search={{ category: "Men" }}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground tap-target"
                        >
                          <div className="text-sm font-medium leading-none">
                            Men
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Clothing, accessories & footwear
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/shop"
                          search={{ category: "Women" }}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground tap-target"
                        >
                          <div className="text-sm font-medium leading-none">
                            Women
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Clothing, accessories & footwear
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/shop"
                          search={{ category: "Kids" }}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground tap-target"
                        >
                          <div className="text-sm font-medium leading-none">
                            Kids
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Clothing, accessories & footwear
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/shop"
                          search={{ category: "Unisex" }}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground tap-target"
                        >
                          <div className="text-sm font-medium leading-none">
                            Unisex
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Clothing, accessories & footwear
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link
                  to="/promotions"
                  className="px-4 py-2 text-sm font-medium transition-colors hover:text-primary tap-target"
                >
                  Sales
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link
                  to="/about"
                  className="px-4 py-2 text-sm font-medium transition-colors hover:text-primary tap-target"
                >
                  About
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link
                  to="/contact"
                  className="px-4 py-2 text-sm font-medium transition-colors hover:text-primary tap-target"
                >
                  Contact
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <div className="flex items-center space-x-1 md:space-x-2">
          {/* Search Icon */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: "/shop" })}
            className="tap-target h-9 w-9 md:h-10 md:w-10"
          >
            <Search className="h-4 w-4 md:h-5 md:w-5" />
          </Button>

          {/* Favorites Icon */}
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              className="relative tap-target h-9 w-9 md:h-10 md:w-10"
              onClick={() => navigate({ to: "/favorites" })}
            >
              <Heart className="h-4 w-4 md:h-5 md:w-5" />
              {favoritesCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-full bg-primary text-[10px] md:text-xs text-primary-foreground">
                  {favoritesCount}
                </span>
              )}
            </Button>
          )}

          {/* Cart Icon */}
          <Button
            variant="ghost"
            size="icon"
            className="relative tap-target h-9 w-9 md:h-10 md:w-10"
            onClick={() => navigate({ to: "/cart" })}
          >
            <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-full bg-primary text-[10px] md:text-xs text-primary-foreground">
                {totalItems}
              </span>
            )}
          </Button>

          {/* User Account Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="tap-target h-9 w-9 md:h-10 md:w-10"
              >
                <User className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {isAuthenticated ? (
                <>
                  <DropdownMenuItem
                    onClick={() => navigate({ to: "/account" })}
                    className="tap-target"
                  >
                    My Account
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate({ to: "/favorites" })}
                    className="tap-target"
                  >
                    My Favorites
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleAuth}
                    disabled={loginStatus === "logging-in"}
                    className="tap-target"
                  >
                    {loginStatus === "logging-in" ? "Logging out..." : "Logout"}
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={handleAuth} className="tap-target">
                  Login / Create Account
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="tap-target h-9 w-9 md:h-10 md:w-10"
              >
                <Menu className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <nav className="flex flex-col space-y-4 mt-8">
                <Link
                  to="/"
                  className="text-lg font-medium transition-colors hover:text-primary tap-target py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/shop"
                  className="text-lg font-medium transition-colors hover:text-primary tap-target py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Shop All
                </Link>
                <Link
                  to="/shop"
                  search={{ category: "Men" }}
                  className="text-base text-muted-foreground transition-colors hover:text-primary pl-4 tap-target py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Men
                </Link>
                <Link
                  to="/shop"
                  search={{ category: "Women" }}
                  className="text-base text-muted-foreground transition-colors hover:text-primary pl-4 tap-target py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Women
                </Link>
                <Link
                  to="/shop"
                  search={{ category: "Kids" }}
                  className="text-base text-muted-foreground transition-colors hover:text-primary pl-4 tap-target py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Kids
                </Link>
                <Link
                  to="/shop"
                  search={{ category: "Unisex" }}
                  className="text-base text-muted-foreground transition-colors hover:text-primary pl-4 tap-target py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Unisex
                </Link>
                <Link
                  to="/promotions"
                  className="text-lg font-medium transition-colors hover:text-primary tap-target py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sales & Promotions
                </Link>
                <Link
                  to="/about"
                  className="text-lg font-medium transition-colors hover:text-primary tap-target py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="text-lg font-medium transition-colors hover:text-primary tap-target py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/favorites"
                      className="text-lg font-medium transition-colors hover:text-primary tap-target py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Favorites
                    </Link>
                    <Link
                      to="/account"
                      className="text-lg font-medium transition-colors hover:text-primary tap-target py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Account
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="text-lg font-medium transition-colors hover:text-primary tap-target py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login / Create Account
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
