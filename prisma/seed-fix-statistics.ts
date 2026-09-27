import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 شروع اصلاح دسته‌ی آمار و احتمال...\n");

  const existing = await prisma.category.findUnique({
    where: { slug: "statistics" },
  });

  if (existing) {
    await prisma.category.update({
      where: { slug: "statistics" },
      data: {
        title: "آمار و احتمال",
        icon: "📊",
        color: "blue",
        group: "university",
        description:
          "آمار و احتمال برای دانشجویان — کتاب‌ها و منابع دانشگاهی",
      },
    });
    console.log(`🔄 «آمار و احتمال» به گروه «دانشگاهی» منتقل شد`);
  } else {
    await prisma.category.create({
      data: {
        slug: "statistics",
        title: "آمار و احتمال",
        icon: "📊",
        color: "blue",
        group: "university",
        description:
          "آمار و احتمال برای دانشجویان — کتاب‌ها و منابع دانشگاهی",
        order: 10,
      },
    });
    console.log(`✅ «آمار و احتمال» اضافه شد`);
  }

  console.log("\n🎉 تمام!");
}

main()
  .catch((e) => {
    console.error("❌ خطا:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });