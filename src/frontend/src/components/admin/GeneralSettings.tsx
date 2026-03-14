import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import GCashSettings from "./GCashSettings";
import SocialMediaSettings from "./SocialMediaSettings";
import StripeSetup from "./StripeSetup";

export default function GeneralSettings() {
  return (
    <Tabs defaultValue="store" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">General Settings</h2>
        <p className="text-sm text-muted-foreground">
          Configure store settings and preferences
        </p>
      </div>

      <TabsList>
        <TabsTrigger value="store">Store</TabsTrigger>
        <TabsTrigger value="payment">Payment Methods</TabsTrigger>
        <TabsTrigger value="social">Social Media</TabsTrigger>
      </TabsList>

      <TabsContent value="store" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Store Configuration</CardTitle>
            <CardDescription>
              Basic store settings and information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="store-name">Store Name</Label>
              <Input
                id="store-name"
                defaultValue="HASSANé Collections"
                disabled
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                defaultValue="PHP (Philippine Peso)"
                disabled
              />
            </div>
            <div>
              <Label htmlFor="tax-rate">Tax Rate (%)</Label>
              <Input
                id="tax-rate"
                type="number"
                step="0.01"
                placeholder="e.g., 12.00"
                disabled
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Tax configuration coming soon
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping Settings</CardTitle>
            <CardDescription>
              Configure shipping options and rates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="shipping-fee">Standard Shipping Fee (PHP)</Label>
              <Input
                id="shipping-fee"
                type="number"
                step="0.01"
                placeholder="e.g., 100.00"
                disabled
              />
            </div>
            <div>
              <Label htmlFor="free-shipping">
                Free Shipping Threshold (PHP)
              </Label>
              <Input
                id="free-shipping"
                type="number"
                step="0.01"
                placeholder="e.g., 2000.00"
                disabled
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Shipping configuration coming soon
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>
              Manage authentication and security options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="mfa">Multi-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Require additional verification for admin access
                </p>
              </div>
              <Switch id="mfa" disabled />
            </div>
            <p className="text-xs text-muted-foreground">
              MFA configuration coming soon
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="payment" className="space-y-6">
        <StripeSetup />

        <GCashSettings />

        <Card>
          <CardHeader>
            <CardTitle>Cash on Delivery</CardTitle>
            <CardDescription>COD payment is enabled by default</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="cod">Cash on Delivery</Label>
                <p className="text-sm text-muted-foreground">
                  Allow customers to pay upon delivery
                </p>
              </div>
              <Switch id="cod" defaultChecked disabled />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="social">
        <SocialMediaSettings />
      </TabsContent>
    </Tabs>
  );
}
