import { AlertTriangle, Loader2, Package, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useGetAllProducts,
  useGetLowStockAlerts,
  useRestockProduct,
  useUpdateStock,
} from "../../hooks/useQueries";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export default function InventoryManagement() {
  const { data: products, isLoading } = useGetAllProducts();
  const { data: lowStockAlerts } = useGetLowStockAlerts(10);
  const restockProduct = useRestockProduct();
  const _updateStock = useUpdateStock();

  const [restockDialogOpen, setRestockDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [restockQuantity, setRestockQuantity] = useState("");

  const handleRestock = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProductId || !restockQuantity) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await restockProduct.mutateAsync({
        productId: selectedProductId,
        quantity: BigInt(restockQuantity),
      });
      toast.success("Product restocked successfully");
      setRestockDialogOpen(false);
      setSelectedProductId("");
      setRestockQuantity("");
    } catch (error) {
      console.error("Error restocking product:", error);
      toast.error("Failed to restock product");
    }
  };

  const openRestockDialog = (productId: string) => {
    setSelectedProductId(productId);
    setRestockDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Inventory Management</h2>
        <p className="text-sm text-muted-foreground">
          Track and manage stock levels
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {products?.filter((p) => Number(p.stockQuantity) > 10).length ||
                0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {lowStockAlerts?.length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {lowStockAlerts && lowStockAlerts.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle>Low Stock Alerts</CardTitle>
            </div>
            <CardDescription>These products need restocking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockAlerts.map(([productId, quantity]) => {
                const product = products?.find((p) => p.id === productId);
                return (
                  <div
                    key={productId}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      {product?.images[0] && (
                        <img
                          src={product.images[0].getDirectURL()}
                          alt={product.name}
                          className="h-12 w-12 rounded object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium">
                          {product?.name || productId}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Current stock: {quantity.toString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => openRestockDialog(productId)}
                    >
                      <Package className="mr-2 h-4 w-4" />
                      Restock
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Inventory Summary</CardTitle>
          <CardDescription>
            Complete list of all products and stock levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.map((product) => {
                const stock = Number(product.stockQuantity);
                const status =
                  stock === 0 ? "out" : stock <= 10 ? "low" : "in-stock";

                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.images[0] && (
                          <img
                            src={product.images[0].getDirectURL()}
                            alt={product.name}
                            className="h-10 w-10 rounded object-cover"
                          />
                        )}
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {product.sku}
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="font-medium">{stock}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          status === "out"
                            ? "destructive"
                            : status === "low"
                              ? "outline"
                              : "default"
                        }
                      >
                        {status === "out"
                          ? "Out of Stock"
                          : status === "low"
                            ? "Low Stock"
                            : "In Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openRestockDialog(product.id)}
                      >
                        Restock
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={restockDialogOpen} onOpenChange={setRestockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restock Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRestock} className="space-y-4">
            <div>
              <Label>Product</Label>
              <p className="text-sm font-medium">
                {products?.find((p) => p.id === selectedProductId)?.name}
              </p>
            </div>
            <div>
              <Label htmlFor="restock-quantity">New Stock Quantity</Label>
              <Input
                id="restock-quantity"
                type="number"
                value={restockQuantity}
                onChange={(e) => setRestockQuantity(e.target.value)}
                placeholder="Enter quantity"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setRestockDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={restockProduct.isPending}>
                {restockProduct.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Restocking...
                  </>
                ) : (
                  "Restock"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
