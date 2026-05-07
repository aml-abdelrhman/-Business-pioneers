import { IProfessionalLMS, User, Course, EnrollmentRequest } from "@/types";
import apiClient from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";


// 1. الدوال العامة والمشتركة (General & Shared)
// تخدم جميع الزوار والمستخدمين (عرض الكورسات، التصنيفات، إلخ)

// جلب كل الكورسات
export const getCourses = async (): Promise<IProfessionalLMS[]> => {
  try {
    const response = await apiClient.get<IProfessionalLMS[]>("/courses");
    return response;
  } catch (error: any) {
    console.error("Error fetching courses:", error);
    throw new Error(error?.message || "Failed to fetch courses");
  }
};

export const coursesQueryOptions = () => ({
  queryKey: ["courses"],
  queryFn: getCourses,
});

// جلب كورس واحد بالتفصيل عبر الـ ID
export const getCourseById = async (id: string): Promise<IProfessionalLMS> => {
  try {
    const response = await apiClient.get<IProfessionalLMS>(`/courses/${id}`);
    return response;
  } catch (error: any) {
    console.error(`Error fetching course with id ${id}:`, error);
    throw new Error(error?.message || "Failed to fetch course");
  }
};

export const courseQueryOptions = (id: string) => ({
  queryKey: ["course", id],
  queryFn: () => getCourseById(id),
});

// جلب الكورسات المميزة (Trending) للهوم بيج
export const getTrendingCourses = async (): Promise<IProfessionalLMS[]> => {
  try {
    const response = await apiClient.get<IProfessionalLMS[]>(
      "/courses?isTrending=true",
    );
    return response;
  } catch (error: any) {
    throw new Error(error?.message || "Failed to fetch trending courses");
  }
};

export const trendingCoursesQueryOptions = () => ({
  queryKey: ["courses", "trending"],
  queryFn: getTrendingCourses,
});

// جلب كورسات بناءً على التصنيف (Category)
export const getCoursesByCategory = async (
  category: string,
): Promise<IProfessionalLMS[]> => {
  try {
    const response = await apiClient.get<IProfessionalLMS[]>(
      `/courses?category.en=${category}`,
    );
    return response;
  } catch (error: any) {
    throw new Error(error?.message || "Failed to fetch category courses");
  }
};

export const categoryCoursesQueryOptions = (category: string) => ({
  queryKey: ["courses", "category", category],
  queryFn: () => getCoursesByCategory(category),
  enabled: !!category,
});


export const addCourse = async (courseData: Partial<IProfessionalLMS>): Promise<IProfessionalLMS> => {
  try {
    const response = await apiClient.post<IProfessionalLMS>(`/courses`, courseData);
    return response;
  } catch (error: any) {
    console.error("Error adding new course:", error);
    throw new Error(error?.message || "Failed to add course");
  }
};

export const useAddCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newCourse: Partial<IProfessionalLMS>) => addCourse(newCourse),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      
      console.log("Course added successfully!");
    },
    onError: (error: any) => {
      console.error("Mutation Error:", error.message);
    }
  });
};


// جلب بيانات مستخدم واحد بالـ ID
export const getUserById = async (id: string): Promise<User> => {
  try {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response;
  } catch (error: any) {
    console.error(`Error fetching user with id ${id}:`, error);
    throw new Error(error?.message || "Failed to fetch user");
  }
};

// خيارات الاستعلام لبيانات المستخدم
export const userQueryOptions = (id: string | undefined) => ({
  queryKey: ["user", id],
  queryFn: () => getUserById(id!),
  enabled: !!id,
});

// ============================================================
// 2. وظائف الطالب (Student Actions)
// تشمل الاشتراك، تحديث الملف الشخصي، ومتابعة الإنجاز
// ============================================================

// تسجيل مستخدم جديد في المنصة
export const registerUser = async (userData: Partial<User>): Promise<User> => {
  const users = await apiClient.get<User[]>("/users");
  if (users.find((u) => u.email === userData.email)) {
    throw new Error("Email already registered. Please login instead.");
  }

  const newUser = {
    ...userData,
    id: Math.random().toString(36).substring(2, 9),
    role: "student", 
    enrolledCourses: [],
    myCourses: [],
    totalLearningHours: 0,
    certificates: [],
    streak: 0, 
    averageGrade: 0,
    progress: 0,
    
    weeklyActivity: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"].map(
      (day) => ({ day, hours: 0 }),
    ),
    token: `token_${Math.random().toString(36).substring(7)}`,
  };

  return await apiClient.post<User>("/users", newUser);
};

// طلب الاشتراك في كورس (إضافة الكورس لقائمة الطالب)
export const enrollCourse = async (
  userId: string,
  course: Course,
): Promise<any> => {
  const user = await apiClient.get<User>(`/users/${userId}`);

  const isAlreadyEnrolled = user.enrolledCourses?.some(
    (c) => c.id === course.id,
  );
  if (isAlreadyEnrolled) return user;

  const enrollmentData = {
    ...course,
    progress: 0,
    enrolledAt: new Date().toISOString(),
    lastAccessed: new Date().toISOString(),
    status: "active",
  };

  const updatedUser = {
    ...user,
    enrolledCourses: [...(user.enrolledCourses || []), enrollmentData],
  };

  return await apiClient.put<User>(`/users/${userId}`, updatedUser);
};

export const enrollCourseMutationOptions = () => ({
  mutationKey: ["enrollCourse"],
  mutationFn: ({ userId, course }: { userId: string; course: Course }) =>
    enrollCourse(userId, course),
});

// جلب طلبات الالتحاق المعلقة لمستخدم وكورس معين
export const getPendingRequests = async (userId: string, courseId: string) => {
  try {
    const response = await apiClient.get<any[]>(
      `/enrollmentRequests?userId=${userId}&courseId=${courseId}&status=pending`,
    );
    return response || [];
  } catch (error: any) {
    return []; 
  }
};

export const pendingRequestQueryOptions = (
  userId: string | undefined,
  courseId: string | undefined,
) => ({
  queryKey: ["pendingRequest", userId, courseId],
  queryFn: () => getPendingRequests(userId!, courseId!),
  enabled: !!userId && !!courseId,
});

// تحديث نسبة الإنجاز في كورس معين للطالب
export const updateCourseProgress = async (
  userId: string,
  courseId: string,
  progress: number,
  additionalHours: number,
): Promise<User> => {
  const user = await apiClient.get<User>(`/users/${userId}`);

  let newlyEarnedCertificate = null;
  const updatedCourses = user.enrolledCourses?.map((c) => {
    if (c.id === courseId) {
      const currentProgress = c.progress ?? 0;

      return { ...c, progress: Math.max(currentProgress, progress) };
    }
    return c;
  });

  // 2. تحديث النشاط الأسبوعي
  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: "short",
  });
  const updatedWeeklyActivity = user.weeklyActivity.map((dayActivity) =>
    dayActivity.day === currentDay
      ? { ...dayActivity, hours: dayActivity.hours + additionalHours }
      : dayActivity,
  );

  // 3. منطق تحديث الـ Streak (لو ذاكر اليوم نزود الـ Streak)
  const updatedStreak =
    additionalHours > 0 ? (user.streak || 0) + 1 : user.streak;

  // 4. تجميع البيانات النهائية
  const finalUpdate: Partial<User> = {
    ...user,
    enrolledCourses: updatedCourses,
    weeklyActivity: updatedWeeklyActivity,
    totalLearningHours: user.totalLearningHours + additionalHours,
    streak: updatedStreak,
  };

  // إذا حصل على شهادة جديدة، نضيفها للمصفوفة
  if (newlyEarnedCertificate) {
    finalUpdate.certificates = [
      ...(user.certificates || []),
      newlyEarnedCertificate,
    ];
  }

  return await apiClient.put<User>(`/users/${userId}`, finalUpdate);
};

// جلب كل طلبات الالتحاق المعلقة للآدمن
export const getEnrollmentRequests = async () => {
  return await apiClient.get<any[]>("/enrollmentRequests?status=pending");
};

// الموافقة على طلب التحاق
export const approveEnrollment = async (requestId: string) => {
  const request = await apiClient.get<any>(`/enrollmentRequests/${requestId}`);
  const { userId, courseData } = request;

  // 1. جلب بيانات المستخدم
  const user = await apiClient.get<User>(`/users/${userId}`);

  // 2. تجهيز بيانات الكورس لتثبيت الاشتراك عند الطالب
  const enrollmentData = {
    ...courseData,
    progress: 0,
    enrolledAt: new Date().toISOString(),
    lastAccessed: new Date().toISOString(),
    status: "active",
  };

  // 3. تحديث مصفوفة الكورسات عند الطالب
  const updatedUser = {
    ...user,
    enrolledCourses: [...(user.enrolledCourses || []), enrollmentData],
  };

  // 4. تنفيذ التحديث وحذف الطلب أو تحديث حالته
  await Promise.all([
    apiClient.put(`/users/${userId}`, updatedUser),
    apiClient.patch(`/enrollmentRequests/${requestId}`, { status: "approved" }),
  ]);

  return updatedUser;
};

// رفض طلب التحاق
export const rejectEnrollment = async (requestId: string) => {
  return await apiClient.patch(`/enrollmentRequests/${requestId}`, {
    status: "rejected",
  });
};

// خيارات استعلام طلبات الالتحاق للآدمن
export const enrollmentRequestsQueryOptions = () => ({
  queryKey: ["admin", "enrollmentRequests"],
  queryFn: getEnrollmentRequests,
});

// خيارات الموافقة/الرفض
export const enrollmentActionMutationOptions = () => ({
  mutationKey: ["admin", "enrollmentAction"],
  mutationFn: ({
    requestId,
    action,
  }: {
    requestId: string;
    action: "approve" | "reject";
  }) =>
    action === "approve"
      ? approveEnrollment(requestId)
      : rejectEnrollment(requestId),
});

export const updateProgressMutationOptions = () => ({
  mutationKey: ["updateProgress"],
  mutationFn: (params: {
    userId: string;
    courseId: string;
    progress: number;
    additionalHours: number;
  }) =>
    updateCourseProgress(
      params.userId,
      params.courseId,
      params.progress,
      params.additionalHours,
    ),
});

// تحديث بيانات الملف الشخصي (الاسم، الصورة، إلخ)
export const updateProfile = async (
  userId: string,
  data: Partial<User>,
): Promise<User> => {
  const response = await apiClient.patch<User>(`/users/${userId}`, data);
  return response;
};

export const updateProfileMutationOptions = (userId: string) => ({
  mutationKey: ["updateProfile", userId],
  mutationFn: (data: Partial<User>) => updateProfile(userId, data),
});

// ============================================================
// 3. وظائف المدرس (Teacher Actions)
// ============================================================

export const createCourse = async (
  courseData: Partial<IProfessionalLMS>,
): Promise<IProfessionalLMS> => {
  return await apiClient.post<IProfessionalLMS>("/courses", courseData);
};

export const updateCourse = async (
  id: string,
  data: Partial<IProfessionalLMS>,
): Promise<IProfessionalLMS> => {
  return await apiClient.put<IProfessionalLMS>(`/courses/${id}`, data);
};

export const deleteCourse = async (id: string): Promise<void> => {
  await apiClient.delete(`/courses/${id}`);
};

// ============================================================
// 2. وظائف المدرس (Teacher Specific Actions)
// مركزة على تحديث بيانات المدرس (My Courses & Stats)
// ============================================================

/**
 * جلب إحصائيات المدرس مباشرة من بيانات المستخدم
 */
export const getTeacherStats = async (teacherId: string) => {
  const user = await apiClient.get<User>(`/users/${teacherId}`);
  return user.stats;
};

/**
 * جلب كورسات المدرس من مصفوفته الخاصة
  */
export const getTeacherCourses = async (
  teacherId: string,
): Promise<any[]> => {
  const user = await apiClient.get<User>(`/users/${teacherId}`);
  return user.myCourses || [];
};


  // إنشاء كورس جديد للمدرس
export const addCourseToTeacher = async (
  teacherId: string,
  newCourse: any // يفضل تستخدمي Interface Lesson هنا
): Promise<any[]> => {
  if (!teacherId) {
    toast.error("User ID is missing!");
    throw new Error("User ID is missing");
  }

  try {
    // 1. جلب بيانات المدرس الحالية أولاً
    const response = await apiClient.get<User>(`/users/${teacherId}`);
    const currentCourses = response.myCourses || [];

    // 2. تجهيز القائمة الجديدة (القديم + الجديد)
    const updatedCourses = [...currentCourses, { ...newCourse, id: Date.now().toString() }];

    // 3. تحديث المدرس في الباك إيند
    const patchResponse = await apiClient.patch<User>(`/users/${teacherId}`, {
      myCourses: updatedCourses
    });

    return patchResponse.myCourses || [];
  } catch (error: any) {
    console.error("Error updating teacher courses:", error);
    throw new Error(error?.message || "Failed to update courses");
  }
};


export const createTeacherCourse = async (
  teacherId: string,
  courseData: Partial<Course>,
) => {
  const user = await apiClient.get<User>(`/users/${teacherId}`);
  const newCourse = {
    ...courseData,
    id: `c${Date.now()}`,
    teacherId,
    enrolledStudents: [],
    rating: 5,
    createdAt: Date.now(),
  };

  // تحديث المدرس (المصفوفة + الإحصائيات)
  await apiClient.patch(`/users/${teacherId}`, {
    myCourses: [...(user.myCourses || []), newCourse],
    stats: { ...user.stats, totalCourses: (user.stats?.totalCourses || 0) + 1 },
  });

  // إضافة للجدول العام
  return await createCourse(newCourse as IProfessionalLMS);
};


/**
 * تحديث المنهج (الأقسام والدروس) للمدرس بناءً على داتا الباك إيند
 */
export const updateCourseCurriculum = async (
  teacherId: string,
  courseId: string,
  sections: any[],
) => {
  // 1. جلب بيانات المدرس الحالية
  const user = await apiClient.get<User>(`/users/${teacherId}`);

  // 2. تحديث الكورس المطلوب داخل مصفوفة المدرس
  const updatedMyCourses = user.myCourses?.map((c) => {
    if (c.id === courseId) {
      return {
        ...c,
        curriculum: sections, 
      };
    }
    return c;
  });

  // 3. التحديث المزدوج (المدرس + جدول الكورسات العام)
  try {
    const [teacherUpdate, generalUpdate] = await Promise.all([
      apiClient.patch(`/users/${teacherId}`, { myCourses: updatedMyCourses }),
      apiClient.patch(`/courses/${courseId}`, { curriculum: sections }),
    ]);

    return generalUpdate;
  } catch (error) {
    console.error("Error updating curriculum:", error);
    throw error;
  }
};
/**
 * حذف كورس خاص بالمدرس

/**
 * جلب الطلاب المسجلين في كورسات المدرس فقط
 */
export const getTeacherStudents = async (
  teacherId: string,
): Promise<User[]> => {
  const allStudents = await apiClient.get<User[]>("/users?role=student");
  return allStudents.filter((student) =>
    student.enrolledCourses?.some((course) => course.teacherId === teacherId),
  );
};

// ============================================================
// 3. خيارات الاستعلام (React Query Options)
// ============================================================

export const teacherQueryOptions = {
  stats: (id: string) => ({
    queryKey: ["teacher", "stats", id],
    queryFn: () => getTeacherStats(id),
    enabled: !!id,
  }),
  courses: (id: string) => ({
    queryKey: ["teacher", "courses", id],
    queryFn: () => getTeacherCourses(id),
    enabled: !!id,
  }),
  students: (id: string) => ({
    queryKey: ["teacher", "students", id],
    queryFn: () => getTeacherStudents(id),
    enabled: !!id,
  }),
};

// تصدير الخيارات كدوال منفصلة لتتوافق مع استيرادات صفحة المدرس
export const teacherStatsQueryOptions = (id: string) =>
  teacherQueryOptions.stats(id);
export const teacherCoursesQueryOptions = (id: string) =>
  teacherQueryOptions.courses(id);
export const teacherStudentsQueryOptions = (id: string) =>
  teacherQueryOptions.students(id);

export const courseMutationOptions = {
  create: (teacherId: string) => ({
    mutationKey: ["createCourse", teacherId],
    mutationFn: (data: Partial<Course>) => createTeacherCourse(teacherId, data),
  }),
  update: (id: string) => ({
    mutationKey: ["updateCourse", id],
    mutationFn: (data: Partial<IProfessionalLMS>) => updateCourse(id, data),
  }),
  delete: (teacherId: string) => ({
    mutationKey: ["deleteCourse"],
    mutationFn: (courseId: string) => teacherDeleteCourse(teacherId, courseId),
  }),
};

// ============================================================
// 4. وظائف الآدمن (Admin Actions)
// التحكم الكامل في المستخدمين، الأدوار، وإحصائيات المنصة الشاملة
// ============================================================

// جلب إحصائيات المنصة (عدد الطلاب، المدرسين، الكورسات، والأرباح)
export const getPlatformStats = async () => {
  const [users, courses] = await Promise.all([
    apiClient.get<User[]>("/users"),
    apiClient.get<IProfessionalLMS[]>("/courses"),
  ]);

  return {
    totalStudents: users.filter((u) => u.role === "student").length,
    totalTeachers: users.filter((u) => u.role === "teacher").length,
    totalCourses: courses.length,
    totalRevenue: courses.reduce(
      (acc, curr) => acc + (Number(curr.price) || 0),
      0,
    ),
  };
};

export const statsQueryOptions = () => ({
  queryKey: ["admin", "stats"],
  queryFn: getPlatformStats,
});

// جلب قائمة بكل المستخدمين المسجلين للإدارة
export const getAllUsers = async (): Promise<User[]> => {
  return await apiClient.get<User[]>("/users");
};

export const allUsersQueryOptions = () => ({
  queryKey: ["admin", "users"],
  queryFn: getAllUsers,
});

// تحديث دالة تغيير الرتبة لضمان عملها
export const changeUserRole = async (userId: string, newRole: string) => {
  // هنا بنبعت كائن فيه حقل اسمه role عشان ده اللي الباك إيند مستنيه
  const response = await apiClient.patch(`/users/${userId}`, { role: newRole });
  return response;
};

export const changeUserRoleMutationOptions = () => ({
  mutationKey: ["admin", "changeUserRole"],
  mutationFn: (params: { userId: string; newRole: string }) =>
    changeUserRole(params.userId, params.newRole),
});

// حذف المستخدم نهائياً من النظام
export const deleteUser = async (userId: string): Promise<void> => {
  await apiClient.delete(`/users/${userId}`);
};

export const deleteUserMutationOptions = () => ({
  mutationKey: ["admin", "deleteUser"],
  mutationFn: (userId: string) => deleteUser(userId),
});

export const getPlatformSettings = async () => {
  const response = await apiClient.get("/admin/settings");
  // هنا بنفك الداتا مرتين لو الباك بيبعت { data: { ...settings } }
  const data = (response as any)?.data || response;
  return data?.data || data;
};

export const updatePlatformSettings = async (settings: any) => {
  const response = await apiClient.patch("/admin/settings", settings);
  const data = (response as any)?.data || response;
  return data?.data || data;
};

export const getFinancialTransactions = async () => {
  const response = await apiClient.get("/admin/finances/transactions");
  const data = (response as any)?.data || response;
  return data?.data || data;
};

/**
 * تحديث كورس خاص بالمدرس (تحديث مزدوج)
 */
export const teacherUpdateCourse = async (
  teacherId: string,
  courseId: string,
  data: Partial<Course>,
) => {
  // 1. جلب بيانات المدرس الحالية
  const user = await apiClient.get<User>(`/users/${teacherId}`);

  // 2. تحديث الكورس داخل مصفوفة المدرس
  const updatedMyCourses = user.myCourses?.map((c) =>
    c.id === courseId ? { ...c, ...data } : c,
  );

  // 3. التحديث المتوازي في الجدول العام وبروفايل المدرس
  const [updatedCourseResponse] = await Promise.all([
    apiClient.patch<Course>(`/courses/${courseId}`, data),
    apiClient.patch(`/users/${teacherId}`, { myCourses: updatedMyCourses }),
  ]);

  return updatedCourseResponse;
};

/**
 * حذف كورس خاص بالمدرس نهائياً
 */
export const teacherDeleteCourse = async (
  teacherId: string,
  courseId: string,
) => {
  // 1. جلب بيانات المدرس لتحديث مصفوفته وإحصائياته
  const user = await apiClient.get<User>(`/users/${teacherId}`);

  // 2. فلترة المصفوفة لحذف الكورس
  const filteredCourses = user.myCourses?.filter((c) => c.id !== courseId);

  // 3. تحديث بروفايل المدرس (حذف الكورس + تقليل العداد)
  await apiClient.patch(`/users/${teacherId}`, {
    myCourses: filteredCourses,
    stats: {
      ...user.stats,
      totalCourses: Math.max(0, (user.stats?.totalCourses || 0) - 1),
    },
  });

  // 4. الحذف من الجدول العام للكورسات
  return await apiClient.delete(`/courses/${courseId}`);
};


// ============================================================
// دالة جلب كل المدرسين (Get All Teachers)
// ============================================================

export const getTeachers = async (): Promise<User[]> => {
  try {
    // جلب المستخدمين الذين يمتلكون رتبة مدرس فقط
    const response = await apiClient.get<User[]>("/users?role=teacher");
    return response;
  } catch (error: any) {
    console.error("Error fetching teachers:", error);
    throw new Error(error?.message || "Failed to fetch teachers");
  }
};

// خيارات الكويري لاستخدامها في صفحة المدرسين
export const teachersQueryOptions = () => ({
  queryKey: ["teachers"],
  queryFn: getTeachers,
});


 
export const addLessonToUserCourse = async (
  teacherId: string,
  courseId: string,
  sectionTitle: string,
  newLesson: any
) => {
  try {
    // 1. جلب بيانات المدرس
    const userData = await apiClient.get<User>(`/users/${teacherId}`);

    // 2. تحديث المنهج محلياً داخل مصفوفة المدرس
    let updatedCurriculum: any[] = [];
    
    const updatedMyCourses = userData.myCourses?.map((course: any) => {
      if (course.id === courseId) {
        const newCurriculum = course.curriculum.map((section: any) => {
          if (section.sectionTitle === sectionTitle) {
            return {
              ...section,
              lessons: [...(section.lessons || []), newLesson]
            };
          }
          return section;
        });
        
        // حفظ النسخة المحدثة للمنهج لاستخدامها في التحديث العام
        updatedCurriculum = newCurriculum;
        
        return { ...course, curriculum: newCurriculum };
      }
      return course;
    });

    // 3. التحديث المزدوج (PATCH للمدرس و PATCH لجدول الكورسات)
    const [teacherResponse] = await Promise.all([
      apiClient.patch(`/users/${teacherId}`, { myCourses: updatedMyCourses }),
      apiClient.patch(`/courses/${courseId}`, { curriculum: updatedCurriculum })
    ]);

    return teacherResponse;
  } catch (error: any) {
    console.error("Failed to add lesson:", error);
    throw new Error(error?.message || "Failed to add lesson to course");
  }
};

/**
 * خيارات Mutation لإضافة درس
 */
export const addLessonMutationOptions = (queryClient: any) => ({
  mutationKey: ["teacher", "addLesson"],
  mutationFn: (params: {
    teacherId: string;
    courseId: string;
    sectionTitle: string;
    newLesson: any;
  }) =>
    addLessonToUserCourse(
      params.teacherId,
      params.courseId,
      params.sectionTitle,
      params.newLesson
    ),
  onSuccess: (_data: any, variables: any) => {
    // تحديث البيانات المتعلقة بالمدرس رقم 2 (أو أي ID ممرر)
    queryClient.invalidateQueries({ queryKey: ["user", variables.teacherId] });
    queryClient.invalidateQueries({ queryKey: ["teacher", "courses", variables.teacherId] });
    
    // إبطال كاش الكورس المحدد أيضاً لأنه تم تحديث جدول الكورسات العام
    queryClient.invalidateQueries({ queryKey: ["course", variables.courseId] });
  },
});