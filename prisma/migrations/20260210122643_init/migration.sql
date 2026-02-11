-- CreateEnum
CREATE TYPE "MedicationSchedules" AS ENUM ('II', 'III', 'IV', 'V');

-- CreateEnum
CREATE TYPE "MedicationUnits" AS ENUM ('mg', 'ml', 'mcg');

-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('NURSE', 'WITNESS', 'ADMIN');

-- CreateEnum
CREATE TYPE "TransactionTypes" AS ENUM ('CHECKOUT', 'RETURN', 'WASTE');

-- CreateEnum
CREATE TYPE "EntityTypes" AS ENUM ('Medication', 'Transaction', 'User');

-- CreateTable
CREATE TABLE "Medication" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "schedule" "MedicationSchedules" NOT NULL,
    "unit" "MedicationUnits" NOT NULL,
    "currentStockQuantity" INTEGER NOT NULL,

    CONSTRAINT "Medication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRoles" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "medicationId" INTEGER NOT NULL,
    "nurseId" INTEGER NOT NULL,
    "witnessId" INTEGER NOT NULL,
    "type" "TransactionTypes" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "notes" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" "EntityTypes" NOT NULL,
    "entityId" INTEGER NOT NULL,
    "performedBy" INTEGER NOT NULL,
    "details" JSONB NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Medication_name_key" ON "Medication"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_nurseId_witnessId_key" ON "Transaction"("nurseId", "witnessId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "Medication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_nurseId_fkey" FOREIGN KEY ("nurseId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_witnessId_fkey" FOREIGN KEY ("witnessId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_performedBy_fkey" FOREIGN KEY ("performedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
