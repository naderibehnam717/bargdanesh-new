import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  // ─── دانشگاهی ───
  {
    slug: "physics",
    title: "فیزیک",
    icon: "⚛️",
    color: "purple",
    group: "university",
    description: "جزوه‌های فیزیک پایه، الکترومغناطیس، مکانیک و...",
    order: 1,
  },
  {
    slug: "chemistry",
    title: "شیمی",
    icon: "🧪",
    color: "green",
    group: "university",
    description: "جزوه‌های شیمی آلی، معدنی، تجزیه و...",
    order: 2,
  },
  {
    slug: "computer",
    title: "کامپیوتر",
    icon: "💻",
    color: "blue",
    group: "university",
    description: "جزوه‌های مبانی کامپیوتر، برنامه‌نویسی، الگوریتم و شبکه.",
    order: 3,
  },
  {
    slug: "psychology",
    title: "روانشناسی",
    icon: "🧠",
    color: "purple",
    group: "university",
    description: "جزوه‌های روانشناسی عمومی، رشد، شخصیت و اجتماعی.",
    order: 4,
  },
  {
    slug: "education",
    title: "علوم تربیتی",
    icon: "🎓",
    color: "green",
    group: "university",
    description: "جزوه‌های روش‌های تدریس، ارزشیابی، یادگیری و انگیزش.",
    order: 5,
  },
  {
    slug: "sociology",
    title: "جامعه‌شناسی",
    icon: "👥",
    color: "rose",
    group: "university",
    description: "جزوه‌های مفاهیم پایه، فرهنگ و جامعه، ساختار اجتماعی.",
    order: 6,
  },
  {
    slug: "islamic",
    title: "معارف",
    icon: "📿",
    color: "orange",
    group: "university",
    description: "کتاب‌های اندیشه اسلامی، معارف و دروس دینی دانشگاهی.",
    order: 7,
  },
  {
    slug: "english",
    title: "زبان انگلیسی",
    icon: "🌍",
    color: "blue",
    group: "university",
    description: "جزوه‌های گرامر، ضمایر، ساختار جملات و مکالمه.",
    order: 8,
  },

  // ─── مدرسه‌ای ───
  {
    slug: "math",
    title: "ریاضی",
    icon: "📐",
    color: "blue",
    group: "school",
    description: "ریاضی تمامی پایه‌ها از ابتدایی تا متوسطه.",
    order: 9,
  },
  {
    slug: "science",
    title: "علوم تجربی",
    icon: "🔬",
    color: "green",
    group: "school",
    description: "فیزیک، شیمی و زیست مدرسه.",
    order: 10,
  },
  {
    slug: "literature",
    title: "ادبیات",
    icon: "📖",
    color: "purple",
    group: "school",
    description: "قرائت، دستور زبان و آرایه‌های ادبی.",
    order: 11,
  },
  {
    slug: "arabic",
    title: "عربی",
    icon: "🕌",
    color: "rose",
    group: "school",
    description: "قواعد، ترجمه و متن عربی مدرسه.",
    order: 12,
  },
  {
    slug: "religious",
    title: "دین و زندگی",
    icon: "📿",
    color: "orange",
    group: "school",
    description: "پیام‌های آسمانی و دین و زندگی مدرسه.",
    order: 13,
  },
  {
    slug: "social",
    title: "مطالعات اجتماعی",
    icon: "🏛️",
    color: "yellow",
    group: "school",
    description: "تاریخ، جغرافیا و مدنی.",
    order: 14,
  },

  // ─── رشته‌های کنکور ───
  {
    slug: "konkur-riazi",
    title: "ریاضی و فنی",
    icon: "📐",
    color: "blue",
    group: "konkur",
    description: "کنکور سراسری رشته‌ی ریاضی و فنی.",
    order: 15,
  },
  {
    slug: "konkur-tajrobi",
    title: "علوم تجربی",
    icon: "🧬",
    color: "green",
    group: "konkur",
    description: "کنکور سراسری رشته‌ی علوم تجربی.",
    order: 16,
  },
  {
    slug: "konkur-ensani",
    title: "علوم انسانی",
    icon: "📚",
    color: "purple",
    group: "konkur",
    description: "کنکور سراسری رشته‌ی علوم انسانی.",
    order: 17,
  },
  {
    slug: "konkur-honar",
    title: "هنر",
    icon: "🎨",
    color: "orange",
    group: "konkur",
    description: "کنکور سراسری رشته‌ی هنر.",
    order: 18,
  },
  {
    slug: "konkur-zaban",
    title: "زبان‌های خارجی",
    icon: "🌍",
    color: "rose",
    group: "konkur",
    description: "کنکور سراسری رشته‌ی زبان‌های خارجی.",
    order: 19,
  },

  // ─── کتاب‌های غیر درسی ───
  {
    slug: "book",
    title: "کتاب",
    icon: "📚",
    color: "blue",
    group: "book",
    description: "کتاب‌های عمومی و غیر درسی.",
    order: 20,
  },
  {
    slug: "novel",
    title: "رمان",
    icon: "📖",
    color: "purple",
    group: "book",
    description: "رمان‌های کلاسیک و مدرن.",
    order: 21,
  },
  {
    slug: "story",
    title: "داستان",
    icon: "✏️",
    color: "green",
    group: "book",
    description: "داستان‌های کوتاه و مجموعه‌داستان.",
    order: 22,
  },
  {
    slug: "play",
    title: "نمایشنامه",
    icon: "🎭",
    color: "rose",
    group: "book",
    description: "نمایشنامه‌های ایرانی و خارجی.",
    order: 23,
  },
  {
    slug: "poem",
    title: "شعر",
    icon: "🌿",
    color: "yellow",
    group: "book",
    description: "مجموعه اشعار کلاسیک و معاصر.",
    order: 24,
  },
];

async function main() {
  console.log("🌱 شروع seed کردن دسته‌ها...\n");

  let added = 0;
  let updated = 0;

  for (const cat of categories) {
    const existing = await prisma.category.findUnique({
      where: { slug: cat.slug },
    });

    if (existing) {
      await prisma.category.update({
        where: { slug: cat.slug },
        data: {
          title: cat.title,
          icon: cat.icon,
          color: cat.color,
          group: cat.group,
          description: cat.description,
          order: cat.order,
        },
      });
      console.log(`🔄 «${cat.title}» آپدیت شد`);
      updated++;
    } else {
      await prisma.category.create({ data: cat });
      console.log(`✅ «${cat.title}» اضافه شد`);
      added++;
    }
  }

  console.log("\n🎉 تمام!");
  console.log(`   ➕ اضافه شده: ${added}`);
  console.log(`   🔄 آپدیت شده: ${updated}`);

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