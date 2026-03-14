import { AlertCircle, CheckCircle2, CreditCard, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { StripeConfiguration } from "../../backend";
import { useActor } from "../../hooks/useActor";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function StripeSetup() {
  const { actor } = useActor();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [formData, setFormData] = useState({
    secretKey: "",
    allowedCountries: "PH",
  });

  useEffect(() => {
    if (!actor) return;
    setIsLoading(true);
    actor
      .isStripeConfigured()
      .then((configured) => setIsConfigured(configured))
      .catch((error) =>
        console.error("Error checking Stripe configuration:", error),
      )
      .finally(() => setIsLoading(false));
  }, [actor]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!formData.secretKey.trim()) {
      toast.error("Please enter your Stripe Secret Key");
      return;
    }

    if (!formData.allowedCountries.trim()) {
      toast.error("Please enter at least one country code");
      return;
    }

    const countries = formData.allowedCountries
      .split(",")
      .map((c) => c.trim().toUpperCase())
      .filter((c) => c.length === 2);

    if (countries.length === 0) {
      toast.error(
        "Please enter valid 2-letter country codes (e.g., PH, US, CA)",
      );
      return;
    }

    try {
      setIsSaving(true);

      if (!actor) throw new Error("Actor not available");

      const config: StripeConfiguration = {
        secretKey: formData.secretKey,
        allowedCountries: countries,
      };

      await actor.setStripeConfiguration(config);

      setIsConfigured(true);
      toast.success("Stripe payment settings saved successfully!");

      // Clear the secret key from display for security
      setFormData({ ...formData, secretKey: "••••••••••••••••" });
    } catch (error: any) {
      console.error("Error saving Stripe configuration:", error);
      toast.error(error.message || "Failed to save Stripe settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          <CardTitle>Stripe Payment Setup</CardTitle>
        </div>
        <CardDescription>
          Configure Stripe to accept card payments in PHP currency
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isConfigured && (
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              Stripe payment is configured and ready to accept payments
            </AlertDescription>
          </Alert>
        )}

        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
          <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Important:</strong> Get your Stripe Secret Key from your{" "}
            <a
              href="https://dashboard.stripe.com/apikeys"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-600"
            >
              Stripe Dashboard
            </a>
            . Keep this key secure and never share it publicly.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="secretKey">Stripe Secret Key *</Label>
            <Input
              id="secretKey"
              name="secretKey"
              type="password"
              value={formData.secretKey}
              onChange={handleInputChange}
              placeholder="sk_live_... or sk_test_..."
              disabled={isSaving}
            />
            <p className="text-xs text-muted-foreground">
              Your Stripe secret key (starts with sk_live_ or sk_test_)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="allowedCountries">Supported Countries *</Label>
            <Input
              id="allowedCountries"
              name="allowedCountries"
              value={formData.allowedCountries}
              onChange={handleInputChange}
              placeholder="PH, US, CA, GB"
              disabled={isSaving}
            />
            <p className="text-xs text-muted-foreground">
              Comma-separated 2-letter country codes (e.g., PH for Philippines,
              US for United States)
            </p>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <p className="text-sm font-medium">Payment Currency</p>
            <p className="text-sm text-muted-foreground">
              All payments will be processed in{" "}
              <strong>PHP (Philippine Peso)</strong>
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={isSaving} className="flex-1">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Save Stripe Settings
              </>
            )}
          </Button>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>Testing:</strong> Use test mode keys (sk_test_...) for
            development. Switch to live keys (sk_live_...) when ready for
            production.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
