import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetAllProducts,
  useGetCallerFavorites,
  useRemoveFavorite,
} from "../hooks/useQueries";
import { useCartStore } from "../lib/cartStore";
import { formatPhpPrice } from "../lib/currency";

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: favoriteIds, isLoading: favoritesLoading } =
    useGetCallerFavorites();
  const { data: allProducts, isLoading: productsLoading } = useGetAllProducts();
  const removeFavorite = useRemoveFavorite();
  const addItem = useCartStore((state) => state.addItem);

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="container py-12 text-center">
        <Heart className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
        <h1 className="mb-4 text-2xl font-bold">Login Required</h1>
        <p className="mb-6 text-muted-foreground">
          Please log in to view your favorites
        </p>
        <Button onClick={() => navigate({ to: "/" })}>Go to Home</Button>
      </div>
    );
  }

  const isLoading = favoritesLoading || productsLoading;

  const favoriteProducts =
    allProducts?.filter((product) => favoriteIds?.includes(product.id)) || [];

  const handleRemoveFavorite = async (
    productId: string,
    productName: string,
  ) => {
    try {
      await removeFavorite.mutateAsync(productId);
      toast.success(`${productName} removed from favorites`);
    } catch {
      toast.error("Failed to remove from favorites");
    }
  };

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

  return (
    <div className="container py-12">
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">My Favorites</h1>
        <p className="text-muted-foreground">Your saved fashion pieces</p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {["f1", "f2", "f3", "f4"].map((sk) => (
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
      ) : favoriteProducts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favoriteProducts.map((product) => (
            <Card key={product.id} className="group overflow-hidden">
              <Link to="/product/$productId" params={{ productId: product.id }}>
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
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => handleAddToCart(product)}
                    disabled={Number(product.availability) === 0}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleRemoveFavorite(product.id, product.name)
                    }
                    disabled={removeFavorite.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <Heart className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <p className="mb-6 text-muted-foreground">
            You haven't added any favorites yet.
          </p>
          <Button onClick={() => navigate({ to: "/shop" })}>
            Browse Products
          </Button>
        </div>
      )}
    </div>
  );
}
