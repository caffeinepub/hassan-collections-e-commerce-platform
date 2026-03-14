import { Link } from "@tanstack/react-router";
import { CheckCircle2, Home, Package, ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useCartStore } from "../lib/cartStore";

export default function PaymentSuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    // Clear cart on successful payment
    clearCart();
  }, [clearCart]);

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-2xl">
        <Card className="border-2 border-green-500/20 bg-green-50/50 dark:bg-green-950/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl text-green-900 dark:text-green-100">
              Order Placed Successfully!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-white dark:bg-gray-900 p-6 text-center">
              <p className="text-lg font-medium mb-2">
                Thank you for your order!
              </p>
              <p className="text-muted-foreground">
                Your order has been received and is being processed. You will
                receive a confirmation email shortly with your order details and
                tracking information.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-lg bg-white dark:bg-gray-900 p-4">
                <Package className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Order Confirmation</p>
                  <p className="text-sm text-muted-foreground">
                    Check your email for order details and receipt
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg bg-white dark:bg-gray-900 p-4">
                <ShoppingBag className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Processing Time</p>
                  <p className="text-sm text-muted-foreground">
                    Orders are typically processed within 1-2 business days
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-4 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Payment Method Note:</strong> If you selected GCash or
                Cash on Delivery, please ensure payment is completed as
                instructed. For card payments via Stripe, your payment has been
                processed successfully.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button asChild className="flex-1" size="lg">
                <Link to="/">
                  <Home className="mr-2 h-5 w-5" />
                  Back to Home
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1" size="lg">
                <Link to="/shop">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Continue Shopping
                </Link>
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Need help? Contact us at support@shophassane.com
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
