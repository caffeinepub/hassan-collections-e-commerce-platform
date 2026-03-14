import { useNavigate } from "@tanstack/react-router";
import { Upload, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Skeleton } from "../components/ui/skeleton";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useRegisterUser,
  useSaveCallerUserProfile,
  useUpdateProfilePicture,
} from "../hooks/useQueries";

export default function AccountPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();
  const registerUser = useRegisterUser();
  const saveProfile = useSaveCallerUserProfile();
  const updatePicture = useUpdateProfilePicture();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showRegistration, setShowRegistration] = useState(false);
  const [uploadingPicture, setUploadingPicture] = useState(false);

  const isAuthenticated = !!identity;

  // Show registration modal when user is authenticated but has no profile
  const shouldShowRegistration =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (!isAuthenticated) {
    return (
      <div className="container py-12 text-center">
        <User className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
        <h1 className="mb-4 text-2xl font-bold">Login Required</h1>
        <p className="mb-6 text-muted-foreground">
          Please log in to view your account
        </p>
        <Button onClick={() => navigate({ to: "/" })}>Go to Home</Button>
      </div>
    );
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      // Simple hash (in production, use proper hashing)
      const passwordHash = btoa(password);
      await registerUser.mutateAsync({ name, email, passwordHash });
      toast.success("Account created successfully!");
      setShowRegistration(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;

    try {
      await saveProfile.mutateAsync({
        ...userProfile,
        name: name || userProfile.name,
        email: email || userProfile.email,
      });
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  const handleProfilePictureUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingPicture(true);
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(uint8Array);
      await updatePicture.mutateAsync(blob);
      toast.success("Profile picture updated!");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload picture");
    } finally {
      setUploadingPicture(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="container py-12">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="container py-12">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>My Account</CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent>
            {userProfile ? (
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {userProfile.profilePicture ? (
                      <img
                        src={userProfile.profilePicture.getDirectURL()}
                        alt="Profile"
                        className="h-20 w-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                        <User className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="picture" className="cursor-pointer">
                      <div className="flex items-center space-x-2 text-sm text-primary hover:underline">
                        <Upload className="h-4 w-4" />
                        <span>
                          {uploadingPicture ? "Uploading..." : "Upload Picture"}
                        </span>
                      </div>
                    </Label>
                    <Input
                      id="picture"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePictureUpload}
                      disabled={uploadingPicture}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    defaultValue={userProfile.name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={userProfile.email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Principal ID</Label>
                  <Input
                    value={userProfile.principal.toString()}
                    disabled
                    className="font-mono text-xs"
                  />
                </div>

                <Button type="submit" disabled={saveProfile.isPending}>
                  {saveProfile.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            ) : (
              <div className="text-center">
                <p className="text-muted-foreground">Loading profile...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Registration Modal */}
      <Dialog
        open={shouldShowRegistration || showRegistration}
        onOpenChange={setShowRegistration}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Your Account</DialogTitle>
            <DialogDescription>
              Welcome! Please complete your profile to continue.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reg-name">Name *</Label>
              <Input
                id="reg-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-email">Email *</Label>
              <Input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-password">Password *</Label>
              <Input
                id="reg-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a password"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={registerUser.isPending}
            >
              {registerUser.isPending
                ? "Creating Account..."
                : "Create Account"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
