import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const schoolCategories = [
  // ─── پایه‌های متوسطه (ریاضی، تجربی، انسانی) ───
  {
    slug: "math-school",
    title: "ریاضی (مدرسه)",
    icon: "🔢",
    color: "blue",
    group: "school",
    description: "ریاضی تمامی پایه‌های دبیرستان — حسابان، هندسه، آمار و احتمال",
    order: 30,
  },
  {
    slug: "geometry",
    title: "هندسه",
    icon: "📏",
    color: "purple",
    group: "school",
    description: "هندسه ۱، ۲ و ۳ به همراه تمرین‌های حل‌شده",
    order: 31,
  },
  {
    slug: "calculus",
    title: "حسابان",
    icon: "🧮",
    color: "orange",
    group: "school",
    description: "حسابان ۱ و ۲ — مشتق، انتگرال و کاربردها",
    order: 32,
  },
  {
    slug: "statistics",
    title: "آمار و احتمال",
    icon: "📊",
    color: "green",
    group: "school",
    description: "آمار و احتمال پایه‌های دهم، یازدهم و دوازدهم",
    order: 33,
  },

  // ─── علوم تجربی ───
  {
    slug: "biology",
    title: "زیست‌شناسی",
    icon: "🧬",
    color: "green",
    group: "school",
    description: "زیست‌شناسی ۱، ۲ و ۳ به همراه نکات کلیدی و شکل‌ها",
    order: 34,
  },
  {
    slug: "physics-school",
    title: "فیزیک (مدرسه)",
    icon: "🔭",
    color: "purple",
    group: "school",
    description: "فیزیک پایه‌های دهم، یازدهم و دوازدهم",
    order: 35,
  },
  {
    slug: "chemistry-school",
    title: "شیمی (مدرسه)",
    icon: "⚗️",
    color: "rose",
    group: "school",
    description: "شیمی پایه‌های دهم، یازدهم و دوازدهم",
    order: 36,
  },
  {
    slug: "geology",
    title: "زمین‌شناسی",
    icon: "🪨",
    color: "orange",
    group: "school",
    description: "زمین‌شناسی برای پایه‌ی یازدهم رشته‌های تجربی و ریاضی",
    order: 37,
  },

  // ─── ادبیات و زبان ───
  {
    slug: "farsi",
    title: "فارسی",
    icon: "📕",
    color: "rose",
    group: "school",
    description: "فارسی تمامی پایه‌های متوسطه — قرائت، دستور و آرایه‌ها",
    order: 38,
  },
  {
    slug: "negaresh",
    title: "نگارش",
    icon: "✒️",
    color: "yellow",
    group: "school",
    description: "نگارش و انشا پایه‌های دهم، یازدهم و دوازدهم",
    order: 39,
  },
  {
    slug: "english-school",
    title: "زبان انگلیسی (مدرسه)",
    icon: "🔤",
    color: "blue",
    group: "school",
    description: "زبان انگلیسی مدرسه — گرامر، واژگان و درک مطلب",
    order: 40,
  },

  // ─── معارف ───
  {
    slug: "quran",
    title: "قرآن",
    icon: "📖",
    color: "green",
    group: "school",
    description: "قرآن پایه‌های مختلف — روخوانی، ترجمه و مفاهیم",
    order: 41,
  },

  // ─── علوم اجتماعی ───
  {
    slug: "history-school",
    title: "تاریخ (مدرسه)",
    icon: "📜",
    color: "orange",
    group: "school",
    description: "تاریخ ایران و جهان برای پایه‌های دبیرستان",
    order: 42,
  },
  {
    slug: "geography-school",
    title: "جغرافیا (مدرسه)",
    icon: "🌐",
    color: "blue",
    group: "school",
    description: "جغرافیای ایران و جهان — طبیعی و انسانی",
    order: 43,
  },
  {
    slug: "economics",
    title: "اقتصاد",
    icon: "💹",
    color: "green",
    group: "school",
    description: "اقتصاد پایه‌ی دهم و یازدهم رشته‌های انسانی و ریاضی",
    order: 44,
  },

  // ─── انسانی ───
  {
    slug: "philosophy",
    title: "فلسفه و منطق",
    icon: "🤔",
    color: "purple",
    group: "school",
    description: "فلسفه و منطق برای پایه‌های یازدهم و دوازدهم انسانی",
    order: 45,
  },
  {
    slug: "psychology-school",
    title: "روانشناسی (مدرسه)",
    icon: "🧩",
    color: "rose",
    group: "school",
    description: "روانشناسی پایه‌ی یازدهم رشته‌ی علوم انسانی",
    order: 46,
  },
];

async function main() {
  console.log("🌱 شروع اضافه کردن درس‌های مدرسه...\n");

  let added = 0;
  let skipped = 0;

  for (const cat of schoolCategories) {
    const existing = await prisma.category.findUnique({
      where: { slug: cat.slug },
    });

    if (existing) {
      console.log(`⏭️  «${cat.title}» از قبل هست — رد شد`);
      skipped++;
    } else {
      await prisma.category.create({ data: cat });
      console.log(`✅ «${cat.title}» اضافه شد`);
      added++;
    }
  }

  console.log("\n🎉 تمام!");
  console.log(`   ➕ اضافه شده: ${added}`);
  console.log(`   ⏭️  رد شده: ${skipped}`);

  const total = await prisma.category.count();
  console.log(`   📊 مجموع دسته‌ها: ${total}`);
}

main()
  .catch((e) => {
    console.error("❌ خطا:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });