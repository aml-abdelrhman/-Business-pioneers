"use client";

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';

// تعريف التنسيقات الخاصة بالملف
// Register fonts for Arabic and English
// Assuming Alexandria font files are in public/fonts/Alexandria
Font.register({
  family: "Alexandria",
  fonts: [
    { src: "/fonts/Alexandria/Alexandria-Regular.ttf", fontWeight: 400 },
    { src: "/fonts/Alexandria/Alexandria-Medium.ttf", fontWeight: 500 },
    { src: "/fonts/Alexandria/Alexandria-Bold.ttf", fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#F8F8F8', // Light grey background
    fontFamily: 'Alexandria',
    color: '#333333',
  },
  title: {
    fontSize: 26,
    marginBottom: 20,
    color: '#D97706', // لون amber-600
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#1e293b',
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
    lineHeight: 1.6,
    color: '#475569', // Changed to a slightly darker grey
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  logo: {
    width: 60,
    height: 60,
    objectFit: 'contain',
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D97706', // Amber-600
    textAlign: 'right', // Default for Arabic, will adjust for English
  },
  profileTitle: {
    fontSize: 18,
    color: '#555555',
    textAlign: 'right', // Default for Arabic
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D97706', // Amber-600
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 5,
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 1.8,
    marginBottom: 10,
    textAlign: 'right', // Default for Arabic
  },
  listItem: {
    fontSize: 12,
    lineHeight: 1.6,
    marginBottom: 5,
    marginLeft: 15,
    textAlign: 'right', // Default for Arabic
  },
  contactInfo: {
    fontSize: 12,
    marginBottom: 5,
    textAlign: 'right', // Default for Arabic
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 10,
    color: '#AAAAAA',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 10,
  },
});

interface CompanyProfilePDFProps {
  locale: "en" | "ar";
}

export const CompanyProfilePDF = ({ locale }: CompanyProfilePDFProps) => {
  const isAr = locale === "ar";

  const content = {
    en: {
      companyFullName: "BUSINESS PIONEERS HOLDING",
      profileLabel: "Official Company Profile",
      aboutUsTitle: "About Us",
      aboutUsText: "Business Pioneers Holding is a leading institution in urban development and real estate investment in Saudi Arabia. We are dedicated to shaping the future by creating exceptional, sustainable, and smart communities that blend rich Saudi heritage with global modernity. Our commitment extends beyond construction; we build landmarks that tell the story of the Kingdom's success and global aspirations, offering our partners well-studied investment opportunities that keep them at the forefront.",
      visionTitle: "Our Vision",
      visionText: "To be the pioneers in developing sustainable urban communities that reflect the Saudi identity and meet future aspirations.",
      missionTitle: "Our Mission",
      missionText: "Providing innovative real estate and engineering solutions that ensure the highest quality standards and achieve added value for our clients.",
      valuesTitle: "Our Core Values",
      valuesList: [
        "Innovation: Embracing cutting-edge technologies and creative designs.",
        "Sustainability: Committed to green building standards and environmental responsibility.",
        "Quality: Delivering projects with precision and excellence.",
        "Integrity: Upholding transparency and ethical practices.",
        "Client Focus: Prioritizing client needs and satisfaction."
      ],
      servicesTitle: "What We Do",
      servicesList: [
        "Urban Planning & Design",
        "Real Estate Development",
        "Project Management",
        "Architectural & Engineering Consulting",
        "Sustainable Solutions Integration"
      ],
      contactTitle: "Contact Us",
      phone: "Phone: 920014659",
      email: "Email: info@bpholding.sa", // Assuming an email
      website: "Website: www.bpholding.sa", // Assuming a website
      address: "Address: Riyadh, Saudi Arabia",
      copyright: "© 2018 - 2024 BUSINESS PIONEERS HOLDING. ALL RIGHTS RESERVED."
    },
    ar: {
      companyFullName: "رواد الأعمال القابضة",
      profileLabel: "ملف الشركة الرسمي",
      aboutUsTitle: "نبذة عن الشركة",
      aboutUsText: "رواد الأعمال القابضة هي مؤسسة رائدة في التطوير العمراني والاستثمار العقاري بالمملكة العربية السعودية. نكرس جهودنا لتشكيل المستقبل من خلال إنشاء مجتمعات استثنائية، مستدامة، وذكية تمزج بين التراث السعودي الغني والحداثة العالمية. يتجاوز التزامنا مجرد البناء؛ فنحن نشيد صروحاً تحكي قصة نجاح المملكة وتطلعاتها العالمية، مقدمين لشركائنا فرصاً استثمارية مدروسة تضعهم دائماً في الصدارة.",
      visionTitle: "رؤيتنا",
      visionText: "أن نكون الرواد في تطوير مجتمعات عمرانية مستدامة تعكس الهوية السعودية وتلبي تطلعات المستقبل.",
      missionTitle: "رسالتنا",
      missionText: "تقديم حلول عقارية وهندسية مبتكرة تضمن أعلى معايير الجودة وتحقق القيمة المضافة لعملائنا.",
      valuesTitle: "قيمنا الجوهرية",
      valuesList: [
        "الابتكار: تبني أحدث التقنيات والتصاميم الإبداعية.",
        "الاستدامة: الالتزام بمعايير الأبنية الخضراء والمسؤولية البيئية.",
        "الجودة: تسليم المشاريع بدقة وتميز.",
        "النزاهة: الالتزام بالشفافية والممارسات الأخلاقية.",
        "التركيز على العميل: إعطاء الأولوية لاحتياجات العميل ورضاه."
      ],
      servicesTitle: "خدماتنا",
      servicesList: [
        "التخطيط والتصميم العمراني",
        "التطوير العقاري",
        "إدارة المشاريع",
        "الاستشارات المعمارية والهندسية",
        "دمج الحلول المستدامة"
      ],
      contactTitle: "تواصل معنا",
      phone: "الهاتف: 920014659",
      email: "البريد الإلكتروني: info@bpholding.sa",
      website: "الموقع الإلكتروني: www.bpholding.sa",
      address: "العنوان: الرياض، المملكة العربية السعودية",
      copyright: "© 2018 - 2024 رواد الأعمال القابضة. جميع الحقوق محفوظة."
    }
  };

  const currentContent = isAr ? content.ar : content.en;

  return (
    <Document>
      <Page size="A4" style={{ ...styles.page, direction: isAr ? 'rtl' : 'ltr' }}>
        {/* Header */}
        <View style={styles.header}>
          <Image src="/images/logo.png" style={styles.logo} />
          <View style={{ flexGrow: 1, marginLeft: isAr ? 0 : 20, marginRight: isAr ? 20 : 0 }}>
            <Text style={{ ...styles.companyName, textAlign: isAr ? 'right' : 'left' }}>{currentContent.companyFullName}</Text>
            <Text style={{ ...styles.profileTitle, textAlign: isAr ? 'right' : 'left' }}>{currentContent.profileLabel}</Text>
          </View>
        </View>

        {/* About Us */}
        <View style={styles.section}>
          <Text style={{ ...styles.sectionTitle, textAlign: isAr ? 'right' : 'left' }}>{currentContent.aboutUsTitle}</Text>
          <Text style={{ ...styles.paragraph, textAlign: isAr ? 'right' : 'left' }}>{currentContent.aboutUsText}</Text>
        </View>

        {/* Vision & Mission */}
        <View style={styles.section}>
          <Text style={{ ...styles.sectionTitle, textAlign: isAr ? 'right' : 'left' }}>{currentContent.visionTitle}</Text>
          <Text style={{ ...styles.paragraph, textAlign: isAr ? 'right' : 'left' }}>{currentContent.visionText}</Text>
        </View>

        <View style={styles.section}>
          <Text style={{ ...styles.sectionTitle, textAlign: isAr ? 'right' : 'left' }}>{currentContent.missionTitle}</Text>
          <Text style={{ ...styles.paragraph, textAlign: isAr ? 'right' : 'left' }}>{currentContent.missionText}</Text>
        </View>

        {/* Core Values */}
        <View style={styles.section}>
          <Text style={{ ...styles.sectionTitle, textAlign: isAr ? 'right' : 'left' }}>{currentContent.valuesTitle}</Text>
          {currentContent.valuesList.map((item, index) => (
            <Text key={index} style={{ ...styles.listItem, textAlign: isAr ? 'right' : 'left' }}>• {item}</Text>
          ))}
        </View>

        {/* Services */}
        <View style={styles.section}>
          <Text style={{ ...styles.sectionTitle, textAlign: isAr ? 'right' : 'left' }}>{currentContent.servicesTitle}</Text>
          {currentContent.servicesList.map((item, index) => (
            <Text key={index} style={{ ...styles.listItem, textAlign: isAr ? 'right' : 'left' }}>• {item}</Text>
          ))}
        </View>

        {/* Contact Us */}
        <View style={styles.section}>
          <Text style={{ ...styles.sectionTitle, textAlign: isAr ? 'right' : 'left' }}>{currentContent.contactTitle}</Text>
          <Text style={{ ...styles.contactInfo, textAlign: isAr ? 'right' : 'left' }}>{currentContent.phone}</Text>
          <Text style={{ ...styles.contactInfo, textAlign: isAr ? 'right' : 'left' }}>{currentContent.email}</Text>
          <Text style={{ ...styles.contactInfo, textAlign: isAr ? 'right' : 'left' }}>{currentContent.website}</Text>
          <Text style={{ ...styles.contactInfo, textAlign: isAr ? 'right' : 'left' }}>{currentContent.address}</Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer} fixed>
          {currentContent.copyright}
        </Text>
      </Page>
    </Document>
  );
};