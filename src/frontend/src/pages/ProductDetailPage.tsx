import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { Heart, Share2, ShoppingCart, Star, ZoomIn } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog";
import { Separator } from "../components/ui/separator";
import { Skeleton } from "../components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddFavorite,
  useGetAllProducts,
  useGetProduct,
  useIsFavorite,
  useRemoveFavorite,
} from "../hooks/useQueries";
import { useCartStore } from "../lib/cartStore";
import { formatPhpPrice } from "../lib/currency";

export default function ProductDetailPage() {
  const { productId } = useParams({ from: "/product/$productId" });
  const _navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: product, isLoading } = useGetProduct(productId);
  const { data: allProducts } = useGetAllProducts();
  const { data: isFavorite } = useIsFavorite(productId);
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const addItem = useCartStore((state) => state.addItem);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const isAuthenticated = !!identity;

  // Get related products (same category, excluding current)
  const relatedProducts =
    allProducts
      ?.filter((p) => p.category === product?.category && p.id !== productId)
      .slice(0, 4) || [];

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      productId: product.id,
      name: product.name,
      pricePhpCents: Number(product.pricePhpCents),
      quantity,
      image:
        product.images[0]?.getDirectURL() ||
        "/assets/generated/sample-dress.dim_600x800.jpg",
    });
    toast.success(`${product.name} added to cart`);
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to add favorites");
      return;
    }

    if (!product) return;

    try {
      if (isFavorite) {
        await removeFavorite.mutateAsync(productId);
        toast.success(`${product.name} removed from favorites`);
      } else {
        await addFavorite.mutateAsync(productId);
        toast.success(`${product.name} added to favorites`);
      }
    } catch {
      toast.error("Failed to update favorites");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-12 text-center">
        <h1 className="mb-4 text-2xl font-bold">Product not found</h1>
        <Button asChild>
          <Link to="/shop">Back to Shop</Link>
        </Button>
      </div>
    );
  }

  const mainImage =
    product.images[selectedImage]?.getDirectURL() ||
    "/assets/generated/sample-dress.dim_600x800.jpg";

  return (
    <div className="container py-12">
      {/* Product Details */}
      <div className="grid gap-8 md:grid-cols-2 mb-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          <Dialog>
            <DialogTrigger asChild>
              <div className="relative aspect-square overflow-hidden rounded-lg cursor-zoom-in group">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-auto"
              />
            </DialogContent>
          </Dialog>

          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  type="button"
                  key={image.getDirectURL() || String(index)}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                    selectedImage === index
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image.getDirectURL()}
                    alt={`${product.name} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge className="mb-2">{product.category}</Badge>
            <h1 className="mb-2 text-3xl font-bold tracking-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <Star className="h-4 w-4 fill-primary text-primary" />
                <Star className="h-4 w-4 fill-primary text-primary" />
                <Star className="h-4 w-4 fill-primary text-primary" />
                <Star className="h-4 w-4 fill-primary text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">
                (24 reviews)
              </span>
            </div>
            <p className="text-3xl font-bold">
              {formatPhpPrice(product.pricePhpCents)}
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="mb-2 font-semibold">Description</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Availability</h3>
            <p
              className={
                Number(product.availability) > 0
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {Number(product.availability) > 0
                ? `${product.availability} in stock`
                : "Out of stock"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setQuantity(
                    Math.min(Number(product.availability), quantity + 1),
                  )
                }
                disabled={quantity >= Number(product.availability)}
              >
                +
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              className="flex-1"
              size="lg"
              onClick={handleAddToCart}
              disabled={Number(product.availability) === 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            {isAuthenticated && (
              <Button
                variant="outline"
                size="lg"
                onClick={handleToggleFavorite}
              >
                <Heart
                  className={`h-5 w-5 ${isFavorite ? "fill-primary text-primary" : ""}`}
                />
              </Button>
            )}
            <Button variant="outline" size="lg" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          <Separator />

          <div className="space-y-2 text-sm">
            <p className="flex justify-between">
              <span className="text-muted-foreground">Category:</span>
              <span className="font-medium">{product.category}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted-foreground">Product ID:</span>
              <span className="font-medium">{product.id}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="reviews" className="mb-16">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
          <TabsTrigger value="size">Size Guide</TabsTrigger>
        </TabsList>
        <TabsContent value="reviews" className="space-y-4 mt-6">
          <h3 className="text-xl font-semibold">Customer Reviews</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarFallback>U{i}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Customer {i}</h4>
                        <div className="flex">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <Star className="h-4 w-4 fill-primary text-primary" />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Great quality and perfect fit! Highly recommend this
                        product.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="shipping" className="mt-6">
          <div className="prose prose-sm max-w-none">
            <h3>Shipping Information</h3>
            <p>
              We offer free shipping on orders over ₱2,000. Standard delivery
              takes 3-5 business days.
            </p>
            <h3>Returns Policy</h3>
            <p>
              Items can be returned within 30 days of purchase. Products must be
              unworn and in original packaging.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="size" className="mt-6">
          <div className="prose prose-sm max-w-none">
            <h3>Size Guide</h3>
            <p>
              Please refer to our comprehensive size guide to find your perfect
              fit.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link to="/size-guide">View Full Size Guide</Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="mb-6 text-2xl font-bold">You May Also Like</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                to="/product/$productId"
                params={{ productId: relatedProduct.id }}
              >
                <Card className="group overflow-hidden transition-all hover:shadow-lg">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={
                        relatedProduct.images[0]?.getDirectURL() ||
                        "/assets/generated/sample-dress.dim_600x800.jpg"
                      }
                      alt={relatedProduct.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="mb-2 font-semibold">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-lg font-bold">
                      {formatPhpPrice(relatedProduct.pricePhpCents)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
