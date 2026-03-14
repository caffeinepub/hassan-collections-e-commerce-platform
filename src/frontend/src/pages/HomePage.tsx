import { Link } from "@tanstack/react-router";
import { ArrowRight, Star, TrendingUp } from "lucide-react";
import { SiInstagram, SiX } from "react-icons/si";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import {
  useGetAllProducts,
  useGetAppearanceSettings,
  useGetFeaturedProducts,
} from "../hooks/useQueries";
import { formatPhpPrice } from "../lib/currency";

export default function HomePage() {
  const { data: featuredProducts, isLoading: featuredLoading } =
    useGetFeaturedProducts(6);
  const { data: allProducts, isLoading: allLoading } = useGetAllProducts();
  const { data: appearanceSettings } = useGetAppearanceSettings();

  const heroImageUrl =
    appearanceSettings?.heroImage?.getDirectURL() ||
    "/assets/generated/hero-banner.dim_1200x600.jpg";
  const homepageBackgroundUrl =
    appearanceSettings?.homepageBackground?.getDirectURL();

  // Get bestsellers (first 4 products for demo)
  const bestsellers = allProducts?.slice(0, 4) || [];

  // Category collections
  const collections = [
    {
      title: "Men's Collection",
      image: "/assets/generated/mens-formal-collection.dim_800x600.jpg",
      category: "Men",
      description: "Sophisticated styles for the modern gentleman",
    },
    {
      title: "Women's Collection",
      image: "/assets/generated/womens-summer-collection.dim_800x600.jpg",
      category: "Women",
      description: "Elegant designs for every occasion",
    },
    {
      title: "Kids' Collection",
      image: "/assets/generated/kids-collection.dim_800x600.jpg",
      category: "Kids",
      description: "Comfortable and stylish for little ones",
    },
    {
      title: "Accessories",
      image: "/assets/generated/unisex-accessories.dim_800x600.jpg",
      category: "Accessories",
      description: "Complete your look with premium accessories",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <img
          src={heroImageUrl}
          alt="HASSANé Collections"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/20">
          <div className="container flex h-full items-center">
            <div className="max-w-2xl space-y-6">
              <Badge variant="secondary" className="mb-2">
                New Season Collection
              </Badge>
              <h1 className="text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                Elegance Redefined
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl">
                Discover the latest collection of premium fashion pieces crafted
                for the modern individual.
              </p>
              <div className="flex gap-4">
                <Button asChild size="lg">
                  <Link to="/shop">
                    Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/promotions">View Sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Collections */}
      <section className="container py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Shop by Category
          </h2>
          <p className="text-muted-foreground">
            Explore our curated collections for every style
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {collections.map((collection) => (
            <Link
              key={collection.title}
              to="/shop"
              search={{ category: collection.category }}
            >
              <Card className="group overflow-hidden transition-all hover:shadow-lg">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="mb-2 font-semibold">{collection.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {collection.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section
        className="py-16"
        style={
          homepageBackgroundUrl
            ? {
                backgroundImage: `url(${homepageBackgroundUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
              }
            : { backgroundColor: "oklch(var(--muted) / 0.3)" }
        }
      >
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              New Arrivals
            </h2>
            <p className="text-muted-foreground">
              Fresh styles just added to our collection
            </p>
          </div>

          {featuredLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {["h1", "h2", "h3", "h4", "h5", "h6"].map((sk) => (
                <Card key={sk}>
                  <Skeleton className="aspect-[3/4] w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="mb-2 h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts?.map((product) => (
                <Link
                  key={product.id}
                  to="/product/$productId"
                  params={{ productId: product.id }}
                >
                  <Card className="group overflow-hidden transition-all hover:shadow-lg">
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
                    <CardContent className="p-4">
                      <h3 className="mb-2 font-semibold">{product.name}</h3>
                      <p className="text-lg font-bold">
                        {formatPhpPrice(product.pricePhpCents)}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Button asChild size="lg" variant="outline">
              <Link to="/shop">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="container py-16">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl flex items-center gap-2">
              <Star className="h-8 w-8 fill-primary text-primary" />
              Bestsellers
            </h2>
            <p className="text-muted-foreground">
              Customer favorites you'll love
            </p>
          </div>
          <Button asChild variant="ghost">
            <Link to="/shop">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {allLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {["a1", "a2", "a3", "a4"].map((sk) => (
              <Card key={sk}>
                <Skeleton className="aspect-[3/4] w-full" />
                <CardContent className="p-4">
                  <Skeleton className="mb-2 h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {bestsellers.map((product) => (
              <Link
                key={product.id}
                to="/product/$productId"
                params={{ productId: product.id }}
              >
                <Card className="group overflow-hidden transition-all hover:shadow-lg">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Badge className="absolute left-2 top-2 z-10">
                      Bestseller
                    </Badge>
                    <img
                      src={
                        product.images[0]?.getDirectURL() ||
                        "/assets/generated/sample-dress.dim_600x800.jpg"
                      }
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="mb-2 font-semibold">{product.name}</h3>
                    <p className="text-lg font-bold">
                      {formatPhpPrice(product.pricePhpCents)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Seasonal Trends Banner */}
      <section className="relative h-[400px] overflow-hidden">
        <img
          src="/assets/generated/seasonal-trends-banner.dim_1200x400.jpg"
          alt="Seasonal Trends"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/40">
          <div className="container flex h-full items-center">
            <div className="max-w-xl space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                <Badge variant="secondary">Trending Now</Badge>
              </div>
              <h2 className="text-4xl font-bold tracking-tight">
                Seasonal Trends
              </h2>
              <p className="text-lg text-muted-foreground">
                Stay ahead with our curated selection of this season's must-have
                styles
              </p>
              <Button asChild size="lg">
                <Link to="/shop">
                  Explore Trends <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Integration */}
      <section className="container py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Follow Us
          </h2>
          <p className="text-muted-foreground">
            Join our community and stay updated with the latest trends
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Button asChild variant="outline" size="lg">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiInstagram className="mr-2 h-5 w-5" />
                Instagram
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiX className="mr-2 h-5 w-5" />
                Twitter
              </a>
            </Button>
          </div>
        </div>

        {/* Social Feed Preview */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square overflow-hidden rounded-lg">
              <img
                src="/assets/generated/featured-model.dim_800x1000.jpg"
                alt={`Social post ${i}`}
                className="h-full w-full object-cover transition-transform hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Brand Story Preview */}
      <section className="bg-muted/30 py-16">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <img
                src="/assets/generated/store-interior.dim_800x600.jpg"
                alt="HASSANé Collections Story"
                className="rounded-lg object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Our Story
              </h2>
              <p className="text-muted-foreground">
                HASSANé Collections was born from a passion for timeless
                elegance and contemporary design. We believe that fashion is
                more than just clothing—it's a form of self-expression, a
                statement of individuality, and a celebration of craftsmanship.
              </p>
              <p className="text-muted-foreground">
                Every piece in our collection is carefully curated to bring you
                the perfect blend of style, comfort, and quality. From classic
                essentials to statement pieces, we're here to help you express
                your unique style.
              </p>
              <Button asChild variant="outline">
                <Link to="/about">Read More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
