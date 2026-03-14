import { ExternalLink, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { SiFacebook, SiInstagram, SiTiktok, SiX } from "react-icons/si";
import { toast } from "sonner";
import {
  useGetSocialLinks,
  useUpdateSocialLinks,
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

export default function SocialMediaSettings() {
  const { data: socialLinks, isLoading } = useGetSocialLinks();
  const updateSocialLinks = useUpdateSocialLinks();

  const [formData, setFormData] = useState({
    facebook: "",
    instagram: "",
    x: "",
    tiktok: "",
    email: "",
  });

  // Update form when data loads
  useEffect(() => {
    if (socialLinks) {
      setFormData({
        facebook: socialLinks.facebook,
        instagram: socialLinks.instagram,
        x: socialLinks.x,
        tiktok: socialLinks.tiktok,
        email: socialLinks.email,
      });
    }
  }, [socialLinks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateSocialLinks.mutateAsync(formData);
      toast.success("Social media links updated successfully");
    } catch (error) {
      console.error("Failed to update social links:", error);
      toast.error("Failed to update social media links");
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
        <h2 className="text-2xl font-bold">Social Media Links</h2>
        <p className="text-sm text-muted-foreground">
          Manage your social media presence and contact information
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Social Media Accounts</CardTitle>
            <CardDescription>
              Update your social media URLs and contact email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Facebook */}
            <div className="space-y-2">
              <Label htmlFor="facebook" className="flex items-center gap-2">
                <SiFacebook className="h-4 w-4" />
                Facebook
              </Label>
              <div className="flex gap-2">
                <Input
                  id="facebook"
                  type="url"
                  placeholder="https://facebook.com/shophassaneofficial"
                  value={formData.facebook}
                  onChange={(e) =>
                    setFormData({ ...formData, facebook: e.target.value })
                  }
                />
                {formData.facebook && (
                  <Button type="button" variant="outline" size="icon" asChild>
                    <a
                      href={formData.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {/* Instagram */}
            <div className="space-y-2">
              <Label htmlFor="instagram" className="flex items-center gap-2">
                <SiInstagram className="h-4 w-4" />
                Instagram
              </Label>
              <div className="flex gap-2">
                <Input
                  id="instagram"
                  type="url"
                  placeholder="https://instagram.com/shophassaneofficial"
                  value={formData.instagram}
                  onChange={(e) =>
                    setFormData({ ...formData, instagram: e.target.value })
                  }
                />
                {formData.instagram && (
                  <Button type="button" variant="outline" size="icon" asChild>
                    <a
                      href={formData.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {/* X (Twitter) */}
            <div className="space-y-2">
              <Label htmlFor="x" className="flex items-center gap-2">
                <SiX className="h-4 w-4" />X (Twitter)
              </Label>
              <div className="flex gap-2">
                <Input
                  id="x"
                  type="url"
                  placeholder="https://twitter.com/shophassane"
                  value={formData.x}
                  onChange={(e) =>
                    setFormData({ ...formData, x: e.target.value })
                  }
                />
                {formData.x && (
                  <Button type="button" variant="outline" size="icon" asChild>
                    <a
                      href={formData.x}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {/* TikTok */}
            <div className="space-y-2">
              <Label htmlFor="tiktok" className="flex items-center gap-2">
                <SiTiktok className="h-4 w-4" />
                TikTok
              </Label>
              <div className="flex gap-2">
                <Input
                  id="tiktok"
                  type="url"
                  placeholder="https://tiktok.com/@shophassane"
                  value={formData.tiktok}
                  onChange={(e) =>
                    setFormData({ ...formData, tiktok: e.target.value })
                  }
                />
                {formData.tiktok && (
                  <Button type="button" variant="outline" size="icon" asChild>
                    <a
                      href={formData.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {/* Contact Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Contact Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="support@shophassane.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={updateSocialLinks.isPending}>
                {updateSocialLinks.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>
            How your social media links will appear
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {formData.facebook && (
              <a
                href={formData.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <SiFacebook className="h-6 w-6" />
              </a>
            )}
            {formData.instagram && (
              <a
                href={formData.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <SiInstagram className="h-6 w-6" />
              </a>
            )}
            {formData.x && (
              <a
                href={formData.x}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <SiX className="h-6 w-6" />
              </a>
            )}
            {formData.tiktok && (
              <a
                href={formData.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <SiTiktok className="h-6 w-6" />
              </a>
            )}
          </div>
          {formData.email && (
            <p className="mt-4 text-sm text-muted-foreground">
              Contact:{" "}
              <a
                href={`mailto:${formData.email}`}
                className="text-primary hover:underline"
              >
                {formData.email}
              </a>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
