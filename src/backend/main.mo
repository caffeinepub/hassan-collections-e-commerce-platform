import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import Map "mo:core/Map";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Int "mo:core/Int";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();

  type UserProfile = {
    principal : Principal;
    name : Text;
    email : Text;
    passwordHash : Text;
    profilePicture : ?Storage.ExternalBlob;
    dateCreated : Nat;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let userFavorites = Map.empty<Principal, Set.Set<Text>>();

  type PasswordResetToken = {
    token : Text;
    userPrincipal : Principal;
    expiresAt : Nat;
    used : Bool;
  };

  let passwordResetTokens = Map.empty<Text, PasswordResetToken>();

  type ProductMetadata = {
    id : Text;
    name : Text;
    description : Text;
    category : Text;
    subcategory : Text;
    tags : [Text];
    sku : Text;
    pricePhpCents : Nat;
    stockQuantity : Nat;
    images : [Storage.ExternalBlob];
    availability : Nat;
  };

  let products = Map.empty<Text, ProductMetadata>();

  type AppearanceSettings = {
    homepageBackground : ?Storage.ExternalBlob;
    shopBackground : ?Storage.ExternalBlob;
    heroImage : ?Storage.ExternalBlob;
  };

  var appearanceSettings : AppearanceSettings = {
    homepageBackground = null;
    shopBackground = null;
    heroImage = null;
  };

  type ContactSubmission = {
    name : Text;
    email : Text;
    message : Text;
  };

  let contactSubmissions = List.empty<ContactSubmission>();
  let imageBlobs = Map.empty<Text, Storage.ExternalBlob>();
  var stripeConfig : ?Stripe.StripeConfiguration = null;
  let userCheckoutSessions = Map.empty<Principal, Set.Set<Text>>();

  type OrderStatus = {
    #pending;
    #shipped;
    #delivered;
    #returned;
  };

  type Order = {
    id : Text;
    userId : ?Principal;
    items : [{ productId : Text; quantity : Nat; pricePhpCents : Nat }];
    totalPhpCents : Nat;
    status : OrderStatus;
    createdAt : Nat;
    shippingAddress : Text;
    paymentMethod : Text;
    isGuestOrder : Bool;
    guestEmail : ?Text;
  };

  let orders = Map.empty<Text, Order>();
  let guestOrderSessions = Map.empty<Text, Text>();
  let validGuestSessions = Set.empty<Text>();
  var shouldInitializeAccessControl : Bool = true;

  public shared ({ caller }) func initializeAccessControl() : async () {
    if (not shouldInitializeAccessControl) {
      return;
    };

    shouldInitializeAccessControl := false;
    AccessControl.initialize(accessControlState, caller);
  };

  public shared ({ caller }) func resetAdminAccess() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can reset admin access");
    };
    shouldInitializeAccessControl := true;
  };

  public query func isAdminAssigned() : async Bool {
    not shouldInitializeAccessControl;
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func registerUser(name : Text, email : Text, passwordHash : Text) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous principals cannot register");
    };

    switch (userProfiles.get(caller)) {
      case (?_) {
        Runtime.trap("User already registered");
      };
      case (null) {
        let newUser : UserProfile = {
          principal = caller;
          name;
          email;
          passwordHash;
          profilePicture = null;
          dateCreated = Int.abs(Time.now());
        };
        userProfiles.add(caller, newUser);
      };
    };
  };

  public shared func createPasswordResetToken(email : Text, token : Text, expiresAt : Nat) : async () {
    var foundPrincipal : ?Principal = null;

    for ((principal, profile) in userProfiles.entries()) {
      if (profile.email == email) {
        foundPrincipal := ?principal;
      };
    };

    switch (foundPrincipal) {
      case (null) {
        ();
      };
      case (?userPrincipal) {
        let resetToken : PasswordResetToken = {
          token;
          userPrincipal;
          expiresAt;
          used = false;
        };
        passwordResetTokens.add(token, resetToken);
      };
    };
  };

  public shared func resetPasswordWithToken(token : Text, newPasswordHash : Text) : async () {
    switch (passwordResetTokens.get(token)) {
      case (null) {
        Runtime.trap("Invalid or expired reset token");
      };
      case (?resetToken) {
        if (resetToken.used) {
          Runtime.trap("Reset token has already been used");
        };

        let currentTime = Int.abs(Time.now());
        if (currentTime > resetToken.expiresAt) {
          Runtime.trap("Reset token has expired");
        };

        let updatedToken = { resetToken with used = true };
        passwordResetTokens.add(token, updatedToken);

        switch (userProfiles.get(resetToken.userPrincipal)) {
          case (null) {
            Runtime.trap("User not found");
          };
          case (?profile) {
            let updatedProfile = { profile with passwordHash = newPasswordHash };
            userProfiles.add(resetToken.userPrincipal, updatedProfile);
          };
        };
      };
    };
  };

  public shared ({ caller }) func updateProfilePicture(picture : Storage.ExternalBlob) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update profile pictures");
    };

    switch (userProfiles.get(caller)) {
      case (null) {
        Runtime.trap("User profile not found");
      };
      case (?profile) {
        let updatedProfile = { profile with profilePicture = ?picture };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func addFavorite(productId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add favorites");
    };

    let currentFavorites = switch (userFavorites.get(caller)) {
      case (null) { Set.empty<Text>() };
      case (?favorites) { favorites };
    };

    currentFavorites.add(productId);
    userFavorites.add(caller, currentFavorites);
  };

  public shared ({ caller }) func removeFavorite(productId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can remove favorites");
    };

    switch (userFavorites.get(caller)) {
      case (null) { () };
      case (?favorites) {
        favorites.remove(productId);
        userFavorites.add(caller, favorites);
      };
    };
  };

  public query ({ caller }) func getFavorites(user : Principal) : async [Text] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own favorites");
    };

    switch (userFavorites.get(user)) {
      case (null) { [] };
      case (?favorites) { favorites.toArray() };
    };
  };

  public query ({ caller }) func getCallerFavorites() : async [Text] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view favorites");
    };

    switch (userFavorites.get(caller)) {
      case (null) { [] };
      case (?favorites) { favorites.toArray() };
    };
  };

  public query ({ caller }) func isFavorite(productId : Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can check favorites");
    };

    switch (userFavorites.get(caller)) {
      case (null) { false };
      case (?favorites) { favorites.contains(productId) };
    };
  };

  public query func getProduct(productId : Text) : async ?ProductMetadata {
    products.get(productId);
  };

  public query func getAllProducts() : async [ProductMetadata] {
    products.values().toArray();
  };

  public query func getProductsByCategory(category : Text) : async [ProductMetadata] {
    let filtered = List.empty<ProductMetadata>();
    products.values().forEach(
      func(product) {
        if (product.category == category) {
          filtered.add(product);
        };
      }
    );
    filtered.toArray();
  };

  public query func getProductsBySubcategory(subcategory : Text) : async [ProductMetadata] {
    let filtered = List.empty<ProductMetadata>();
    products.values().forEach(
      func(product) {
        if (product.subcategory == subcategory) {
          filtered.add(product);
        };
      }
    );
    filtered.toArray();
  };

  public query func getFeaturedProducts(limit : Nat) : async [ProductMetadata] {
    let allProducts = products.values().toArray();
    let actualLimit = if (limit > allProducts.size()) {
      allProducts.size();
    } else {
      limit;
    };
    allProducts.sliceToArray(0, actualLimit);
  };

  public query func getAvailableProductsByCategory(category : Text) : async [ProductMetadata] {
    let filtered = List.empty<ProductMetadata>();
    products.values().forEach(
      func(product) {
        if (product.category == category and product.stockQuantity > 0) {
          filtered.add(product);
        };
      }
    );
    filtered.toArray();
  };

  public query func getProductImages(productId : Text) : async ?[Storage.ExternalBlob] {
    switch (products.get(productId)) {
      case (null) { null };
      case (?product) { ?product.images };
    };
  };

  public shared ({ caller }) func updateAppearanceSettings(settings : AppearanceSettings) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update appearance settings");
    };
    appearanceSettings := settings;
  };

  public query func getAppearanceSettings() : async AppearanceSettings {
    appearanceSettings;
  };

  let aboutPageContent = "HASSANé Collections is a premium fashion brand...";

  public query func getAboutPageContent() : async Text {
    aboutPageContent;
  };

  public shared func submitContactForm(submission : ContactSubmission) : async () {
    contactSubmissions.add(submission);
  };

  public query ({ caller }) func getContactSubmissions() : async [ContactSubmission] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view contact submissions");
    };
    contactSubmissions.toArray();
  };

  public shared ({ caller }) func uploadImage(id : Text, blob : Storage.ExternalBlob) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can upload images");
    };
    imageBlobs.add(id, blob);
  };

  public query func getImage(id : Text) : async ?Storage.ExternalBlob {
    imageBlobs.get(id);
  };

  public query ({ caller }) func getAllImages() : async [(Text, Storage.ExternalBlob)] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can list all images");
    };
    imageBlobs.toArray();
  };

  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can set Stripe configuration");
    };
    stripeConfig := ?config;
  };

  func getStripeConfig() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe is not configured") };
      case (?value) { value };
    };
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can check payment status");
    };

    switch (userCheckoutSessions.get(caller)) {
      case (null) {
        Runtime.trap("Unauthorized: Session does not belong to caller");
      };
      case (?sessions) {
        if (not sessions.contains(sessionId)) {
          Runtime.trap("Unauthorized: Session does not belong to caller");
        };
      };
    };

    await Stripe.getSessionStatus(getStripeConfig(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can create checkout sessions");
    };

    let sessionId = await Stripe.createCheckoutSession(getStripeConfig(), caller, items, successUrl, cancelUrl, transform);

    let currentSessions = switch (userCheckoutSessions.get(caller)) {
      case (null) { Set.empty<Text>() };
      case (?sessions) { sessions };
    };
    currentSessions.add(sessionId);
    userCheckoutSessions.add(caller, currentSessions);

    sessionId;
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func addProduct(product : ProductMetadata) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func updateProduct(product : ProductMetadata) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(productId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    products.remove(productId);
  };

  public shared ({ caller }) func bulkUpdateProducts(ids : [Text], price : ?Nat, stockQuantity : ?Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform bulk updates");
    };

    for (id in ids.values()) {
      switch (products.get(id)) {
        case (null) { () };
        case (?product) {
          let updatedProduct = {
            product with
            pricePhpCents = switch (price) {
              case (null) { product.pricePhpCents };
              case (?p) { p };
            };
            stockQuantity = switch (stockQuantity) {
              case (null) { product.stockQuantity };
              case (?q) { q };
            };
          };
          products.add(id, updatedProduct);
        };
      };
    };
  };

  public shared ({ caller }) func updateStock(productId : Text, quantity : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update stock");
    };

    switch (products.get(productId)) {
      case (null) {
        Runtime.trap("Product not found");
      };
      case (?product) {
        let updatedProduct = { product with stockQuantity = quantity };
        products.add(productId, updatedProduct);
      };
    };
  };

  public query ({ caller }) func getInventorySummary() : async [(Text, Nat)] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view inventory summary");
    };

    let summary = List.empty<(Text, Nat)>();
    products.entries().forEach(
      func(entry) {
        summary.add((entry.0, entry.1.stockQuantity));
      }
    );
    summary.toArray();
  };

  public query ({ caller }) func getLowStockAlerts(threshold : Nat) : async [(Text, Nat)] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view low stock alerts");
    };

    let lowStock = List.empty<(Text, Nat)>();
    products.entries().forEach(
      func(entry) {
        if (entry.1.stockQuantity <= threshold) {
          lowStock.add((entry.0, entry.1.stockQuantity));
        };
      }
    );
    lowStock.toArray();
  };

  public shared ({ caller }) func restockProduct(productId : Text, quantity : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can restock products");
    };

    switch (products.get(productId)) {
      case (null) {
        Runtime.trap("Product not found");
      };
      case (?product) {
        let updatedProduct = { product with stockQuantity = quantity };
        products.add(productId, updatedProduct);
      };
    };
  };

  // Start guestSessionCounter at 10000 to avoid conflicts with legacy values
  var guestSessionCounter : Nat = 10000;

  public shared func createGuestSession() : async Text {
    guestSessionCounter += 1;
    let sessionId = guestSessionCounter.toText();
    validGuestSessions.add(sessionId);
    sessionId;
  };

  func isValidGuestSession(sessionId : Text) : Bool {
    validGuestSessions.contains(sessionId);
  };

  public shared ({ caller }) func createOrder(order : Order) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can create orders");
    };

    switch (order.userId) {
      case (null) {
        Runtime.trap("User ID must be provided");
      };
      case (?userId) {
        if (userId != caller) {
          Runtime.trap("Unauthorized: Cannot create order for another user");
        };
      };
    };

    if (order.isGuestOrder) {
      Runtime.trap("Invalid: Authenticated users cannot create guest orders");
    };

    orders.add(order.id, order);
  };

  public shared func createGuestOrder(order : Order, guestSessionId : Text) : async () {
    if (not isValidGuestSession(guestSessionId)) {
      Runtime.trap("Unauthorized: Invalid guest session");
    };

    if (not order.isGuestOrder) {
      Runtime.trap("Invalid: Must be a guest order");
    };

    orders.add(order.id, order);
    guestOrderSessions.add(guestSessionId, order.id);
  };

  public query ({ caller }) func getOrder(orderId : Text) : async ?Order {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view orders");
    };

    switch (orders.get(orderId)) {
      case (null) { null };
      case (?order) {
        switch (order.userId) {
          case (null) {
            if (not AccessControl.isAdmin(accessControlState, caller)) {
              Runtime.trap("Unauthorized: Cannot view guest orders");
            };
            ?order;
          };
          case (?userId) {
            if (userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
              Runtime.trap("Unauthorized: Can only view your own orders");
            };
            ?order;
          };
        };
      };
    };
  };

  public query func getGuestOrder(orderId : Text, guestSessionId : Text) : async ?Order {
    if (not isValidGuestSession(guestSessionId)) {
      Runtime.trap("Unauthorized: Invalid guest session");
    };

    switch (guestOrderSessions.get(guestSessionId)) {
      case (null) { null };
      case (?sessionOrderId) {
        if (sessionOrderId != orderId) {
          Runtime.trap("Unauthorized: Order does not belong to this session");
        };
        orders.get(orderId);
      };
    };
  };

  public query ({ caller }) func getUserOrders() : async [Order] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view orders");
    };

    let userOrders = List.empty<Order>();
    orders.values().forEach(
      func(order) {
        switch (order.userId) {
          case (?userId) {
            if (userId == caller) {
              userOrders.add(order);
            };
          };
          case (null) {};
        };
      }
    );
    userOrders.toArray();
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  public query ({ caller }) func getOrdersByStatus(status : OrderStatus) : async [Order] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can filter orders by status");
    };

    let filtered = List.empty<Order>();
    orders.values().forEach(
      func(order) {
        if (order.status == status) {
          filtered.add(order);
        };
      }
    );
    filtered.toArray();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Text, status : OrderStatus) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    switch (orders.get(orderId)) {
      case (null) {
        Runtime.trap("Order not found");
      };
      case (?order) {
        let updatedOrder = { order with status = status };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public query ({ caller }) func getTotalSales() : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view sales analytics");
    };

    var total : Nat = 0;
    orders.values().forEach(
      func(order) {
        total += order.totalPhpCents;
      }
    );
    total;
  };

  public query ({ caller }) func getSalesByCategory() : async [(Text, Nat)] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view sales analytics");
    };

    let categoryMap = Map.empty<Text, Nat>();

    orders.values().forEach(
      func(order) {
        for (item in order.items.values()) {
          switch (products.get(item.productId)) {
            case (null) { () };
            case (?product) {
              let currentTotal = switch (categoryMap.get(product.category)) {
                case (null) { 0 };
                case (?total) { total };
              };
              categoryMap.add(product.category, currentTotal + (item.pricePhpCents * item.quantity));
            };
          };
        };
      }
    );

    categoryMap.toArray();
  };

  public query ({ caller }) func getTopSellingProducts(limit : Nat) : async [(Text, Nat)] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view sales analytics");
    };

    let productSales = Map.empty<Text, Nat>();

    orders.values().forEach(
      func(order) {
        for (item in order.items.values()) {
          let currentQuantity = switch (productSales.get(item.productId)) {
            case (null) { 0 };
            case (?qty) { qty };
          };
          productSales.add(item.productId, currentQuantity + item.quantity);
        };
      }
    );

    let salesArray = productSales.toArray();
    let actualLimit = if (limit > salesArray.size()) {
      salesArray.size();
    } else {
      limit;
    };
    salesArray.sliceToArray(0, actualLimit);
  };

  type SocialLinks = {
    facebook : Text;
    instagram : Text;
    x : Text;
    tiktok : Text;
    email : Text;
  };

  var socialLinks : SocialLinks = {
    facebook = "https://facebook.com/shophassaneofficial";
    instagram = "https://instagram.com/shophassaneofficial";
    x = "https://twitter.com/shophassane";
    tiktok = "https://tiktok.com/@shophassane";
    email = "support@shophassane.com";
  };

  public query func getSocialLinks() : async SocialLinks {
    socialLinks;
  };

  public shared ({ caller }) func updateSocialLinks(newLinks : SocialLinks) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update social links");
    };
    socialLinks := newLinks;
  };

  type GCashSettings = {
    merchantName : Text;
    accountNumber : Text;
    qrCodeImage : ?Storage.ExternalBlob;
  };

  var gCashSettings : GCashSettings = {
    merchantName = "";
    accountNumber = "";
    qrCodeImage = null;
  };

  public query func getGCashSettings() : async GCashSettings {
    gCashSettings;
  };

  public shared ({ caller }) func updateGCashSettings(settings : GCashSettings) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update GCash settings");
    };
    gCashSettings := settings;
  };
};

