/*
  Warnings:

  - Added the required column `updatedAt` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "ReviewImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reviewId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ReviewImage_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "dateOfBirth" DATETIME,
    "profilePhoto" TEXT,
    "socialLinks" TEXT,
    "preferredLanguage" TEXT NOT NULL DEFAULT 'en',
    "newsletterSubscribed" BOOLEAN NOT NULL DEFAULT false,
    "verificationStatus" TEXT NOT NULL DEFAULT 'unverified',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DiscountCode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "maxUses" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "minOrderAmount" REAL NOT NULL DEFAULT 0,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DiscountUsage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "discountId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "usedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DiscountUsage_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "DiscountCode" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DiscountUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "reservedCount" INTEGER NOT NULL DEFAULT 0,
    "lowStockThreshold" INTEGER NOT NULL DEFAULT 10,
    "warehouseLocation" TEXT,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Inventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InventoryLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "inventoryId" TEXT NOT NULL,
    "changeType" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reason" TEXT,
    "orderId" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InventoryLog_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmailTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "htmlContent" TEXT NOT NULL,
    "variables" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EmailLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recipientId" TEXT NOT NULL,
    "templateName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'sent',
    "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "failureReason" TEXT,
    "orderId" TEXT
);

-- CreateTable
CREATE TABLE "PageView" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "pagePath" TEXT NOT NULL,
    "referrer" TEXT,
    "sessionId" TEXT NOT NULL,
    "viewedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ProductView" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "productId" TEXT NOT NULL,
    "viewDuration" INTEGER,
    "source" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Conversion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "source" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventType" TEXT NOT NULL,
    "userId" TEXT,
    "productId" TEXT,
    "metadata" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AdminSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "updatedBy" TEXT,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "_CategoryToDiscountCode" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CategoryToDiscountCode_A_fkey" FOREIGN KEY ("A") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CategoryToDiscountCode_B_fkey" FOREIGN KEY ("B") REFERENCES "DiscountCode" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_DiscountCodeToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_DiscountCodeToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "DiscountCode" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_DiscountCodeToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Category" ("createdAt", "description", "icon", "id", "name", "slug") SELECT "createdAt", "description", "icon", "id", "name", "slug" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
CREATE INDEX "Category_slug_idx" ON "Category"("slug");
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "totalAmount" REAL NOT NULL,
    "subtotal" REAL NOT NULL,
    "tax" REAL NOT NULL,
    "discountAmount" REAL NOT NULL DEFAULT 0,
    "discountCodeId" TEXT,
    "shippingAddress" TEXT NOT NULL,
    "shippingCity" TEXT NOT NULL,
    "shippingState" TEXT NOT NULL,
    "shippingZip" TEXT NOT NULL,
    "shippingCountry" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "paymentIntentId" TEXT,
    "paymentStatus" TEXT NOT NULL DEFAULT 'unpaid',
    "paymentMethod" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_discountCodeId_fkey" FOREIGN KEY ("discountCodeId") REFERENCES "DiscountCode" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("createdAt", "discountAmount", "id", "paymentIntentId", "paymentMethod", "paymentStatus", "shippingAddress", "shippingCity", "shippingCountry", "shippingState", "shippingZip", "status", "subtotal", "tax", "totalAmount", "updatedAt", "userId") SELECT "createdAt", "discountAmount", "id", "paymentIntentId", "paymentMethod", "paymentStatus", "shippingAddress", "shippingCity", "shippingCountry", "shippingState", "shippingZip", "status", "subtotal", "tax", "totalAmount", "updatedAt", "userId" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE INDEX "Order_userId_idx" ON "Order"("userId");
CREATE INDEX "Order_paymentIntentId_idx" ON "Order"("paymentIntentId");
CREATE INDEX "Order_discountCodeId_idx" ON "Order"("discountCodeId");
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "longDescription" TEXT,
    "price" REAL NOT NULL,
    "discountPrice" REAL,
    "categoryId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "rating" REAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "visibility" TEXT NOT NULL DEFAULT 'public',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "fileUrl" TEXT,
    "fileName" TEXT,
    "fileSize" INTEGER,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Product_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("authorId", "categoryId", "createdAt", "description", "discountPrice", "downloads", "fileName", "fileSize", "fileUrl", "id", "longDescription", "metaDescription", "metaKeywords", "metaTitle", "price", "rating", "slug", "status", "title", "updatedAt") SELECT "authorId", "categoryId", "createdAt", "description", "discountPrice", "downloads", "fileName", "fileSize", "fileUrl", "id", "longDescription", "metaDescription", "metaKeywords", "metaTitle", "price", "rating", "slug", "status", "title", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
CREATE INDEX "Product_slug_idx" ON "Product"("slug");
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");
CREATE INDEX "Product_authorId_idx" ON "Product"("authorId");
CREATE TABLE "new_Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rating" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "helpfulCount" INTEGER NOT NULL DEFAULT 0,
    "reportCount" INTEGER NOT NULL DEFAULT 0,
    "verifiedPurchase" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Review" ("content", "createdAt", "id", "productId", "rating", "title", "updatedAt", "userId") SELECT "content", "createdAt", "id", "productId", "rating", "title", "updatedAt", "userId" FROM "Review";
DROP TABLE "Review";
ALTER TABLE "new_Review" RENAME TO "Review";
CREATE INDEX "Review_productId_idx" ON "Review"("productId");
CREATE INDEX "Review_userId_idx" ON "Review"("userId");
CREATE INDEX "Review_status_idx" ON "Review"("status");
CREATE UNIQUE INDEX "Review_productId_userId_key" ON "Review"("productId", "userId");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "image" TEXT,
    "bio" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "suspended" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("bio", "createdAt", "email", "id", "image", "name", "password", "role", "updatedAt") SELECT "bio", "createdAt", "email", "id", "image", "name", "password", "role", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_email_idx" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "ReviewImage_reviewId_idx" ON "ReviewImage"("reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE INDEX "UserProfile_userId_idx" ON "UserProfile"("userId");

-- CreateIndex
CREATE INDEX "Address_userId_idx" ON "Address"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscountCode_code_key" ON "DiscountCode"("code");

-- CreateIndex
CREATE INDEX "DiscountCode_code_idx" ON "DiscountCode"("code");

-- CreateIndex
CREATE INDEX "DiscountCode_expiresAt_idx" ON "DiscountCode"("expiresAt");

-- CreateIndex
CREATE INDEX "DiscountUsage_discountId_idx" ON "DiscountUsage"("discountId");

-- CreateIndex
CREATE INDEX "DiscountUsage_userId_idx" ON "DiscountUsage"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_productId_key" ON "Inventory"("productId");

-- CreateIndex
CREATE INDEX "Inventory_productId_idx" ON "Inventory"("productId");

-- CreateIndex
CREATE INDEX "InventoryLog_inventoryId_idx" ON "InventoryLog"("inventoryId");

-- CreateIndex
CREATE INDEX "InventoryLog_orderId_idx" ON "InventoryLog"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "EmailTemplate_name_key" ON "EmailTemplate"("name");

-- CreateIndex
CREATE INDEX "EmailLog_recipientId_idx" ON "EmailLog"("recipientId");

-- CreateIndex
CREATE INDEX "EmailLog_orderId_idx" ON "EmailLog"("orderId");

-- CreateIndex
CREATE INDEX "EmailLog_status_idx" ON "EmailLog"("status");

-- CreateIndex
CREATE INDEX "PageView_userId_idx" ON "PageView"("userId");

-- CreateIndex
CREATE INDEX "PageView_sessionId_idx" ON "PageView"("sessionId");

-- CreateIndex
CREATE INDEX "PageView_viewedAt_idx" ON "PageView"("viewedAt");

-- CreateIndex
CREATE INDEX "ProductView_productId_idx" ON "ProductView"("productId");

-- CreateIndex
CREATE INDEX "ProductView_userId_idx" ON "ProductView"("userId");

-- CreateIndex
CREATE INDEX "ProductView_timestamp_idx" ON "ProductView"("timestamp");

-- CreateIndex
CREATE INDEX "Conversion_userId_idx" ON "Conversion"("userId");

-- CreateIndex
CREATE INDEX "Conversion_orderId_idx" ON "Conversion"("orderId");

-- CreateIndex
CREATE INDEX "Conversion_timestamp_idx" ON "Conversion"("timestamp");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_eventType_idx" ON "AnalyticsEvent"("eventType");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_userId_idx" ON "AnalyticsEvent"("userId");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_productId_idx" ON "AnalyticsEvent"("productId");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_timestamp_idx" ON "AnalyticsEvent"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "AdminSetting_key_key" ON "AdminSetting"("key");

-- CreateIndex
CREATE INDEX "AdminSetting_key_idx" ON "AdminSetting"("key");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToDiscountCode_AB_unique" ON "_CategoryToDiscountCode"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToDiscountCode_B_index" ON "_CategoryToDiscountCode"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DiscountCodeToProduct_AB_unique" ON "_DiscountCodeToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_DiscountCodeToProduct_B_index" ON "_DiscountCodeToProduct"("B");
