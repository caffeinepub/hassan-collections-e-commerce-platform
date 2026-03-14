import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  KeyRound,
  LogIn,
  Shield,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreatePasswordResetToken,
  useRegisterUser,
  useResetPasswordWithToken,
} from "../hooks/useQueries";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginStatus, identity } = useInternetIdentity();
  const registerUser = useRegisterUser();
  const createResetToken = useCreatePasswordResetToken();
  const resetPassword = useResetPasswordWithToken();

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const [resetEmail, setResetEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [generatedToken, setGeneratedToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [resetPasswordErrors, setResetPasswordErrors] = useState<string[]>([]);
  const [resetStep, setResetStep] = useState<"email" | "token">("email");

  const isAuthenticated = !!identity;

  if (isAuthenticated) {
    navigate({ to: "/account" });
    return null;
  }

  const validatePasswords = (
    password: string,
    confirmPassword: string,
    setErrors: (errors: string[]) => void,
  ) => {
    const errors: string[] = [];

    if (password.length > 0 && password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    if (password.length > 0 && !/[A-Z]/.test(password)) {
      errors.push("Must contain at least one uppercase letter");
    }

    if (password.length > 0 && !/[a-z]/.test(password)) {
      errors.push("Must contain at least one lowercase letter");
    }

    if (password.length > 0 && !/[0-9]/.test(password)) {
      errors.push("Must contain at least one number");
    }

    if (confirmPassword.length > 0 && password !== confirmPassword) {
      errors.push("Passwords do not match");
    }

    setErrors(errors);
    return errors.length === 0;
  };

  const handleInternetIdentityLogin = async () => {
    try {
      await login();
      toast.success("Logged in successfully!");
      navigate({ to: "/account" });
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.message === "User is already authenticated") {
        toast.error("Already authenticated. Please refresh the page.");
      } else {
        toast.error(error.message || "Failed to log in");
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !regName ||
      !regEmail ||
      !regPhone ||
      !regPassword ||
      !regConfirmPassword
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (regPhone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    if (
      !validatePasswords(regPassword, regConfirmPassword, setPasswordErrors)
    ) {
      toast.error("Please fix password errors before continuing");
      return;
    }

    try {
      await login();

      const passwordHash = btoa(regPassword);
      await registerUser.mutateAsync({
        name: regName,
        email: regEmail,
        passwordHash,
      });

      toast.success(
        "Account created successfully! Welcome to HASSANé Collections.",
      );
      navigate({ to: "/account" });
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resetEmail) {
      toast.error("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const token =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      const expiresAt = BigInt(Date.now() + 3600000);

      await createResetToken.mutateAsync({
        email: resetEmail,
        token,
        expiresAt,
      });

      setGeneratedToken(token);
      setResetToken(token);
      setResetStep("token");
      toast.success("Password reset token generated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate reset token");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resetToken || !newPassword || !confirmNewPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (
      !validatePasswords(
        newPassword,
        confirmNewPassword,
        setResetPasswordErrors,
      )
    ) {
      toast.error("Please fix password errors before continuing");
      return;
    }

    try {
      const newPasswordHash = btoa(newPassword);
      await resetPassword.mutateAsync({ token: resetToken, newPasswordHash });

      toast.success(
        "Password reset successfully! You can now log in with your new password.",
      );
      setResetStep("email");
      setResetEmail("");
      setResetToken("");
      setGeneratedToken("");
      setNewPassword("");
      setConfirmNewPassword("");
      setResetPasswordErrors([]);
    } catch (error: any) {
      toast.error(
        error.message ||
          "Failed to reset password. Token may be invalid or expired.",
      );
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Token copied to clipboard!");
  };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <img
            src="/assets/generated/hassane-logo-transparent.dim_200x200.png"
            alt="HASSANé Collections"
            className="h-20 w-20 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold">Welcome to HASSANé Collections</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to your account or create a new one
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
            <TabsTrigger value="reset">Reset</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  Sign In
                </CardTitle>
                <CardDescription>
                  Secure authentication with Internet Identity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                  <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <AlertDescription className="text-blue-900 dark:text-blue-100">
                    <strong>Secure & Private:</strong> Internet Identity
                    provides passwordless authentication using your device's
                    biometrics or security key. No Google or Apple account
                    required.
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={handleInternetIdentityLogin}
                  disabled={loginStatus === "logging-in"}
                  className="w-full"
                  size="lg"
                >
                  {loginStatus === "logging-in"
                    ? "Connecting..."
                    : "Sign in with Internet Identity"}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      const tabsList =
                        document.querySelector('[role="tablist"]');
                      const registerTab = tabsList?.querySelector(
                        '[value="register"]',
                      ) as HTMLElement;
                      registerTab?.click();
                    }}
                    className="text-primary hover:underline font-medium"
                  >
                    Create one now
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Create New Account
                </CardTitle>
                <CardDescription>
                  Register with any email or phone number
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-name">Full Name *</Label>
                    <Input
                      id="reg-name"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Juan Dela Cruz"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email Address *</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="juan@example.com"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Use any email address - no restrictions
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-phone">Phone Number *</Label>
                    <Input
                      id="reg-phone"
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+63 912 345 6789"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Any valid phone number accepted
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password *</Label>
                    <Input
                      id="reg-password"
                      type="password"
                      value={regPassword}
                      onChange={(e) => {
                        setRegPassword(e.target.value);
                        validatePasswords(
                          e.target.value,
                          regConfirmPassword,
                          setPasswordErrors,
                        );
                      }}
                      placeholder="Create a secure password"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-confirm-password">
                      Confirm Password *
                    </Label>
                    <Input
                      id="reg-confirm-password"
                      type="password"
                      value={regConfirmPassword}
                      onChange={(e) => {
                        setRegConfirmPassword(e.target.value);
                        validatePasswords(
                          regPassword,
                          e.target.value,
                          setPasswordErrors,
                        );
                      }}
                      placeholder="Re-enter your password"
                      required
                    />
                  </div>

                  {passwordErrors.length > 0 && (
                    <Alert className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
                      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      <AlertDescription>
                        <ul className="text-xs text-red-800 dark:text-red-200 space-y-1 mt-1">
                          {passwordErrors.map((error) => (
                            <li key={error}>• {error}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  {passwordErrors.length === 0 &&
                    regPassword.length > 0 &&
                    regConfirmPassword.length > 0 && (
                      <Alert className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <AlertDescription className="text-green-800 dark:text-green-200">
                          Password meets all requirements
                        </AlertDescription>
                      </Alert>
                    )}

                  <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                    <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <AlertDescription className="text-xs text-blue-900 dark:text-blue-100">
                      You'll be authenticated with Internet Identity for secure
                      access. No third-party accounts required.
                    </AlertDescription>
                  </Alert>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      registerUser.isPending ||
                      loginStatus === "logging-in" ||
                      passwordErrors.length > 0
                    }
                  >
                    {registerUser.isPending || loginStatus === "logging-in"
                      ? "Creating Account..."
                      : "Create Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reset">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="h-5 w-5" />
                  Reset Password
                </CardTitle>
                <CardDescription>
                  {resetStep === "email"
                    ? "Enter your email to receive a reset token"
                    : "Enter the reset token and your new password"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {resetStep === "email" ? (
                  <form onSubmit={handleRequestReset} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">Email Address *</Label>
                      <Input
                        id="reset-email"
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>

                    <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                      <AlertDescription className="text-xs text-blue-900 dark:text-blue-100">
                        A password reset token will be generated and displayed.
                        Save it to reset your password. The token expires in 1
                        hour.
                      </AlertDescription>
                    </Alert>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={createResetToken.isPending}
                    >
                      {createResetToken.isPending
                        ? "Generating Token..."
                        : "Generate Reset Token"}
                    </Button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setResetStep("token")}
                        className="text-sm text-primary hover:underline"
                      >
                        Already have a token?
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    {generatedToken && (
                      <Alert className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <AlertDescription>
                          <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">
                            Your Reset Token:
                          </p>
                          <div className="flex items-center gap-2 bg-white dark:bg-gray-900 p-2 rounded border border-green-300 dark:border-green-700">
                            <code className="text-xs flex-1 break-all text-green-800 dark:text-green-200">
                              {generatedToken}
                            </code>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(generatedToken)}
                              className="shrink-0"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-green-700 dark:text-green-300 mt-2">
                            Save this token securely. It expires in 1 hour.
                          </p>
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="reset-token">Reset Token *</Label>
                      <Input
                        id="reset-token"
                        value={resetToken}
                        onChange={(e) => setResetToken(e.target.value)}
                        placeholder="Enter your reset token"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password *</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          validatePasswords(
                            e.target.value,
                            confirmNewPassword,
                            setResetPasswordErrors,
                          );
                        }}
                        placeholder="Create a secure password"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-new-password">
                        Confirm New Password *
                      </Label>
                      <Input
                        id="confirm-new-password"
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => {
                          setConfirmNewPassword(e.target.value);
                          validatePasswords(
                            newPassword,
                            e.target.value,
                            setResetPasswordErrors,
                          );
                        }}
                        placeholder="Re-enter your new password"
                        required
                      />
                    </div>

                    {resetPasswordErrors.length > 0 && (
                      <Alert className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
                        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        <AlertDescription>
                          <ul className="text-xs text-red-800 dark:text-red-200 space-y-1 mt-1">
                            {resetPasswordErrors.map((error) => (
                              <li key={error}>• {error}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}

                    {resetPasswordErrors.length === 0 &&
                      newPassword.length > 0 &&
                      confirmNewPassword.length > 0 && (
                        <Alert className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                          <AlertDescription className="text-green-800 dark:text-green-200">
                            Password meets all requirements
                          </AlertDescription>
                        </Alert>
                      )}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={
                        resetPassword.isPending ||
                        resetPasswordErrors.length > 0
                      }
                    >
                      {resetPassword.isPending
                        ? "Resetting Password..."
                        : "Reset Password"}
                    </Button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setResetStep("email");
                          setResetToken("");
                          setGeneratedToken("");
                          setNewPassword("");
                          setConfirmNewPassword("");
                          setResetPasswordErrors([]);
                        }}
                        className="text-sm text-primary hover:underline"
                      >
                        Back to email entry
                      </button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            Need help?{" "}
            <button
              type="button"
              onClick={() => navigate({ to: "/contact" })}
              className="text-primary hover:underline"
            >
              Contact Support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
