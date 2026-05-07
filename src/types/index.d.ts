// types.ts

export type TranslatedText = {
  en: string;
  ar: string;
};

export type WeeklyActivity = {
  day: string;
  hours: number;
};

export interface EnrollmentRequest {
  id: string;
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string | TranslatedText;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
}


export interface MyCourseItem {
  id: string;
  title: string;
  url: string;
  type: "video" | "pdf"; 
  duration?: string;      
  
}

export interface IProfessionalLMS {
  id: string;
  title: TranslatedText;
  description?: TranslatedText;
  subject: TranslatedText;
  category: TranslatedText;
  price: number;
  image: string;
  videoUrl?: string;
  duration: string | TranslatedText; // مرونة أكبر للباك إيند
  level: TranslatedText;
  createdAt: number;
  teacher: TranslatedText;
  teacherImage?: string;
  rating: number;
  isNew?: boolean;
  isTrending?: boolean;
  isPopular?: boolean;
  enrollments?: string[];
  teacherId ?: string;
  lessons ?: any[];
progress: number; // جعلناها إجبارية لأنها موجودة في داتا الباكيند للطالب  
  curriculum ?: any[];
}

// types.ts

// ====== نوع الكورس ======
export type Course = {
  id: string;
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  subject: {
    en: string;
    ar: string;
  };
  category: {
    en: string;
    ar: string;
  };
  price: number;
  image: string;
  videoUrl: string;
  duration: string | TranslatedText; // توحيد الأنواع
  level: {
    en: string;
    ar: string;
  };
  teacher: {
    en: string;
    ar: string;
  } | string;
  teacherImage?: string;
  createdAt: number;
  rating: number;
  isNew?: boolean;
  isTrending?: boolean;
  isPopular?: boolean;
  progress?: number;
  teacherId?: string;
  curriculum?: any[];
  lessons?: any[];
  enrolledStudents?: string[];
};

// ====== نوع اليوزر ======
  export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: "student" | "teacher" | "admin";
  enrolledCourses: Course[];
  enrollmentRequests?: EnrollmentRequest[];
  // الحقول الخاصة بالطالب (إجبارية لتجنب خطأ undefined)
  totalLearningHours: number; 
  certificates: string[];
  streak: number;
  averageGrade: number;
  weeklyActivity: WeeklyActivity[];
lessons ?: any[];
  // الحقول الخاصة بالمعلم والآدمن (اختيارية)
myCourses?: MyCourseItem[];
  image?: string;
  bio?: string;
  token?: string;
  
  stats?: {
    totalStudents: number;
    totalCourses: number;
    totalRevenue: number;
    avgRating?: string;
    growth?: {
      overall: string;
      revenue: string;
      students: string;
    };
    revenueChart?: { name: string; rev: number }[];
  };

  platformStats?: {
    totalUsers: number;
    totalStudents: number;
    totalTeachers: number;
    totalCourses: number;
    totalRevenue: number;
    monthlyGrowth: string;
  };
  
  settings?: any;
  recentActivities?: string[];

};
// types/project.ts
export interface Project {
  id: string;
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  location: { lat: number; lng: number; address: string };
  stats: {
    area: string;
    units: string;
    floors: string;
  };
  images: string[];
  features: { ar: string[]; en: string[] };
}