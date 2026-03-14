import { Eye, Loader2, Package } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { type Order, OrderStatus } from "../../backend";
import { useGetAllOrders, useUpdateOrderStatus } from "../../hooks/useQueries";
import { formatPhpPrice } from "../../lib/currency";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export default function OrderManagement() {
  const { data: orders, isLoading } = useGetAllOrders();
  const updateOrderStatus = useUpdateOrderStatus();

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus,
  ) => {
    try {
      await updateOrderStatus.mutateAsync({ orderId, status: newStatus });
      toast.success("Order status updated successfully");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsDialogOpen(true);
  };

  const filteredOrders =
    orders?.filter((order) => {
      if (statusFilter === "all") return true;
      return order.status === statusFilter;
    }) || [];

  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.pending:
        return "outline";
      case OrderStatus.shipped:
        return "default";
      case OrderStatus.delivered:
        return "default";
      case OrderStatus.returned:
        return "destructive";
      default:
        return "outline";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const pendingCount =
    orders?.filter((o) => o.status === OrderStatus.pending).length || 0;
  const shippedCount =
    orders?.filter((o) => o.status === OrderStatus.shipped).length || 0;
  const deliveredCount =
    orders?.filter((o) => o.status === OrderStatus.delivered).length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Order Management</h2>
        <p className="text-sm text-muted-foreground">
          Process and track customer orders
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Shipped</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {shippedCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {deliveredCount}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Orders</CardTitle>
              <CardDescription>
                Manage and track all customer orders
              </CardDescription>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value={OrderStatus.pending}>Pending</SelectItem>
                <SelectItem value={OrderStatus.shipped}>Shipped</SelectItem>
                <SelectItem value={OrderStatus.delivered}>Delivered</SelectItem>
                <SelectItem value={OrderStatus.returned}>Returned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredOrders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      #{order.id.slice(0, 8)}
                    </TableCell>
                    <TableCell>{order.items.length} item(s)</TableCell>
                    <TableCell className="font-medium">
                      {formatPhpPrice(order.totalPhpCents)}
                    </TableCell>
                    <TableCell className="capitalize">
                      {order.paymentMethod}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(value) =>
                          handleStatusChange(order.id, value as OrderStatus)
                        }
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue>
                            <Badge
                              variant={getStatusBadgeVariant(order.status)}
                            >
                              {order.status}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={OrderStatus.pending}>
                            Pending
                          </SelectItem>
                          <SelectItem value={OrderStatus.shipped}>
                            Shipped
                          </SelectItem>
                          <SelectItem value={OrderStatus.delivered}>
                            Delivered
                          </SelectItem>
                          <SelectItem value={OrderStatus.returned}>
                            Returned
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => viewOrderDetails(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">
                {statusFilter === "all"
                  ? "No orders yet"
                  : `No ${statusFilter} orders`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Order ID
                  </p>
                  <p className="font-medium">#{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <Badge variant={getStatusBadgeVariant(selectedOrder.status)}>
                    {selectedOrder.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Payment Method
                  </p>
                  <p className="capitalize">{selectedOrder.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total
                  </p>
                  <p className="font-bold">
                    {formatPhpPrice(selectedOrder.totalPhpCents)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Shipping Address
                </p>
                <p className="text-sm">{selectedOrder.shippingAddress}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Order Items
                </p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="font-medium">
                          Product ID: {item.productId}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity.toString()}
                        </p>
                      </div>
                      <p className="font-medium">
                        {formatPhpPrice(item.pricePhpCents)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
