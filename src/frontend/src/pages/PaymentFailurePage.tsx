import { Link } from "@tanstack/react-router";
import { ArrowLeft, HelpCircle, ShoppingCart, XCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function PaymentFailurePage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-2xl">
        <Card className="border-2 border-red-500/20 bg-red-50/50 dark:bg-red-950/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-2xl text-red-900 dark:text-red-100">
              Payment Failed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-white dark:bg-gray-900 p-6 text-center">
              <p className="text-lg font-medium mb-2">
                We couldn't process your payment
              </p>
              <p className="text-muted-foreground">
                Your order was not completed. Don't worry, no charges were made
                to your account.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-lg bg-white dark:bg-gray-900 p-4">
                <HelpCircle className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">
                    Common reasons for payment failure:
                  </p>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                    <li>Insufficient funds in your account</li>
                    <li>Incorrect card details or expired card</li>
                    <li>Payment was cancelled or timed out</li>
                    <li>Bank declined the transaction</li>
                    <li>Network or connection issues</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950/20 p-4 border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-900 dark:text-yellow-100">
                <strong>What to do next:</strong> Please check your payment
                details and try again. If the problem persists, try a different
                payment method or contact your bank for assistance.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button asChild className="flex-1" size="lg">
                <Link to="/cart">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Return to Cart
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1" size="lg">
                <Link to="/checkout">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Try Again
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
