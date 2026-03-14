import { useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  BookOpen,
  FileText,
  HelpCircle,
  Info,
  Mail,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import {
  useIsAdminAssigned,
  useResetAdminAccess,
} from "../../hooks/useQueries";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function AdminHelp() {
  const { data: isAdminAssigned } = useIsAdminAssigned();
  const { clear } = useInternetIdentity();
  const resetAdminAccess = useResetAdminAccess();
  const queryClient = useQueryClient();
  const [isResetting, setIsResetting] = useState(false);

  const handleResetAdminAccess = async () => {
    setIsResetting(true);
    try {
      await resetAdminAccess.mutateAsync();
      toast.success("Admin access has been reset successfully");

      // Clear all cached data and log out
      await clear();
      queryClient.clear();

      // Redirect to home page
      window.location.href = "/";
    } catch (error: any) {
      console.error("Failed to reset admin access:", error);
      toast.error(
        `Failed to reset admin access: ${error.message || "Unknown error"}`,
      );
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Help & Documentation</CardTitle>
          <CardDescription>
            Find answers to common questions and learn how to use the admin
            panel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="cursor-pointer transition-colors hover:bg-accent">
              <CardHeader>
                <BookOpen className="mb-2 h-8 w-8 text-primary" />
                <CardTitle className="text-base">Getting Started</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Learn the basics of managing your store
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer transition-colors hover:bg-accent">
              <CardHeader>
                <FileText className="mb-2 h-8 w-8 text-primary" />
                <CardTitle className="text-base">Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Detailed guides for all features
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer transition-colors hover:bg-accent">
              <CardHeader>
                <Mail className="mb-2 h-8 w-8 text-primary" />
                <CardTitle className="text-base">Contact Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get help from our support team
                </p>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">
              Frequently Asked Questions
            </h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    How do I add a new product?
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    Navigate to the Products tab and click the "Add Product"
                    button. Fill in the product details including name,
                    description, price, category, and upload images. Make sure
                    to set the stock quantity and click "Save" to add the
                    product to your catalog.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    How do I manage inventory?
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    Go to the Inventory tab to view stock levels for all
                    products. You can update stock quantities, set low stock
                    alerts, and restock products. The system will automatically
                    notify you when items are running low.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    How do I process orders?
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    Visit the Orders tab to see all customer orders. You can
                    filter by status (pending, shipped, delivered, returned),
                    view order details, and update the order status as you
                    process and ship items.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    How do I customize the store appearance?
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    In the Settings tab, you'll find options to customize your
                    store's appearance including homepage background, shop page
                    background, and hero images. You can also manage social
                    media links and payment settings.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    How do I view sales analytics?
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    The Analytics tab provides detailed insights into your sales
                    performance including total revenue, sales by category, and
                    top-selling products. Use these insights to make informed
                    business decisions.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    How do I manage media files?
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    The Media tab allows you to upload and organize images for
                    your store. You can upload product images, banners, and
                    other media files. Each uploaded file gets a unique URL that
                    you can use throughout your store.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    How does admin access work?
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    {isAdminAssigned
                      ? "An administrator has been assigned to this store. The admin has full access to all features including product management, order processing, inventory control, and settings configuration."
                      : "No administrator has been assigned yet. The first person to log in with Internet Identity will automatically become the administrator with full access to all features."}
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    How do I reset admin access?
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    If you need to reassign admin access to a different Internet
                    Identity, you can use the "Reset Admin Access" button below.
                    This will clear the current admin assignment, and the next
                    person to log in with Internet Identity will automatically
                    become the new administrator. This action requires you to be
                    logged out and cannot be undone.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {!isAdminAssigned && (
            <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertTitle className="text-blue-800 dark:text-blue-200">
                Admin Setup Required
              </AlertTitle>
              <AlertDescription className="text-blue-700 dark:text-blue-300">
                No administrator has been assigned to this store yet. The next
                person to log in with Internet Identity will automatically
                become the administrator with full access privileges.
              </AlertDescription>
            </Alert>
          )}

          {isAdminAssigned && (
            <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                  <AlertTriangle className="h-5 w-5" />
                  Reset Admin Access
                </CardTitle>
                <CardDescription className="text-orange-700 dark:text-orange-300">
                  Clear the current admin assignment and allow a new
                  administrator to be assigned
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-orange-300 bg-white p-4 dark:border-orange-700 dark:bg-orange-900/20">
                  <h4 className="mb-2 font-semibold text-orange-900 dark:text-orange-100">
                    What happens when you reset admin access?
                  </h4>
                  <ul className="list-inside list-disc space-y-1 text-sm text-orange-800 dark:text-orange-200">
                    <li>The current admin assignment will be cleared</li>
                    <li>You will be logged out immediately</li>
                    <li>All cached data will be cleared</li>
                    <li>
                      The next person to log in with Internet Identity will
                      become the new admin
                    </li>
                    <li>This action cannot be undone</li>
                  </ul>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isResetting}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reset Admin Access
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will reset the admin access control. You
                        will be logged out immediately, and the next person to
                        log in with Internet Identity will become the new
                        administrator. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleResetAdminAccess}
                        disabled={isResetting}
                      >
                        {isResetting
                          ? "Resetting..."
                          : "Yes, Reset Admin Access"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          )}

          <div className="rounded-lg border bg-muted/50 p-4">
            <h4 className="mb-2 font-semibold">Need More Help?</h4>
            <p className="mb-4 text-sm text-muted-foreground">
              If you can't find the answer you're looking for, our support team
              is here to help.
            </p>
            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
