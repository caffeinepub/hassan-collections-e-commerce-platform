import { Loader2, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../../backend";
import {
  useGetAppearanceSettings,
  useUpdateAppearanceSettings,
} from "../../hooks/useQueries";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";

export default function AppearanceSettings() {
  const { data: settings, isLoading } = useGetAppearanceSettings();
  const updateSettings = useUpdateAppearanceSettings();

  const [homepageBackground, setHomepageBackground] =
    useState<ExternalBlob | null>(null);
  const [shopBackground, setShopBackground] = useState<ExternalBlob | null>(
    null,
  );
  const [heroImage, setHeroImage] = useState<ExternalBlob | null>(null);

  const [homepagePreview, setHomepagePreview] = useState<string | null>(null);
  const [shopPreview, setShopPreview] = useState<string | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      if (settings.homepageBackground) {
        setHomepageBackground(settings.homepageBackground);
        setHomepagePreview(settings.homepageBackground.getDirectURL());
      }
      if (settings.shopBackground) {
        setShopBackground(settings.shopBackground);
        setShopPreview(settings.shopBackground.getDirectURL());
      }
      if (settings.heroImage) {
        setHeroImage(settings.heroImage);
        setHeroPreview(settings.heroImage.getDirectURL());
      }
    }
  }, [settings]);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "homepage" | "shop" | "hero",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(uint8Array);
      const previewUrl = URL.createObjectURL(file);

      if (type === "homepage") {
        setHomepageBackground(blob);
        setHomepagePreview(previewUrl);
      } else if (type === "shop") {
        setShopBackground(blob);
        setShopPreview(previewUrl);
      } else if (type === "hero") {
        setHeroImage(blob);
        setHeroPreview(previewUrl);
      }
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process image");
    }
  };

  const handleRemoveImage = (type: "homepage" | "shop" | "hero") => {
    if (type === "homepage") {
      setHomepageBackground(null);
      setHomepagePreview(null);
    } else if (type === "shop") {
      setShopBackground(null);
      setShopPreview(null);
    } else if (type === "hero") {
      setHeroImage(null);
      setHeroPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateSettings.mutateAsync({
        homepageBackground: homepageBackground || undefined,
        shopBackground: shopBackground || undefined,
        heroImage: heroImage || undefined,
      });
      toast.success("Appearance settings saved successfully");
    } catch (error) {
      console.error("Error saving appearance settings:", error);
      toast.error("Failed to save appearance settings");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Homepage Background</CardTitle>
          <CardDescription>
            Upload a background image for the homepage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {homepagePreview ? (
            <div className="relative">
              <img
                src={homepagePreview}
                alt="Homepage background preview"
                className="h-48 w-full rounded-lg object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => handleRemoveImage("homepage")}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-12">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No image uploaded
                </p>
              </div>
            </div>
          )}
          <div>
            <Label htmlFor="homepage-bg">Upload Image</Label>
            <input
              id="homepage-bg"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "homepage")}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shop Page Background</CardTitle>
          <CardDescription>
            Upload a background image for the shop page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {shopPreview ? (
            <div className="relative">
              <img
                src={shopPreview}
                alt="Shop background preview"
                className="h-48 w-full rounded-lg object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => handleRemoveImage("shop")}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-12">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No image uploaded
                </p>
              </div>
            </div>
          )}
          <div>
            <Label htmlFor="shop-bg">Upload Image</Label>
            <input
              id="shop-bg"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "shop")}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hero Section Image</CardTitle>
          <CardDescription>
            Upload a hero image for the homepage banner
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {heroPreview ? (
            <div className="relative">
              <img
                src={heroPreview}
                alt="Hero banner"
                className="h-48 w-full rounded-lg object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => handleRemoveImage("hero")}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-12">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No image uploaded
                </p>
              </div>
            </div>
          )}
          <div>
            <Label htmlFor="hero-image">Upload Image</Label>
            <input
              id="hero-image"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "hero")}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={updateSettings.isPending}>
        {updateSettings.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Appearance Settings"
        )}
      </Button>
    </form>
  );
}
