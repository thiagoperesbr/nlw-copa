/*
  Warnings:

  - You are about to drop the `GameResult` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "GameResult_gameId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GameResult";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "firstTeamCountryCode" TEXT NOT NULL,
    "secondTeamCountryCode" TEXT NOT NULL,
    "resultFirstTeamPoints" INTEGER NOT NULL DEFAULT -1,
    "resultSecondTeamPoints" INTEGER NOT NULL DEFAULT -1
);
INSERT INTO "new_Game" ("date", "firstTeamCountryCode", "id", "secondTeamCountryCode") SELECT "date", "firstTeamCountryCode", "id", "secondTeamCountryCode" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
