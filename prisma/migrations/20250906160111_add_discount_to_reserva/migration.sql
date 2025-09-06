/*
  Warnings:

  - You are about to drop the column `discount` on the `reserva` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `reserva` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `reserva` DROP COLUMN `discount`,
    DROP COLUMN `price`;
