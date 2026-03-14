import { Link } from "@tanstack/react-router";
import { Gift, Tag, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";

export default function PromotionsPage() {
  const [couponCode, setCouponCode] = useState("");

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      toast.success("Coupon code will be applied at checkout");
      setCouponCode("");
    }
  };

  const promotions = [
    {
      title: "Summer Sale",
      description: "Up to 50% off on selected summer collection items",
      code: "SUMMER50",
      image: "/assets/generated/sale-banner.dim_800x300.jpg",
    },
    {
      title: "New Customer Discount",
      description: "Get 15% off your first purchase",
      code: "WELCOME15",
      image: "/assets/generated/womens-summer-collection.dim_800x600.jpg",
    },
    {
      title: "Free Shipping",
      description: "Free shipping on orders over ₱2,000",
      code: "FREESHIP",
      image: "/assets/generated/footwear-collection.dim_800x600.jpg",
    },
  ];

  return (
    <div className="container py-12">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <Badge className="mb-4" variant="secondary">
          <Tag className="mr-1 h-3 w-3" />
          Special Offers
        </Badge>
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
          Sales & Promotions
        </h1>
        <p className="text-lg text-muted-foreground">
          Don't miss out on our exclusive deals and limited-time offers
        </p>
      </div>

      {/* Coupon Code Input */}
      <Card className="mb-12 max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Have a Coupon Code?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            />
            <Button onClick={handleApplyCoupon}>Apply</Button>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Coupon codes can be applied during checkout
          </p>
        </CardContent>
      </Card>

      {/* Active Promotions */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="h-6 w-6" />
          Active Promotions
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {promotions.map((promo) => (
            <Card key={promo.code} className="overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="mb-2 text-xl font-semibold">{promo.title}</h3>
                <p className="mb-4 text-muted-foreground">
                  {promo.description}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="font-mono">
                    {promo.code}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(promo.code);
                      toast.success("Coupon code copied!");
                    }}
                  >
                    Copy Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Flash Sale Banner */}
      <div className="relative h-[300px] overflow-hidden rounded-lg mb-12">
        <img
          src="/assets/generated/seasonal-trends-banner.dim_1200x400.jpg"
          alt="Flash Sale"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/40 flex items-center">
          <div className="container">
            <Badge className="mb-4" variant="destructive">
              Limited Time Only
            </Badge>
            <h2 className="mb-4 text-4xl font-bold">Flash Sale</h2>
            <p className="mb-6 text-lg text-muted-foreground max-w-xl">
              Grab amazing deals before they're gone! Up to 70% off on selected
              items.
            </p>
            <Button asChild size="lg">
              <Link to="/shop">Shop Flash Sale</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Stay Updated</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground">
            Subscribe to our newsletter to receive exclusive offers and early
            access to sales.
          </p>
          <div className="flex gap-2">
            <Input type="email" placeholder="Enter your email" />
            <Button>Subscribe</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
