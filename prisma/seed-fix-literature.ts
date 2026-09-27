import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 شروع اصلاح دسته‌ی ادبیات...\n");

  // ─── ۱. ادبیات (دانشگاهی) ───
  const existingUni = await prisma.category.findUnique({
    where: { slug: "literature" },
  });

  if (existingUni) {
    await prisma.category.update({
      where: { slug: "literature" },
      data: {
        title: "ادبیات",
        icon: "📖",
        color: "purple",
        group: "university",
        description:
          "ادبیات برای دانشجویان — کتاب‌ها و منابع ادبی دانشگاهی",
      },
    });
    console.log(`🔄 «ادبیات (دانشگاهی)» آپدیت شد`);
  } else {
    await prisma.category.create({
      data: {
        slug: "literature",
        title: "ادبیات",
        icon: "📖",
        color: "purple",
        group: "university",
        description:
          "ادبیات برای دانشجویان — کتاب‌ها و منابع ادبی دانشگاهی",
        order: 11,
      },
    });
    console.log(`✅ «ادبیات (دانشگاهی)» اضافه شد`);
  }

  // ─── ۲. ادبیات (مدرسه) ───
  const existingSchool = await prisma.category.findUnique({
    where: { slug: "literature-school" },
  });

  if (existingSchool) {
    await prisma.category.update({
      where: { slug: "literature-school" },
      data: {
        title: "ادبیات (مدرسه)",
        icon: "📚",
        color: "rose",
        group: "school",
        description: "ادبیات فارسی مدرسه — قرائت، دستور زبان و آرایه‌ها",
        order: 35,
      },
    });
    console.log(`🔄 «ادبیات (مدرسه)» آپدیت شد`);
  } else {
    await prisma.category.create({
      data: {
        slug: "literature-school",
        title: "ادبیات (مدرسه)",
        icon: "📚",
        color: "rose",
        group: "school",
        description: "ادبیات فارسی مدرسه — قرائت، دستور زبان و آرایه‌ها",
        order: 35,
      },
    });
    console.log(`✅ «ادبیات (مدرسه)» اضافه شد`);
  }

  console.log("\n🎉 تمام!");
  console.log("📖 حالا دو تا دسته داری:");
  console.log("   • ادبیات (دانشگاهی) — slug: literature");
  console.log("   • ادبیات (مدرسه) — slug: literature-school");
}

main()
  .catch((e) => {
    console.error("❌ خطا:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });