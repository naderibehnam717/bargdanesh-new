-- CreateTable
CREATE TABLE "Konkur" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "field" TEXT NOT NULL,
    "description" TEXT,
    "questionUrl" TEXT,
    "answerUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Konkur_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Konkur_slug_key" ON "Konkur"("slug");

-- CreateIndex
CREATE INDEX "Konkur_year_idx" ON "Konkur"("year");

-- CreateIndex
CREATE INDEX "Konkur_field_idx" ON "Konkur"("field");

-- CreateIndex
CREATE INDEX "Konkur_year_field_idx" ON "Konkur"("year", "field");
