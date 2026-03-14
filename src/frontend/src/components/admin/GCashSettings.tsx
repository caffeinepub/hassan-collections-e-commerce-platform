import { Loader2, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../../backend";
import {
  useGetGCashSettings,
  useUpdateGCashSettings,
} from "../../hooks/useQueries";
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

export default function GCashSettings() {
  const { data: gCashSettings, isLoading } = useGetGCashSettings();
  const updateGCashSettings = useUpdateGCashSettings();

  const [merchantName, setMerchantName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [qrCodeImage, setQrCodeImage] = useState<ExternalBlob | null>(null);
  const [qrCodePreview, setQrCodePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Initialize form with existing settings
  useEffect(() => {
    if (gCashSettings) {
      setMerchantName(gCashSettings.merchantName);
      setAccountNumber(gCashSettings.accountNumber);
      if (gCashSettings.qrCodeImage) {
        setQrCodeImage(gCashSettings.qrCodeImage);
        setQrCodePreview(gCashSettings.qrCodeImage.getDirectURL());
      }
    }
  }, [gCashSettings]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setIsUploading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(uint8Array);

      setQrCodeImage(blob);
      setQrCodePreview(URL.createObjectURL(file));
      toast.success("QR code image uploaded");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setQrCodeImage(null);
    setQrCodePreview(null);
  };

  const handleSave = async () => {
    if (!merchantName || !accountNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await updateGCashSettings.mutateAsync({
        merchantName,
        accountNumber,
        qrCodeImage: qrCodeImage || undefined,
      });
      toast.success("GCash settings saved successfully");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save GCash settings");
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
        <CardTitle>GCash Payment Settings</CardTitle>
        <CardDescription>
          Configure your GCash payment details. This information will be
          displayed to customers during checkout.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="merchant-name">Merchant Name *</Label>
          <Input
            id="merchant-name"
            value={merchantName}
            onChange={(e) => setMerchantName(e.target.value)}
            placeholder="e.g., HASSANé Collections"
          />
          <p className="text-xs text-muted-foreground">
            The name that will appear on the payment instructions
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="account-number">GCash Account Number *</Label>
          <Input
            id="account-number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="e.g., 0917-123-4567"
          />
          <p className="text-xs text-muted-foreground">
            Your GCash mobile number for receiving payments
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="qr-code">GCash QR Code Image</Label>
          <div className="space-y-4">
            {qrCodePreview ? (
              <div className="relative inline-block">
                <img
                  src={qrCodePreview}
                  alt="GCash QR Code"
                  className="h-48 w-48 rounded-lg border object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -right-2 -top-2"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-12">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    No QR code uploaded
                  </p>
                </div>
              </div>
            )}
            <div>
              <Input
                id="qr-code"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="cursor-pointer"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Upload a QR code image for customers to scan during checkout
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-muted p-4">
          <h4 className="mb-2 font-medium">Preview</h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Merchant Name:</span>{" "}
              <span className="font-medium">{merchantName || "Not set"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Account Number:</span>{" "}
              <span className="font-medium">{accountNumber || "Not set"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">QR Code:</span>{" "}
              <span className="font-medium">
                {qrCodeImage ? "Uploaded" : "Not uploaded"}
              </span>
            </div>
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={updateGCashSettings.isPending || isUploading}
          className="w-full"
        >
          {updateGCashSettings.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save GCash Settings"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
