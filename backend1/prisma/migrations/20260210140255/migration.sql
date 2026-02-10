/*
  Warnings:

  - You are about to drop the column `caption` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Photo` table. All the data in the column will be lost.
  - Added the required column `imageUrl` to the `Photo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "caption",
DROP COLUMN "url",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "uploadedBy" DROP NOT NULL;
