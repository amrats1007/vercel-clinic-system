"use client"

export type Language = "en" | "ar"

export const languages = {
  en: "English",
  ar: "العربية",
}

export const translations = {
  en: {
    // Common
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.view": "View",
    "common.back": "Back",
    "common.next": "Next",
    "common.previous": "Previous",
    "common.submit": "Submit",
    "common.close": "Close",
    "common.confirm": "Confirm",
    "common.yes": "Yes",
    "common.no": "No",

    // Navigation
    "nav.home": "Home",
    "nav.login": "Login",
    "nav.register": "Register",
    "nav.dashboard": "Dashboard",
    "nav.appointments": "Appointments",
    "nav.patients": "Patients",
    "nav.profile": "Profile",
    "nav.settings": "Settings",
    "nav.logout": "Logout",

    // Authentication
    "auth.login.title": "Login to Your Account",
    "auth.login.subtitle": "Enter your credentials to access your account",
    "auth.register.title": "Create Patient Account",
    "auth.register.subtitle": "Register as a new patient",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.confirmPassword": "Confirm Password",
    "auth.forgotPassword": "Forgot Password?",
    "auth.noAccount": "Don't have an account?",
    "auth.hasAccount": "Already have an account?",
    "auth.signUp": "Sign Up",
    "auth.signIn": "Sign In",

    // Registration Form
    "register.form.firstName": "First Name",
    "register.form.lastName": "Last Name",
    "register.form.email": "Email Address",
    "register.form.phone": "Phone Number",
    "register.form.password": "Password",
    "register.form.confirmPassword": "Confirm Password",
    "register.form.dateOfBirth": "Date of Birth",
    "register.form.gender": "Gender",
    "register.form.gender.male": "Male",
    "register.form.gender.female": "Female",
    "register.form.address": "Address",
    "register.form.submit": "Create Account",
    "register.form.submitting": "Creating Account...",
    "register.success": "Account created successfully! Redirecting to login...",

    // Validation
    "validation.required": "This field is required",
    "validation.email": "Please enter a valid email address",
    "validation.password.min": "Password must be at least 8 characters",
    "validation.password.match": "Passwords do not match",

    // Errors
    "error.network": "Network error. Please try again.",
    "error.server": "Server error. Please try again later.",
    "error.unauthorized": "Unauthorized access",
    "error.forbidden": "Access forbidden",
    "error.notFound": "Resource not found",

    // Home Page
    "home.title": "Medical Clinic Management System",
    "home.subtitle": "Comprehensive healthcare management solution",
    "home.patient.title": "Patient Registration",
    "home.patient.description": "New patients can register here to book appointments and access medical services.",
    "home.staff.title": "Staff Access",
    "home.staff.description": "Medical staff and administrators can access their dashboards through the login portal.",
    "home.features.title": "System Features",
    "home.features.appointments": "Appointment Management",
    "home.features.patients": "Patient Records",
    "home.features.billing": "Billing & Invoicing",
    "home.features.reports": "Medical Reports",
  },
  ar: {
    // Common
    "common.loading": "جاري التحميل...",
    "common.error": "حدث خطأ",
    "common.success": "نجح",
    "common.cancel": "إلغاء",
    "common.save": "حفظ",
    "common.delete": "حذف",
    "common.edit": "تعديل",
    "common.view": "عرض",
    "common.back": "رجوع",
    "common.next": "التالي",
    "common.previous": "السابق",
    "common.submit": "إرسال",
    "common.close": "إغلاق",
    "common.confirm": "تأكيد",
    "common.yes": "نعم",
    "common.no": "لا",

    // Navigation
    "nav.home": "الرئيسية",
    "nav.login": "تسجيل الدخول",
    "nav.register": "التسجيل",
    "nav.dashboard": "لوحة التحكم",
    "nav.appointments": "المواعيد",
    "nav.patients": "المرضى",
    "nav.profile": "الملف الشخصي",
    "nav.settings": "الإعدادات",
    "nav.logout": "تسجيل الخروج",

    // Authentication
    "auth.login.title": "تسجيل الدخول إلى حسابك",
    "auth.login.subtitle": "أدخل بياناتك للوصول إلى حسابك",
    "auth.register.title": "إنشاء حساب مريض",
    "auth.register.subtitle": "التسجيل كمريض جديد",
    "auth.email": "البريد الإلكتروني",
    "auth.password": "كلمة المرور",
    "auth.confirmPassword": "تأكيد كلمة المرور",
    "auth.forgotPassword": "نسيت كلمة المرور؟",
    "auth.noAccount": "ليس لديك حساب؟",
    "auth.hasAccount": "لديك حساب بالفعل؟",
    "auth.signUp": "إنشاء حساب",
    "auth.signIn": "تسجيل الدخول",

    // Registration Form
    "register.form.firstName": "الاسم الأول",
    "register.form.lastName": "اسم العائلة",
    "register.form.email": "عنوان البريد الإلكتروني",
    "register.form.phone": "رقم الهاتف",
    "register.form.password": "كلمة المرور",
    "register.form.confirmPassword": "تأكيد كلمة المرور",
    "register.form.dateOfBirth": "تاريخ الميلاد",
    "register.form.gender": "الجنس",
    "register.form.gender.male": "ذكر",
    "register.form.gender.female": "أنثى",
    "register.form.address": "العنوان",
    "register.form.submit": "إنشاء الحساب",
    "register.form.submitting": "جاري إنشاء الحساب...",
    "register.success": "تم إنشاء الحساب بنجاح! جاري التوجيه لتسجيل الدخول...",

    // Validation
    "validation.required": "هذا الحقل مطلوب",
    "validation.email": "يرجى إدخال عنوان بريد إلكتروني صحيح",
    "validation.password.min": "يجب أن تكون كلمة المرور 8 أحرف على الأقل",
    "validation.password.match": "كلمات المرور غير متطابقة",

    // Errors
    "error.network": "خطأ في الشبكة. يرجى المحاولة مرة أخرى.",
    "error.server": "خطأ في الخادم. يرجى المحاولة لاحقاً.",
    "error.unauthorized": "وصول غير مصرح به",
    "error.forbidden": "الوصول محظور",
    "error.notFound": "المورد غير موجود",

    // Home Page
    "home.title": "نظام إدارة العيادات الطبية",
    "home.subtitle": "حل شامل لإدارة الرعاية الصحية",
    "home.patient.title": "تسجيل المرضى",
    "home.patient.description": "يمكن للمرضى الجدد التسجيل هنا لحجز المواعيد والوصول للخدمات الطبية.",
    "home.staff.title": "وصول الموظفين",
    "home.staff.description": "يمكن للطاقم الطبي والإداريين الوصول لوحات التحكم الخاصة بهم من خلال بوابة تسجيل الدخول.",
    "home.features.title": "ميزات النظام",
    "home.features.appointments": "إدارة المواعيد",
    "home.features.patients": "سجلات المرضى",
    "home.features.billing": "الفواتير والمحاسبة",
    "home.features.reports": "التقارير الطبية",
  },
}

let currentLanguage: Language = "en"

export function getTranslation(key: string, language?: Language): string {
  const lang = language || currentLanguage;
  return translations[lang][key] || translations.en[key] || key;
}

export function getCurrentLanguage(): Language {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("language") as Language
    if (stored && ["en", "ar"].includes(stored)) {
      currentLanguage = stored
      return stored
    }

    // Detect browser language
    const browserLang = navigator.language.toLowerCase()
    if (browserLang.startsWith("ar")) {
      currentLanguage = "ar"
      return "ar"
    }
  }

  return currentLanguage
}

export function setCurrentLanguage(language: Language) {
  currentLanguage = language

  if (typeof window !== "undefined") {
    localStorage.setItem("language", language)
    document.documentElement.lang = language
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
  }
}
