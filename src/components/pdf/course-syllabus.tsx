"use client";

import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { Course } from "@/types";
import moment from "moment";

// تسجيل الخطوط لدعم اللغة العربية
Font.register({
  family: "Alexandria",
  fonts: [
    { src: "/fonts/Alexandria/Alexandria-Regular.ttf", fontWeight: 400 },
    { src: "/fonts/Alexandria/Alexandria-Medium.ttf", fontWeight: 500 },
    { src: "/fonts/Alexandria/Alexandria-Bold.ttf", fontWeight: 700 },
  ],
});

interface CourseSyllabusPDFProps {
  course: Course;
  locale: "en" | "ar";
}

// ===============================
// 🔥 SAFE LOCALIZATION HELPER
// ===============================
const getLocalized = (
  value: string | { en: string; ar: string } | undefined,
  locale: "en" | "ar"
) => {
  if (!value) return "---";
  if (typeof value === "string") return value;
  return value?.[locale] ?? "---";
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#FFFFFF",
    fontFamily: "Alexandria",
  },
  header: {
    backgroundColor: "#7c3aed",
    padding: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    borderRadius: 8,
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
  },
  logo: {
    width: 50,
  },
  metaInfo: {
    marginBottom: 25,
  },
  metaText: {
    fontSize: 10,
    color: "#64748b",
    marginBottom: 6,
  },
  metaTextRTL: {
    fontSize: 10,
    color: "#64748b",
    marginBottom: 6,
    textAlign: "right",
  },
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 30,
    borderRadius: 4,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tableRowReverse: {
    flexDirection: "row-reverse",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tableCellLabel: {
    width: "35%",
    backgroundColor: "#f8fafc",
    padding: 12,
    fontSize: 11,
    fontWeight: "bold",
    color: "#1e293b",
    borderRightWidth: 1,
    borderRightColor: "#e2e8f0",
  },
  tableCellLabelRTL: {
    width: "35%",
    backgroundColor: "#f8fafc",
    padding: 12,
    fontSize: 11,
    fontWeight: "bold",
    color: "#1e293b",
    borderLeftWidth: 1,
    borderLeftColor: "#e2e8f0",
    textAlign: "right",
  },
  tableCellValue: {
    width: "65%",
    padding: 12,
    fontSize: 11,
    color: "#334155",
  },
  tableCellValueRTL: {
    width: "65%",
    padding: 12,
    fontSize: 11,
    color: "#334155",
    textAlign: "right",
  },
  infoSection: {
    backgroundColor: "#f5f3ff",
    padding: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#7c3aed",
  },
  infoTitleRTL: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#7c3aed",
    textAlign: "right",
  },
  descriptionText: {
    fontSize: 10,
    color: "#475569",
    lineHeight: 1.6,
  },
  descriptionTextRTL: {
    fontSize: 10,
    color: "#475569",
    lineHeight: 1.6,
    textAlign: "right",
  },
});

const CourseSyllabusPDF = ({ course, locale }: CourseSyllabusPDFProps) => {
  const isRtl = locale === "ar";
  const date = moment().format("YYYY/MM/DD");

  const t = {
    en: {
      title: "Course Syllabus",
      generatedOn: "Date:",
      courseName: "Course Name",
      instructor: "Instructor",
      level: "Level",
      duration: "Duration",
      price: "Course Fee",
      overview: "Course Overview",
      includes: "Course Includes",
      includesText:
        "• Lifetime access to materials\n• Professional Certificate upon completion\n• Real-world projects and assignments\n• 24/7 Student Support Community",
      currency: "USD",
    },
    ar: {
      title: "منهج الدورة التدريبية",
      generatedOn: "تاريخ الإصدار:",
      courseName: "اسم الدورة",
      instructor: "المحاضر",
      level: "المستوى",
      duration: "المدة",
      price: "رسوم الدورة",
      overview: "نظرة عامة",
      includes: "مزايا الدورة",
      includesText:
        "• وصول مدى الحياة للمحتوى\n• شهادة إتمام معتمدة\n• مشاريع تطبيقية عملية\n• دعم فني ومجتمع تعليمي متكامل",
      currency: "دولار",
    },
  }[locale];

  const Row = ({
    label,
    value,
  }: {
    label: string;
    value: string | number;
  }) => (
    <View style={isRtl ? styles.tableRowReverse : styles.tableRow}>
      <Text style={isRtl ? styles.tableCellLabelRTL : styles.tableCellLabel}>
        {label}
      </Text>
      <Text style={isRtl ? styles.tableCellValueRTL : styles.tableCellValue}>
        {value || "---"}
      </Text>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View
          style={{
            ...styles.header,
            flexDirection: isRtl ? "row-reverse" : "row",
          }}
        >
          <Text style={styles.headerText}>{t.title}</Text>
          <Image src="/logo.png" style={styles.logo} />
        </View>

        {/* Meta */}
        <View style={styles.metaInfo}>
          <Text style={isRtl ? styles.metaTextRTL : styles.metaText}>
            {t.generatedOn} {date}
          </Text>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <Row
            label={t.courseName}
            value={getLocalized(course.title, locale)}
          />
          <Row
            label={t.instructor}
            value={getLocalized(course.teacher, locale)}
          />
          <Row label={t.level} value={getLocalized(course.level, locale)} />
          <Row
            label={t.duration}
            value={getLocalized(course.duration, locale)}
          />
          <Row label={t.price} value={`${course.price} ${t.currency}`} />
        </View>

        {/* Overview */}
        <View style={{ marginBottom: 20 }}>
          <Text style={isRtl ? styles.infoTitleRTL : styles.infoTitle}>
            {t.overview}
          </Text>

          <Text
            style={
              isRtl
                ? styles.descriptionTextRTL
                : styles.descriptionText
            }
          >
            {getLocalized(course.description, locale)}
          </Text>
        </View>

        {/* Includes */}
        <View style={styles.infoSection}>
          <Text style={isRtl ? styles.infoTitleRTL : styles.infoTitle}>
            {t.includes}
          </Text>

          <Text
            style={
              isRtl
                ? styles.descriptionTextRTL
                : styles.descriptionText
            }
          >
            {t.includesText}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default CourseSyllabusPDF;