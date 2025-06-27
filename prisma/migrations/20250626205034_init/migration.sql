-- CreateTable
CREATE TABLE "Entry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "image" TEXT,
    "startDate" DATETIME NOT NULL,
    "finishDate" DATETIME,
    "completed" BOOLEAN NOT NULL,
    "timeSpent" REAL NOT NULL,
    "type" TEXT NOT NULL,
    "ranking" TEXT NOT NULL
);
