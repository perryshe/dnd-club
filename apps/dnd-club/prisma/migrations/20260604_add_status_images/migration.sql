-- CreateTable
CREATE TABLE "status_images" (
    "id" TEXT NOT NULL,
    "status_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "status_images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "status_images" ADD CONSTRAINT "status_images_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "statuses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
