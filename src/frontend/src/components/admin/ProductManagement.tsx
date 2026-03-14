import { Edit, Loader2, Package, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ProductMetadata } from "../../backend";
import { ExternalBlob } from "../../backend";
import {
  useAddProduct,
  useBulkUpdateProducts,
  useDeleteProduct,
  useGetAllProducts,
  useUpdateProduct,
} from "../../hooks/useQueries";
import { formatPhpPrice, parsePhpPriceToCents } from "../../lib/currency";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

export default function ProductManagement() {
  const { data: products, isLoading } = useGetAllProducts();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const bulkUpdate = useBulkUpdateProducts();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductMetadata | null>(
    null,
  );
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set(),
  );
  const [bulkPrice, setBulkPrice] = useState("");
  const [bulkStock, setBulkStock] = useState("");

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    category: "",
    subcategory: "",
    tags: "",
    sku: "",
    price: "",
    stockQuantity: "",
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      description: "",
      category: "",
      subcategory: "",
      tags: "",
      sku: "",
      price: "",
      stockQuantity: "",
    });
    setImageFiles([]);
    setEditingProduct(null);
  };

  const handleEdit = (product: ProductMetadata) => {
    setEditingProduct(product);
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      subcategory: product.subcategory,
      tags: product.tags.join(", "),
      sku: product.sku,
      price: (Number(product.pricePhpCents) / 100).toString(),
      stockQuantity: product.stockQuantity.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      let images: ExternalBlob[] = [];

      if (imageFiles.length > 0) {
        images = await Promise.all(
          imageFiles.map(async (file) => {
            const arrayBuffer = await file.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            return ExternalBlob.fromBytes(uint8Array);
          }),
        );
      } else if (editingProduct) {
        images = editingProduct.images;
      }

      const productData: ProductMetadata = {
        id: editingProduct ? editingProduct.id : `product-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        category: formData.category,
        subcategory: formData.subcategory,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
        sku: formData.sku || `SKU-${Date.now()}`,
        pricePhpCents: BigInt(parsePhpPriceToCents(formData.price)),
        stockQuantity: BigInt(formData.stockQuantity || "0"),
        availability: BigInt(formData.stockQuantity || "0"),
        images,
      };

      if (editingProduct) {
        await updateProduct.mutateAsync(productData);
        toast.success("Product updated successfully");
      } else {
        await addProduct.mutateAsync(productData);
        toast.success("Product added successfully");
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product");
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct.mutateAsync(productId);
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedProducts.size === 0) {
      toast.error("Please select products to update");
      return;
    }

    if (!bulkPrice && !bulkStock) {
      toast.error("Please enter a price or stock quantity to update");
      return;
    }

    try {
      await bulkUpdate.mutateAsync({
        ids: Array.from(selectedProducts),
        price: bulkPrice ? BigInt(parsePhpPriceToCents(bulkPrice)) : null,
        stockQuantity: bulkStock ? BigInt(bulkStock) : null,
      });
      toast.success(`Updated ${selectedProducts.size} products`);
      setSelectedProducts(new Set());
      setBulkPrice("");
      setBulkStock("");
    } catch (error) {
      console.error("Error bulk updating:", error);
      toast.error("Failed to update products");
    }
  };

  const toggleProductSelection = (productId: string) => {
    const newSelection = new Set(selectedProducts);
    if (newSelection.has(productId)) {
      newSelection.delete(productId);
    } else {
      newSelection.add(productId);
    }
    setSelectedProducts(newSelection);
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Product Management</h2>
          <p className="text-sm text-muted-foreground">
            Add, edit, and manage your product catalog
          </p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    placeholder="Auto-generated if empty"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Men">Men</SelectItem>
                      <SelectItem value="Women">Women</SelectItem>
                      <SelectItem value="Kids">Kids</SelectItem>
                      <SelectItem value="Unisex">Unisex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Select
                    value={formData.subcategory}
                    onValueChange={(value) =>
                      setFormData({ ...formData, subcategory: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Clothing">Clothing</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                      <SelectItem value="Footwear">Footwear</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="e.g., summer, casual, formal"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="price">Price (PHP) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="e.g., 1000.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stockQuantity: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="images">Product Images</Label>
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {editingProduct && imageFiles.length === 0
                    ? "Leave empty to keep existing images"
                    : "Select one or more images"}
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={addProduct.isPending || updateProduct.isPending}
                >
                  {addProduct.isPending || updateProduct.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Product"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {selectedProducts.size > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Bulk Actions ({selectedProducts.size} selected)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <Label htmlFor="bulk-price">Update Price (PHP)</Label>
                <Input
                  id="bulk-price"
                  type="number"
                  step="0.01"
                  value={bulkPrice}
                  onChange={(e) => setBulkPrice(e.target.value)}
                  placeholder="Leave empty to skip"
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <Label htmlFor="bulk-stock">Update Stock</Label>
                <Input
                  id="bulk-stock"
                  type="number"
                  value={bulkStock}
                  onChange={(e) => setBulkStock(e.target.value)}
                  placeholder="Leave empty to skip"
                />
              </div>
              <div className="flex items-end gap-2">
                <Button
                  onClick={handleBulkUpdate}
                  disabled={bulkUpdate.isPending}
                >
                  {bulkUpdate.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Apply Changes"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedProducts(new Set())}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products?.map((product) => (
          <Card
            key={product.id}
            className={
              selectedProducts.has(product.id) ? "ring-2 ring-primary" : ""
            }
          >
            <CardHeader className="p-0">
              <div className="relative">
                <img
                  src={
                    product.images[0]?.getDirectURL() ||
                    "/assets/generated/sample-dress.dim_600x800.jpg"
                  }
                  alt={product.name}
                  className="aspect-[3/4] w-full rounded-t-lg object-cover"
                />
                <div className="absolute left-2 top-2">
                  <Checkbox
                    checked={selectedProducts.has(product.id)}
                    onCheckedChange={() => toggleProductSelection(product.id)}
                    className="bg-background"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="mb-2 text-lg">{product.name}</CardTitle>
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <span>{product.category}</span>
                {product.subcategory && (
                  <>
                    <span>•</span>
                    <span>{product.subcategory}</span>
                  </>
                )}
              </div>
              <p className="mb-1 text-sm text-muted-foreground">
                SKU: {product.sku}
              </p>
              <p className="mb-2 font-bold">
                {formatPhpPrice(product.pricePhpCents)}
              </p>
              <div className="mb-4 flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Stock: {product.stockQuantity.toString()}
                </span>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(product)}
                  className="flex-1"
                >
                  <Edit className="mr-1 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(product.id)}
                  disabled={deleteProduct.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products?.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No products yet. Add your first product to get started.
        </div>
      )}
    </div>
  );
}
