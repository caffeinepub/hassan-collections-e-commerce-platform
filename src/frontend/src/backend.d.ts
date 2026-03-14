import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ContactSubmission {
    name: string;
    email: string;
    message: string;
}
export interface ProductMetadata {
    id: string;
    sku: string;
    stockQuantity: bigint;
    subcategory: string;
    name: string;
    tags: Array<string>;
    description: string;
    availability: bigint;
    pricePhpCents: bigint;
    category: string;
    images: Array<ExternalBlob>;
}
export interface SocialLinks {
    x: string;
    tiktok: string;
    instagram: string;
    email: string;
    facebook: string;
}
export interface AppearanceSettings {
    heroImage?: ExternalBlob;
    shopBackground?: ExternalBlob;
    homepageBackground?: ExternalBlob;
}
export interface Order {
    id: string;
    isGuestOrder: boolean;
    status: OrderStatus;
    paymentMethod: string;
    userId?: Principal;
    createdAt: bigint;
    guestEmail?: string;
    shippingAddress: string;
    totalPhpCents: bigint;
    items: Array<{
        productId: string;
        pricePhpCents: bigint;
        quantity: bigint;
    }>;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface GCashSettings {
    merchantName: string;
    qrCodeImage?: ExternalBlob;
    accountNumber: string;
}
export interface UserProfile {
    principal: Principal;
    dateCreated: bigint;
    name: string;
    email: string;
    passwordHash: string;
    profilePicture?: ExternalBlob;
}
export enum OrderStatus {
    shipped = "shipped",
    pending = "pending",
    delivered = "delivered",
    returned = "returned"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addFavorite(productId: string): Promise<void>;
    addProduct(product: ProductMetadata): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bulkUpdateProducts(ids: Array<string>, price: bigint | null, stockQuantity: bigint | null): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createGuestOrder(order: Order, guestSessionId: string): Promise<void>;
    createGuestSession(): Promise<string>;
    createOrder(order: Order): Promise<void>;
    createPasswordResetToken(email: string, token: string, expiresAt: bigint): Promise<void>;
    deleteProduct(productId: string): Promise<void>;
    getAboutPageContent(): Promise<string>;
    getAllImages(): Promise<Array<[string, ExternalBlob]>>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<ProductMetadata>>;
    getAppearanceSettings(): Promise<AppearanceSettings>;
    getAvailableProductsByCategory(category: string): Promise<Array<ProductMetadata>>;
    getCallerFavorites(): Promise<Array<string>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactSubmissions(): Promise<Array<ContactSubmission>>;
    getFavorites(user: Principal): Promise<Array<string>>;
    getFeaturedProducts(limit: bigint): Promise<Array<ProductMetadata>>;
    getGCashSettings(): Promise<GCashSettings>;
    getGuestOrder(orderId: string, guestSessionId: string): Promise<Order | null>;
    getImage(id: string): Promise<ExternalBlob | null>;
    getInventorySummary(): Promise<Array<[string, bigint]>>;
    getLowStockAlerts(threshold: bigint): Promise<Array<[string, bigint]>>;
    getOrder(orderId: string): Promise<Order | null>;
    getOrdersByStatus(status: OrderStatus): Promise<Array<Order>>;
    getProduct(productId: string): Promise<ProductMetadata | null>;
    getProductImages(productId: string): Promise<Array<ExternalBlob> | null>;
    getProductsByCategory(category: string): Promise<Array<ProductMetadata>>;
    getProductsBySubcategory(subcategory: string): Promise<Array<ProductMetadata>>;
    getSalesByCategory(): Promise<Array<[string, bigint]>>;
    getSocialLinks(): Promise<SocialLinks>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getTopSellingProducts(limit: bigint): Promise<Array<[string, bigint]>>;
    getTotalSales(): Promise<bigint>;
    getUserOrders(): Promise<Array<Order>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeAccessControl(): Promise<void>;
    isAdminAssigned(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    isFavorite(productId: string): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    registerUser(name: string, email: string, passwordHash: string): Promise<void>;
    removeFavorite(productId: string): Promise<void>;
    resetAdminAccess(): Promise<void>;
    resetPasswordWithToken(token: string, newPasswordHash: string): Promise<void>;
    restockProduct(productId: string, quantity: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    submitContactForm(submission: ContactSubmission): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateAppearanceSettings(settings: AppearanceSettings): Promise<void>;
    updateGCashSettings(settings: GCashSettings): Promise<void>;
    updateOrderStatus(orderId: string, status: OrderStatus): Promise<void>;
    updateProduct(product: ProductMetadata): Promise<void>;
    updateProfilePicture(picture: ExternalBlob): Promise<void>;
    updateSocialLinks(newLinks: SocialLinks): Promise<void>;
    updateStock(productId: string, quantity: bigint): Promise<void>;
    uploadImage(id: string, blob: ExternalBlob): Promise<void>;
}
