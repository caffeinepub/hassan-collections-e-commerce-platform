import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  CreditCard,
  Loader2,
  ShoppingBag,
  UserPlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Order, ShoppingItem } from "../backend";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateCheckoutSession,
  useGetAllProducts,
  useGetCallerUserProfile,
  useGetGCashSettings,
  useIsStripeConfigured,
  useRegisterUser,
} from "../hooks/useQueries";
import { useCartStore } from "../lib/cartStore";
import { formatPhpPrice } from "../lib/currency";

type PaymentMethod = "stripe" | "gcash" | "cod";
type CheckoutMode = "guest" | "create-account";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotalPricePhpCents, clearCart } = useCartStore();
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const registerUser = useRegisterUser();
  const { actor } = useActor();
  const { data: gCashSettings } = useGetGCashSettings();
  const { data: isStripeConfigured } = useIsStripeConfigured();
  const createCheckoutSession = useCreateCheckoutSession();
  const { data: allProducts } = useGetAllProducts();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGCashModal, setShowGCashModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [checkoutMode, setCheckoutMode] = useState<CheckoutMode>("guest");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [accountData, setAccountData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const isAuthenticated = !!identity;
  const hasProfile = !!userProfile;

  useEffect(() => {
    if (items.length === 0) {
      navigate({ to: "/cart" });
    }
  }, [items.length, navigate]);

  useEffect(() => {
    if (isAuthenticated && hasProfile && userProfile) {
      setFormData((prev) => ({
        ...prev,
        name: userProfile.name || "",
        email: userProfile.email || "",
      }));
    }
  }, [isAuthenticated, hasProfile, userProfile]);

  // Set default payment method based on Stripe configuration
  useEffect(() => {
    if (isStripeConfigured) {
      setPaymentMethod("stripe");
    } else {
      setPaymentMethod("gcash");
    }
  }, [isStripeConfigured]);

  if (items.length === 0) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAccountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountData({ ...accountData, [name]: value });

    if (name === "password" || name === "confirmPassword") {
      validatePasswords(
        name === "password" ? value : accountData.password,
        name === "confirmPassword" ? value : accountData.confirmPassword,
      );
    }
  };

  const validatePasswords = (password: string, confirmPassword: string) => {
    const errors: string[] = [];

    if (password.length > 0 && password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    if (password.length > 0 && !/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }

    if (password.length > 0 && !/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }

    if (password.length > 0 && !/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }

    if (confirmPassword.length > 0 && password !== confirmPassword) {
      errors.push("Passwords do not match");
    }

    setPasswordErrors(errors);
    return errors.length === 0;
  };

  const handleCreateAccount = async () => {
    if (
      !accountData.name ||
      !accountData.email ||
      !accountData.password ||
      !accountData.confirmPassword
    ) {
      toast.error("Please fill in all account fields");
      return;
    }

    if (!validatePasswords(accountData.password, accountData.confirmPassword)) {
      toast.error("Please fix password errors before continuing");
      return;
    }

    try {
      setIsProcessing(true);

      await login();

      const passwordHash = btoa(accountData.password);
      await registerUser.mutateAsync({
        name: accountData.name,
        email: accountData.email,
        passwordHash,
      });

      toast.success("Account created successfully!");
      setShowAccountModal(false);

      setFormData({
        ...formData,
        name: accountData.name,
        email: accountData.email,
      });
    } catch (error: any) {
      console.error("Account creation error:", error);
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsProcessing(false);
    }
  };

  const validateCartItems = () => {
    // Validate that all cart items have required data
    for (const item of items) {
      if (
        !item.productId ||
        !item.name ||
        !item.pricePhpCents ||
        !item.quantity
      ) {
        toast.error("Invalid cart data. Please refresh and try again.");
        return false;
      }

      if (item.quantity <= 0) {
        toast.error(`Invalid quantity for ${item.name}`);
        return false;
      }

      if (item.pricePhpCents <= 0) {
        toast.error(`Invalid price for ${item.name}`);
        return false;
      }

      // Verify product still exists and has stock
      if (allProducts) {
        const product = allProducts.find((p) => p.id === item.productId);
        if (!product) {
          toast.error(`Product ${item.name} is no longer available`);
          return false;
        }
        if (Number(product.stockQuantity) < item.quantity) {
          toast.error(
            `Insufficient stock for ${item.name}. Only ${product.stockQuantity} available.`,
          );
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address
    ) {
      toast.error("Please fill in all shipping information fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (formData.phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    // Validate cart items before proceeding
    if (!validateCartItems()) {
      return;
    }

    if (!isAuthenticated && checkoutMode === "create-account") {
      setAccountData({
        name: formData.name,
        email: formData.email,
        password: "",
        confirmPassword: "",
      });
      setShowAccountModal(true);
      return;
    }

    setIsProcessing(true);

    try {
      // Handle Stripe payment
      if (paymentMethod === "stripe") {
        if (!isStripeConfigured) {
          toast.error(
            "Stripe payment is not configured. Please choose another payment method.",
          );
          setIsProcessing(false);
          return;
        }

        const baseUrl = `${window.location.protocol}//${window.location.host}`;
        const successUrl = `${baseUrl}/payment-success`;
        const cancelUrl = `${baseUrl}/payment-failure`;

        const shoppingItems: ShoppingItem[] = items.map((item) => ({
          productName: item.name,
          productDescription: item.name,
          priceInCents: BigInt(item.pricePhpCents),
          quantity: BigInt(item.quantity),
          currency: "PHP",
        }));

        const session = await createCheckoutSession.mutateAsync({
          items: shoppingItems,
          successUrl,
          cancelUrl,
        });

        // Redirect to Stripe checkout
        window.location.href = session.url;
        return;
      }

      // Handle GCash and COD payments
      const orderId = `order-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      // Create order with validated data
      const order: Order = {
        id: orderId,
        userId: identity?.getPrincipal(),
        items: items.map((item) => ({
          productId: item.productId,
          quantity: BigInt(item.quantity),
          pricePhpCents: BigInt(item.pricePhpCents),
        })),
        totalPhpCents: BigInt(getTotalPricePhpCents()),
        status: { __kind__: "pending" } as any,
        createdAt: BigInt(Date.now()),
        shippingAddress: `${formData.name}, ${formData.phone}, ${formData.address}`,
        paymentMethod: paymentMethod === "gcash" ? "GCash" : "Cash on Delivery",
        isGuestOrder: !isAuthenticated,
        guestEmail: !isAuthenticated ? formData.email : undefined,
      };

      if (isAuthenticated && hasProfile && actor) {
        await actor.createOrder(order);
        toast.success("Order created successfully!");
      } else if (!isAuthenticated && actor) {
        const guestSessionId = await actor.createGuestSession();
        await actor.createGuestOrder(order, guestSessionId);

        localStorage.setItem("guestSessionId", guestSessionId);
        localStorage.setItem("guestOrderId", orderId);
        toast.success("Order created successfully!");
      }

      if (paymentMethod === "gcash") {
        setShowGCashModal(true);
      } else if (paymentMethod === "cod") {
        toast.success("Order placed successfully! You will pay on delivery.");
        clearCart();
        navigate({ to: "/payment-success" });
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      const errorMessage =
        error.message || "Failed to process order. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGCashConfirm = () => {
    setShowGCashModal(false);
    toast.success(
      "Order placed successfully! Please complete the GCash payment.",
    );
    clearCart();
    navigate({ to: "/payment-success" });
  };

  return (
    <div className="container py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">
        Secure Checkout
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {!isAuthenticated && (
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Checkout Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs
                    value={checkoutMode}
                    onValueChange={(value) =>
                      setCheckoutMode(value as CheckoutMode)
                    }
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger
                        value="guest"
                        className="flex items-center gap-2"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Guest Checkout
                      </TabsTrigger>
                      <TabsTrigger
                        value="create-account"
                        className="flex items-center gap-2"
                      >
                        <UserPlus className="h-4 w-4" />
                        Create Account
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="guest" className="mt-4">
                      <div className="rounded-lg bg-muted p-4">
                        <p className="text-sm text-muted-foreground">
                          Checkout quickly without creating an account. You'll
                          receive order confirmation via email.
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="create-account" className="mt-4">
                      <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-4 border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-2">
                          Benefits of creating an account:
                        </p>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                          <li>Track your orders easily</li>
                          <li>Save favorites for later</li>
                          <li>Faster checkout next time</li>
                          <li>Exclusive member offers</li>
                        </ul>
                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-3">
                          You'll be prompted to set up your account after
                          entering shipping details.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {isAuthenticated && hasProfile && (
              <Card className="border-2 border-green-500/20 bg-green-50/50 dark:bg-green-950/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <CheckCircle2 className="h-5 w-5" />
                    <p className="font-medium">
                      Logged in as {userProfile.name}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Juan Dela Cruz"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="juan@example.com"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Order confirmation will be sent to this email
                  </p>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+63 912 345 6789"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    For delivery coordination
                  </p>
                </div>
                <div>
                  <Label htmlFor="address">Complete Shipping Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="House/Unit No., Street, Barangay, City, Province, Postal Code"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) =>
                    setPaymentMethod(value as PaymentMethod)
                  }
                >
                  {isStripeConfigured && (
                    <div className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-accent/50 transition-colors">
                      <RadioGroupItem
                        value="stripe"
                        id="stripe"
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor="stripe"
                          className="cursor-pointer font-medium flex items-center gap-2"
                        >
                          <CreditCard className="h-4 w-4" />
                          Credit/Debit Card (Stripe)
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Pay securely with your credit or debit card. Powered
                          by Stripe.
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="gcash" id="gcash" className="mt-1" />
                    <div className="flex-1">
                      <Label
                        htmlFor="gcash"
                        className="cursor-pointer font-medium"
                      >
                        GCash Payment
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Pay securely using GCash. QR code and payment details
                        will be provided after placing your order.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="cod" id="cod" className="mt-1" />
                    <div className="flex-1">
                      <Label
                        htmlFor="cod"
                        className="cursor-pointer font-medium"
                      >
                        Cash on Delivery
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Pay with cash when your order is delivered to your
                        address. No advance payment required.
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {item.name} × {item.quantity}
                      </span>
                      <span>
                        {formatPhpPrice(item.pricePhpCents * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPhpPrice(getTotalPricePhpCents())}</span>
                  </div>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isProcessing || loginStatus === "logging-in"}
                >
                  {isProcessing || loginStatus === "logging-in" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  By placing your order, you agree to our Terms of Service and
                  Privacy Policy
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

      <Dialog open={showAccountModal} onOpenChange={setShowAccountModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Your Account</DialogTitle>
            <DialogDescription>
              Set up your account to complete the order and enjoy member
              benefits.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="acc-name">Full Name *</Label>
              <Input
                id="acc-name"
                name="name"
                value={accountData.name}
                onChange={handleAccountInputChange}
                placeholder="Juan Dela Cruz"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="acc-email">Email Address *</Label>
              <Input
                id="acc-email"
                name="email"
                type="email"
                value={accountData.email}
                onChange={handleAccountInputChange}
                placeholder="juan@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="acc-password">Password *</Label>
              <Input
                id="acc-password"
                name="password"
                type="password"
                value={accountData.password}
                onChange={handleAccountInputChange}
                placeholder="Create a secure password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="acc-confirm-password">Confirm Password *</Label>
              <Input
                id="acc-confirm-password"
                name="confirmPassword"
                type="password"
                value={accountData.confirmPassword}
                onChange={handleAccountInputChange}
                placeholder="Re-enter your password"
                required
              />
            </div>

            {passwordErrors.length > 0 && (
              <div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-3 border border-red-200 dark:border-red-800">
                <ul className="text-xs text-red-800 dark:text-red-200 space-y-1">
                  {passwordErrors.map((error) => (
                    <li key={error}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-3 border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-900 dark:text-blue-100">
                <strong>Secure Authentication:</strong> You'll be redirected to
                Internet Identity for secure, passwordless authentication using
                your device's biometrics or security key.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAccountModal(false);
                  setCheckoutMode("guest");
                }}
                className="flex-1"
                disabled={isProcessing}
              >
                Continue as Guest
              </Button>
              <Button
                onClick={handleCreateAccount}
                disabled={
                  isProcessing ||
                  registerUser.isPending ||
                  loginStatus === "logging-in" ||
                  passwordErrors.length > 0
                }
                className="flex-1"
              >
                {isProcessing ||
                registerUser.isPending ||
                loginStatus === "logging-in" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showGCashModal} onOpenChange={setShowGCashModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>GCash Payment Instructions</DialogTitle>
            <DialogDescription>
              Please scan the QR code or use the payment details below to
              complete your payment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {gCashSettings?.qrCodeImage && (
              <div className="flex justify-center">
                <img
                  src={gCashSettings.qrCodeImage.getDirectURL()}
                  alt="GCash QR Code"
                  className="h-64 w-64 rounded-lg border object-contain"
                />
              </div>
            )}
            <div className="space-y-2 rounded-lg bg-muted p-4">
              {gCashSettings?.merchantName && (
                <div>
                  <p className="text-sm font-medium">Account Name</p>
                  <p className="text-lg font-bold">
                    {gCashSettings.merchantName}
                  </p>
                </div>
              )}
              {gCashSettings?.accountNumber && (
                <div>
                  <p className="text-sm font-medium">GCash Number</p>
                  <p className="text-lg font-bold">
                    {gCashSettings.accountNumber}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium">Amount to Pay</p>
                <p className="text-lg font-bold">
                  {formatPhpPrice(getTotalPricePhpCents())}
                </p>
              </div>
            </div>
            {!gCashSettings?.merchantName && !gCashSettings?.accountNumber && (
              <div className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
                GCash payment details have not been configured yet. Please
                contact the store administrator or choose Cash on Delivery.
              </div>
            )}
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-3 border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-900 dark:text-blue-100">
                <strong>Important:</strong> After completing the payment, please
                keep your reference number for tracking purposes. You will
                receive an order confirmation email shortly.
              </p>
            </div>
            <Button onClick={handleGCashConfirm} className="w-full">
              I've Completed the Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
