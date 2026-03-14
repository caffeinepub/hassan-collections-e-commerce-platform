import { useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Package,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { OrderStatus } from "../backend";
import AdminHelp from "../components/admin/AdminHelp";
import AppearanceSettings from "../components/admin/AppearanceSettings";
import GeneralSettings from "../components/admin/GeneralSettings";
import InventoryManagement from "../components/admin/InventoryManagement";
import MediaManagement from "../components/admin/MediaManagement";
import OrderManagement from "../components/admin/OrderManagement";
import ProductManagement from "../components/admin/ProductManagement";
import SalesAnalytics from "../components/admin/SalesAnalytics";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetAllOrders,
  useGetAllProducts,
  useGetLowStockAlerts,
  useGetTopSellingProducts,
  useGetTotalSales,
  useInitializeAccessControl,
  useIsAdminAssigned,
  useIsCallerAdmin,
} from "../hooks/useQueries";
import { formatPhpPrice } from "../lib/currency";

export default function AdminPage() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const {
    data: isAdmin,
    isLoading: isCheckingAdmin,
    refetch: refetchIsAdmin,
  } = useIsCallerAdmin();
  const { data: isAdminAssigned, isLoading: isCheckingAssigned } =
    useIsAdminAssigned();
  const initializeAccess = useInitializeAccessControl();
  const { data: products } = useGetAllProducts();
  const { data: totalSales } = useGetTotalSales();
  const { data: topProducts } = useGetTopSellingProducts(5);
  const { data: lowStockAlerts } = useGetLowStockAlerts(10);
  const { data: orders } = useGetAllOrders();

  const [showAdminActivationBanner, setShowAdminActivationBanner] =
    useState(false);

  const isAuthenticated = !!identity;
  const disabled = loginStatus === "logging-in";

  // Auto-initialize admin access when no admin is assigned yet
  useEffect(() => {
    if (
      isAuthenticated &&
      isAdminAssigned === false &&
      !isCheckingAssigned &&
      !initializeAccess.isPending
    ) {
      initializeAccess.mutate(undefined, {
        onSuccess: () => {
          refetchIsAdmin();
          setShowAdminActivationBanner(true);
          setTimeout(() => setShowAdminActivationBanner(false), 10000);
        },
      });
    }
  }, [
    isAuthenticated,
    isAdminAssigned,
    isCheckingAssigned,
    initializeAccess.isPending,
    initializeAccess.mutate,
    refetchIsAdmin,
  ]);

  // Reset banner when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setShowAdminActivationBanner(false);
    }
  }, [isAuthenticated]);

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error("Login error:", error);
        if (error.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-12">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please log in with Internet Identity to access the admin panel.
            </p>
            <Button onClick={handleAuth} disabled={disabled} className="w-full">
              {disabled ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login with Internet Identity"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isCheckingAdmin || isCheckingAssigned || initializeAccess.isPending) {
    return (
      <div className="container flex min-h-[400px] flex-col items-center justify-center gap-3 py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        {(isCheckingAssigned || initializeAccess.isPending) && (
          <p className="text-sm text-muted-foreground">
            Setting up admin access...
          </p>
        )}
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-12">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You don't have permission to access the admin panel.
            </p>
            <Button onClick={handleAuth} variant="outline" className="w-full">
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const recentOrders = orders?.slice(0, 5) || [];
  const pendingOrders =
    orders?.filter((o) => o.status === OrderStatus.pending).length || 0;

  return (
    <div className="container py-12">
      {showAdminActivationBanner && (
        <Alert className="mb-6 border-green-500 bg-green-50 dark:bg-green-950">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-800 dark:text-green-200">
            Admin Access Granted!
          </AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-300">
            You have been successfully assigned as an administrator. You now
            have full access to manage the HASSANé Collections store.
          </AlertDescription>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
            onClick={() => setShowAdminActivationBanner(false)}
          >
            ×
          </Button>
        </Alert>
      )}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your HASSANé Collections store
          </p>
        </div>
        <Button onClick={handleAuth} variant="outline">
          Logout
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="help">Help</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Sales
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPhpPrice(totalSales || BigInt(0))}
                </div>
                <p className="text-xs text-muted-foreground">
                  All-time revenue
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Products
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {products?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {products?.filter((p) => Number(p.stockQuantity) > 0)
                    .length || 0}{" "}
                  in stock
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Low Stock Alerts
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {lowStockAlerts?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Items need restocking
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Orders
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingOrders}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting processing
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
              </CardHeader>
              <CardContent>
                {topProducts && topProducts.length > 0 ? (
                  <div className="space-y-4">
                    {topProducts.map(([productId, quantity]) => {
                      const product = products?.find((p) => p.id === productId);
                      return (
                        <div
                          key={productId}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            {product?.images[0] && (
                              <img
                                src={product.images[0].getDirectURL()}
                                alt={product.name}
                                className="h-10 w-10 rounded object-cover"
                              />
                            )}
                            <div>
                              <p className="text-sm font-medium">
                                {product?.name || productId}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {product?.category}
                              </p>
                            </div>
                          </div>
                          <div className="text-sm font-medium">
                            {quantity.toString()} sold
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No sales data yet
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            Order #{order.id.slice(0, 8)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.items.length} item(s)
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {formatPhpPrice(order.totalPhpCents)}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {order.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No orders yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="cursor-pointer transition-colors hover:bg-accent">
              <CardHeader>
                <CardTitle className="text-base">Product Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Add, edit, and manage your product catalog
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer transition-colors hover:bg-accent">
              <CardHeader>
                <CardTitle className="text-base">Media Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Upload and organize store images and media
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer transition-colors hover:bg-accent">
              <CardHeader>
                <CardTitle className="text-base">Order Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Process orders and manage fulfillment
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products">
          <ProductManagement />
        </TabsContent>

        <TabsContent value="inventory">
          <InventoryManagement />
        </TabsContent>

        <TabsContent value="media">
          <MediaManagement />
        </TabsContent>

        <TabsContent value="orders">
          <OrderManagement />
        </TabsContent>

        <TabsContent value="analytics">
          <SalesAnalytics />
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-6">
            <GeneralSettings />
            <AppearanceSettings />
          </div>
        </TabsContent>

        <TabsContent value="help">
          <AdminHelp />
        </TabsContent>
      </Tabs>
    </div>
  );
}
