-- CreateEnum
CREATE TYPE "CredentialDeviceType" AS ENUM ('singleDevice', 'multiDevice');

-- CreateEnum
CREATE TYPE "AuthenticatorTransportFuture" AS ENUM ('ble', 'cable', 'hybrid', 'internal', 'nfc', 'smartcard', 'usb');

-- CreateTable
CREATE TABLE "passkeys" (
    "id" TEXT NOT NULL,
    "publicKey" BYTEA NOT NULL,
    "userId" TEXT NOT NULL,
    "webauthnUserID" TEXT NOT NULL,
    "counter" BIGINT NOT NULL,
    "deviceType" "CredentialDeviceType" NOT NULL,
    "backedUp" BOOLEAN NOT NULL DEFAULT false,
    "transports" "AuthenticatorTransportFuture"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "passkeys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "passkeys_userId_key" ON "passkeys"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "passkeys_webauthnUserID_key" ON "passkeys"("webauthnUserID");

-- CreateIndex
CREATE INDEX "passkeys_webauthnUserID_idx" ON "passkeys"("webauthnUserID");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "passkeys" ADD CONSTRAINT "passkeys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
