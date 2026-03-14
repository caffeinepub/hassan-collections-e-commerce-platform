import { Image as ImageIcon, Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../../backend";
import { useGetAllImages, useUploadImage } from "../../hooks/useQueries";
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

export default function MediaManagement() {
  const { data: images, isLoading } = useGetAllImages();
  const uploadImage = useUploadImage();

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [imageId, setImageId] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      setUploadFile(file);
      setImageId(`image-${Date.now()}`);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadFile || !imageId) {
      toast.error("Please select an image and provide an ID");
      return;
    }

    try {
      const arrayBuffer = await uploadFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(uint8Array);

      await uploadImage.mutateAsync({ id: imageId, blob });
      toast.success("Image uploaded successfully");
      setUploadFile(null);
      setImageId("");

      // Reset file input
      const fileInput = document.getElementById(
        "media-upload",
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Media Management</h2>
        <p className="text-sm text-muted-foreground">
          Upload and organize store images
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload New Image</CardTitle>
          <CardDescription>Add images to your media library</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <Label htmlFor="media-upload">Select Image</Label>
              <Input
                id="media-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            {uploadFile && (
              <div>
                <Label htmlFor="image-id">Image ID</Label>
                <Input
                  id="image-id"
                  value={imageId}
                  onChange={(e) => setImageId(e.target.value)}
                  placeholder="e.g., banner-summer-2025"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Auto-generated, but you can customize it
                </p>
              </div>
            )}
            <Button
              type="submit"
              disabled={!uploadFile || uploadImage.isPending}
            >
              {uploadImage.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Media Library</CardTitle>
          <CardDescription>
            {images?.length || 0} image(s) in your library
          </CardDescription>
        </CardHeader>
        <CardContent>
          {images && images.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              {images.map(([id, blob]) => (
                <div
                  key={id}
                  className="group relative overflow-hidden rounded-lg border"
                >
                  <img
                    src={blob.getDirectURL()}
                    alt={id}
                    className="aspect-square w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="text-xs font-medium text-white truncate">
                      {id}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">
                No images in your library yet. Upload your first image to get
                started.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
