import { Clock, Package, RotateCcw, Truck } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function ShippingReturnsPage() {
  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          Shipping & Returns
        </h1>
        <p className="text-lg text-muted-foreground">
          Everything you need to know about our shipping and return policies
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Shipping Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Shipping Methods</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    <strong>Standard Shipping:</strong> 3-5 business days (Free
                    on orders over ₱2,000)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    <strong>Express Shipping:</strong> 1-2 business days (₱200)
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Shipping Locations</h3>
              <p className="text-muted-foreground">
                We currently ship to all locations within the Philippines.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Order Processing</h3>
              <p className="text-muted-foreground">
                Orders are processed within 1-2 business days. You will receive
                a confirmation email with tracking information once your order
                ships.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5" />
              Returns & Exchanges
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Return Policy</h3>
              <p className="text-muted-foreground">
                We accept returns within 30 days of purchase. Items must be:
              </p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Unworn and unwashed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>In original packaging</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>With all original tags attached</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">How to Return</h3>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Contact our customer service team</li>
                <li>Receive return authorization and instructions</li>
                <li>Pack items securely with original packaging</li>
                <li>Ship to the provided return address</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Refund Processing</h3>
              <p className="text-muted-foreground">
                Refunds are processed within 5-7 business days after we receive
                your return.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5" />
              Order Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Track your order status in real-time through your account
              dashboard or using the tracking number sent to your email.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5" />
              Processing Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              All orders are processed within 1-2 business days. Orders placed
              on weekends or holidays will be processed the next business day.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <RotateCcw className="h-5 w-5" />
              Exchanges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We offer free exchanges for different sizes or colors. Contact us
              within 30 days of purchase to arrange an exchange.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">
              What if my item arrives damaged?
            </h3>
            <p className="text-muted-foreground">
              Please contact us immediately with photos of the damage. We will
              arrange for a replacement or full refund at no cost to you.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Can I cancel my order?</h3>
            <p className="text-muted-foreground">
              Orders can be cancelled within 24 hours of placement. After that,
              the order may have already been processed and shipped.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Do you ship internationally?</h3>
            <p className="text-muted-foreground">
              Currently, we only ship within the Philippines. International
              shipping may be available in the future.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">
              Who pays for return shipping?
            </h3>
            <p className="text-muted-foreground">
              For defective or incorrect items, we cover return shipping. For
              other returns, customers are responsible for return shipping
              costs.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
