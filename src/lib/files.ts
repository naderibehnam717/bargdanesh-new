export type FileType = "جزوه" | "کتاب" | "نمونه سوال" | "منابع غیر درسی" | "منابع استخدامی";

export type FileLevel = "دانشگاهی" | "مدرسه ای" | "غیر درسی";

export type FileColor = "blue" | "green" | "purple" | "rose" | "yellow" | "red" | "orange" | "pink" | "black";

export interface FileItem {
  slug: string;
  title: string;
  desc: string;
  category: string;
  type: FileType;
  level: FileLevel;
  author?: string;
  viewUrl?: string;
  downloadUrl?: string;
  downloadName?: string;
  color: FileColor;
}

export const allFiles: FileItem[] = [
  {
    slug: "jozve-fizik-paye",
    title: "جزوه فیزیک پایه",
    desc: "جزوه کامل فیزیک ۱ و ۲",
    category: "فیزیک",
    type: "جزوه",
    level: "دانشگاهی",
    viewUrl: "https://drive.google.com/file/d/1XKAoerWekowO56UXQ_0iw3WwX3FN0Q60/view",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1XKAoerWekowO56UXQ_0iw3WwX3FN0Q60",
    downloadName: "jozve-fizik-paye.pdf",
    color: "purple"
  },
  {
    slug: "jozve-mabani-computer-barname-nevisi",
    title: "جزوه مبانی کامپیوتر و برنامه‌نویسی",
    desc: "مفاهیم پایه کامپیوتر، الگوریتم و برنامه‌نویسی C++",
    category: "کامپیوتر",
    type: "جزوه",
    level: "دانشگاهی",
    viewUrl: "https://drive.google.com/file/d/15h2ylcOqKHGuvNsT1Yfdz0RezD21--jW/view",
    downloadUrl: "https://drive.google.com/uc?export=download&id=15h2ylcOqKHGuvNsT1Yfdz0RezD21--jW",
    downloadName: "jozve-mabani-computer.pdf",
    color: "blue"
  },
  {
    slug: "ketab-andishe-islami-1",
    title: "کتاب اندیشه اسلامی ۱",
    desc: "کتاب مرجع اندیشه اسلامی — آیت‌الله جعفر سبحانی",
    category: "معارف",
    type: "کتاب",
    level: "دانشگاهی",
    viewUrl: "https://drive.google.com/file/d/10TbXwsw7XGSbEHpTrzkAb9VZ1NRPWZnh/view",
    downloadUrl: "https://drive.google.com/uc?export=download&id=10TbXwsw7XGSbEHpTrzkAb9VZ1NRPWZnh",
    downloadName: "ketab-andishe-islami-1.pdf",
    color: "green"
  },
  {
    slug: "jozve-amar-ravesh-tahghigh",
    title: "جزوه آمار و روش تحقیق در علوم انسانی",
    desc: "آمار توصیفی، استنباطی، روش‌های تحقیق و آزمون فرضیه",
    category: "روانشناسی",
    type: "جزوه",
    level: "دانشگاهی",
    viewUrl: "https://drive.google.com/file/d/1GF_65KVpdGIksA0NfyAx8PPBxcFmnZ4f/view",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1GF_65KVpdGIksA0NfyAx8PPBxcFmnZ4f",
    downloadName: "jozve-amar-ravash-tahghigh.pdf",
    color: "purple"
  },
  {
    slug: "jozve-ravanshenasi-omumi",
    title: "جزوه روانشناسی عمومی",
    desc: "مفاهیم پایه، مکاتب، یادگیری، حافظه، هوش و شخصیت",
    category: "روانشناسی",
    type: "جزوه",
    level: "دانشگاهی",
    author: "جزوه اختصاصی برگ دانش",
    viewUrl: "https://drive.google.com/file/d/13elZtuifvT3kRuxxgOyKrbYxpmTHVDK6/view",
    downloadUrl: "https://drive.google.com/uc?export=download&id=13elZtuifvT3kRuxxgOyKrbYxpmTHVDK6",
    downloadName: "jozve-ravanshenasi-omumi.pdf",
    color: "purple"
  },
  {
    slug: "jozve-ravanshenasi-roshd",
    title: "جزوه روانشناسی رشد",
    desc: "مراحل رشد انسان از تولد تا سالمندی و نظریه‌های مهم رشد",
    category: "روانشناسی",
    type: "جزوه",
    level: "دانشگاهی",
    author: "جزوه اختصاصی برگ دانش",
    viewUrl: "https://drive.google.com/file/d/1kyHTp4611PI7_WGNJwj6nPrgkOinRKn4/view",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1kyHTp4611PI7_WGNJwj6nPrgkOinRKn4",
    downloadName: "jozve-ravanshenasi-roshd.pdf",
    color: "purple"
  },
  {
    slug: "jozve-ravanshenasi-shakhsiat",
    title: "جزوه روانشناسی شخصیت",
    desc: "نظریه‌های فروید، یونگ، آدلر، مازلو، راجرز و مدل پنج عامل بزرگ",
    category: "روانشناسی",
    type: "جزوه",
    level: "دانشگاهی",
    author: "جزوه اختصاصی برگ دانش",
    viewUrl: "https://drive.google.com/file/d/1-TsLOR5IzlbhV0z8aia9zmr1G8WK7wwH/view",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1-TsLOR5IzlbhV0z8aia9zmr1G8WK7wwH",
    downloadName: "jozve-ravanshenasi-shakhsiat.pdf",
    color: "purple"
  },
  {
    slug: "jozve-ravanshenasi-ejtemaei",
    title: "جزوه روانشناسی اجتماعی",
    desc: "نگرش، نفوذ اجتماعی، همرنگی، اطاعت، گروه‌ها و پیش‌داوری",
    category: "روانشناسی",
    type: "جزوه",
    level: "دانشگاهی",
    author: "جزوه اختصاصی برگ دانش",
    viewUrl: "https://drive.google.com/file/d/1SmpFYokvs91iATrv_ks1LBJrFcsb2QJt/view",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1SmpFYokvs91iATrv_ks1LBJrFcsb2QJt",
    downloadName: "jozve-ravanshenasi-ejtemaei.pdf",
    color: "purple"
  },
  {
    slug: "jozve-tafakor-hal-masale-khalaghiat",
    title: "جزوه تفکر، حل مسئله و خلاقیت",
    desc: "تفکر انتقادی، تفکر خلاق، مراحل حل مسئله و پرورش خلاقیت",
    category: "علوم تربیتی",
    type: "جزوه",
    level: "دانشگاهی",
    author: "جزوه اختصاصی برگ دانش",
    viewUrl: "https://drive.google.com/file/d/1KYSK_RvPfJvTtitXfZzkyuyGbFahQ1R2/view",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1KYSK_RvPfJvTtitXfZzkyuyGbFahQ1R2",
    downloadName: "jozve-tafakor-hal-masale.pdf",
    color: "blue"
  },
  {
    slug: "jozve-angizesh-yadgiri",
    title: "جزوه انگیزش و نقش آن در یادگیری",
    desc: "انگیزش درونی و بیرونی، خودکارآمدی و نقش معلم در افزایش انگیزه",
    category: "علوم تربیتی",
    type: "جزوه",
    level: "دانشگاهی",
    author: "جزوه اختصاصی برگ دانش",
    viewUrl: "https://drive.google.com/file/d/1gpxtW2iyurPpKk_UN0ymdsB4yfuc9lse/view",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1gpxtW2iyurPpKk_UN0ymdsB4yfuc9lse",
    downloadName: "jozve-angizesh-yadgiri.pdf",
    color: "green"
  },
  {
    slug: "jozve-roshd-tahavol-amoozesh",
    title: "جزوه رشد و تحول در آموزش",
    desc: "ابعاد تحول، رابطه رشد و یادگیری و آموزش متناسب با سطح رشد",
    category: "علوم تربیتی",
    type: "جزوه",
    level: "دانشگاهی",
    author: "جزوه اختصاصی برگ دانش",
    viewUrl: "https://drive.google.com/file/d/1FCx0OKfAdECYAzPjvrA0nt1VVUZGkp1I/view",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1FCx0OKfAdECYAzPjvrA0nt1VVUZGkp1I",
    downloadName: "jozve-roshd-tahavol.pdf",
    color: "rose"
  },
  {
    slug: "jozve-tafavot-fardi-yadgirande",
    title: "جزوه تفاوت‌های فردی و شناخت یادگیرندگان",
    desc: "تفاوت‌های شناختی، استعداد، سرعت یادگیری، سبک‌های یادگیری و تفاوت‌های عاطفی",
    category: "علوم تربیتی",
    type: "جزوه",
    level: "دانشگاهی",
    author: "جزوه اختصاصی برگ دانش",
    viewUrl: "https://drive.google.com/file/d/1ErLGgkEtA6shRmnx3wIXOLK1tM080eWN/view",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1ErLGgkEtA6shRmnx3wIXOLK1tM080eWN",
    downloadName: "jozve-tafavot-fardi.pdf",
    color: "purple"
  },
  {
    slug: "jozve-hafeze-farayand-yadgiri",
    title: "جزوه حافظه و فرایندهای یادگیری",
    desc: "رمزگردانی، ذخیره‌سازی، بازیابی و روش‌های تقویت حافظه",
    category: "علوم تربیتی",
    type: "جزوه",
    level: "دانشگاهی",
    author: "جزوه اختصاصی برگ دانش",
    viewUrl: "https://drive.google.com/file/d/140KnkfmsD7TRPIbUOWS0m1aauRoNuMfm/view",
    downloadUrl: "https://drive.google.com/uc?export=download&id=140KnkfmsD7TRPIbUOWS0m1aauRoNuMfm",
    downloadName: "jozve-hafeze.pdf",
    color: "blue"
  },
  {
    slug: "jozve-mafhoom-yadgiri-nazariye",
    title: "جزوه مفهوم یادگیری و نظریه‌های یادگیری",
    desc: "رفتارگرایی، شناخت‌گرایی، یادگیری مشاهده‌ای و نظریه‌های پاولف، اسکینر و بندورا",
    category: "علوم تربیتی",
    type: "جزوه",
    level: "دانشگاهی",
    author: "جزوه اختصاصی برگ دانش",
    viewUrl: "https://drive.google.com/file/d/1gzztUqrD_cG9K4KbCnniVyWA2ddg0pvT/view",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1gzztUqrD_cG9K4KbCnniVyWA2ddg0pvT",
    downloadName: "jozve-mafhoom-yadgiri.pdf",
    color: "purple"
  },
  {
    slug: "jozve-ravesh-fonoon-tadris",
    title: "جزوه روش‌ها و فنون تدریس",
    desc: "روش‌های تدریس مستقیم، سخنرانی، پرسش و پاسخ، بحث گروهی، حل مسئله و یادگیری مشارکتی",
    category: "علوم تربیتی",
    type: "جزوه",
    level: "دانشگاهی",
    author: "جزوه اختصاصی برگ دانش",
    viewUrl: "https://drive.google.com/file/d/1p4_PvDQACtjAQ1Q_EfjDQw3jDi3t9b5q/view",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1p4_PvDQACtjAQ1Q_EfjDQw3jDi3t9b5q",
    downloadName: "jozve-ravesh-fonoon-tadris.pdf",
    color: "blue"
  },
  {
    slug: "jozve-mabani-oloom-tarbiati",
    title: "جزوه مبانی و مفاهیم اساسی علوم تربیتی",
    desc: "تعریف علوم تربیتی، تفاوت آموزش و تربیت، نقش معلم و یادگیرنده و عوامل مؤثر بر یادگیری",
    category: "علوم تربیتی",
    type: "جزوه",
    level: "دانشگاهی",
    author: "جزوه اختصاصی برگ دانش",
    viewUrl: "https://drive.google.com/file/d/1ldI9Wawz27sjHvULC_kHawWS01U9Ebe-/view",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1ldI9Wawz27sjHvULC_kHawWS01U9Ebe-",
    downloadName: "jozve-mabani-oloom-tarbiati.pdf",
    color: "green"
  },
  {
    slug: "jozve-arzyabi-sanjesh-amoozeshi",
    title: "جزوه ارزشیابی و سنجش آموزشی",
    desc: "اندازه‌گیری، سنجش، ارزشیابی تشخیصی، تکوینی و پایانی و ابزارهای سنجش",
    category: "علوم تربیتی",
    type: "جزوه",
    level: "دانشگاهی",
    author: "جزوه اختصاصی برگ دانش",
    viewUrl: "https://drive.google.com/file/d/13wvUg5DezDmRsEKSDD7tIbuZH3FCGSJT/view",
    downloadUrl: "https://drive.google.com/uc?export=download&id=13wvUg5DezDmRsEKSDD7tIbuZH3FCGSJT",
    downloadName: "jozve-arzyabi-sanjesh.pdf",
    color: "blue"
  },
  {
    slug: "jozve-farhang-jamee",
    title: "جزوه فرهنگ و جامعه",
    desc: "مفاهیم پایه فرهنگ، ارزش‌ها، هنجارها، نمادها، نسبیت فرهنگی و تغییرات فرهنگی",
    category: "جامعه‌شناسی",
    type: "جزوه",
    level: "دانشگاهی",
    author: "جزوه اختصاصی برگ دانش",
    viewUrl: "https://drive.google.com/file/d/1eDve43xbWhZS7EntmJf6mZzdX6QyhwqP/view",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1eDve43xbWhZS7EntmJf6mZzdX6QyhwqP",
    downloadName: "jozve-farhang-va-jamee.pdf",
    color: "blue"
  },
  {
    slug: "jozve-mabani-jamee-shenasi",
    title: "جزوه مبانی و مفاهیم اساسی جامعه‌شناسی",
    desc: "جامعه، کنش اجتماعی، تعامل، گروه، نهاد، پایگاه، نقش و ساختار اجتماعی",
    category: "جامعه‌شناسی",
    type: "جزوه",
    level: "دانشگاهی",
    author: "جزوه اختصاصی برگ دانش",
    viewUrl: "https://drive.google.com/file/d/1HEm77iAGSZ7hBoxYRkq1S_ssRhxKVpPJ/view",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1HEm77iAGSZ7hBoxYRkq1S_ssRhxKVpPJ",
    downloadName: "jozve-mabani-jamee-shenasi.pdf",
    color: "purple"
  },
  {
    slug: "jozve-zaban-zamayer-to-be",
    title: "جزوه ضمایر شخصی و فعل To Be در زبان انگلیسی",
    desc: "آموزش ضمایر شخصی، فعل To Be، جمله‌های مثبت، منفی و پرسشی",
    category: "زبان انگلیسی",
    type: "جزوه",
    level: "دانشگاهی",
    author: "جزوه اختصاصی برگ دانش",
    viewUrl: "https://drive.google.com/file/d/1wsY_DBRlUpYVGzZtef_MvZsZVrkYHKwF/view",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1wsY_DBRlUpYVGzZtef_MvZsZVrkYHKwF",
    downloadName: "jozve-zaban-english-zamayer-va-to-be-1.pdf",
    color: "blue"
  },
  {
    slug: "jozve-esm-sefat-jomle-sadeh",
    title: "جزوه اسم، صفت و ساختار جمله‌های ساده",
    desc: "آموزش اسم، صفت و ساختار جمله‌های ساده در زبان انگلیسی",
    category: "زبان انگلیسی",
    type: "جزوه",
    level: "دانشگاهی",
    author: "جزوه اختصاصی برگ دانش",
    viewUrl: "https://drive.google.com/file/d/1k7RCPmgHGiG5wRvVhnSfj6KcsIdO7PoO/view",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1k7RCPmgHGiG5wRvVhnSfj6KcsIdO7PoO",
    downloadName: "jozve-esm-sefat-sakhtar-jomle.pdf",
    color: "green"
  },
  {
    slug: "ketab-ertebat-ba-har-joor-adami",
    title: "کتاب چطور با هرجور آدمی ارتباط برقرار کنیم؟",
    desc: "لیل لوندز — ترجمه فرخ بافنده | ۹۲ ترفند کوچک برای جذب دیگران",
    category: "کتاب",
    type: "منابع غیر درسی",
    level: "غیر درسی",
    author: "لیل لوندز",
    viewUrl: "https://drive.google.com/file/d/1LuSVVkyATBBDaXV7grB2UPlhe3Pr9TYk/view",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1LuSVVkyATBBDaXV7grB2UPlhe3Pr9TYk",
    downloadName: "ketab-chetor-ba-har-joor-adami-ertebat-bargirar-konim.pdf",
    color: "green"
  },
  {
    slug: "ketab-pranses-pa-berahne",
    title: "کتاب پرنسس پا برهنه",
    desc: "اریک امانوئل اشمیت - ترجمه سعیده بوغیری | چاپ چهارم",
    category: "کتاب",
    type: "منابع غیر درسی",
    level: "غیر درسی",
    author: "اریک امانوئل اشمیت",
    viewUrl: "https://drive.google.com/file/d/1KZXl8bQ9iqyObQYBtC2hXaMmVoH7xScQ/view",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1KZXl8bQ9iqyObQYBtC2hXaMmVoH7xScQ",
    downloadName: "ketab-prances-pa-berahne.pdf",
    color: "red"
  },
  {
    slug: "ketab-zan-ziyadi",
    title: "کتاب زن زیادی",
    desc: "کتاب زن زیادی - چاپ دهم - جلال آل احمد",
    category: "کتاب",
    type: "منابع غیر درسی",
    level: "غیر درسی",
    author: "جلال آل احمد",
    viewUrl: "https://drive.google.com/file/d/1K_GwQlo3BB4hS7M9QSUyYPNyuNbSGgBg/view",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1K_GwQlo3BB4hS7M9QSUyYPNyuNbSGgBg",
    downloadName: "ketab-zan-e-ziyadi.pdf",
    color: "purple"
  },
  {
    slug: "roman-saat-setareh",
    title: "رمان ساعت ستاره",
    desc: "کلاریس لیسپکتور - مترجم شکیبا محب علی",
    category: "رمان",
    type: "منابع غیر درسی",
    level: "غیر درسی",
    author: "کلاریس لیسپکتور",
    viewUrl: "https://drive.google.com/file/d/1uvQIORoUTTLQYO0D-y_O6J_megpw5BhP/view",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1uvQIORoUTTLQYO0D-y_O6J_megpw5BhP",
    downloadName: "roman-saat-setareh.pdf",
    color: "yellow"
  },
  {
    slug: "namayeshname-mostajer-jadid-royaye-americayi",
    title: "نمایشنامه مستاجر جدید و رویای آمریکایی",
    desc: "اوژن یونسکو | ادوارد آلبی - ترجمه رضا کرم رضایی",
    category: "نمایشنامه",
    type: "منابع غیر درسی",
    level: "غیر درسی",
    author: "مستاجر جدید = اوژن یونسکو -- رویای آمریکایی = ادوارد آلبی",
    viewUrl: "https://drive.google.com/file/d/1p7J8Q4k7h7C0ys8BBq0_34mbvm8bwyGC/view",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1p7J8Q4k7h7C0ys8BBq0_34mbvm8bwyGC",
    downloadName: "namayeshname-mostajer-jadid-v-royaye-americayi",
    color: "pink"
  },
  {
    slug: "dastan-tafsir-yek-khab",
    title: "داستان تفسیر یک خواب",
    desc: "زیگموند فروید - مترجم حمید محرمیان معلم",
    category: "داستان",
    type: "منابع غیر درسی",
    level: "غیر درسی",
    author: "زیگموند فروید",
    viewUrl: "https://drive.google.com/file/d/1RoPh2ftXp6nsbk0KYST_3-o82DAcwy-S/view",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1RoPh2ftXp6nsbk0KYST_3-o82DAcwy-S",
    downloadName: "dastan-tafsir-e-yek-khab",
    color: "orange"
  },
  {
    slug: "roman-girande-shenakhte-nashod",
    title: "رمان گیرنده شناخته نشد",
    desc: "کاترین کرسمن تیلور - ترجمه بهمن دارالشفایی",
    category: "رمان",
    type: "منابع غیر درسی",
    level: "غیر درسی",
    author: "کاترین کرسمن تیلور",
    viewUrl: "https://drive.google.com/file/d/1Htt13U_hlylyQM3NXzvMl7JccQcCWfdn/view",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1Htt13U_hlylyQM3NXzvMl7JccQcCWfdn",
    downloadName: "roman-girandeh-shenakhte-nashod.pdf",
    color: "red"
  },
  {
    slug: "roman-pish-az-an-ke-bekhabam",
    title: "رمان پیش از آنکه بخوابم",
    desc: "اس . جی . واتسون - مترجم شقایق قندهاری",
    category: "رمان",
    type: "منابع غیر درسی",
    level: "غیر درسی",
    author: "اس . جی . واتسون",
    viewUrl: "https://drive.google.com/file/d/1YJyTqEOlQ-PdFV75mlN67O36Cob4PRiV/view",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1YJyTqEOlQ-PdFV75mlN67O36Cob4PRiV",
    downloadName: "roman-pish-az-an-ke-bekhabam.pdf",
    color: "blue"
  },
  {
    slug: "roman-be-khodaye-nashenakhte",
    title: "رمان به خدای ناشناخته",
    desc: "جان اشتاین بک - مترجم محمد معینی",
    category: "رمان",
    type: "منابع غیر درسی",
    level: "غیر درسی",
    author: "جان اشتاین بک",
    viewUrl: "https://drive.google.com/file/d/17ucqhPszuoxLRhLKAp4xKJt65UWXTAMJ/view",
    downloadUrl: "https://drive.google.com/uc?export=download&id=17ucqhPszuoxLRhLKAp4xKJt65UWXTAMJ",
    downloadName: "roman-be-khodaye-nashenakhte.pdf",
    color: "black"
  },
  {
    slug: "roman-gahvare-gorbe",
    title: "رمان گهواره ی گربه",
    desc: "کرت ونه گوت جونیور - مترجم علی اصغر بهرامی",
    category: "رمان",
    type: "منابع غیر درسی",
    level: "غیر درسی",
    author: "کرت ونه گوت جونیور",
    viewUrl: "https://drive.google.com/file/d/1r3oplGCww6GkXNYxuUEaGiNWeA9KUopb/view",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1r3oplGCww6GkXNYxuUEaGiNWeA9KUopb",
    downloadName: "roman-gahvareye-gorbe.pdf",
    color: "yellow"
  },
  {
    slug: "roman-shekast-napazir",
    title: "رمان شکست ناپذیر",
    desc: "ارنست همینگوی - مترجمان مرسده بصیریان | همایون حنیفه وند مقدم",
    category: "رمان",
    type: "منابع غیر درسی",
    level: "غیر درسی",
    author: "ارنست همینگوی",
    viewUrl: "https://drive.google.com/file/d/17JUndqMctJX3BAOO2ClZovDl8m9h3woD/view",
    downloadUrl: "https://drive.google.com/uc?export=download&id=17JUndqMctJX3BAOO2ClZovDl8m9h3woD",
    downloadName: "roman-shekast-napazir.pdf",
    color: "yellow"
  },
  {
    slug: "jozve-shimi-aali",
    title: "جزوه شیمی آلی",
    desc: "شیمی آلی فصل یک - دکتر پارسا فراهانی",
    category: "شیمی",
    type: "جزوه",
    level: "دانشگاهی",
    author: "دکتر پارسا فراهانی",
    viewUrl: "https://drive.google.com/file/d/1tcVBDuI85FrCEjelFCUPc0IxCg5b2Nhe/view",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1tcVBDuI85FrCEjelFCUPc0IxCg5b2Nhe",
    downloadName: "jozve-shimi-aali.pdf",
    color: "green"
  },
  {
    slug: "jozve-ashenayi-mabani-computer",
    title: "جزوه آشنایی با مبانی کامپیوتر",
    desc: "جزوه آشنایی با مبانی کامپیوتر",
    category: "کامپیوتر",
    type: "جزوه",
    level: "دانشگاهی",
    viewUrl: "https://drive.google.com/file/d/1ioO93Bl87mw8tFWweRVq3-Er_PC3jStt/view",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1ioO93Bl87mw8tFWweRVq3-Er_PC3jStt",
    downloadName: "jozve-ashenayi-ba-mabani-computer.pdf",
    color: "green"
  },
  {
    slug: "jozve-mabani-computer-barname-sazi",
    title: "مبانی کامپیوتر و برنامه سازی",
    desc: "مبانی کامپیوتر و برنامه سازی - محمد هادی علائیان",
    category: "کامپیوتر",
    type: "جزوه",
    level: "دانشگاهی",
    author: "محمد هادی علائیان",
    viewUrl: "https://drive.google.com/file/d/1NJE8gbPq0AQAvS4Z6162TFinmJBH4x0k/view",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1NJE8gbPq0AQAvS4Z6162TFinmJBH4x0k",
    downloadName: "jozve-mabani-computer-v-barname-sazi.pdf",
    color: "yellow"
  }
];

// ─────── Helpers ───────

export function getFileBySlug(slug: string): FileItem | undefined {
  return allFiles.find((f) => f.slug === slug);
}

export function getFilesByType(type: FileType): FileItem[] {
  return allFiles.filter((f) => f.type === type);
}

export function getFilesByCategory(category: string): FileItem[] {
  return allFiles.filter((f) => f.category === category);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(allFiles.map((f) => f.category)));
}

export function getAllSlugs(): string[] {
  return allFiles.map((f) => f.slug);
}