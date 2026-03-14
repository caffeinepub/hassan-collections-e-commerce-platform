import { Link, useSearch } from "@tanstack/react-router";
import { Heart, ShoppingCart, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { Skeleton } from "../components/ui/skeleton";
import { Slider } from "../components/ui/slider";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddFavorite,
  useGetAllProducts,
  useGetAppearanceSettings,
  useGetCallerFavorites,
  useRemoveFavorite,
} from "../hooks/useQueries";
import { useCartStore } from "../lib/cartStore";
import { formatPhpPrice } from "../lib/currency";

export default function ShopPage() {
  const { identity } = useInternetIdentity();
  const search = useSearch({ from: "/shop" }) as { category?: string };
  const { data: products, isLoading } = useGetAllProducts();
  const { data: appearanceSettings } = useGetAppearanceSettings();
  const { data: favorites } = useGetCallerFavorites();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const addItem = useCartStore((state) => state.addItem);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedCategory, setSelectedCategory] = useState(
    search.category || "All",
  );

  const isAuthenticated = !!identity;
  const shopBackgroundUrl = appearanceSettings?.shopBackground?.getDirectURL();

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Price range filter
    filtered = filtered.filter((p) => {
      const price = Number(p.pricePhpCents);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort(
          (a, b) => Number(a.pricePhpCents) - Number(b.pricePhpCents),
        );
        break;
      case "price-high":
        filtered.sort(
          (a, b) => Number(b.pricePhpCents) - Number(a.pricePhpCents),
        );
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // newest - keep original order
        break;
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  const handleAddToCart = (product: any) => {
    addItem({
      productId: product.id,
      name: product.name,
      pricePhpCents: Number(product.pricePhpCents),
      quantity: 1,
      image:
        product.images[0]?.getDirectURL() ||
        "/assets/generated/sample-dress.dim_600x800.jpg",
    });
    toast.success(`${product.name} added to cart`);
  };

  const handleToggleFavorite = async (
    productId: string,
    productName: string,
    isFavorite: boolean,
  ) => {
    if (!isAuthenticated) {
      toast.error("Please log in to add favorites");
      return;
    }

    try {
      if (isFavorite) {
        await removeFavorite.mutateAsync(productId);
        toast.success(`${productName} removed from favorites`);
      } else {
        await addFavorite.mutateAsync(productId);
        toast.success(`${productName} added to favorites`);
      }
    } catch {
      toast.error("Failed to update favorites");
    }
  };

  const categories = [
    "All",
    "Men",
    "Women",
    "Kids",
    "Unisex",
    "Clothing",
    "Accessories",
    "Footwear",
  ];

  return (
    <div
      className="container py-12"
      style={
        shopBackgroundUrl
          ? {
              backgroundImage: `url(${shopBackgroundUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }
          : undefined
      }
    >
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          {selectedCategory === "All" ? "Shop All" : selectedCategory}
        </h1>
        <p className="text-muted-foreground">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "product" : "products"} found
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 max-w-md">
          <Input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name">Name: A to Z</SelectItem>
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Products</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div>
                  <Label className="mb-3 block">Category</Label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <Badge
                        key={cat}
                        variant={
                          selectedCategory === cat ? "default" : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">
                    Price Range: {formatPhpPrice(priceRange[0])} -{" "}
                    {formatPhpPrice(priceRange[1])}
                  </Label>
                  <Slider
                    min={0}
                    max={1000000}
                    step={10000}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mt-2"
                  />
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setPriceRange([0, 1000000]);
                    setSortBy("newest");
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"].map((sk) => (
            <Card key={sk}>
              <Skeleton className="aspect-[3/4] w-full" />
              <CardContent className="p-4">
                <Skeleton className="mb-2 h-6 w-3/4" />
                <Skeleton className="mb-4 h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => {
            const isFavorite = favorites?.includes(product.id) || false;
            return (
              <Card key={product.id} className="group overflow-hidden">
                <div className="relative">
                  <Link
                    to="/product/$productId"
                    params={{ productId: product.id }}
                  >
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={
                          product.images[0]?.getDirectURL() ||
                          "/assets/generated/sample-dress.dim_600x800.jpg"
                        }
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  </Link>
                  {isAuthenticated && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 bg-background/80 backdrop-blur-sm hover:bg-background"
                      onClick={() =>
                        handleToggleFavorite(
                          product.id,
                          product.name,
                          isFavorite,
                        )
                      }
                    >
                      <Heart
                        className={`h-5 w-5 ${isFavorite ? "fill-primary text-primary" : ""}`}
                      />
                    </Button>
                  )}
                </div>
                <CardContent className="p-4">
                  <Link
                    to="/product/$productId"
                    params={{ productId: product.id }}
                  >
                    <h3 className="mb-2 font-semibold hover:text-primary">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="mb-4 text-lg font-bold">
                    {formatPhpPrice(product.pricePhpCents)}
                  </p>
                  <Button
                    className="w-full"
                    onClick={() => handleAddToCart(product)}
                    disabled={Number(product.availability) === 0}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {Number(product.availability) === 0
                      ? "Out of Stock"
                      : "Add to Cart"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            No products match your filters. Try adjusting your search.
          </p>
        </div>
      )}
    </div>
  );
}
