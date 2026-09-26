import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "آرشیو کنکور — دفترچه سوالات و کلید پاسخ",
  description:
    "دانلود رایگان دفترچه سوالات و کلید پاسخ کنکور سراسری سال‌های گذشته (۱۴۰۰ تا ۱۴۰۵) در تمامی رشته‌ها — ریاضی، تجربی، انسانی، هنر و زبان",
  keywords: [
    "آرشیو کنکور",
    "دفترچه سوالات کنکور",
    "کلید پاسخ کنکور",
    "دانلود کنکور",
    "کنکور ۱۴۰۵",
    "کنکور ۱۴۰۴",
    "کنکور ریاضی",
    "کنکور تجربی",
    "کنکور انسانی",
    "سوالات کنکور سراسری",
    "برگ دانش",
  ],
  alternates: {
    canonical: "https://www.bargdanesh.ir/konkur",
  },
  openGraph: {
    title: "آرشیو کنکور | برگ دانش",
    description:
      "دانلود رایگان دفترچه سوالات و کلید پاسخ کنکور سراسری تمامی رشته‌ها",
    url: "https://www.bargdanesh.ir/konkur",
    type: "website",
    locale: "fa_IR",
    siteName: "برگ دانش",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "آرشیو کنکور برگ دانش",
      },
    ],
  },
};

const FIELDS = [
  { value: "ریاضی و فنی", icon: "📐", color: "#0066cc" },
  { value: "علوم تجربی", icon: "🧬", color: "#10b981" },
  { value: "علوم انسانی", icon: "📚", color: "#7c3aed" },
  { value: "هنر", icon: "🎨", color: "#f59e0b" },
  { value: "زبان‌های خارجی", icon: "🌍", color: "#e11d48" },
];

const YEARS = [1405, 1404, 1403, 1402, 1401, 1400];

const KONKUR_GRADIENT = "linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #7c3aed 100%)";

interface PageProps {
  searchParams: Promise<{ year?: string; field?: string }>;
}

export default async function KonkurPage({ searchParams }: PageProps) {
  const { year, field } = await searchParams;

  const where: { year?: number; field?: string } = {};
  if (year && year !== "all") {
    const y = parseInt(year);
    if (!isNaN(y)) where.year = y;
  }
  if (field && field !== "all") {
    where.field = field;
  }

  const konkurList = await prisma.konkur.findMany({
    where,
    orderBy: [
      { year: "desc" },
      { field: "asc" },
      { order: "asc" },
      { createdAt: "asc" },
    ],
  });

  // ─── آمار کلی ───
  const totalKonkur = await prisma.konkur.count();
  const allKonkurs = await prisma.konkur.findMany({
    select: { year: true, field: true },
  });
  const totalYears = new Set(allKonkurs.map((k) => k.year)).size;
  const totalFields = new Set(allKonkurs.map((k) => k.field)).size;

  // ─── گروه‌بندی ───
  const groupedData = konkurList.reduce((acc, item) => {
    if (!acc[item.year]) acc[item.year] = {};
    if (!acc[item.year][item.field]) acc[item.year][item.field] = [];
    acc[item.year][item.field].push(item);
    return acc;
  }, {} as Record<number, Record<string, typeof konkurList>>);

  const sortedYears = Object.keys(groupedData)
    .map(Number)
    .sort((a, b) => b - a);

  const toFa = (n: number) =>
    String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

  return (
    <>
      {/* ─── Hero گرادیانتی ─── */}
      <section
        style={{
          position: "relative",
          padding: "80px 0 60px",
          background: KONKUR_GRADIENT,
          color: "#fff",
          overflow: "hidden",
        }}
      >
        {/* ─── ذرات شناور ─── */}
        <div
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          {[
            { top: "12%", right: "10%", delay: "0s", emoji: "📚" },
            { top: "35%", right: "18%", delay: "-1.5s", emoji: "📄" },
            { top: "65%", right: "12%", delay: "-3s", emoji: "✅" },
            { top: "18%", left: "10%", delay: "-0.5s", emoji: "🎓" },
            { top: "50%", left: "15%", delay: "-2s", emoji: "✏️" },
            { top: "78%", left: "20%", delay: "-3.5s", emoji: "📝" },
          ].map((pos, i) => (
            <span
              key={i}
              style={{
                position: "absolute",
                top: pos.top,
                right: (pos as { right?: string }).right,
                left: (pos as { left?: string }).left,
                fontSize: "32px",
                opacity: 0.5,
                animation: `floatEmoji 6s ease-in-out infinite ${pos.delay}`,
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
              }}
            >
              {pos.emoji}
            </span>
          ))}
        </div>

        <div
          className="container"
          style={{ position: "relative", zIndex: 1, textAlign: "center" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "96px",
              height: "96px",
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderRadius: "28px",
              fontSize: "52px",
              marginBottom: "24px",
              boxShadow: "0 16px 40px rgba(0, 0, 0, 0.2)",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              animation:
                "iconPop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
              opacity: 0,
            }}
          >
            📚
          </div>

          <h1
            style={{
              fontSize: "42px",
              fontWeight: 900,
              margin: "0 0 16px",
              lineHeight: 1.3,
              textShadow: "0 4px 12px rgba(0,0,0,0.2)",
              opacity: 0,
              animation: "fadeInUp 0.8s ease 0.3s forwards",
            }}
          >
            آرشیو کنکور
          </h1>

          <p
            style={{
              fontSize: "16px",
              opacity: 0,
              margin: "0 0 28px",
              lineHeight: 1.9,
              maxWidth: "600px",
              marginLeft: "auto",
              marginRight: "auto",
              animation: "fadeInUp 0.8s ease 0.5s forwards",
              textShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            دفترچه سوالات و کلید پاسخ کنکور سراسری
          </p>

          {/* ─── آمار ─── */}
          <div
            style={{
              display: "inline-flex",
              gap: "12px",
              flexWrap: "wrap",
              justifyContent: "center",
              padding: "14px 22px",
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              opacity: 0,
              animation: "fadeInUp 0.8s ease 0.7s forwards",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              📊 {toFa(totalKonkur)} آزمون
            </span>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                paddingRight: "12px",
                borderRight: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              📅 {toFa(totalYears)} سال
            </span>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                paddingRight: "12px",
                borderRight: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              🎓 {toFa(totalFields)} رشته
            </span>
          </div>
        </div>

        <style
          dangerouslySetInnerHTML={{
            __html: `
              @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
              @keyframes iconPop {
                0% { opacity: 0; transform: scale(0.3) rotate(-20deg); }
                60% { transform: scale(1.1) rotate(5deg); }
                100% { opacity: 1; transform: scale(1) rotate(0); }
              }
              @keyframes floatEmoji {
                0%, 100% { transform: translateY(0) rotate(-5deg) scale(1); }
                50% { transform: translateY(-18px) rotate(8deg) scale(1.15); }
              }
            `,
          }}
        />
      </section>

      <main className="section">
        <div className="container">
          {/* محتوای متنی سئو */}
          <div
            style={{
              maxWidth: "900px",
              margin: "0 auto 40px",
              padding: "24px",
              background: "#f8f9fa",
              borderRadius: "16px",
              lineHeight: 2,
              textAlign: "justify",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                marginBottom: "12px",
                color: "#1a1a1a",
              }}
            >
              دانلود رایگان دفترچه سوالات کنکور سراسری
            </h2>
            <p style={{ marginBottom: "12px", color: "#444" }}>
              آرشیو کامل <strong>دفترچه سوالات و کلید پاسخ کنکور سراسری</strong>{" "}
              از سال ۱۴۰۰ تا ۱۴۰۵ در تمامی رشته‌ها (ریاضی و فنی، علوم تجربی،
              علوم انسانی، هنر و زبان‌های خارجی) به‌صورت رایگان در برگ دانش
              در دسترس شماست.
            </p>
            <p style={{ margin: 0, color: "#444" }}>
              استفاده از <strong>سوالات کنکور سال‌های گذشته</strong> یکی از
              مؤثرترین روش‌های آمادگی برای کنکور است. با حل این سوالات، با
              ساختار آزمون، نوع سوالات و سطح دشواری آن‌ها آشنا می‌شوید.
            </p>
          </div>

          {/* فیلترها */}
          <div
            style={{
              maxWidth: "900px",
              margin: "0 auto 32px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {/* فیلتر سال */}
            <div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#666",
                  marginBottom: "8px",
                }}
              >
                📅 سال کنکور:
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <Link
                  href="/konkur"
                  className={`btn btn--sm ${
                    !year || year === "all" ? "btn--primary" : "btn--ghost"
                  }`}
                >
                  همه
                </Link>
                {YEARS.map((y) => (
                  <Link
                    key={y}
                    href={`/konkur?year=${y}${
                      field && field !== "all" ? `&field=${field}` : ""
                    }`}
                    className={`btn btn--sm ${
                      year === String(y) ? "btn--primary" : "btn--ghost"
                    }`}
                  >
                    {toFa(y)}
                  </Link>
                ))}
              </div>
            </div>

            {/* فیلتر رشته */}
            <div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#666",
                  marginBottom: "8px",
                }}
              >
                🎓 رشته:
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <Link
                  href={`/konkur${
                    year && year !== "all" ? `?year=${year}` : ""
                  }`}
                  className={`btn btn--sm ${
                    !field || field === "all" ? "btn--primary" : "btn--ghost"
                  }`}
                >
                  همه
                </Link>
                {FIELDS.map((f) => (
                  <Link
                    key={f.value}
                    href={`/konkur?field=${encodeURIComponent(f.value)}${
                      year && year !== "all" ? `&year=${year}` : ""
                    }`}
                    className={`btn btn--sm ${
                      field === f.value ? "btn--primary" : "btn--ghost"
                    }`}
                  >
                    {f.icon} {f.value}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* لیست */}
          {sortedYears.length === 0 ? (
            <div
              style={{
                maxWidth: "900px",
                margin: "0 auto",
                padding: "60px 20px",
                textAlign: "center",
                background: "#fff",
                borderRadius: "16px",
                border: "1px solid #e5e5e5",
                color: "#999",
              }}
            >
              📚 هنوز کنکوری اضافه نشده است. به‌زودی...
            </div>
          ) : (
            <div
              style={{
                maxWidth: "900px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                gap: "40px",
              }}
            >
              {sortedYears.map((yearNum) => {
                const fields = Object.keys(groupedData[yearNum]).sort();
                const totalInYear = fields.reduce(
                  (sum, f) => sum + groupedData[yearNum][f].length,
                  0
                );

                return (
                  <div key={yearNum}>
                    {/* هدر سال */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                        marginBottom: "20px",
                        paddingBottom: "16px",
                        borderBottom: "3px solid #f0f0f0",
                        flexWrap: "wrap",
                      }}
                    >
                      <h2
                        style={{
                          fontSize: "24px",
                          fontWeight: 800,
                          color: "#1a1a1a",
                          margin: 0,
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <span
                          style={{
                            background:
                              "linear-gradient(135deg, #0066cc, #7c3aed)",
                            color: "#fff",
                            padding: "6px 16px",
                            borderRadius: "10px",
                            fontSize: "18px",
                            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
                          }}
                        >
                          {toFa(yearNum)}
                        </span>
                        کنکور {toFa(yearNum)}
                      </h2>
                      <span
                        style={{
                          fontSize: "13px",
                          color: "#0066cc",
                          background: "#f0f7ff",
                          padding: "4px 12px",
                          borderRadius: "100px",
                          fontWeight: 700,
                        }}
                      >
                        {toFa(totalInYear)} فایل
                      </span>
                    </div>

                    {/* رشته‌ها */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "24px",
                      }}
                    >
                      {fields.map((fieldName) => {
                        const fieldInfo = FIELDS.find(
                          (f) => f.value === fieldName
                        );
                        const icon = fieldInfo?.icon || "📚";
                        const items = groupedData[yearNum][fieldName];

                        return (
                          <div key={fieldName}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                marginBottom: "12px",
                                paddingRight: "12px",
                                borderRight: `4px solid ${
                                  fieldInfo?.color || "#0066cc"
                                }`,
                              }}
                            >
                              <span style={{ fontSize: "22px" }}>{icon}</span>
                              <h3
                                style={{
                                  fontSize: "17px",
                                  fontWeight: 700,
                                  color: "#1a1a1a",
                                  margin: 0,
                                }}
                              >
                                {fieldName}
                              </h3>
                              <span
                                style={{
                                  fontSize: "12px",
                                  color: "#999",
                                  background: "#f8f9fa",
                                  padding: "2px 8px",
                                  borderRadius: "100px",
                                }}
                              >
                                {toFa(items.length)}
                              </span>
                            </div>

                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns:
                                  "repeat(auto-fill, minmax(240px, 1fr))",
                                gap: "10px",
                              }}
                            >
                              {items.map((item) => (
                                <Link
                                  key={item.id}
                                  href={`/konkur/${item.slug}`}
                                  style={{
                                    display: "block",
                                    background: "#fff",
                                    padding: "14px",
                                    borderRadius: "10px",
                                    border: "1px solid #e5e5e5",
                                    textDecoration: "none",
                                    transition: "all 0.25s ease",
                                    position: "relative",
                                    overflow: "hidden",
                                  }}
                                >
                                  {/* ─── نوار رنگی ─── */}
                                  <span
                                    style={{
                                      position: "absolute",
                                      top: 0,
                                      right: 0,
                                      bottom: 0,
                                      width: "4px",
                                      background:
                                        fieldInfo?.color || "#0066cc",
                                    }}
                                  />
                                  {item.subtitle && (
                                    <div
                                      style={{
                                        fontSize: "13px",
                                        fontWeight: 700,
                                        color: "#0066cc",
                                        marginBottom: "8px",
                                        lineHeight: 1.6,
                                      }}
                                    >
                                      {item.subtitle}
                                    </div>
                                  )}
                                  {!item.subtitle && (
                                    <div
                                      style={{
                                        fontSize: "13px",
                                        fontWeight: 700,
                                        color: "#1a1a1a",
                                        marginBottom: "8px",
                                        lineHeight: 1.6,
                                      }}
                                    >
                                      {item.title}
                                    </div>
                                  )}

                                  <div
                                    style={{
                                      fontSize: "11px",
                                      color: "#666",
                                      display: "flex",
                                      gap: "8px",
                                      flexWrap: "wrap",
                                    }}
                                  >
                                    {item.questionUrl && (
                                      <span
                                        style={{
                                          background: "#dbeafe",
                                          color: "#1e40af",
                                          padding: "2px 8px",
                                          borderRadius: "6px",
                                          fontWeight: 600,
                                        }}
                                      >
                                        📄 دفترچه
                                      </span>
                                    )}
                                    {item.answerUrl && (
                                      <span
                                        style={{
                                          background: "#d1fae5",
                                          color: "#065f46",
                                          padding: "2px 8px",
                                          borderRadius: "6px",
                                          fontWeight: 600,
                                        }}
                                      >
                                        ✅ کلید
                                      </span>
                                    )}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}