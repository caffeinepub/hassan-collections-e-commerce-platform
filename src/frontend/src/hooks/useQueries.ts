import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AppearanceSettings,
  ContactSubmission,
  GCashSettings,
  Order,
  OrderStatus,
  ProductMetadata,
  ShoppingItem,
  SocialLinks,
  StripeConfiguration,
  UserProfile,
} from "../backend";
import type { ExternalBlob } from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

// Products
export function useGetAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<ProductMetadata[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProduct(productId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<ProductMetadata | null>({
    queryKey: ["product", productId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProduct(productId);
    },
    enabled: !!actor && !isFetching && !!productId,
  });
}

export function useGetFeaturedProducts(limit: number) {
  const { actor, isFetching } = useActor();

  return useQuery<ProductMetadata[]>({
    queryKey: ["featuredProducts", limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeaturedProducts(BigInt(limit));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: ProductMetadata) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["inventorySummary"] });
      queryClient.invalidateQueries({ queryKey: ["lowStockAlerts"] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: ProductMetadata) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["inventorySummary"] });
      queryClient.invalidateQueries({ queryKey: ["lowStockAlerts"] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteProduct(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["inventorySummary"] });
      queryClient.invalidateQueries({ queryKey: ["lowStockAlerts"] });
    },
  });
}

export function useBulkUpdateProducts() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ids,
      price,
      stockQuantity,
    }: {
      ids: string[];
      price: bigint | null;
      stockQuantity: bigint | null;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.bulkUpdateProducts(ids, price, stockQuantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["inventorySummary"] });
      queryClient.invalidateQueries({ queryKey: ["lowStockAlerts"] });
    },
  });
}

// Inventory Management
export function useGetInventorySummary() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, bigint]>>({
    queryKey: ["inventorySummary"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getInventorySummary();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetLowStockAlerts(threshold: number) {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, bigint]>>({
    queryKey: ["lowStockAlerts", threshold],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLowStockAlerts(BigInt(threshold));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRestockProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: { productId: string; quantity: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.restockProduct(productId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["inventorySummary"] });
      queryClient.invalidateQueries({ queryKey: ["lowStockAlerts"] });
    },
  });
}

export function useUpdateStock() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: { productId: string; quantity: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateStock(productId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["inventorySummary"] });
      queryClient.invalidateQueries({ queryKey: ["lowStockAlerts"] });
    },
  });
}

// Media Management
export function useGetAllImages() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, ExternalBlob]>>({
    queryKey: ["images"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllImages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUploadImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, blob }: { id: string; blob: ExternalBlob }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.uploadImage(id, blob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
    },
  });
}

// Orders
export function useGetAllOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetUserOrders() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Order[]>({
    queryKey: ["userOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserOrders();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (order: Order) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createOrder(order);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });
    },
  });
}

export function useCreateGuestOrder() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      order,
      guestSessionId,
    }: { order: Order; guestSessionId: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createGuestOrder(order, guestSessionId);
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: { orderId: string; status: OrderStatus }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });
    },
  });
}

// Sales Analytics
export function useGetTotalSales() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ["totalSales"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getTotalSales();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSalesByCategory() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, bigint]>>({
    queryKey: ["salesByCategory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSalesByCategory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTopSellingProducts(limit: number) {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, bigint]>>({
    queryKey: ["topSellingProducts", limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTopSellingProducts(BigInt(limit));
    },
    enabled: !!actor && !isFetching,
  });
}

// Contact
export function useSubmitContactForm() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (submission: ContactSubmission) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitContactForm(submission);
    },
  });
}

// Admin
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ["isAdmin", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && !!identity,
    staleTime: 0,
  });
}

export function useIsAdminAssigned() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ["isAdminAssigned"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isAdminAssigned();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
  });
}

export function useResetAdminAccess() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.resetAdminAccess();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isAdminAssigned"] });
      queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
    },
  });
}

export function useInitializeAccessControl() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.initializeAccessControl();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isAdminAssigned"] });
      queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
    },
  });
}

// Appearance Settings
export function useGetAppearanceSettings() {
  const { actor, isFetching } = useActor();

  return useQuery<AppearanceSettings>({
    queryKey: ["appearanceSettings"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getAppearanceSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateAppearanceSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: AppearanceSettings) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateAppearanceSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appearanceSettings"] });
    },
  });
}

// User Profile
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useRegisterUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      email,
      passwordHash,
    }: { name: string; email: string; passwordHash: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.registerUser(name, email, passwordHash);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function useUpdateProfilePicture() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (picture: ExternalBlob) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateProfilePicture(picture);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// Password Reset
export function useCreatePasswordResetToken() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      email,
      token,
      expiresAt,
    }: { email: string; token: string; expiresAt: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createPasswordResetToken(email, token, expiresAt);
    },
  });
}

export function useResetPasswordWithToken() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      token,
      newPasswordHash,
    }: { token: string; newPasswordHash: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.resetPasswordWithToken(token, newPasswordHash);
    },
  });
}

// Favorites
export function useGetCallerFavorites() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<string[]>({
    queryKey: ["favorites"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCallerFavorites();
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

export function useAddFavorite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addFavorite(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

export function useRemoveFavorite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.removeFavorite(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

export function useIsFavorite(productId: string) {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ["isFavorite", productId],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isFavorite(productId);
    },
    enabled: !!actor && !actorFetching && !!identity && !!productId,
  });
}

// Social Media Links
export function useGetSocialLinks() {
  const { actor, isFetching } = useActor();

  return useQuery<SocialLinks>({
    queryKey: ["socialLinks"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getSocialLinks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateSocialLinks() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (links: SocialLinks) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateSocialLinks(links);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socialLinks"] });
    },
  });
}

// GCash Settings - Public access for checkout
export function useGetGCashSettings() {
  const { actor, isFetching } = useActor();

  return useQuery<GCashSettings>({
    queryKey: ["gCashSettings"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getGCashSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateGCashSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: GCashSettings) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateGCashSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gCashSettings"] });
    },
  });
}

// Stripe Payment
export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ["isStripeConfigured"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateCheckoutSession() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      items,
      successUrl,
      cancelUrl,
    }: { items: ShoppingItem[]; successUrl: string; cancelUrl: string }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.createCheckoutSession(
        items,
        successUrl,
        cancelUrl,
      );
      return JSON.parse(result);
    },
  });
}
