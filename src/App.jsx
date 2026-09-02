import { useState, useEffect, useMemo, useCallback } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import {
  GraduationCap,
  LayoutDashboard,
  List,
  History as HistoryIcon,
  Search,
  Users,
  BarChart3,
  BookOpen,
  UserCog,
  ScrollText,
  Sun,
  Moon,
  Download,
  Printer,
  Check,
  CheckCircle2,
  AlertCircle,
  User,
  Lock,
  KeyRound,
  HelpCircle,
  ChevronRight,
  X,
  Eye,
  PanelLeft,
  Menu,
  LogOut,
  ArrowLeft,
  FileText,
  Settings
} from 'lucide-react';

const CATEGORY_THEME = {
  'gen-ed': {
    nameTh: 'หมวดวิชาศึกษาทั่วไป',
    nameEn: 'General Education',
    shortTh: 'ศึกษาทั่วไป',
    shortEn: 'Gen-Ed',
    color: '#16A34A',
    bgLight: 'rgba(22, 163, 74, 0.12)',
    border: 'rgba(22, 163, 74, 0.28)'
  },
  'core-req': {
    nameTh: 'หมวดวิชาเฉพาะบังคับ',
    nameEn: 'Major Required',
    shortTh: 'เฉพาะบังคับ',
    shortEn: 'Core Req',
    color: '#2563EB',
    bgLight: 'rgba(37, 99, 235, 0.12)',
    border: 'rgba(37, 99, 235, 0.28)'
  },
  'core-elec': {
    nameTh: 'หมวดวิชาเฉพาะเลือก',
    nameEn: 'Major Elective',
    shortTh: 'เฉพาะเลือก',
    shortEn: 'Elective',
    color: '#9333EA',
    bgLight: 'rgba(147, 51, 234, 0.12)',
    border: 'rgba(147, 51, 234, 0.28)'
  },
  'free-elec': {
    nameTh: 'หมวดวิชาเลือกเสรี',
    nameEn: 'Free Elective',
    shortTh: 'เลือกเสรี',
    shortEn: 'Free Elec',
    color: '#EA580C',
    bgLight: 'rgba(234, 88, 12, 0.12)',
    border: 'rgba(234, 88, 12, 0.28)'
  }
};

const I18N = {
  th: {
    appName: "PSU Credit Checker",
    universityName: "มหาวิทยาลัยสงขลานครินทร์",
    campusHatyai: "วิทยาเขตหาดใหญ่",
    loginTitle: "เข้าสู่ระบบตรวจสอบหน่วยกิต",
    loginSubtitle: "สำหรับนักศึกษา อาจารย์ที่ปรึกษา และบุคลากร ม.อ.",
    passportLabel: "PSU Passport Account",
    passportPlaceholder: "รหัสนักศึกษา เช่น 6710110001",
    passwordLabel: "รหัสผ่าน (Password)",
    passwordPlaceholder: "รหัสผ่าน PSU Passport",
    loginPassportBtn: "เข้าสู่ระบบด้วย PSU Passport",
    login365Btn: "เข้าสู่ระบบด้วย PSU 365",
    viewStructurePublic: "ดูโครงสร้างหลักสูตรโดยไม่ต้องเข้าสู่ระบบ",
    or: "หรือ",
    overallProgress: "ความคืบหน้ารวม",
    creditsSummary: "หน่วยกิตแยกตามหมวดวิชา",
    currentSemesterCourses: "รายวิชาที่ลงทะเบียนภาคเรียนนี้ (1/2569)",
    exportPdfBtn: "ส่งออกรายงาน PDF",
    exportPdfModalTitle: "รายงานการตรวจสอบหน่วยกิต — ม.อ.",
    printPdfBtn: "พิมพ์ / บันทึก PDF",
    closeBtn: "ปิด",
    logoutBtn: "ออกจากระบบ",
    status: "สถานะ",
    credits: "หน่วยกิต",
    grade: "เกรด",
    courseCode: "รหัสวิชา",
    courseName: "ชื่อวิชา",
    time: "เวลาเรียน",
    category: "หมวด",
    year: "ชั้นปีที่",
    term: "ภาคเรียน",
    gpa: "GPA สะสม",
    advisor: "อาจารย์ที่ปรึกษา",
    remainingEst: "คงเหลืออีก 33 หน่วยกิต คาดว่าจะสำเร็จการศึกษาตามแผนภาคปลาย 2570",
    simPlanTitle: "เลือกไว้",
    simPlanClear: "ล้างแผน",
    coursesRequiredInCat: "รายวิชาที่ต้องลงทะเบียน / เปิดให้เลือก",
    historyTitle: "ประวัติการลงทะเบียนเรียน",
    searchPlaceholder: "ค้นหารหัสวิชา หรือชื่อวิชา...",
    filterAllTerms: "ทุกภาคการศึกษา",
    filterAllYears: "ทุกปีการศึกษา",
    termGpaLabel: "GPA ประจำภาค",
    termCreditsLabel: "หน่วยกิตในภาคนี้",
    totalCoursesCount: "จำนวนวิชา",
    noCoursesFound: "ไม่พบรายวิชาตามเงื่อนไขที่เลือก",
    adviseesTitle: "รายชื่อนักศึกษาในความดูแล",
    viewDetail: "ดู",
    backToAdviseesList: "← กลับไปรายชื่อนักศึกษาในความดูแล",
    readOnlyAdviseeBanner: "โหมดดูอย่างเดียว — กำลังตรวจสอบข้อมูลผลการเรียนของนักศึกษาในที่ปรึกษา",
    consultationNotesTitle: "บันทึกการให้คำปรึกษา",
    consultationPlaceholder: "พิมพ์ข้อความบันทึกการให้คำปรึกษา เช่น แนะนำวิชาที่ต้องลง...",
    addConsultationBtn: "+ บันทึกการให้คำปรึกษา",
    deptStatsTitle: "ภาพรวมสถิติภาควิชาวิทยาการคอมพิวเตอร์",
    studentsByYear: "จำนวนนักศึกษาแยกตามชั้นปี",
    studentsProportion: "สัดส่วนสถานะนักศึกษา",
    roleStudent: "นักศึกษา",
    roleAdvisor: "อาจารย์",
    roleAdmin: "ผู้ดูแลระบบ",
    menuOverview: "ภาพรวมหน่วยกิต",
    menuCategories: "รายวิชาตามหมวด & ค้นหา",
    menuHistory: "ประวัติการลงทะเบียน",
    menuTour: "คู่มือการใช้งาน",
    menuAdvisees: "นักศึกษาในที่ปรึกษา",
    menuDept: "ภาพรวมภาควิชา",
    menuAdminStats: "แดชบอร์ดสถิติ",
    menuAdminCurriculums: "จัดการหลักสูตร",
    menuAdminUsers: "จัดการผู้ใช้",
    menuAdminLogs: "บันทึกการใช้งาน",
    toggleThemeLight: "โหมดสว่าง",
    toggleThemeDark: "โหมดมืด"
  },
  en: {
    appName: "PSU Credit Checker",
    universityName: "Prince of Songkla University",
    campusHatyai: "Hat Yai Campus",
    loginTitle: "Sign in to Credit Checker",
    loginSubtitle: "For PSU Students, Academic Advisors, and Staff",
    passportLabel: "PSU Passport Account",
    passportPlaceholder: "Student ID e.g. 6710110001",
    passwordLabel: "Password",
    passwordPlaceholder: "PSU Passport Password",
    loginPassportBtn: "Sign in with PSU Passport",
    login365Btn: "Sign in with PSU 365",
    viewStructurePublic: "View curriculum structure without sign-in",
    or: "or",
    overallProgress: "Overall Progress",
    creditsSummary: "Credits by Category",
    currentSemesterCourses: "Current Enrolled Courses (1/2026)",
    exportPdfBtn: "Export PDF Report",
    exportPdfModalTitle: "Academic Credit Verification Report — PSU",
    printPdfBtn: "Print / Save PDF",
    closeBtn: "Close",
    logoutBtn: "Sign Out",
    status: "Status",
    credits: "Credits",
    grade: "Grade",
    courseCode: "Course Code",
    courseName: "Course Title",
    time: "Schedule",
    category: "Category",
    year: "Year",
    term: "Semester",
    gpa: "Cumulative GPA",
    advisor: "Advisor",
    remainingEst: "33 credits remaining. On track to graduate in Semester 2/2027.",
    simPlanTitle: "Selected",
    simPlanClear: "Clear Plan",
    coursesRequiredInCat: "Required & Elective Courses in this Category",
    historyTitle: "Academic History & Transcript",
    searchPlaceholder: "Search by course code or title...",
    filterAllTerms: "All Semesters",
    filterAllYears: "All Academic Years",
    termGpaLabel: "Semester GPA",
    termCreditsLabel: "Semester Credits",
    totalCoursesCount: "Total Courses",
    noCoursesFound: "No courses found matching criteria",
    adviseesTitle: "Advisees Student List",
    viewDetail: "View",
    backToAdviseesList: "← Back to Advisees Student List",
    readOnlyAdviseeBanner: "Read-only Mode — Reviewing Advisee Academic Record",
    consultationNotesTitle: "Consultation Notes",
    consultationPlaceholder: "Write a consultation note or study advice...",
    addConsultationBtn: "+ Save Consultation Note",
    deptStatsTitle: "Department of Computer Science Overview",
    studentsByYear: "Students Count by Year",
    studentsProportion: "Student Status Proportion",
    roleStudent: "Student",
    roleAdvisor: "Advisor",
    roleAdmin: "Admin",
    menuOverview: "Credit Overview",
    menuCategories: "Courses & Catalog Search",
    menuHistory: "Enrollment History",
    menuTour: "User Guide",
    menuAdvisees: "My Advisees",
    menuDept: "Department Overview",
    menuAdminStats: "Analytics Dashboard",
    menuAdminCurriculums: "Curriculums",
    menuAdminUsers: "User Management",
    menuAdminLogs: "Audit Logs",
    toggleThemeLight: "Light Mode",
    toggleThemeDark: "Dark Mode"
  }
};

const MOCK = {
  student: {
    id: "6710110001",
    name: "นายสมชาย ใจดี",
    nameEn: "Mr. Somchai Jaidee",
    email: "somchai.j@psu.ac.th",
    faculty: "คณะวิทยาศาสตร์",
    facultyEn: "Faculty of Science",
    campus: "วิทยาเขตหาดใหญ่",
    campusEn: "Hat Yai Campus",
    curriculum: "วิทยาศาสตรบัณฑิต สาขาวิชาวิทยาการคอมพิวเตอร์ (หลักสูตรปรับปรุง พ.ศ. 2567)",
    curriculumEn: "B.Sc. in Computer Science (Revised 2024)",
    year: 3,
    currentTerm: "1/2569",
    currentTermEn: "1/2026",
    gpa: 3.24,
    advisor: "ผศ.ดร.วิชัย ทองสุข",
    advisorEn: "Asst. Prof. Dr. Wichai Thongsuk",
    totalCreditsRequired: 132,
    creditsEarned: 99,
    creditsRemaining: 33,
    categories: [
      {
        id: "gen-ed",
        name: "หมวดวิชาศึกษาทั่วไป",
        nameEn: "General Education",
        required: 30,
        earned: 30,
        status: "complete",
        subcategories: [
          { name: "กลุ่มพลเมืองไทยและพลเมืองโลก", nameEn: "Thai and Global Citizens", required: 12, earned: 12 },
          { name: "กลุ่มสุนทรียศาสตร์และกีฬา", nameEn: "Aesthetics and Sports", required: 6, earned: 6 },
          { name: "กลุ่มภาษาและการสื่อสาร", nameEn: "Language and Communication", required: 12, earned: 12 }
        ]
      },
      { id: "core-req", name: "หมวดวิชาเฉพาะบังคับ", nameEn: "Major Required", required: 72, earned: 54, status: "warning", subcategories: [] },
      { id: "core-elec", name: "หมวดวิชาเฉพาะเลือก", nameEn: "Major Elective", required: 24, earned: 12, status: "warning", subcategories: [] },
      { id: "free-elec", name: "หมวดวิชาเลือกเสรี", nameEn: "Free Elective", required: 6, earned: 3, status: "warning", subcategories: [] }
    ],
    currentSemesterCourses: [
      { code: "344-301", nameTh: "ระบบปฏิบัติการ", nameEn: "Operating Systems", credits: 3, category: "core-req", status: "กำลังศึกษา", statusEn: "Enrolled", time: "อ. 09:00-12:00", timeEn: "Tue. 09:00-12:00" },
      { code: "344-311", nameTh: "ปัญญาประดิษฐ์เบื้องต้น", nameEn: "Intro to AI", credits: 3, category: "core-elec", status: "กำลังศึกษา", statusEn: "Enrolled", time: "พฤ. 13:00-16:00", timeEn: "Thu. 13:00-16:00" },
      { code: "344-321", nameTh: "การพัฒนาเว็บแอปพลิเคชัน", nameEn: "Web App Dev", credits: 3, category: "core-elec", status: "กำลังศึกษา", statusEn: "Enrolled", time: "ศ. 09:00-12:00", timeEn: "Fri. 09:00-12:00" },
      { code: "344-331", nameTh: "ความมั่นคงทางไซเบอร์", nameEn: "Cybersecurity Essentials", credits: 3, category: "core-req", status: "กำลังศึกษา", statusEn: "Enrolled", time: "จ. 13:00-16:00", timeEn: "Mon. 13:00-16:00" },
      { code: "890-201", nameTh: "ภาษาอังกฤษเพื่องานอาชีพ", nameEn: "English for Career", credits: 3, category: "gen-ed", status: "กำลังศึกษา", statusEn: "Enrolled", time: "พ. 09:00-12:00", timeEn: "Wed. 09:00-12:00" }
    ],
    passedCourses: [
      { code: "344-101", nameTh: "หลักการเขียนโปรแกรม", nameEn: "Programming Principles", credits: 3, term: "1/2567", grade: "A", category: "core-req" },
      { code: "344-102", nameTh: "ปฏิบัติการเขียนโปรแกรม", nameEn: "Programming Lab", credits: 1, term: "1/2567", grade: "A", category: "core-req" },
      { code: "322-101", nameTh: "แคลคูลัส 1", nameEn: "Calculus I", credits: 3, term: "1/2567", grade: "B", category: "core-req" },
      { code: "890-101", nameTh: "ภาษาอังกฤษเตรียมความพร้อม", nameEn: "Prep English", credits: 3, term: "1/2567", grade: "A", category: "gen-ed" },
      { code: "895-101", nameTh: "ทักษะชีวิตและความเป็นพลเมือง", nameEn: "Life Skills and Citizenship", credits: 3, term: "1/2567", grade: "A", category: "gen-ed" },
      { code: "895-102", nameTh: "กีฬาเพื่อสุขภาพ", nameEn: "Sports for Health", credits: 2, term: "1/2567", grade: "A", category: "gen-ed" },
      { code: "324-101", nameTh: "ฟิสิกส์ทั่วไป", nameEn: "General Physics", credits: 3, term: "1/2567", grade: "B+", category: "core-req" },
      { code: "344-103", nameTh: "การโปรแกรมเชิงวัตถุ", nameEn: "Object-Oriented Programming", credits: 3, term: "2/2567", grade: "A", category: "core-req" },
      { code: "344-104", nameTh: "คณิตศาสตร์ดิสครีต", nameEn: "Discrete Mathematics", credits: 3, term: "2/2567", grade: "B+", category: "core-req" },
      { code: "322-102", nameTh: "แคลคูลัส 2", nameEn: "Calculus II", credits: 3, term: "2/2567", grade: "C+", category: "core-req" },
      { code: "890-102", nameTh: "ภาษาอังกฤษเพื่อการสื่อสาร", nameEn: "English for Communication", credits: 3, term: "2/2567", grade: "B+", category: "gen-ed" },
      { code: "895-103", nameTh: "ศิลปะกับการดำรงชีวิต", nameEn: "Arts and Living", credits: 2, term: "2/2567", grade: "A", category: "gen-ed" },
      { code: "895-104", nameTh: "สุขภาวะทางจิตและกาย", nameEn: "Well-being", credits: 3, term: "2/2567", grade: "A", category: "gen-ed" },
      { code: "895-106", nameTh: "การพัฒนาบุคลิกภาพและการพูด", nameEn: "Personality & Public Speaking", credits: 2, term: "3/2567", grade: "A", category: "gen-ed" },
      { code: "344-201", nameTh: "โครงสร้างข้อมูลและอัลกอริทึม", nameEn: "Data Structures", credits: 3, term: "1/2568", grade: "B+", category: "core-req" },
      { code: "344-211", nameTh: "สถาปัตยกรรมคอมพิวเตอร์", nameEn: "Computer Architecture", credits: 3, term: "1/2568", grade: "B", category: "core-req" },
      { code: "344-221", nameTh: "การพัฒนาโปรแกรมส่วนหน้า", nameEn: "Frontend Dev", credits: 3, term: "1/2568", grade: "A", category: "core-elec" },
      { code: "344-202", nameTh: "ระบบฐานข้อมูล", nameEn: "Database Systems", credits: 3, term: "2/2568", grade: "A", category: "core-req" },
      { code: "344-231", nameTh: "เครือข่ายคอมพิวเตอร์เบื้องต้น", nameEn: "Computer Networks", credits: 3, term: "2/2568", grade: "B+", category: "core-req" },
      { code: "344-241", nameTh: "การประมวลผลระบบคลาวด์", nameEn: "Cloud Computing", credits: 3, term: "2/2568", grade: "A", category: "core-elec" },
      { code: "001-101", nameTh: "การเป็นผู้ประกอบการเบื้องต้น", nameEn: "Intro to Entrepreneurship", credits: 3, term: "2/2568", grade: "A", category: "free-elec" },
      { code: "344-281", nameTh: "การฝึกงานภาคฤดูร้อนทางคอมพิวเตอร์", nameEn: "Summer Computing Internship", credits: 2, term: "3/2568", grade: "A", category: "core-req" },
      { code: "344-301", nameTh: "ระบบปฏิบัติการ", nameEn: "Operating Systems", credits: 3, term: "1/2569", grade: "B+", category: "core-req" },
      { code: "344-302", nameTh: "วิศวกรรมซอฟต์แวร์", nameEn: "Software Engineering", credits: 3, term: "1/2569", grade: "A", category: "core-req" },
      { code: "344-311", nameTh: "ปัญญาประดิษฐ์", nameEn: "AI Basics", credits: 3, term: "1/2569", grade: "B+", category: "core-elec" }
    ],
    remainingCourses: [
      { code: "344-303", nameTh: "เครือข่ายคอมพิวเตอร์ขั้นสูง", nameEn: "Advanced Networks", credits: 3, category: "core-req", prerequisite: "344-231", availableNextTerm: true },
      { code: "344-401", nameTh: "การเรียนรู้ของเครื่อง", nameEn: "Machine Learning", credits: 3, category: "core-elec", prerequisite: "344-201", availableNextTerm: true },
      { code: "344-402", nameTh: "การประมวลผลภาษาธรรมชาติ", nameEn: "NLP & LLM Applications", credits: 3, category: "core-elec", prerequisite: "344-311", availableNextTerm: true },
      { code: "344-411", nameTh: "สถาปัตยกรรมไมโครเซอร์วิสและคลาวด์เนทีฟ", nameEn: "Microservices & Cloud Native", credits: 3, category: "core-elec", prerequisite: "344-241", availableNextTerm: true },
      { code: "344-490", nameTh: "โครงงานวิทยาการคอมพิวเตอร์ 1", nameEn: "CS Senior Project I", credits: 3, category: "core-req", prerequisite: "344-302", availableNextTerm: true },
      { code: "895-107", nameTh: "การรู้เท่าทันสื่อและพลเมืองดิจิทัล", nameEn: "Media Literacy & Digital Citizenship", credits: 3, category: "gen-ed", prerequisite: "-", availableNextTerm: true },
      { code: "890-203", nameTh: "ภาษาอังกฤษเพื่อการนำเสนอทางวิชาชีพ", nameEn: "English for Professional Presentation", credits: 3, category: "gen-ed", prerequisite: "890-102", availableNextTerm: true },
      { code: "895-109", nameTh: "การคิดเชิงออกแบบและการแก้ปัญหาเชิงสร้างสรรค์", nameEn: "Design Thinking & Creative Problem Solving", credits: 3, category: "gen-ed", prerequisite: "-", availableNextTerm: true },
      { code: "001-201", nameTh: "การเงินส่วนบุคคลเพื่อวัยทำงาน", nameEn: "Personal Finance", credits: 3, category: "free-elec", prerequisite: "-", availableNextTerm: true },
      { code: "193-101", nameTh: "ภาษาเกาหลีเบื้องต้นเพื่อการสื่อสาร", nameEn: "Basic Korean for Communication", credits: 3, category: "free-elec", prerequisite: "-", availableNextTerm: true },
      { code: "264-101", nameTh: "ศิลปะการถ่ายภาพดิจิทัล", nameEn: "Digital Photography Arts", credits: 3, category: "free-elec", prerequisite: "-", availableNextTerm: true },
      { code: "511-102", nameTh: "ศาสตร์และศิลป์แห่งกาแฟ", nameEn: "Science and Art of Coffee", credits: 3, category: "free-elec", prerequisite: "-", availableNextTerm: true },
      { code: "262-105", nameTh: "การผลิตคอนเทนต์ดิจิทัลและการสร้างสื่อสร้างสรรค์", nameEn: "Digital Content Creation", credits: 3, category: "free-elec", prerequisite: "-", availableNextTerm: true }
    ]
  },
  availableCatalog: [
    { code: "890-201", nameTh: "ภาษาอังกฤษเพื่องานอาชีพ", nameEn: "English for Career", credits: 3, category: "gen-ed", instructor: "ผศ.ดร.พรพรรณ สุวรรณโณ", instructorEn: "Asst. Prof. Dr. Pornpan Suwanno", schedule: "พุธ 09:00-12:00 LA301", scheduleEn: "Wed. 09:00-12:00 LA301", seatsMax: 50, seatsAvailable: 8, description: "การพัฒนาทักษะการสื่อสารภาษาอังกฤษเพื่อการสัมภาษณ์งาน การเขียนจดหมายสมัครงานและเรซูเม่อาชีพ", descriptionEn: "English communication skills for job interviews and resume writing", prerequisite: "890-102" },
    { code: "890-202", nameTh: "ภาษาอังกฤษเชิงวิชาการ", nameEn: "Academic English", credits: 3, category: "gen-ed", instructor: "ผศ.ดร.พรพรรณ สุวรรณโณ", instructorEn: "Asst. Prof. Dr. Pornpan Suwanno", schedule: "จันทร์ 09:00-12:00 LA102", scheduleEn: "Mon. 09:00-12:00 LA102", seatsMax: 45, seatsAvailable: 0, description: "การเขียนรายงานทางวิชาการ การอ้างอิง และการอ่านบทความวิจัยขั้นสูง", descriptionEn: "Academic writing, referencing, and research analysis", prerequisite: "890-102" },
    { code: "890-203", nameTh: "ภาษาอังกฤษเพื่อการนำเสนอทางวิชาชีพ", nameEn: "English for Professional Presentation", credits: 3, category: "gen-ed", instructor: "อาจารย์ มาร์ค สมิธ", instructorEn: "Lect. Mark Smith", schedule: "ศุกร์ 13:00-16:00 LA205", scheduleEn: "Fri. 13:00-16:00 LA205", seatsMax: 40, seatsAvailable: 15, description: "เทคนิคการนำเสนองานทางวิชาการและธุรกิจเป็นภาษาอังกฤษ", descriptionEn: "Public speaking and academic presentation skills in English", prerequisite: "890-102" },
    { code: "895-103", nameTh: "ศิลปะกับการดำรงชีวิต", nameEn: "Arts and Living", credits: 2, category: "gen-ed", instructor: "อาจารย์ วรรณษา ภักดี", instructorEn: "Lect. Wannasa Phakdee", schedule: "พฤหัสบดี 09:00-11:00 FA101", scheduleEn: "Thu. 09:00-11:00 FA101", seatsMax: 60, seatsAvailable: 0, description: "สุนทรียศาสตร์ทางทัศนศิลป์และการประยุกต์ใช้ศิลปะในการพัฒนาคุณภาพชีวิต", descriptionEn: "Visual arts aesthetics and daily life applications", prerequisite: "-" },
    { code: "895-107", nameTh: "การรู้เท่าทันสื่อและพลเมืองดิจิทัล", nameEn: "Media Literacy & Digital Citizenship", credits: 3, category: "gen-ed", instructor: "ดร.ปิยวัฒน์ ชูเชิด", instructorEn: "Dr. Piyawat Choocheod", schedule: "อังคาร 09:00-12:00 LC202", scheduleEn: "Tue. 09:00-12:00 LC202", seatsMax: 120, seatsAvailable: 34, description: "จริยธรรมในยุคดิจิทัล การวิเคราะห์ข้อมูลข่าวสาร และความเป็นส่วนตัวทางไซเบอร์", descriptionEn: "Digital ethics, media analysis, and cyber privacy", prerequisite: "-" },
    { code: "895-109", nameTh: "การคิดเชิงออกแบบและการแก้ปัญหาเชิงสร้างสรรค์", nameEn: "Design Thinking & Creative Problem Solving", credits: 3, category: "gen-ed", instructor: "ผศ.สุพัตรา มณีรัตน์", instructorEn: "Asst. Prof. Supattra Maneerat", schedule: "พฤหัสบดี 13:00-16:00 LC401", scheduleEn: "Thu. 13:00-16:00 LC401", seatsMax: 80, seatsAvailable: 21, description: "กระบวนการคิดเชิงออกแบบ Empathy, Define, Ideate, Prototype, Test", descriptionEn: "Design thinking methodology and creative innovation", prerequisite: "-" },
    { code: "895-102", nameTh: "กีฬาเพื่อสุขภาพ (แบดมินตันและว่ายน้ำ)", nameEn: "Sports for Health", credits: 2, category: "gen-ed", instructor: "อาจารย์ สุริยา ชัยเดช", instructorEn: "Lect. Suriya Chaidet", schedule: "จันทร์ 15:00-17:00 PSU Sports Complex", scheduleEn: "Mon. 15:00-17:00 PSU Sports Complex", seatsMax: 60, seatsAvailable: 6, description: "หลักสรีรวิทยาการออกกำลังกาย กฎกติกาและทักษะการเล่นกีฬาเพื่อสุขภาพ", descriptionEn: "Exercise physiology and physical fitness development", prerequisite: "-" },
    { code: "895-105", nameTh: "ดนตรีและคุณค่าชีวิต", nameEn: "Music and Life Values", credits: 2, category: "gen-ed", instructor: "อาจารย์ วรรณษา ภักดี", instructorEn: "Lect. Wannasa Phakdee", schedule: "พุธ 13:00-15:00 FA201", scheduleEn: "Wed. 13:00-15:00 FA201", seatsMax: 70, seatsAvailable: 19, description: "สุนทรียศาสตร์ทางดนตรี ดนตรีบำบัด และบทบาทของดนตรีในจิตใจ", descriptionEn: "Music aesthetics and mental wellness through harmony", prerequisite: "-" },
    { code: "344-303", nameTh: "เครือข่ายคอมพิวเตอร์ขั้นสูง", nameEn: "Advanced Networks", credits: 3, category: "core-req", instructor: "รศ.ดร.สมเกียรติ สว่างศรี", instructorEn: "Assoc. Prof. Dr. Somkiat Sawangsri", schedule: "จันทร์ 09:00-12:00 BSc0301", scheduleEn: "Mon. 09:00-12:00 BSc0301", seatsMax: 60, seatsAvailable: 12, description: "การออกแบบและวิเคราะห์โพรโทคอลเครือข่าย Software-Defined Networking (SDN)", descriptionEn: "Network protocol design, SDN, and architecture", prerequisite: "344-231" },
    { code: "344-322", nameTh: "การพัฒนาโปรแกรมส่วนหลัง", nameEn: "Backend Development", credits: 3, category: "core-req", instructor: "ผศ.ดร.กิตติพงษ์ วิริยะ", instructorEn: "Asst. Prof. Dr. Kittipong Wiriya", schedule: "พุธ 13:00-16:00 CS202", scheduleEn: "Wed. 13:00-16:00 CS202", seatsMax: 45, seatsAvailable: 0, description: "RESTful API, GraphQL, Database ORM, Authentication & Microservices", descriptionEn: "RESTful APIs, GraphQL, ORMs, and secure backend servers", prerequisite: "344-201" },
    { code: "344-490", nameTh: "โครงงานวิทยาการคอมพิวเตอร์ 1", nameEn: "CS Senior Project I", credits: 3, category: "core-req", instructor: "คณาจารย์ประจำภาควิชา", instructorEn: "Computer Science Faculty Staff", schedule: "พฤหัสบดี 09:00-12:00 CS101", scheduleEn: "Thu. 09:00-12:00 CS101", seatsMax: 80, seatsAvailable: 34, description: "การศึกษาและเสนอโครงร่างงานวิจัย การออกแบบสถาปัตยกรรมระบบ", descriptionEn: "Research methodology, literature review, and project proposal", prerequisite: "344-302" },
    { code: "344-491", nameTh: "โครงงานวิทยาการคอมพิวเตอร์ 2", nameEn: "CS Senior Project II", credits: 3, category: "core-req", instructor: "คณาจารย์ประจำภาควิชา", instructorEn: "Computer Science Faculty Staff", schedule: "พฤหัสบดี 13:00-16:00 CS101", scheduleEn: "Thu. 13:00-16:00 CS101", seatsMax: 80, seatsAvailable: 50, description: "การพัฒนา ทดสอบ นำระบบไปใช้งานจริง และการเขียนบทความวิชาการ", descriptionEn: "System development, evaluation, and academic paper presentation", prerequisite: "344-490" },
    { code: "344-401", nameTh: "การเรียนรู้ของเครื่อง", nameEn: "Machine Learning", credits: 3, category: "core-elec", instructor: "ผศ.ดร.จินตนา ไชยรัตน์", instructorEn: "Asst. Prof. Dr. Jintana Chairat", schedule: "อังคาร 13:00-16:00 CS201", scheduleEn: "Tue. 13:00-16:00 CS201", seatsMax: 45, seatsAvailable: 5, description: "ทฤษฎีและอัลกอริทึมการเรียนรู้แบบมีผู้สอน Deep Learning และ MLOps", descriptionEn: "Supervised and unsupervised learning, deep neural nets, and MLOps", prerequisite: "344-201" },
    { code: "344-402", nameTh: "การประมวลผลภาษาธรรมชาติ", nameEn: "NLP & LLM Applications", credits: 3, category: "core-elec", instructor: "ดร.ณัฐวุฒิ ประชารักษ์", instructorEn: "Dr. Natthawut Pracharak", schedule: "พุธ 09:00-12:00 CS203", scheduleEn: "Wed. 09:00-12:00 CS203", seatsMax: 40, seatsAvailable: 18, description: "แบบจำลองภาษา Transformer การไฟน์ทูน LLMs และการสร้าง AI Agent", descriptionEn: "Transformer language models, fine-tuning LLMs, and autonomous agents", prerequisite: "344-311" },
    { code: "344-411", nameTh: "สถาปัตยกรรมไมโครเซอร์วิสและคลาวด์เนทีฟ", nameEn: "Microservices & Cloud Native", credits: 3, category: "core-elec", instructor: "ผศ.ดร.กิตติพงษ์ วิริยะ", instructorEn: "Asst. Prof. Dr. Kittipong Wiriya", schedule: "ศุกร์ 09:00-12:00 CS202", scheduleEn: "Fri. 09:00-12:00 CS202", seatsMax: 45, seatsAvailable: 14, description: "การออกแบบระบบด้วย Docker, Kubernetes, CI/CD Pipeline", descriptionEn: "System design with Docker, Kubernetes orchestration, and CI/CD", prerequisite: "344-241" },
    { code: "344-421", nameTh: "ความมั่นคงปลอดภัยของเว็บและอุปกรณ์พกพา", nameEn: "Web & Mobile Security", credits: 3, category: "core-elec", instructor: "ดร.วรเชษฐ์ สุวรรณรัตน์", instructorEn: "Dr. Worachet Suwannarat", schedule: "อังคาร 09:00-12:00 CS204", scheduleEn: "Tue. 09:00-12:00 CS204", seatsMax: 40, seatsAvailable: 0, description: "การทดสอบเจาะระบบ Penetration Testing และ OWASP Top 10", descriptionEn: "Penetration testing and OWASP security vulnerability mitigations", prerequisite: "344-331" },
    { code: "001-101", nameTh: "การเป็นผู้ประกอบการเบื้องต้น", nameEn: "Intro to Entrepreneurship", credits: 3, category: "free-elec", instructor: "ดร.เกรียงไกร ชัยมงคล", instructorEn: "Dr. Kriangkrai Chaimongkol", schedule: "ศุกร์ 09:00-12:00 LC302", scheduleEn: "Fri. 09:00-12:00 LC302", seatsMax: 120, seatsAvailable: 42, description: "แนวคิดการสร้างธุรกิจนวัตกรรม Lean Startup และการวิเคราะห์กลุ่มเป้าหมาย", descriptionEn: "Lean startup methodologies and business modeling", prerequisite: "-" },
    { code: "001-201", nameTh: "การเงินส่วนบุคคลเพื่อวัยทำงาน", nameEn: "Personal Finance", credits: 3, category: "free-elec", instructor: "ผศ.ดร.รพีพร มณีโชติ", instructorEn: "Asst. Prof. Dr. Rapeeporn Maneechot", schedule: "ศุกร์ 13:00-16:00 LC301", scheduleEn: "Fri. 13:00-16:00 LC301", seatsMax: 150, seatsAvailable: 19, description: "การวางแผนภาษี การลงทุนในสินทรัพย์ หุ้น กองทุนรวม และการบริหารหนี้สิน", descriptionEn: "Personal wealth, tax management, and investment planning", prerequisite: "-" },
    { code: "193-101", nameTh: "ภาษาเกาหลีเบื้องต้นเพื่อการสื่อสาร", nameEn: "Basic Korean for Communication", credits: 3, category: "free-elec", instructor: "อาจารย์ คิม จีซู", instructorEn: "Lect. Kim Ji-soo", schedule: "อังคาร 09:00-12:00 LA204", scheduleEn: "Tue. 09:00-12:00 LA204", seatsMax: 60, seatsAvailable: 8, description: "การออกเสียง ไวยากรณ์พื้นฐาน และบทสนทนาที่ใช้ในชีวิตประจำวัน", descriptionEn: "Korean phonetics, basic grammar, and everyday conversations", prerequisite: "-" },
    { code: "264-101", nameTh: "ศิลปะการถ่ายภาพดิจิทัล", nameEn: "Digital Photography Arts", credits: 3, category: "free-elec", instructor: "ผศ.สุรเชษฐ์ สิทธิชัย", instructorEn: "Asst. Prof. Surachet Sitthichai", schedule: "พุธ 13:00-16:00 FA102", scheduleEn: "Wed. 13:00-16:00 FA102", seatsMax: 45, seatsAvailable: 14, description: "ทฤษฎีแสง การจัดองค์ประกอบภาพ และเทคนิคตกแต่งภาพดิจิทัล", descriptionEn: "Lighting, visual composition, and digital photo editing", prerequisite: "-" },
    { code: "511-102", nameTh: "ศาสตร์และศิลป์แห่งกาแฟ", nameEn: "Science and Art of Coffee", credits: 3, category: "free-elec", instructor: "ดร.วรัญญา รัตนพันธ์", instructorEn: "Dr. Waranya Rattanapan", schedule: "พฤหัสบดี 13:00-16:00 AG305", scheduleEn: "Thu. 13:00-16:00 AG305", seatsMax: 40, seatsAvailable: 0, description: "สายพันธุ์กาแฟ กระบวนการคั่ว การสกัด และการประเมินรสชาติ Sensory Evaluation", descriptionEn: "Coffee varieties, roasting techniques, extraction, and sensory tasting", prerequisite: "-" },
    { code: "262-105", nameTh: "การผลิตคอนเทนต์ดิจิทัลและการสร้างสื่อสร้างสรรค์", nameEn: "Digital Content Creation", credits: 3, category: "free-elec", instructor: "อาจารย์ ภาณุพงศ์ อัศวชัย", instructorEn: "Lect. Panupong Asawachai", schedule: "จันทร์ 13:00-16:00 IT202", scheduleEn: "Mon. 13:00-16:00 IT202", seatsMax: 70, seatsAvailable: 25, description: "การวางแผน Storytelling การตัดต่อวิดีโอสั้น และการทำการตลาด Social Media", descriptionEn: "Storytelling, short-form video editing, and digital social media marketing", prerequisite: "-" }
  ],
  advisor: {
    name: "ผศ.ดร.วิชัย ทองสุข",
    nameEn: "Asst. Prof. Dr. Wichai Thongsuk",
    students: [
      { id: "6710110001", name: "นายสมชาย ใจดี", nameEn: "Mr. Somchai Jaidee", year: 3, creditsEarned: 99, creditsReq: 132, gpa: 3.24, status: "normal", statusText: "ปกติ", statusTextEn: "Normal", faculty: "คณะวิทยาศาสตร์", facultyEn: "Faculty of Science", curriculum: "วิทยาศาสตรบัณฑิต สาขาวิชาวิทยาการคอมพิวเตอร์", curriculumEn: "B.Sc. in Computer Science" },
      { id: "6710110002", name: "นางสาวปิยะนุช แก้วมณี", nameEn: "Ms. Piyanuch Kaewmanee", year: 3, creditsEarned: 102, creditsReq: 132, gpa: 3.61, status: "normal", statusText: "ปกติ", statusTextEn: "Normal", faculty: "คณะวิทยาศาสตร์", facultyEn: "Faculty of Science", curriculum: "วิทยาศาสตรบัณฑิต สาขาวิชาวิทยาการคอมพิวเตอร์", curriculumEn: "B.Sc. in Computer Science" },
      { id: "6710110003", name: "นายธนกฤต รักษ์ทอง", nameEn: "Mr. Thanakrit Rakthong", year: 3, creditsEarned: 84, creditsReq: 132, gpa: 2.41, status: "warning", statusText: "เสี่ยง", statusTextEn: "Warning", faculty: "คณะวิทยาศาสตร์", facultyEn: "Faculty of Science", curriculum: "วิทยาศาสตรบัณฑิต สาขาวิชาวิทยาการคอมพิวเตอร์", curriculumEn: "B.Sc. in Computer Science" },
      { id: "6610110024", name: "นายอนุชา บุญเรือง", nameEn: "Mr. Anucha Boonruang", year: 4, creditsEarned: 92, creditsReq: 132, gpa: 1.94, status: "danger", statusText: "ต้องติดตามด่วน", statusTextEn: "Critical", faculty: "คณะวิทยาศาสตร์", facultyEn: "Faculty of Science", curriculum: "วิทยาศาสตรบัณฑิต สาขาวิชาวิทยาการคอมพิวเตอร์", curriculumEn: "B.Sc. in Computer Science" }
    ],
    consultations: [
      { id: 1, studentId: "6710110001", date: "28 ก.พ. 2569", dateEn: "28 Feb 2026", author: "ผศ.ดร.วิชัย ทองสุข", authorEn: "Asst. Prof. Dr. Wichai Thongsuk", note: "เข้าพบเพื่อวางแผนลงทะเบียนภาค 2/2569 แนะนำให้เก็บวิชาเฉพาะบังคับ 344-303 และเริ่มหาหัวข้อโปรเจกต์", noteEn: "Consulted on Term 2/2026 course plan. Recommended completing required 344-303 and starting senior project research." }
    ]
  },
  admin: {
    statsByPeriod: {
      daily: { totalUsers: "1,248", checksCount: "4,892", newUsers: "84", exportedPdfs: "312", trend: "+12.5%" },
      weekly: { totalUsers: "6,410", checksCount: "28,450", newUsers: "340", exportedPdfs: "1,420", trend: "+8.3%" },
      monthly: { totalUsers: "18,920", checksCount: "89,140", newUsers: "1,120", exportedPdfs: "4,850", trend: "+15.1%" },
      term: { totalUsers: "34,200", checksCount: "142,500", newUsers: "4,200", exportedPdfs: "12,900", trend: "+24.0%" },
      year: { totalUsers: "48,500", checksCount: "320,000", newUsers: "9,800", exportedPdfs: "28,400", trend: "+18.7%" }
    },
    campusStats: [
      { campusTh: "วิทยาเขตหาดใหญ่", campusEn: "Hat Yai Campus", users: "24,850", checks: "168,200", percent: 52, color: "#2563EB" },
      { campusTh: "วิทยาเขตปัตตานี", campusEn: "Pattani Campus", users: "8,920", checks: "59,400", percent: 19, color: "#16A34A" },
      { campusTh: "วิทยาเขตภูเก็ต", campusEn: "Phuket Campus", users: "7,150", checks: "46,800", percent: 15, color: "#9333EA" },
      { campusTh: "วิทยาเขตสุราษฎร์ธานี", campusEn: "Surat Thani Campus", users: "4,430", checks: "28,900", percent: 9, color: "#EA580C" },
      { campusTh: "วิทยาเขตตรัง", campusEn: "Trang Campus", users: "2,450", checks: "16,700", percent: 5, color: "#0090E7" }
    ],
    facultyStats: [
      { nameTh: "คณะวิทยาศาสตร์", nameEn: "Faculty of Science", count: "72,400", percent: 32, color: "#16A34A" },
      { nameTh: "คณะวิศวกรรมศาสตร์", nameEn: "Faculty of Engineering", count: "61,200", percent: 27, color: "#2563EB" },
      { nameTh: "คณะแพทยศาสตร์", nameEn: "Faculty of Medicine", count: "34,100", percent: 15, color: "#0090E7" },
      { nameTh: "คณะวิทยาการจัดการ", nameEn: "Faculty of Management Sciences", count: "31,800", percent: 14, color: "#EA580C" },
      { nameTh: "คณะมนุษยศาสตร์และสังคมศาสตร์", nameEn: "Faculty of Humanities", count: "27,500", percent: 12, color: "#9333EA" }
    ],
    curriculums: [
      { id: "c1", nameTh: "วิทยาศาสตรบัณฑิต สาขาวิชาวิทยาการคอมพิวเตอร์", nameEn: "B.Sc. in Computer Science", level: "ปริญญาตรี", levelEn: "Bachelor's", faculty: "คณะวิทยาศาสตร์", facultyEn: "Faculty of Science", year: "2567", credits: 132, status: "active" },
      { id: "c2", nameTh: "วิทยาศาสตรบัณฑิต สาขาวิชาเทคโนโลยีสารสนเทศ", nameEn: "B.Sc. in Information Technology", level: "ปริญญาตรี", levelEn: "Bachelor's", faculty: "คณะวิทยาศาสตร์", facultyEn: "Faculty of Science", year: "2565", credits: 128, status: "active" },
      { id: "c3", nameTh: "วิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมคอมพิวเตอร์", nameEn: "B.Eng. in Computer Engineering", level: "ปริญญาตรี", levelEn: "Bachelor's", faculty: "คณะวิศวกรรมศาสตร์", facultyEn: "Faculty of Engineering", year: "2566", credits: 140, status: "active" }
    ],
    users: [
      { id: "6710110001", name: "นายสมชาย ใจดี", nameEn: "Mr. Somchai Jaidee", email: "somchai.j@psu.ac.th", role: "นักศึกษา", roleEn: "Student", department: "คณะวิทยาศาสตร์", departmentEn: "Faculty of Science", lastLogin: "1 ก.ย. 2569 21:30" },
      { id: "6710110002", name: "นางสาวปิยะนุช แก้วมณี", nameEn: "Ms. Piyanuch Kaewmanee", email: "piyanuch.k@psu.ac.th", role: "นักศึกษา", roleEn: "Student", department: "คณะวิทยาศาสตร์", departmentEn: "Faculty of Science", lastLogin: "1 ก.ย. 2569 19:40" },
      { id: "6610110024", name: "นายอนุชา บุญเรือง", nameEn: "Mr. Anucha Boonruang", email: "anucha.b@psu.ac.th", role: "นักศึกษา", roleEn: "Student", department: "คณะวิทยาศาสตร์", departmentEn: "Faculty of Science", lastLogin: "30 ส.ค. 2569 11:20" },
      { id: "u2", name: "ผศ.ดร.วิชัย ทองสุข", nameEn: "Asst. Prof. Dr. Wichai Thongsuk", email: "wichai.t@psu.ac.th", role: "อาจารย์", roleEn: "Advisor", department: "ภาควิชาวิทยาการคอมพิวเตอร์", departmentEn: "Dept. of Computer Science", lastLogin: "1 ก.ย. 2569 20:15" },
      { id: "u3", name: "นายสมศักดิ์ แอดมิน", nameEn: "Mr. Somsak Admin", email: "somsak.admin@psu.ac.th", role: "ผู้ดูแลระบบ", roleEn: "Admin", department: "สำนักนวัตกรรมดิจิทัล", departmentEn: "Digital Innovation Office", lastLogin: "1 ก.ย. 2569 21:45" }
    ],
    logs: [
      { id: "l1", time: "01/09/2569 21:45:10", user: "somsak.admin@psu.ac.th", role: "ผู้ดูแลระบบ", action: "แก้ไขหลักสูตร", target: "วท.บ. วิทยาการคอมพิวเตอร์ 2567", ip: "192.168.1.104" },
      { id: "l2", time: "01/09/2569 21:30:22", user: "somchai.j@psu.ac.th", role: "นักศึกษา", action: "ส่งออกรายงาน PDF", target: "รายงานตรวจสอบหน่วยกิตสะสม", ip: "10.24.50.88" }
    ]
  }
};

const CategoryBadge = ({ categoryId, lang = 'th' }) => {
  const info = CATEGORY_THEME[categoryId] || {
    shortTh: 'หมวดอื่นๆ',
    shortEn: 'Other',
    color: '#2563EB',
    bgLight: 'rgba(37, 99, 235, 0.12)',
    border: 'rgba(37, 99, 235, 0.28)'
  };
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{
        backgroundColor: info.bgLight,
        color: info.color,
        border: `1px solid ${info.border}`
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: info.color }} />
      {lang === 'th' ? info.shortTh : info.shortEn}
    </span>
  );
};

const ThemeSwitch = ({ theme, toggleTheme, lang = 'th' }) => {
  const isDark = theme === 'dark';
  const label = isDark
    ? (lang === 'th' ? 'โหมดมืด (คลิกเพื่อเปลี่ยนเป็นโหมดสว่าง)' : 'Dark Mode (Click for Light)')
    : (lang === 'th' ? 'โหมดสว่าง (คลิกเพื่อเปลี่ยนเป็นโหมดมืด)' : 'Light Mode (Click for Dark)');

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={toggleTheme}
      title={label}
      aria-label={label}
      className={`relative inline-flex h-9 w-16 shrink-0 cursor-pointer items-center rounded-full p-1 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner select-none ${
        isDark
          ? 'bg-slate-800 border border-slate-700 hover:border-blue-400'
          : 'bg-slate-200/90 border border-slate-300 hover:border-blue-400'
      }`}
    >
      {/* Background Icons */}
      <span className="absolute left-1.5 flex items-center justify-center text-amber-500 transition-opacity duration-200 pointer-events-none">
        <Sun size={13} className={isDark ? 'opacity-30' : 'opacity-90'} />
      </span>
      <span className="absolute right-1.5 flex items-center justify-center text-blue-400 transition-opacity duration-200 pointer-events-none">
        <Moon size={13} className={isDark ? 'opacity-90' : 'opacity-30'} />
      </span>

      {/* Animated Sliding Thumb */}
      <span
        className={`pointer-events-none inline-flex h-7 w-7 transform items-center justify-center rounded-full bg-white dark:bg-[#1E222D] shadow-md transition-all duration-300 ease-in-out ${
          isDark ? 'translate-x-7 text-blue-400' : 'translate-x-0 text-amber-500'
        }`}
      >
        {isDark ? (
          <Moon size={14} className="fill-blue-400/20" />
        ) : (
          <Sun size={14} className="fill-amber-500/20" />
        )}
      </span>
    </button>
  );
};

const LoginScreen = ({ onLogin, theme, toggleTheme, lang, toggleLang }) => {
  const t = I18N[lang];
  const [username, setUsername] = useState('6710110001');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin('student');
    }, 500);
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-[#F5F9FF] dark:bg-black text-slate-800 dark:text-white">
      {/* 55% Left Scenery (Desktop) */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-12 text-white overflow-hidden bg-[#0A192F]">
        <img
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80"
          alt="PSU Campus"
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
        />
        <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(180deg, rgba(10, 25, 47, 0.45) 0%, rgba(6, 18, 38, 0.92) 100%)' }} />

        <div className="relative z-20 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
            <GraduationCap size={26} className="text-white" />
          </div>
          <div>
            <div className="text-base font-bold tracking-wide">{t.universityName}</div>
            <div className="text-xs opacity-80">PRINCE OF SONGKLA UNIVERSITY • {t.campusHatyai.toUpperCase()}</div>
          </div>
        </div>

        <div className="relative z-20 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-400/20 border border-cyan-300/40 text-cyan-100 text-xs font-semibold mb-4">
            <Check size={14} /> {lang === 'th' ? 'ระบบบริการตรวจสอบข้อมูลทางวิชาการแบบรวมศูนย์' : 'Centralized Academic Credit Verification System'}
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight">{t.appName}</h1>
          <p className="text-sm lg:text-base mt-3 opacity-95 leading-relaxed">
            {lang === 'th'
              ? 'ตรวจสอบหน่วยกิตสะสม ผลการศึกษาตามโครงสร้างหลักสูตร ครบทุกหมวดในที่เดียว เพื่อการวางแผนสำเร็จการศึกษาอย่างมั่นใจ'
              : 'Track your cumulative credits, verify curriculum completion across all categories, and plan your graduation with confidence.'}
          </p>
          <div className="flex flex-wrap gap-4 mt-6 pt-5 border-t border-white/20 text-xs lg:text-sm">
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={15} className="text-cyan-300" /> {lang === 'th' ? 'ตรวจสอบ 4 หมวดวิชา' : '4 Category Audit'}</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={15} className="text-cyan-300" /> {lang === 'th' ? 'แผนจำลองการลงทะเบียน' : 'Plan Simulation'}</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={15} className="text-cyan-300" /> {lang === 'th' ? 'รายงาน PDF รับรองเบื้องต้น' : 'Official PDF Export'}</span>
          </div>
        </div>
      </div>

      {/* 45% Right PSU Passport Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12 relative min-h-screen lg:min-h-0 bg-white dark:bg-[#191C24]">
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2.5">
          <button
            onClick={toggleLang}
            className="h-9 w-9 rounded-full border border-slate-200 dark:border-[#2C2E33] bg-slate-100 dark:bg-[#2A3038] text-slate-800 dark:text-white flex items-center justify-center text-xs font-bold hover:border-blue-500 transition-all select-none"
          >
            {lang.toUpperCase()}
          </button>
          <ThemeSwitch theme={theme} toggleTheme={toggleTheme} lang={lang} />
        </div>

        <div className="w-full max-w-md">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 inline-flex items-center justify-center mb-3 shadow-sm">
              <GraduationCap size={36} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{t.loginTitle}</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A8B4C7] mt-1.5">{t.loginSubtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 sm:gap-4">
            <div>
              <label className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 block mb-1.5">{t.passportLabel}</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t.passportPlaceholder}
                  className="w-full py-2.5 sm:py-3 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-slate-50 dark:bg-[#2A3038] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute left-3.5 top-3.5 text-slate-400"><User size={18} /></div>
              </div>
            </div>

            <div>
              <label className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 block mb-1.5">{t.passwordLabel}</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  className="w-full py-2.5 sm:py-3 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-slate-50 dark:bg-[#2A3038] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute left-3.5 top-3.5 text-slate-400"><Lock size={18} /></div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-1"
            >
              {loading ? (lang === 'th' ? 'กำลังตรวจสอบสิทธิ์...' : 'Authenticating...') : <><KeyRound size={18} /> {t.loginPassportBtn}</>}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4 sm:my-5">
            <div className="flex-1 h-px bg-slate-200 dark:bg-[#2C2E33]" />
            <span className="text-xs text-slate-400">{t.or}</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-[#2C2E33]" />
          </div>

          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={loading}
            className="w-full py-2.5 sm:py-3 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-slate-50 dark:bg-[#2A3038] hover:bg-slate-100 dark:hover:bg-[#343b45] text-slate-800 dark:text-white text-sm font-semibold flex items-center justify-center gap-2.5 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 21 21">
              <rect x="1" y="1" width="9" height="9" fill="#F25022" />
              <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
              <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
              <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
            </svg>
            <span>{t.login365Btn}</span>
          </button>

          {/* Quick Demo Role Switchers */}
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-[#2C2E33]">
            <span className="text-[11px] text-slate-400 dark:text-slate-500 block text-center mb-2 font-medium">
              {lang === 'th' ? '— หรือทดลองเข้าใช้งานทันทีด้วยบทบาทตัวอย่าง —' : '— Or explore immediately with demo roles —'}
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onLogin('student')}
                className="py-2.5 px-2 rounded-xl border border-slate-200 dark:border-[#2C2E33] hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 flex items-center justify-center gap-1.5 text-xs font-semibold transition-all active:scale-95"
              >
                <GraduationCap size={14} className="text-blue-600 dark:text-blue-400" />
                <span>{t.demoStudent}</span>
              </button>
              <button
                type="button"
                onClick={() => onLogin('advisor')}
                className="py-2.5 px-2 rounded-xl border border-slate-200 dark:border-[#2C2E33] hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 flex items-center justify-center gap-1.5 text-xs font-semibold transition-all active:scale-95"
              >
                <Users size={14} className="text-purple-600 dark:text-purple-400" />
                <span>{t.demoAdvisor}</span>
              </button>
              <button
                type="button"
                onClick={() => onLogin('admin')}
                className="py-2.5 px-2 rounded-xl border border-slate-200 dark:border-[#2C2E33] hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 flex items-center justify-center gap-1.5 text-xs font-semibold transition-all active:scale-95"
              >
                <Settings size={14} className="text-amber-600 dark:text-amber-400" />
                <span>{t.demoAdmin}</span>
              </button>
            </div>
          </div>

          <div className="mt-5 text-center">
            <span
              onClick={() => onLogin('student')}
              className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 cursor-pointer inline-flex items-center gap-1 font-medium hover:underline"
            >
              {t.viewStructurePublic} <ChevronRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * คำนวณและประเมินสถานะความก้าวหน้าทางการศึกษาตามเป้าหมายสะสมรายชั้นปี
 * Year 1: 25%, Year 2: 50%, Year 3: 75%, Year 4: 100%
 */
const calculateStudentStatus = (student) => {
  const totalReq = student.creditsReq || student.totalCreditsRequired || 132;
  const earned = student.creditsEarned || 0;
  const year = student.year || 1;

  const expectedCredits = Math.round(totalReq * (year * 0.25));
  const creditGap = Math.max(0, expectedCredits - earned);

  let status;
  if (year >= 4) {
    if (creditGap <= 6) status = 'normal';
    else if (creditGap <= 12) status = 'warning';
    else status = 'danger';
  } else {
    if (creditGap <= 9) status = 'normal';
    else if (creditGap <= 18) status = 'warning';
    else status = 'danger';
  }

  const statusText = status === 'normal' ? 'สถานะปกติ' : status === 'warning' ? 'มีความเสี่ยง' : 'ต้องติดตามด่วน';
  const statusTextEn = status === 'normal' ? 'On-track' : status === 'warning' ? 'Warning' : 'Critical';

  const badgeStyle = status === 'normal'
    ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40'
    : status === 'warning'
    ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40'
    : 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200/60 dark:border-red-800/40';

  const progressPercent = Math.min(100, Math.round((earned / expectedCredits) * 100));

  let explanationTh;
  let explanationEn;
  if (creditGap === 0) {
    explanationTh = `ผ่านเกณฑ์เป้าหมายสะสมชั้นปีที่ ${year} ครบถ้วน (สะสมได้ ${earned} จากเป้าหมาย ${expectedCredits} หน่วยกิต)`;
    explanationEn = `Fully achieved Year ${year} benchmark (${earned} of ${expectedCredits} cr.)`;
  } else if (status === 'warning') {
    explanationTh = `ตามหลังแผนการเรียน ${creditGap} หน่วยกิต (เป้าหมายชั้นปีที่ ${year} คือ ${expectedCredits} หน่วยกิต สะสมได้จริง ${earned} หน่วยกิต) แนะนำให้ลงทะเบียนเสริมในภาคการศึกษาถัดไป`;
    explanationEn = `${creditGap} credits behind Year ${year} benchmark (Target: ${expectedCredits} cr., Actual: ${earned} cr.). Recommended to enroll in additional courses next term.`;
  } else {
    explanationTh = `ตามหลังแผนการเรียน ${creditGap} หน่วยกิต (เป้าหมายชั้นปีที่ ${year} คือ ${expectedCredits} หน่วยกิต สะสมได้จริง ${earned} หน่วยกิต) ขาดเกินเกณฑ์ที่กำหนด จำเป็นต้องเข้าพบอาจารย์ที่ปรึกษาเพื่อวางแผนการเรียนทันที`;
    explanationEn = `${creditGap} credits behind Year ${year} benchmark (Target: ${expectedCredits} cr., Actual: ${earned} cr.). Exceeds allowed gap. Urgent academic consultation required.`;
  }

  return {
    status,
    statusText,
    statusTextEn,
    expectedCredits,
    earnedCredits: earned,
    creditGap,
    year,
    badgeStyle,
    progressPercent,
    explanationTh,
    explanationEn
  };
};

const getYearMilestones = (student) => {
  const totalReq = student.creditsReq || student.totalCreditsRequired || 132;
  const earned = student.creditsEarned || 0;
  const currentYear = student.year || 1;

  return [1, 2, 3, 4].map(yr => {
    const target = Math.round(totalReq * (yr * 0.25));
    const isCurrent = yr === currentYear;
    const isPast = yr < currentYear;
    const isPassedTarget = earned >= target;

    return {
      year: yr,
      targetCredits: target,
      isCurrent,
      isPast,
      isPassedTarget,
      gap: Math.max(0, target - earned)
    };
  });
};

const DonutProgressChart = ({ studentData, lang = 'th', hoveredSegment, setHoveredSegment }) => {
  const totalReq = studentData.totalCreditsRequired || 132;
  const earnedTotal = studentData.creditsEarned;
  const C = 615.75; // 2 * PI * 98

  const catGen = studentData.categories.find(c => c.id === 'gen-ed') || { earned: 30, required: 30 };
  const catReq = studentData.categories.find(c => c.id === 'core-req') || { earned: 54, required: 72 };
  const catElec = studentData.categories.find(c => c.id === 'core-elec') || { earned: 12, required: 24 };
  const catFree = studentData.categories.find(c => c.id === 'free-elec') || { earned: 3, required: 6 };

  const dashGen = (catGen.earned / totalReq) * C;
  const dashReq = (catReq.earned / totalReq) * C;
  const dashElec = (catElec.earned / totalReq) * C;
  const dashFree = (catFree.earned / totalReq) * C;

  const offGen = 0;
  const offReq = -dashGen;
  const offElec = -(dashGen + dashReq);
  const offFree = -(dashGen + dashReq + dashElec);

  const percentTotal = ((earnedTotal / totalReq) * 100).toFixed(1);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full max-w-[480px] h-72 sm:h-80 flex items-center justify-center my-2">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 460 320" style={{ fontFamily: "'Sarabun', sans-serif" }}>
          {/* Base Track */}
          <circle
            cx="230"
            cy="160"
            r="98"
            fill="transparent"
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-700/60"
            strokeWidth="22"
            style={{
              opacity: hoveredSegment ? 0.35 : 1,
              transition: 'opacity 200ms ease'
            }}
          />

          {/* Segment 1: Gen-ed (Emerald) */}
          <circle
            cx="230"
            cy="160"
            r="98"
            fill="transparent"
            stroke="#16A34A"
            strokeWidth={hoveredSegment === 'gen-ed' ? 26 : 22}
            strokeDasharray={`${dashGen} ${C}`}
            strokeDashoffset={`${offGen}`}
            transform="rotate(-90 230 160)"
            style={{
              cursor: 'pointer',
              opacity: !hoveredSegment || hoveredSegment === 'gen-ed' ? 1 : 0.22,
              filter: hoveredSegment === 'gen-ed' ? 'drop-shadow(0 4px 14px rgba(22, 163, 74, 0.45))' : 'none',
              transition: 'all 220ms cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={() => setHoveredSegment('gen-ed')}
            onMouseLeave={() => setHoveredSegment(null)}
          />

          {/* Segment 2: Core-req (Royal Blue) */}
          <circle
            cx="230"
            cy="160"
            r="98"
            fill="transparent"
            stroke="#2563EB"
            strokeWidth={hoveredSegment === 'core-req' ? 26 : 22}
            strokeDasharray={`${dashReq} ${C}`}
            strokeDashoffset={`${offReq}`}
            transform="rotate(-90 230 160)"
            style={{
              cursor: 'pointer',
              opacity: !hoveredSegment || hoveredSegment === 'core-req' ? 1 : 0.22,
              filter: hoveredSegment === 'core-req' ? 'drop-shadow(0 4px 14px rgba(37, 99, 235, 0.45))' : 'none',
              transition: 'all 220ms cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={() => setHoveredSegment('core-req')}
            onMouseLeave={() => setHoveredSegment(null)}
          />

          {/* Segment 3: Core-elec (Vivid Purple) */}
          <circle
            cx="230"
            cy="160"
            r="98"
            fill="transparent"
            stroke="#9333EA"
            strokeWidth={hoveredSegment === 'core-elec' ? 26 : 22}
            strokeDasharray={`${dashElec} ${C}`}
            strokeDashoffset={`${offElec}`}
            transform="rotate(-90 230 160)"
            style={{
              cursor: 'pointer',
              opacity: !hoveredSegment || hoveredSegment === 'core-elec' ? 1 : 0.22,
              filter: hoveredSegment === 'core-elec' ? 'drop-shadow(0 4px 14px rgba(147, 51, 234, 0.45))' : 'none',
              transition: 'all 220ms cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={() => setHoveredSegment('core-elec')}
            onMouseLeave={() => setHoveredSegment(null)}
          />

          {/* Segment 4: Free-elec (Warm Tangerine) */}
          <circle
            cx="230"
            cy="160"
            r="98"
            fill="transparent"
            stroke="#EA580C"
            strokeWidth={hoveredSegment === 'free-elec' ? 26 : 22}
            strokeDasharray={`${dashFree} ${C}`}
            strokeDashoffset={`${offFree}`}
            transform="rotate(-90 230 160)"
            style={{
              cursor: 'pointer',
              opacity: !hoveredSegment || hoveredSegment === 'free-elec' ? 1 : 0.22,
              filter: hoveredSegment === 'free-elec' ? 'drop-shadow(0 4px 14px rgba(234, 88, 12, 0.45))' : 'none',
              transition: 'all 220ms cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={() => setHoveredSegment('free-elec')}
            onMouseLeave={() => setHoveredSegment(null)}
          />

          {/* Center Typography */}
          <text
            x="230"
            y="150"
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-slate-900 dark:fill-white font-extrabold text-4xl tabular-nums pointer-events-none select-none"
          >
            {percentTotal}%
          </text>
          <text
            x="230"
            y="184"
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-slate-500 dark:fill-[#A8B4C7] font-semibold text-sm tabular-nums pointer-events-none select-none"
          >
            {earnedTotal} / {totalReq} {lang === 'th' ? 'หน่วยกิต' : 'Credits'}
          </text>

          {/* Leader Line Callouts: Visible only when hovered */}
          <g
            style={{
              opacity: hoveredSegment === 'gen-ed' ? 1 : 0,
              transform: hoveredSegment === 'gen-ed' ? 'none' : 'translateX(6px)',
              transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
              pointerEvents: hoveredSegment === 'gen-ed' ? 'auto' : 'none'
            }}
          >
            <circle cx="310" cy="104" r="5" fill="#16A34A" />
            <polyline points="310,104 346,80 366,80" fill="none" stroke="#16A34A" strokeWidth="2.2" />
            <rect x="368" y="62" width="88" height="36" rx="8" className="fill-white dark:fill-[#191C24] stroke-[#16A34A]" strokeWidth="1.4" />
            <text x="376" y="76" fill="#16A34A" fontSize="11" fontWeight="700">{lang === 'th' ? 'ศึกษาทั่วไป' : 'Gen-Ed'}</text>
            <text x="376" y="90" className="fill-slate-800 dark:fill-slate-100 font-semibold text-[10px] tabular-nums">{catGen.earned} / {catGen.required} {lang === 'th' ? 'หน่วยกิต' : 'cr.'}</text>
          </g>

          <g
            style={{
              opacity: hoveredSegment === 'core-req' ? 1 : 0,
              transform: hoveredSegment === 'core-req' ? 'none' : 'translateX(6px)',
              transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
              pointerEvents: hoveredSegment === 'core-req' ? 'auto' : 'none'
            }}
          >
            <circle cx="298" cy="228" r="5" fill="#2563EB" />
            <polyline points="298,228 334,248 354,248" fill="none" stroke="#2563EB" strokeWidth="2.2" />
            <rect x="356" y="230" width="94" height="36" rx="8" className="fill-white dark:fill-[#191C24] stroke-[#2563EB]" strokeWidth="1.4" />
            <text x="364" y="244" fill="#2563EB" fontSize="11" fontWeight="700">{lang === 'th' ? 'เฉพาะบังคับ' : 'Core Req'}</text>
            <text x="364" y="258" className="fill-slate-800 dark:fill-slate-100 font-semibold text-[10px] tabular-nums">{catReq.earned} / {catReq.required} {lang === 'th' ? 'หน่วยกิต' : 'cr.'}</text>
          </g>

          <g
            style={{
              opacity: hoveredSegment === 'core-elec' ? 1 : 0,
              transform: hoveredSegment === 'core-elec' ? 'none' : 'translateX(-6px)',
              transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
              pointerEvents: hoveredSegment === 'core-elec' ? 'auto' : 'none'
            }}
          >
            <circle cx="156" cy="222" r="5" fill="#9333EA" />
            <polyline points="156,222 120,245 100,245" fill="none" stroke="#9333EA" strokeWidth="2.2" />
            <rect x="10" y="227" width="88" height="36" rx="8" className="fill-white dark:fill-[#191C24] stroke-[#9333EA]" strokeWidth="1.4" />
            <text x="18" y="241" fill="#9333EA" fontSize="11" fontWeight="700">{lang === 'th' ? 'เฉพาะเลือก' : 'Elective'}</text>
            <text x="18" y="255" className="fill-slate-800 dark:fill-slate-100 font-semibold text-[10px] tabular-nums">{catElec.earned} / {catElec.required} {lang === 'th' ? 'หน่วยกิต' : 'cr.'}</text>
          </g>

          <g
            style={{
              opacity: hoveredSegment === 'free-elec' ? 1 : 0,
              transform: hoveredSegment === 'free-elec' ? 'none' : 'translateX(-6px)',
              transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
              pointerEvents: hoveredSegment === 'free-elec' ? 'auto' : 'none'
            }}
          >
            <circle cx="134" cy="173" r="5" fill="#EA580C" />
            <polyline points="134,173 100,155 80,155" fill="none" stroke="#EA580C" strokeWidth="2.2" />
            <rect x="6" y="137" width="72" height="36" rx="8" className="fill-white dark:fill-[#191C24] stroke-[#EA580C]" strokeWidth="1.4" />
            <text x="14" y="151" fill="#EA580C" fontSize="11" fontWeight="700">{lang === 'th' ? 'เลือกเสรี' : 'Free Elec'}</text>
            <text x="14" y="165" className="fill-slate-800 dark:fill-slate-100 font-semibold text-[10px] tabular-nums">{catFree.earned} / {catFree.required} {lang === 'th' ? 'หน่วยกิต' : 'cr.'}</text>
          </g>
        </svg>
      </div>

      {/* Color Legend with interactive hover */}
      <div className="grid grid-cols-2 gap-2 w-full text-left text-xs mb-3 p-2.5 rounded-xl bg-slate-50 dark:bg-[#2A3038] border border-slate-200 dark:border-[#2C2E33]">
        {[
          { id: 'gen-ed', color: '#16A34A', labelTh: `ศึกษาทั่วไป (${catGen.earned} หน่วยกิต)`, labelEn: `Gen-Ed (${catGen.earned} cr.)` },
          { id: 'core-req', color: '#2563EB', labelTh: `เฉพาะบังคับ (${catReq.earned} หน่วยกิต)`, labelEn: `Core Req (${catReq.earned} cr.)` },
          { id: 'core-elec', color: '#9333EA', labelTh: `เฉพาะเลือก (${catElec.earned} หน่วยกิต)`, labelEn: `Elective (${catElec.earned} cr.)` },
          { id: 'free-elec', color: '#EA580C', labelTh: `เลือกเสรี (${catFree.earned} หน่วยกิต)`, labelEn: `Free Elec (${catFree.earned} cr.)` }
        ].map(item => {
          const isHovered = hoveredSegment === item.id;
          const isOtherHovered = hoveredSegment && hoveredSegment !== item.id;
          return (
            <div
              key={item.id}
              className="flex items-center gap-1.5 cursor-pointer p-1.5 rounded-lg transition-all select-none"
              style={{
                opacity: isOtherHovered ? 0.35 : 1,
                transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                backgroundColor: isHovered ? 'rgba(0,0,0,0.06)' : 'transparent'
              }}
              onMouseEnter={() => setHoveredSegment(item.id)}
              onMouseLeave={() => setHoveredSegment(null)}
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-transform"
                style={{
                  backgroundColor: item.color,
                  transform: isHovered ? 'scale(1.25)' : 'scale(1)'
                }}
              />
              <span className="truncate font-medium text-slate-800 dark:text-slate-100">
                {lang === 'th' ? item.labelTh : item.labelEn}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CategoryProgressList = ({ studentData, lang = 'th', onCategoryClick }) => {
  const completedCatsCount = studentData.categories.filter(c => c.earned >= c.required).length;

  return (
    <div className="flex-1 flex flex-col justify-between gap-3 sm:gap-3.5 h-full">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
          {lang === 'th' ? 'หน่วยกิตแยกตามหมวดวิชา' : 'Credits by Category'}
        </h3>
        <span className="text-xs text-slate-500 dark:text-[#A8B4C7] font-medium">
          {lang === 'th' ? `ผ่านครบแล้ว ${completedCatsCount} จาก 4 หมวด` : `${completedCatsCount} of 4 Completed`}
        </span>
      </div>

      {studentData.categories.map(cat => {
        const theme = CATEGORY_THEME[cat.id] || { color: '#2563EB' };
        const rem = Math.max(0, cat.required - cat.earned);
        const percent = Math.min(100, Math.round((cat.earned / cat.required) * 100));
        const isComplete = rem === 0;

        return (
          <div
            key={cat.id}
            onClick={() => onCategoryClick && onCategoryClick(cat.id)}
            className={`flex-1 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-slate-50 dark:bg-[#2A3038] flex flex-col justify-center gap-2.5 transition-all ${
              onCategoryClick ? 'cursor-pointer hover:border-blue-500' : ''
            }`}
          >
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: theme.color }} />
                {lang === 'th' ? cat.name : cat.nameEn}
              </span>
              <div className="flex items-center gap-2">
                <span className="tabular-nums font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  {cat.earned} / {cat.required} {lang === 'th' ? 'หน่วยกิต' : 'Credits'}
                </span>
                <span
                  className="text-[11px] font-semibold py-0.5 px-2 rounded-md whitespace-nowrap"
                  style={{
                    backgroundColor: isComplete ? 'rgba(0, 210, 91, 0.18)' : 'rgba(252, 66, 74, 0.18)',
                    color: isComplete ? '#00D25B' : '#FC424A'
                  }}
                >
                  {isComplete
                    ? (lang === 'th' ? 'ครบแล้ว' : 'Complete')
                    : (lang === 'th' ? `ขาด ${rem}` : `-${rem}`)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  style={{ width: `${percent}%`, backgroundColor: theme.color }}
                  className="h-full rounded-full transition-all duration-300"
                />
              </div>
              <span className="text-[11px] font-semibold tabular-nums text-slate-500 dark:text-[#A8B4C7] w-8 text-right">
                {percent}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function App() {
  const [theme, setTheme] = useState('light');
  const [lang, setLang] = useState('th');
  const [currentRoute, setCurrentRoute] = useState('/student');
  const [currentRole, setCurrentRole] = useState('student');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState('core-req');
  const [searchCatalogQuery, setSearchCatalogQuery] = useState('');
  const [selectedSubView, setSelectedSubView] = useState('all');
  const [onlyNotTaken, setOnlyNotTaken] = useState(false);
  const [selectedCourseDetail, setSelectedCourseDetail] = useState(null);
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [statsPeriod, setStatsPeriod] = useState('daily');

  // History filters
  const [historyTermFilter, setHistoryTermFilter] = useState('all');
  const [historyYearFilter, setHistoryYearFilter] = useState('all');
  const [historySearchQuery, setHistorySearchQuery] = useState('');

  // Selected student and admin user inspection
  const [selectedStudentId, setSelectedStudentId] = useState('6710110001');
  const [selectedAdminUser, setSelectedAdminUser] = useState(null);
  const [advisorConsultations, setAdvisorConsultations] = useState(MOCK.advisor.consultations);
  const [newConsultationText, setNewConsultationText] = useState('');

  const t = I18N[lang];

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  const toggleLang = () => setLang(prev => (prev === 'th' ? 'en' : 'th'));

  const activeStudentData = useMemo(() => {
    const found = MOCK.advisor.students.find(s => s.id === selectedStudentId);
    if (!found || found.id === '6710110001') return MOCK.student;

    const ratio = found.creditsEarned / found.creditsReq;
    const genEdEarned = Math.min(30, Math.round(30 * Math.max(0.6, ratio)));
    const freeElecEarned = ratio > 0.8 ? 6 : (found.creditsEarned > 70 ? 3 : 0);
    const remainingForMajor = Math.max(0, found.creditsEarned - genEdEarned - freeElecEarned);
    const coreReqEarned = Math.min(72, Math.round(remainingForMajor * 0.72));
    const coreElecEarned = Math.max(0, remainingForMajor - coreReqEarned);

    return {
      id: found.id,
      name: found.name,
      nameEn: found.nameEn,
      email: `${found.id}@psu.ac.th`,
      faculty: found.faculty,
      facultyEn: found.facultyEn,
      campus: "วิทยาเขตหาดใหญ่",
      campusEn: "Hat Yai Campus",
      curriculum: found.curriculum,
      curriculumEn: found.curriculumEn,
      year: found.year,
      currentTerm: "1/2569",
      currentTermEn: "1/2026",
      gpa: found.gpa,
      advisor: MOCK.advisor.name,
      advisorEn: MOCK.advisor.nameEn,
      totalCreditsRequired: found.creditsReq,
      creditsEarned: found.creditsEarned,
      creditsRemaining: Math.max(0, found.creditsReq - found.creditsEarned),
      categories: [
        {
          id: "gen-ed",
          name: "หมวดวิชาศึกษาทั่วไป",
          nameEn: "General Education",
          required: 30,
          earned: genEdEarned,
          status: genEdEarned >= 30 ? "complete" : "warning",
          subcategories: [
            { name: "กลุ่มพลเมืองไทยและพลเมืองโลก", nameEn: "Thai and Global Citizens", required: 12, earned: Math.min(12, Math.round(genEdEarned * 0.4)) },
            { name: "กลุ่มสุนทรียศาสตร์และกีฬา", nameEn: "Aesthetics and Sports", required: 6, earned: Math.min(6, Math.round(genEdEarned * 0.2)) },
            { name: "กลุ่มภาษาและการสื่อสาร", nameEn: "Language and Communication", required: 12, earned: Math.min(12, Math.round(genEdEarned * 0.4)) }
          ]
        },
        { id: "core-req", name: "หมวดวิชาเฉพาะบังคับ", nameEn: "Major Required", required: 72, earned: coreReqEarned, status: coreReqEarned >= 72 ? "complete" : "warning", subcategories: [] },
        { id: "core-elec", name: "หมวดวิชาเฉพาะเลือก", nameEn: "Major Elective", required: 24, earned: coreElecEarned, status: coreElecEarned >= 24 ? "complete" : "warning", subcategories: [] },
        { id: "free-elec", name: "หมวดวิชาเลือกเสรี", nameEn: "Free Elective", required: 6, earned: freeElecEarned, status: freeElecEarned >= 6 ? "complete" : "warning", subcategories: [] }
      ],
      currentSemesterCourses: MOCK.student.currentSemesterCourses,
      passedCourses: MOCK.student.passedCourses.slice(0, Math.max(4, Math.round(MOCK.student.passedCourses.length * ratio))),
      remainingCourses: MOCK.student.remainingCourses
    };
  }, [selectedStudentId]);

  const startTour = useCallback(() => {
    const isThai = lang === 'th';
    let steps;

    if (currentRoute === '/student') {
      steps = [
        {
          element: '#tour-student-header',
          popover: {
            title: isThai ? 'ข้อมูลนักศึกษา & ผลการเรียน' : 'Student Profile & Academic Summary',
            description: isThai
              ? 'แสดงข้อมูลชื่อ-สกุล รหัสนักศึกษา หลักสูตร เกรดเฉลี่ยสะสม (GPA) อาจารย์ที่ปรึกษา และปุ่มส่งออกรายงาน PDF สำหรับใช้ยื่นคำร้อง'
              : 'Displays student profile, curriculum, cumulative GPA, academic advisor, and official PDF export button.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '#tour-donut-progress',
          popover: {
            title: isThai ? 'ความคืบหน้ารวมตามหลักสูตร' : 'Overall Degree Progress',
            description: isThai
              ? 'แผนภูมิวงแหวนแสดงสัดส่วนหน่วยกิตสะสมที่ผ่านแล้ว พร้อมการคาดการณ์ภาคการศึกษาที่จะสำเร็จการศึกษาตามแผน'
              : 'Interactive donut chart showing earned vs required credits and graduation timeline projection.',
            side: 'right',
            align: 'center'
          }
        },
        {
          element: '#tour-category-progress',
          popover: {
            title: isThai ? 'หน่วยกิตแยกตาม 4 หมวดวิชา' : 'Credits by 4 Categories',
            description: isThai
              ? 'ตรวจสอบหน่วยกิตในแต่ละหมวด (ศึกษาทั่วไป, เฉพาะบังคับ, เฉพาะเลือก, เลือกเสรี) คลิกที่การ์ดเพื่อดูรายวิชาที่ต้องเรียน'
              : 'Detailed breakdown by 4 categories. Click any category card to drill down into specific course requirements.',
            side: 'left',
            align: 'center'
          }
        },
        {
          element: '#tour-current-enrollment',
          popover: {
            title: isThai ? 'รายวิชาที่ลงทะเบียนในภาคการศึกษาปัจจุบัน' : 'Current Term Enrollment',
            description: isThai
              ? 'รายการวิชาที่กำลังศึกษาในภาค 2/2569 จำนวนหน่วยกิต กลุ่มเรียน และสถานะการลงทะเบียน'
              : 'View courses enrolled in Term 2/2026 along with credits, sections, and schedule.',
            side: 'top',
            align: 'center'
          }
        }
      ];
    } else if (currentRoute === '/student/categories') {
      steps = [
        {
          element: '#tour-search-catalog',
          popover: {
            title: isThai ? 'ค้นหาและกรองรายวิชา' : 'Search & Filter Courses',
            description: isThai
              ? 'ค้นหาตามรหัสวิชา ชื่อวิชา และสลับหมวดหมู่วิชา 4 หมวดได้อย่างสะดวกรวดเร็ว'
              : 'Search courses by code, title, and instantly filter across 4 curriculum categories.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '#tour-catalog-grid',
          popover: {
            title: isThai ? 'รายวิชาที่เปิดรับและจำนวนที่นั่ง' : 'Available Course Catalog',
            description: isThai
              ? 'แสดงรายวิชาที่เปิดสอน ตารางเรียน ผู้สอน และแถบที่นั่งว่างแบบเรียลไทม์ คลิกเพื่อดูรายละเอียดวิชา'
              : 'Explore open courses, schedules, instructors, and real-time seat availability meters.',
            side: 'top',
            align: 'center'
          }
        }
      ];
    } else if (currentRoute === '/advisor/students') {
      steps = [
        {
          element: '#tour-advisor-students',
          popover: {
            title: isThai ? 'รายชื่อนักศึกษาในความดูแล' : 'Advisees Management Directory',
            description: isThai
              ? 'ตรวจสอบสถานะความก้าวหน้าทางการศึกษาของนักศึกษา (ปกติ, เสี่ยง, ต้องติดตามด่วน) และเข้าดูรายละเอียดผลการเรียนรายบุคคล'
              : 'Monitor advisees academic progress statuses (On-track, Warning, Critical) and drill into individual student profiles.',
            side: 'top',
            align: 'center'
          }
        }
      ];
    } else if (currentRoute === '/admin/stats') {
      steps = [
        {
          element: '#tour-admin-stats',
          popover: {
            title: isThai ? 'สถิติการใช้งานระบบภาพรวม' : 'System-wide Telemetry Analytics',
            description: isThai
              ? 'สถิติจำนวนผู้ใช้งาน การตรวจสอบหน่วยกิต และการส่งออกรายงาน PDF แยกตามวิทยาเขตและช่วงเวลา'
              : 'Real-time telemetry of active users, audit checks, and PDF exports across 5 PSU campuses.',
            side: 'top',
            align: 'center'
          }
        }
      ];
    } else {
      steps = [
        {
          element: '#tour-navigation-menu',
          popover: {
            title: isThai ? 'เมนูนำทางหลัก' : 'Navigation Menu',
            description: isThai
              ? 'เข้าถึงฟังก์ชันต่างๆ ของระบบ PSU Credit Checker ได้อย่างสะดวกรวดเร็ว'
              : 'Access all features and modules across student, advisor, and admin portals.',
            side: 'right',
            align: 'center'
          }
        }
      ];
    }

    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      overlayOpacity: 0.7,
      stagePadding: 8,
      nextBtnText: isThai ? 'ถัดไป →' : 'Next →',
      prevBtnText: isThai ? '← ย้อนกลับ' : '← Previous',
      doneBtnText: isThai ? 'เสร็จสิ้น ✓' : 'Done ✓',
      steps: steps
    });

    driverObj.drive();
  }, [currentRoute, lang]);

  const currentUserProfile = useMemo(() => {
    if (currentRole === 'advisor') {
      return {
        name: lang === 'th' ? MOCK.advisor.name : MOCK.advisor.nameEn,
        subtitle: lang === 'th' ? 'อาจารย์ที่ปรึกษา' : 'Academic Advisor',
        roleBadge: t.roleAdvisor,
        initials: lang === 'th' ? 'วท' : 'WT',
        avatarBg: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/40'
      };
    }
    if (currentRole === 'admin') {
      return {
        name: lang === 'th' ? 'นายสมศักดิ์ แอดมิน' : 'Mr. Somsak Admin',
        subtitle: 'somsak.admin@psu.ac.th',
        roleBadge: t.roleAdmin,
        initials: lang === 'th' ? 'สอ' : 'SA',
        avatarBg: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40'
      };
    }
    return {
      name: lang === 'th' ? MOCK.student.name : MOCK.student.nameEn,
      subtitle: MOCK.student.id,
      roleBadge: t.roleStudent,
      initials: lang === 'th' ? 'สช' : 'SJ',
      avatarBg: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40'
    };
  }, [currentRole, lang, t]);

  const handleOpenCourseDetail = useCallback((course) => {
    if (!course) return;
    if (typeof course === 'object') {
      const fullCourse = MOCK.catalog.find(c => c.code === course.code);
      setSelectedCourseDetail(fullCourse || {
        ...course,
        seatsMax: course.seatsMax || 45,
        seatsAvailable: course.seatsAvailable ?? 10,
        instructor: course.instructor || (lang === 'th' ? 'อาจารย์ประจำสาขาวิชา' : 'Faculty Instructor'),
        instructorEn: course.instructorEn || 'Faculty Instructor',
        schedule: course.schedule || (lang === 'th' ? 'ตามประกาศภาควิชา' : 'TBA'),
        scheduleEn: course.scheduleEn || 'TBA',
        description: course.description || (lang === 'th' ? `รายวิชา ${course.code} ตามหลักสูตรวิทยาศาสตรบัณฑิต สาขาวิชาวิทยาการคอมพิวเตอร์` : `Course ${course.code} in Computer Science curriculum.`),
        descriptionEn: course.descriptionEn || `Course ${course.code} in Computer Science curriculum.`,
        prerequisite: course.prerequisite || '-'
      });
    } else if (typeof course === 'string') {
      const found = MOCK.catalog.find(c => c.code === course);
      if (found) {
        setSelectedCourseDetail(found);
      } else {
        const inPassed = MOCK.student.passedCourses.find(c => c.code === course);
        setSelectedCourseDetail({
          code: course,
          nameTh: inPassed ? inPassed.nameTh : course,
          nameEn: inPassed ? inPassed.nameEn : course,
          credits: inPassed ? inPassed.credits : 3,
          category: inPassed ? inPassed.category : 'core-req',
          seatsMax: 45,
          seatsAvailable: 10,
          instructor: lang === 'th' ? 'อาจารย์ประจำสาขาวิชา' : 'Faculty Instructor',
          instructorEn: 'Faculty Instructor',
          schedule: lang === 'th' ? 'ตามประกาศภาควิชา' : 'TBA',
          scheduleEn: 'TBA',
          description: lang === 'th' ? `รายวิชา ${course} ตามหลักสูตรวิทยาศาสตรบัณฑิต สาขาวิชาวิทยาการคอมพิวเตอร์` : `Course ${course} in Computer Science curriculum.`,
          descriptionEn: `Course ${course} in Computer Science curriculum.`,
          prerequisite: '-'
        });
      }
    }
  }, [lang]);

  const studentMenus = [
    { route: '/student', label: t.menuOverview, icon: LayoutDashboard },
    { route: '/student/categories', label: t.menuCategories, icon: List },
    { route: '/student/history', label: t.menuHistory, icon: HistoryIcon },
    { route: '#tour', label: t.menuTour, icon: HelpCircle, action: () => startTour() }
  ];

  const advisorMenus = [
    { route: '/advisor/students', label: t.menuAdvisees, icon: Users },
    { route: '/advisor/department', label: t.menuDept, icon: BarChart3 },
    { route: '#tour', label: t.menuTour, icon: HelpCircle, action: () => startTour() }
  ];

  const adminMenus = [
    { route: '/admin/stats', label: t.menuAdminStats, icon: LayoutDashboard },
    { route: '/admin/curriculums', label: t.menuAdminCurriculums, icon: GraduationCap },
    { route: '/admin/users', label: t.menuAdminUsers, icon: UserCog },
    { route: '/admin/logs', label: t.menuAdminLogs, icon: ScrollText }
  ];

  const currentMenus = currentRole === 'student' ? studentMenus : currentRole === 'advisor' ? advisorMenus : adminMenus;

  const navigateTo = (route, action) => {
    if (action) action();
    else setCurrentRoute(route);
    setIsDrawerOpen(false);
  };

  if (currentRoute === '/login') {
    return (
      <LoginScreen
        onLogin={(role) => {
          setCurrentRole(role || 'student');
          setCurrentRoute(role === 'advisor' ? '/advisor/students' : role === 'admin' ? '/admin/stats' : '/student');
        }}
        theme={theme}
        toggleTheme={toggleTheme}
        lang={lang}
        toggleLang={toggleLang}
      />
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-[#F5F9FF] dark:bg-black text-slate-800 dark:text-white font-['Sarabun',sans-serif]">
      {/* Mobile Slide-out Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Slide-out Drawer for Mobile */}
      <div
        className={`fixed top-0 bottom-0 left-0 w-72 max-w-[85vw] bg-white dark:bg-[#191C24] z-50 shadow-2xl transition-transform duration-300 flex flex-col lg:hidden ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200 dark:border-[#2C2E33]">
          <div className="flex items-center gap-3">
            <img
              src="/PSU-Logo-usual.png"
              alt="PSU Logo"
              className="h-8 w-auto object-contain dark:brightness-0 dark:invert"
            />
            <div>
              <div className="text-sm font-bold text-blue-600 dark:text-blue-400">Credit Checker</div>
              <div className="text-[11px] text-slate-500 dark:text-[#A8B4C7]">{t.universityName}</div>
            </div>
          </div>
          <button onClick={() => setIsDrawerOpen(false)} className="p-1 rounded text-slate-500 hover:text-slate-800">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1.5 overflow-y-auto">
          {currentMenus.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.label}
                onClick={() => navigateTo(item.route, item.action)}
                className={`flex items-center gap-3.5 py-2.5 px-3.5 rounded-xl text-sm font-medium text-left transition-all ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold border-l-4 border-blue-600'
                    : 'text-slate-600 dark:text-[#A8B4C7] hover:bg-slate-100 dark:hover:bg-[#2A3038]'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-200 dark:border-[#2C2E33]">
          {/* User Profile Card */}
          <div className="p-3 mb-2 rounded-xl bg-slate-50 dark:bg-[#2A3038] border border-slate-200 dark:border-[#2C2E33] flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${currentUserProfile.avatarBg}`}>
              {currentUserProfile.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold text-slate-800 dark:text-white truncate">
                  {currentUserProfile.name}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-[#A8B4C7] truncate">
                {currentUserProfile.subtitle}
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentRoute('/login')}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            <LogOut size={16} />
            <span>{t.logoutBtn}</span>
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col border-r border-slate-200 dark:border-[#2C2E33] bg-white dark:bg-[#191C24] transition-all duration-300 sticky top-0 h-screen z-40 flex-shrink-0 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200 dark:border-[#2C2E33]">
          <div className="flex items-center gap-3">
            <img
              src="/PSU-Logo-usual.png"
              alt="PSU Logo"
              className="h-9 w-auto object-contain dark:brightness-0 dark:invert"
            />
            {!isCollapsed && (
              <div className="overflow-hidden whitespace-nowrap">
                <div className="text-sm font-bold text-blue-600 dark:text-blue-400">Credit Checker</div>
                <div className="text-xs text-slate-500 dark:text-[#A8B4C7]">ม.สงขลานครินทร์</div>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1.5 overflow-y-auto">
          {currentMenus.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.label}
                onClick={() => navigateTo(item.route, item.action)}
                className={`flex items-center gap-3.5 py-2.5 px-3.5 rounded-xl text-sm font-medium transition-all ${
                  isCollapsed ? 'justify-center px-0' : 'justify-start'
                } ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold border-l-4 border-blue-600'
                    : 'text-slate-600 dark:text-[#A8B4C7] hover:bg-slate-100 dark:hover:bg-[#2A3038]'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon size={20} className="flex-shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-200 dark:border-[#2C2E33]">
          {/* User Profile Card */}
          {!isCollapsed ? (
            <div className="p-2.5 mb-2.5 rounded-xl bg-slate-50 dark:bg-[#2A3038] border border-slate-200 dark:border-[#2C2E33] flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${currentUserProfile.avatarBg}`}>
                {currentUserProfile.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-800 dark:text-white truncate">
                  {currentUserProfile.name}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-[#A8B4C7] truncate">
                  {currentUserProfile.subtitle}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-2.5" title={`${currentUserProfile.name} (${currentUserProfile.subtitle})`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${currentUserProfile.avatarBg}`}>
                {currentUserProfile.initials}
              </div>
            </div>
          )}

          <button
            onClick={() => setCurrentRoute('/login')}
            className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-950/20 ${
              isCollapsed ? 'p-2' : ''
            }`}
            title={t.logoutBtn}
          >
            <LogOut size={16} />
            {!isCollapsed && <span>{t.logoutBtn}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        {/* Top Header Navbar */}
        <header className="h-16 bg-white dark:bg-[#191C24] border-b border-slate-200 dark:border-[#2C2E33] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#2A3038]"
              title="Toggle Sidebar"
            >
              <PanelLeft size={20} />
            </button>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#2A3038]"
              title="Open Navigation Menu"
            >
              <Menu size={22} />
            </button>
            <h1 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white truncate">
              {t.appName}
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleLang}
              className="w-9 h-9 rounded-full border border-slate-200 dark:border-[#2C2E33] bg-slate-100 dark:bg-[#2A3038] text-slate-800 dark:text-white hover:border-blue-500 flex items-center justify-center text-xs font-bold transition-all select-none"
              title="สลับภาษา / Switch Language (TH / EN)"
            >
              {lang.toUpperCase()}
            </button>

            <button
              onClick={() => startTour()}
              className="w-9 h-9 rounded-full border border-slate-200 dark:border-[#2C2E33] bg-transparent text-slate-500 dark:text-[#A8B4C7] hover:text-slate-900 dark:hover:text-white flex items-center justify-center"
              title={t.menuTour}
            >
              <HelpCircle size={17} />
            </button>

            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full border border-slate-200 dark:border-[#2C2E33] bg-transparent text-slate-800 dark:text-white flex items-center justify-center hover:bg-slate-100 dark:hover:bg-[#2A3038]"
              title={theme === 'dark' ? t.toggleThemeLight : t.toggleThemeDark}
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
        </header>

        {/* View Routing */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">
          {/* VIEW: Student Dashboard */}
          {currentRoute === '/student' && (
            <div className="flex flex-col gap-5 sm:gap-6">
              {/* Student Header Card */}
              <div id="tour-student-header" className="bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xl flex-shrink-0">
                    {lang === 'th' ? 'สช' : 'SJ'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        {lang === 'th' ? MOCK.student.name : MOCK.student.nameEn}
                      </h2>
                      <span className="tabular-nums text-xs text-slate-500 dark:text-[#A8B4C7]">{MOCK.student.id}</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        {t.year} {MOCK.student.year}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A8B4C7] mt-0.5">
                      {lang === 'th' ? MOCK.student.curriculum : MOCK.student.curriculumEn} • {lang === 'th' ? MOCK.student.faculty : MOCK.student.facultyEn}
                    </p>
                    <div className="text-xs text-slate-700 dark:text-slate-300 mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                      <span>{t.gpa}: <strong className="tabular-nums text-blue-600 dark:text-blue-400">{MOCK.student.gpa.toFixed(2)}</strong></span>
                      <span>{t.advisor}: {lang === 'th' ? MOCK.student.advisor : MOCK.student.advisorEn}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsPdfOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all"
                >
                  <Download size={16} />
                  <span>{t.exportPdfBtn}</span>
                </button>
              </div>

              {/* Donut Chart & Category Progress Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
                <div id="tour-donut-progress" className="bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl p-5 shadow-sm lg:col-span-6 flex flex-col items-center justify-between">
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white self-start">
                    {t.overallProgress}
                  </h3>

                  <DonutProgressChart
                    studentData={MOCK.student}
                    lang={lang}
                    hoveredSegment={hoveredSegment}
                    setHoveredSegment={setHoveredSegment}
                  />

                  <div className="w-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40 p-3 rounded-xl text-xs text-slate-700 dark:text-slate-300 text-left">
                    {t.remainingEst}
                  </div>
                </div>

                <div id="tour-category-progress" className="bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl p-5 shadow-sm lg:col-span-6 flex flex-col justify-between">
                  <CategoryProgressList
                    studentData={MOCK.student}
                    lang={lang}
                    onCategoryClick={(catId) => {
                      setActiveCategoryTab(catId);
                      setCurrentRoute('/student/categories');
                    }}
                  />
                </div>
              </div>

              {/* Current Term Registered Courses */}
              <div id="tour-current-enrollment" className="bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white mb-3">
                  {t.currentSemesterCourses}
                </h3>
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-[#2C2E33] text-xs font-semibold text-slate-500 dark:text-[#A8B4C7] bg-slate-50 dark:bg-[#2A3038]">
                        <th className="p-3">{t.courseCode}</th>
                        <th className="p-3">{t.courseName}</th>
                        <th className="p-3">{t.credits}</th>
                        <th className="p-3">{t.category}</th>
                        <th className="p-3">{t.time}</th>
                        <th className="p-3">{t.status}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK.student.currentSemesterCourses.map(c => (
                        <tr
                          key={c.code}
                          onClick={() => handleOpenCourseDetail(c)}
                          className="border-b border-slate-100 dark:border-[#2C2E33] hover:bg-slate-50 dark:hover:bg-[#222736] cursor-pointer transition-colors"
                        >
                          <td className="p-3 font-semibold text-blue-600 dark:text-blue-400 tabular-nums">{c.code}</td>
                          <td className="p-3 font-medium text-slate-800 dark:text-white">{lang === 'th' ? c.nameTh : c.nameEn}</td>
                          <td className="p-3 tabular-nums">{c.credits}</td>
                          <td className="p-3"><CategoryBadge categoryId={c.category} lang={lang} /></td>
                          <td className="p-3 text-xs text-slate-500 dark:text-[#A8B4C7]">{lang === 'th' ? c.time : c.timeEn}</td>
                          <td className="p-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                              {lang === 'th' ? c.status : c.statusEn}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: Categories and Open Course Catalog */}
          {currentRoute === '/student/categories' && (() => {
            const currentCat = MOCK.student.categories.find(c => c.id === activeCategoryTab) || MOCK.student.categories[0];
            const passedInCat = MOCK.student.passedCourses.filter(c => activeCategoryTab === 'all-cats' || c.category === activeCategoryTab);
            const remainingInCat = MOCK.student.remainingCourses.filter(c => activeCategoryTab === 'all-cats' || c.category === activeCategoryTab);
            const passedCodes = new Set(MOCK.student.passedCourses.map(c => c.code));

            const filteredCatalog = MOCK.availableCatalog.filter(c => {
              const matchCat = activeCategoryTab === 'all-cats' || c.category === activeCategoryTab;
              const matchQuery = searchCatalogQuery.trim() === '' ||
                c.code.toLowerCase().includes(searchCatalogQuery.toLowerCase()) ||
                c.nameTh.toLowerCase().includes(searchCatalogQuery.toLowerCase()) ||
                c.nameEn.toLowerCase().includes(searchCatalogQuery.toLowerCase());
              const matchNotTaken = !onlyNotTaken || !passedCodes.has(c.code);
              return matchCat && matchQuery && matchNotTaken;
            });

            return (
              <div className="flex flex-col gap-5 pb-20">
                {/* Category Navigation Tabs */}
                <div className="flex gap-2 border-b border-slate-200 dark:border-[#2C2E33] overflow-x-auto pb-1">
                  <button
                    onClick={() => setActiveCategoryTab('all-cats')}
                    className={`py-2 px-4 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
                      activeCategoryTab === 'all-cats'
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-slate-500 dark:text-[#A8B4C7]'
                    }`}
                  >
                    {lang === 'th' ? 'ทุกหมวดวิชา / ค้นหาทั้งหมด' : 'All Categories / Search All'}
                  </button>
                  {MOCK.student.categories.map(cat => {
                    const theme = CATEGORY_THEME[cat.id] || { color: '#2563EB' };
                    const isActive = activeCategoryTab === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategoryTab(cat.id)}
                        style={{
                          borderColor: isActive ? theme.color : 'transparent',
                          color: isActive ? theme.color : undefined
                        }}
                        className={`py-2 px-4 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 ${
                          !isActive ? 'text-slate-500 dark:text-[#A8B4C7]' : ''
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.color }} />
                        {lang === 'th' ? cat.name : cat.nameEn}
                      </button>
                    );
                  })}
                </div>

                {/* Category Status Banner */}
                {activeCategoryTab !== 'all-cats' && (() => {
                  const theme = CATEGORY_THEME[currentCat.id] || { color: '#2563EB' };
                  return (
                    <div className="bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl p-5 shadow-sm flex flex-col gap-3" style={{ borderLeft: `5px solid ${theme.color}` }}>
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.color }} />
                          {lang === 'th' ? currentCat.name : currentCat.nameEn}
                        </h3>
                        <span className="text-xs sm:text-sm tabular-nums text-slate-700 dark:text-slate-300">
                          {lang === 'th' ? 'ผ่านแล้ว' : 'Earned'} <strong style={{ color: theme.color }}>{currentCat.earned}</strong> / {lang === 'th' ? 'ต้องการ' : 'Required'} <strong>{currentCat.required}</strong> / {lang === 'th' ? 'ขาดอีก' : 'Remaining'} <strong className={currentCat.required - currentCat.earned > 0 ? 'text-red-500' : 'text-emerald-500'}>{Math.max(0, currentCat.required - currentCat.earned)}</strong> {t.credits}
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${Math.min(100, (currentCat.earned / currentCat.required) * 100)}%`, backgroundColor: theme.color }}
                          className="h-full rounded-full transition-all duration-300"
                        />
                      </div>

                      {/* Gen-Ed Subcategories */}
                      {currentCat.subcategories && currentCat.subcategories.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-2">
                          {currentCat.subcategories.map((sub, idx) => (
                            <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-[#2A3038] border border-slate-200 dark:border-[#2C2E33] text-xs">
                              <div className="font-semibold text-slate-800 dark:text-white">
                                {lang === 'th' ? sub.name : sub.nameEn}
                              </div>
                              <div className="text-slate-500 dark:text-[#A8B4C7] mt-1 tabular-nums">
                                {sub.earned} / {sub.required} {t.credits} ({lang === 'th' ? 'ครบแล้ว' : 'Complete'})
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Filter and Search Controls */}
                <div id="tour-search-catalog" className="bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl p-4 shadow-sm flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder={t.searchPlaceholder}
                        value={searchCatalogQuery}
                        onChange={(e) => setSearchCatalogQuery(e.target.value)}
                        className="w-full py-2.5 pl-9 pr-4 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-slate-50 dark:bg-[#2A3038] text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300 select-none">
                      <input
                        type="checkbox"
                        checked={onlyNotTaken}
                        onChange={(e) => setOnlyNotTaken(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                      />
                      <span>{lang === 'th' ? 'เฉพาะวิชาที่ยังไม่เคยลง' : 'Only not taken'}</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pt-1">
                    <span className="text-xs font-semibold text-slate-500 dark:text-[#A8B4C7] whitespace-nowrap">
                      {lang === 'th' ? 'มุมมอง:' : 'View:'}
                    </span>
                    {[
                      { id: 'all', labelTh: 'ทั้งหมด', labelEn: 'All' },
                      { id: 'remaining', labelTh: 'วิชาที่ต้องลงทะเบียน', labelEn: 'Required/Elective Plan' },
                      { id: 'catalog', labelTh: 'วิชาที่เปิดสอน (พร้อมตารางเรียน/ที่นั่ง)', labelEn: 'Available Schedule Catalog' },
                      { id: 'passed', labelTh: 'วิชาที่ผ่านแล้วในหมวดนี้', labelEn: 'Passed Courses' }
                    ].map(pill => (
                      <button
                        key={pill.id}
                        onClick={() => setSelectedSubView(pill.id)}
                        className={`py-1 px-3 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                          selectedSubView === pill.id
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-100 dark:bg-[#2A3038] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#2C2E33]'
                        }`}
                      >
                        {lang === 'th' ? pill.labelTh : pill.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 1: Remaining Courses */}
                {(selectedSubView === 'all' || selectedSubView === 'remaining') && remainingInCat.length > 0 && (
                  <div className="bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl p-5 shadow-sm">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                      <BookOpen size={18} className="text-amber-500" />
                      {t.coursesRequiredInCat} ({remainingInCat.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {remainingInCat.map(rc => (
                        <div
                          key={rc.code}
                          onClick={() => handleOpenCourseDetail(rc)}
                          className="p-4 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-slate-50 dark:bg-[#2A3038] flex flex-col justify-between gap-3 cursor-pointer hover:border-blue-500 hover:shadow-sm transition-all"
                        >
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <span className="tabular-nums font-bold text-blue-600 dark:text-blue-400 text-sm">{rc.code}</span>
                              <CategoryBadge categoryId={rc.category} lang={lang} />
                            </div>
                            <div className="font-semibold text-xs sm:text-sm mt-1 text-slate-800 dark:text-white">{lang === 'th' ? rc.nameTh : rc.nameEn}</div>
                            <div className="text-[11px] text-slate-500 dark:text-[#A8B4C7] mt-1">
                              {lang === 'th' ? 'วิชาบังคับก่อน' : 'Prerequisite'}: <strong>{rc.prerequisite}</strong>
                            </div>
                          </div>
                          <div>
                            {rc.availableNextTerm ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                                {lang === 'th' ? 'เปิดสอนภาค 2/2569' : 'Open 2/2026'}
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200 dark:bg-slate-700 text-slate-500">
                                {lang === 'th' ? 'ยังไม่เปิดสอน' : 'Not open'}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section 2: Open Courses with Dynamic Seat Meter */}
                {(selectedSubView === 'all' || selectedSubView === 'catalog') && (
                  <div id="tour-catalog-grid" className="bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl p-5 shadow-sm">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                      <Search size={18} className="text-blue-600 dark:text-blue-400" />
                      {lang === 'th' ? 'ตารางรายวิชาที่เปิดสอนในระบบ' : 'Open Course Schedule & Seats'} ({filteredCatalog.length})
                    </h4>

                    {filteredCatalog.length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-500 dark:text-[#A8B4C7] flex flex-col items-center gap-2">
                        <AlertCircle size={24} className="text-amber-500" />
                        <span>{t.noCoursesFound}</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                        {filteredCatalog.map(c => {
                          const isFull = c.seatsAvailable === 0;
                          const ratio = c.seatsAvailable / c.seatsMax;
                          const isNearlyFull = !isFull && ratio <= 0.15;
                          const enrolledPercent = Math.min(100, Math.round(((c.seatsMax - c.seatsAvailable) / c.seatsMax) * 100));
                          const barColor = isFull ? '#DC2626' : isNearlyFull ? '#D97706' : '#2563EB';

                          return (
                            <div
                              key={c.code}
                              onClick={() => setSelectedCourseDetail(c)}
                              className={`p-4 rounded-xl border bg-slate-50 dark:bg-[#2A3038] flex flex-col justify-between gap-3 cursor-pointer hover:border-blue-500 transition-all ${
                                isFull ? 'border-red-500/40' : 'border-slate-200 dark:border-[#2C2E33]'
                              }`}
                            >
                              <div>
                                <div className="flex justify-between items-start gap-2">
                                  <span className="tabular-nums font-bold text-blue-600 dark:text-blue-400 text-sm">{c.code}</span>
                                  <div className="flex items-center gap-1.5">
                                    <CategoryBadge categoryId={c.category} lang={lang} />
                                    <span className="text-xs font-semibold text-slate-500 dark:text-[#A8B4C7]">{c.credits} {t.credits}</span>
                                  </div>
                                </div>
                                <h5 className="font-semibold text-xs sm:text-sm mt-1 text-slate-800 dark:text-white">
                                  {lang === 'th' ? c.nameTh : c.nameEn}
                                </h5>
                                <p className="text-[11px] text-slate-500 dark:text-[#A8B4C7] mt-1">{lang === 'th' ? c.schedule : c.scheduleEn}</p>
                                <p className="text-[11px] text-slate-500 dark:text-[#A8B4C7] mt-0.5">{lang === 'th' ? 'ผู้สอน' : 'Instructor'}: {lang === 'th' ? c.instructor : c.instructorEn}</p>
                              </div>

                              {/* Dynamic Seat Bar */}
                              <div>
                                <div className="flex justify-between items-center text-xs sm:text-sm font-bold mb-1">
                                  {isFull ? (
                                    <span className="font-extrabold flex items-center gap-1.5 text-red-600 dark:text-red-400">
                                      <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                                      {lang === 'th' ? `ลงแล้ว ${c.seatsMax}/${c.seatsMax} คน (เต็ม)` : `Enrolled ${c.seatsMax}/${c.seatsMax} (Full)`}
                                    </span>
                                  ) : (
                                    <span className={isNearlyFull ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-700 dark:text-slate-200'}>
                                      {lang === 'th' ? `ลงแล้ว ${c.seatsMax - c.seatsAvailable}/${c.seatsMax} คน` : `Enrolled ${c.seatsMax - c.seatsAvailable}/${c.seatsMax}`}
                                    </span>
                                  )}
                                  <span className={`tabular-nums font-extrabold ${isFull ? 'text-red-600' : isNearlyFull ? 'text-amber-600' : 'text-blue-600 dark:text-blue-400'}`}>
                                    {isFull ? (lang === 'th' ? '100%' : '100%') : `${enrolledPercent}%`}
                                  </span>
                                </div>
                                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                  <div
                                    style={{ width: `${enrolledPercent}%`, backgroundColor: barColor }}
                                    className="h-full rounded-full transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Section 3: Passed Courses */}
                {(selectedSubView === 'all' || selectedSubView === 'passed') && (
                  <div className="bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl p-5 shadow-sm">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-emerald-500" />
                      {lang === 'th' ? 'รายวิชาที่ผ่านแล้วในหมวดนี้' : 'Passed Courses in this Category'} ({passedInCat.length})
                    </h4>
                    <div className="w-full overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-[#2C2E33] text-xs font-semibold text-slate-500 dark:text-[#A8B4C7] bg-slate-50 dark:bg-[#2A3038]">
                            <th className="p-3">{t.courseCode}</th>
                            <th className="p-3">{t.courseName}</th>
                            <th className="p-3">{t.credits}</th>
                            <th className="p-3">{t.category}</th>
                            <th className="p-3">{t.term}</th>
                            <th className="p-3">{t.grade}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {passedInCat.map(c => (
                            <tr
                              key={c.code + c.term}
                              onClick={() => handleOpenCourseDetail(c)}
                              className="border-b border-slate-100 dark:border-[#2C2E33] hover:bg-slate-50 dark:hover:bg-[#222736] cursor-pointer transition-colors"
                            >
                              <td className="p-3 font-semibold text-blue-600 dark:text-blue-400 tabular-nums">{c.code}</td>
                              <td className="p-3 text-slate-800 dark:text-white">{lang === 'th' ? c.nameTh : c.nameEn}</td>
                              <td className="p-3 tabular-nums">{c.credits}</td>
                              <td className="p-3"><CategoryBadge categoryId={c.category} lang={lang} /></td>
                              <td className="p-3 tabular-nums">{c.term}</td>
                              <td className="p-3">
                                <span className="font-bold text-slate-900 dark:text-white tabular-nums text-sm">
                                  {c.grade}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* VIEW: Registration History */}
          {currentRoute === '/student/history' && (() => {
            const gradePoints = { 'A': 4.0, 'B+': 3.5, 'B': 3.0, 'C+': 2.5, 'C': 2.0, 'D+': 1.5, 'D': 1.0, 'F': 0.0 };
            const allTerms = Array.from(new Set(MOCK.student.passedCourses.map(c => c.term))).sort((a, b) => {
              const [semA, yrA] = a.split('/').map(Number);
              const [semB, yrB] = b.split('/').map(Number);
              if (yrB !== yrA) return yrB - yrA;
              return semB - semA;
            });
            const allYears = Array.from(new Set(allTerms.map(term => term.split('/')[1]))).sort((a, b) => Number(b) - Number(a));

            const filteredHistoryCourses = MOCK.student.passedCourses.filter(c => {
              const matchTerm = historyTermFilter === 'all' || c.term === historyTermFilter;
              const matchYear = historyYearFilter === 'all' || c.term.endsWith('/' + historyYearFilter);
              const matchSearch = historySearchQuery.trim() === '' ||
                c.code.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
                c.nameTh.toLowerCase().includes(historySearchQuery.toLowerCase());
              return matchTerm && matchYear && matchSearch;
            });

            const filteredCredits = filteredHistoryCourses.reduce((sum, c) => sum + c.credits, 0);
            const totalPoints = filteredHistoryCourses.reduce((sum, c) => sum + ((gradePoints[c.grade] ?? 4.0) * c.credits), 0);
            const computedGpa = filteredCredits > 0 ? (totalPoints / filteredCredits).toFixed(2) : '0.00';

            return (
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl p-4 shadow-sm">
                    <span className="text-xs text-slate-500 dark:text-[#A8B4C7]">{lang === 'th' ? 'หน่วยกิตสะสมทั้งหมด' : 'Total Credits'}</span>
                    <div className="tabular-nums text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                      {MOCK.student.creditsEarned} / {MOCK.student.totalCreditsRequired}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl p-4 shadow-sm">
                    <span className="text-xs text-slate-500 dark:text-[#A8B4C7]">{lang === 'th' ? 'เกรดเฉลี่ยสะสม (GPAX)' : 'Cumulative GPAX'}</span>
                    <div className="tabular-nums text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                      {MOCK.student.gpa.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl p-4 shadow-sm">
                    <span className="text-xs text-slate-500 dark:text-[#A8B4C7]">{t.termCreditsLabel}</span>
                    <div className="tabular-nums text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mt-1">
                      {filteredCredits} {t.credits}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl p-4 shadow-sm">
                    <span className="text-xs text-slate-500 dark:text-[#A8B4C7]">{t.termGpaLabel}</span>
                    <div className="tabular-nums text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                      {computedGpa}
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl p-4 shadow-sm flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <HistoryIcon size={18} className="text-blue-600 dark:text-blue-400" />
                      {t.historyTitle}
                    </h3>
                    <button onClick={() => setIsPdfOpen(true)} className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold flex items-center gap-1.5">
                      <Download size={14} /> {t.exportPdfBtn}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={t.searchPlaceholder}
                        value={historySearchQuery}
                        onChange={(e) => setHistorySearchQuery(e.target.value)}
                        className="w-full py-2 pl-8 pr-3 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-slate-50 dark:bg-[#2A3038] text-xs"
                      />
                      <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                    </div>

                    <select
                      value={historyYearFilter}
                      onChange={(e) => { setHistoryYearFilter(e.target.value); setHistoryTermFilter('all'); }}
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-slate-50 dark:bg-[#2A3038] text-xs"
                    >
                      <option value="all">{t.filterAllYears}</option>
                      {allYears.map(yr => (
                        <option key={yr} value={yr}>{lang === 'th' ? `ปีการศึกษา ${yr}` : `Year ${yr}`}</option>
                      ))}
                    </select>

                    <select
                      value={historyTermFilter}
                      onChange={(e) => setHistoryTermFilter(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-slate-50 dark:bg-[#2A3038] text-xs"
                    >
                      <option value="all">{t.filterAllTerms}</option>
                      {(historyYearFilter === 'all' ? allTerms : allTerms.filter(t => t.endsWith('/' + historyYearFilter))).map(term => (
                        <option key={term} value={term}>
                          {lang === 'th' ? `ภาคการศึกษา ${term}` : `Semester ${term}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl overflow-hidden shadow-sm">
                  <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-[#2C2E33] text-xs font-semibold text-slate-500 dark:text-[#A8B4C7] bg-slate-50 dark:bg-[#2A3038]">
                          <th className="p-3">{t.courseCode}</th>
                          <th className="p-3">{t.courseName}</th>
                          <th className="p-3">{t.credits}</th>
                          <th className="p-3">{t.category}</th>
                          <th className="p-3">{t.term}</th>
                          <th className="p-3">{t.grade}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredHistoryCourses.map(c => (
                          <tr
                            key={c.code + c.term}
                            onClick={() => handleOpenCourseDetail(c)}
                            className="border-b border-slate-100 dark:border-[#2C2E33] hover:bg-slate-50 dark:hover:bg-[#222736] cursor-pointer transition-colors"
                          >
                            <td className="p-3 font-semibold text-blue-600 dark:text-blue-400 tabular-nums">{c.code}</td>
                            <td className="p-3 text-slate-800 dark:text-white">{lang === 'th' ? c.nameTh : c.nameEn}</td>
                            <td className="p-3 tabular-nums">{c.credits}</td>
                            <td className="p-3"><CategoryBadge categoryId={c.category} lang={lang} /></td>
                            <td className="p-3 tabular-nums font-semibold">{c.term}</td>
                            <td className="p-3">
                              <span className="font-bold text-slate-900 dark:text-white tabular-nums text-sm">
                                {c.grade}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* VIEW: Advisor Advisees List */}
          {currentRoute === '/advisor/students' && (
            <div id="tour-advisor-students" className="bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl p-5 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">{t.adviseesTitle}</h3>
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-[#2C2E33] text-xs font-semibold text-slate-500 dark:text-[#A8B4C7] bg-slate-50 dark:bg-[#2A3038]">
                      <th className="p-3">{lang === 'th' ? 'ชื่อ-สกุล' : 'Full Name'}</th>
                      <th className="p-3">{lang === 'th' ? 'รหัส นศ.' : 'Student ID'}</th>
                      <th className="p-3">{lang === 'th' ? 'ชั้นปี' : 'Year'}</th>
                      <th className="p-3">{lang === 'th' ? 'หน่วยกิตสะสม' : 'Earned Credits'}</th>
                      <th className="p-3">GPA</th>
                      <th className="p-3">{t.status}</th>
                      <th className="p-3">{lang === 'th' ? 'การกระทำ' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK.advisor.students.map(s => {
                      const evalStatus = calculateStudentStatus(s, lang);
                      return (
                        <tr key={s.id} className="border-b border-slate-100 dark:border-[#2C2E33] hover:bg-slate-50 dark:hover:bg-[#222736]">
                          <td className="p-3 font-semibold text-slate-800 dark:text-white">{lang === 'th' ? s.name : s.nameEn}</td>
                          <td className="p-3 tabular-nums text-slate-500 dark:text-[#A8B4C7]">{s.id}</td>
                          <td className="p-3">{t.year} {s.year}</td>
                          <td className="p-3 tabular-nums font-semibold text-slate-800 dark:text-slate-200">{s.creditsEarned}/{s.creditsReq}</td>
                          <td className="p-3 tabular-nums font-semibold">{s.gpa.toFixed(2)}</td>
                          <td className="p-3">
                            <div className="flex flex-col items-start gap-1">
                              <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs sm:text-sm font-bold ${evalStatus.badgeStyle}`}>
                                {lang === 'th' ? evalStatus.statusText : evalStatus.statusTextEn}
                              </span>
                              <div className="text-[11px] tabular-nums">
                                {evalStatus.creditGap === 0 ? (
                                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                    ✓ {lang === 'th' ? `ตามแผน (เป้า ${evalStatus.expectedCredits} นก.)` : `On-track (Target ${evalStatus.expectedCredits} cr.)`}
                                  </span>
                                ) : (
                                  <span className={evalStatus.status === 'danger' ? 'text-red-500 dark:text-red-400 font-medium' : 'text-amber-500 dark:text-amber-400 font-medium'}>
                                    {lang === 'th' ? `ขาดอีก ${evalStatus.creditGap} นก. (เป้า ${evalStatus.expectedCredits})` : `-${evalStatus.creditGap} cr. (Target ${evalStatus.expectedCredits})`}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => {
                                setSelectedStudentId(s.id);
                                setCurrentRoute('/advisor/student-detail');
                              }}
                              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-[#2C2E33] text-xs font-semibold hover:bg-slate-100 dark:hover:bg-[#2A3038] flex items-center gap-1 active:scale-95 transition-transform"
                            >
                              <Eye size={14} />
                              <span>{t.viewDetail}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW: Advisor Student Detail (Identical Layout to Student Dashboard) */}
          {currentRoute === '/advisor/student-detail' && (() => {
            const evalStatus = calculateStudentStatus(activeStudentData, lang);
            const milestones = getYearMilestones(activeStudentData);

            return (
              <div className="flex flex-col gap-5 sm:gap-6">
                {/* Navigation Bar */}
                <div className="flex justify-between items-center flex-wrap gap-2.5">
                  <button
                    onClick={() => setCurrentRoute('/advisor/students')}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#2C2E33] text-xs sm:text-sm font-bold bg-white dark:bg-[#191C24] hover:bg-slate-50 dark:hover:bg-[#2A3038] text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-all shadow-sm active:scale-95"
                  >
                    <ArrowLeft size={16} />
                    <span>{t.backToAdviseesList}</span>
                  </button>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40">
                      <AlertCircle size={14} />
                      {lang === 'th' ? 'โหมดตรวจสอบผลการเรียน' : 'Audit Mode'}
                    </span>
                    <button
                      onClick={() => setIsPdfOpen(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95"
                    >
                      <Download size={15} />
                      <span>{t.exportPdfBtn}</span>
                    </button>
                  </div>
                </div>

                {/* Student Profile Header Card */}
                <div className="bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl flex-shrink-0 ${
                      evalStatus.status === 'danger'
                        ? 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-800/40'
                        : evalStatus.status === 'warning'
                        ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/40'
                        : 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/40'
                    }`}>
                      {lang === 'th'
                        ? (activeStudentData.name ? activeStudentData.name.replace(/^(นาย|นางสาว|นาง)\s*/, '').slice(0, 2) : 'นศ')
                        : (activeStudentData.nameEn ? activeStudentData.nameEn.replace(/^(Mr\.|Ms\.|Mrs\.)\s*/, '').slice(0, 2).toUpperCase() : 'ST')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                          {lang === 'th' ? activeStudentData.name : activeStudentData.nameEn}
                        </h2>
                        <span className="tabular-nums font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#2A3038] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#2C2E33]">
                          {activeStudentData.id}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                          {t.year} {activeStudentData.year}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs sm:text-sm font-bold ${evalStatus.badgeStyle}`}>
                          {lang === 'th' ? evalStatus.statusText : evalStatus.statusTextEn}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A8B4C7] mt-0.5">
                        {lang === 'th' ? activeStudentData.curriculum : activeStudentData.curriculumEn} • {lang === 'th' ? activeStudentData.faculty : activeStudentData.facultyEn}
                      </p>
                      <div className="text-xs text-slate-700 dark:text-slate-300 mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                        <span>{t.gpa}: <strong className="tabular-nums text-blue-600 dark:text-blue-400 text-sm font-extrabold">{activeStudentData.gpa.toFixed(2)}</strong></span>
                        <span>{t.advisor}: <strong>{lang === 'th' ? activeStudentData.advisor : activeStudentData.advisorEn}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Credits Counter Pill */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-[#2C2E33] gap-1">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                      {lang === 'th' ? 'หน่วยกิตสะสม' : 'Earned Credits'}
                    </span>
                    <div className="tabular-nums text-base sm:text-lg font-extrabold text-blue-600 dark:text-blue-400">
                      {activeStudentData.creditsEarned} <span className="text-xs font-medium text-slate-400">/ {activeStudentData.totalCreditsRequired}</span>
                    </div>
                  </div>
                </div>

                {/* Academic Progression & Benchmark Audit Card */}
                <div className="bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 dark:border-[#2C2E33] pb-3">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <GraduationCap size={18} className="text-blue-600 dark:text-blue-400" />
                        {lang === 'th' ? 'การประเมินสถานะตามเกณฑ์หน่วยกิตสะสมรายชั้นปี' : 'Year-Level Cumulative Credit Benchmark Audit'}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-[#A8B4C7] mt-0.5">
                        {lang === 'th'
                          ? `ประเมินเทียบกับเป้าหมายตามแผนการเรียนของหลักสูตร (${activeStudentData.totalCreditsRequired} หน่วยกิต)`
                          : `Evaluated against study plan benchmark (${activeStudentData.totalCreditsRequired} Total Credits)`}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs sm:text-sm font-bold ${evalStatus.badgeStyle}`}>
                      {lang === 'th' ? `สถานะ: ${evalStatus.statusText}` : `Status: ${evalStatus.statusTextEn}`}
                    </span>
                  </div>

                  {/* 4-Year Milestone Stepper Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {milestones.map(ms => {
                      const isCurrentYear = ms.isCurrent;
                      const isTargetMet = ms.isPassedTarget;
                      return (
                        <div
                          key={ms.year}
                          className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                            isCurrentYear
                              ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-400 dark:border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                              : ms.isPast
                              ? 'bg-slate-50 dark:bg-[#2A3038] border-slate-200 dark:border-[#2C2E33]'
                              : 'bg-slate-50/50 dark:bg-[#222736] border-slate-200/60 dark:border-[#2C2E33]/60 opacity-80'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-800 dark:text-white">
                                {lang === 'th' ? `ชั้นปีที่ ${ms.year}` : `Year ${ms.year}`}
                              </span>
                              {isCurrentYear && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow-xs">
                                  {lang === 'th' ? 'ชั้นปีปัจจุบัน' : 'Current'}
                                </span>
                              )}
                            </div>
                            {isTargetMet ? (
                              <span className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                                <Check size={13} strokeWidth={3} />
                              </span>
                            ) : isCurrentYear ? (
                              <span className="p-1 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                                <AlertCircle size={13} />
                              </span>
                            ) : null}
                          </div>

                          <div>
                            <div className="text-[11px] text-slate-500 dark:text-[#A8B4C7]">
                              {lang === 'th' ? 'เป้าหมายสะสม' : 'Expected Benchmark'}
                            </div>
                            <div className="text-lg font-extrabold text-slate-900 dark:text-white tabular-nums mt-0.5">
                              {ms.targetCredits} <span className="text-xs font-semibold text-slate-500">{lang === 'th' ? 'หน่วยกิต' : 'cr.'}</span>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center text-[11px] mb-1 font-semibold">
                              <span className="text-slate-500 dark:text-[#A8B4C7]">{lang === 'th' ? 'สะสมจริง' : 'Actual Earned'}</span>
                              <span className="tabular-nums font-bold text-slate-800 dark:text-slate-200">
                                {Math.min(activeStudentData.creditsEarned, ms.targetCredits)} / {ms.targetCredits}
                              </span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div
                                style={{
                                  width: `${Math.min(100, Math.round((activeStudentData.creditsEarned / ms.targetCredits) * 100))}%`,
                                  backgroundColor: isTargetMet ? '#16A34A' : isCurrentYear ? (evalStatus.status === 'danger' ? '#EF4444' : '#F59E0B') : '#2563EB'
                                }}
                                className="h-full rounded-full transition-all duration-300"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Evaluation Insight Callout Box */}
                  <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
                    evalStatus.status === 'normal'
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-300'
                      : evalStatus.status === 'warning'
                      ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-300'
                      : 'bg-red-50/70 dark:bg-red-950/20 border-red-200 dark:border-red-800/40 text-red-900 dark:text-red-300'
                  }`}>
                    <div className="flex items-start gap-2.5">
                      <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-sm">
                          {lang === 'th'
                            ? `ผลการประเมิน: ${evalStatus.statusText}`
                            : `Audit Result: ${evalStatus.statusTextEn}`}
                        </div>
                        <p className="mt-0.5 text-xs opacity-90">
                          {lang === 'th' ? evalStatus.explanationTh : evalStatus.explanationEn}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 self-end sm:self-center font-semibold">
                      {lang === 'th' ? 'ความคืบหน้าเทียบเป้าหมายปีนี้:' : 'Progress to Year Benchmark:'}{' '}
                      <strong className="tabular-nums text-sm font-extrabold">{evalStatus.progressPercent}%</strong>
                    </div>
                  </div>
                </div>

                {/* Donut Chart & Category Progress Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
                  <div className="bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl p-5 shadow-sm lg:col-span-6 flex flex-col items-center justify-between">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white self-start">
                      {t.overallProgress}
                    </h3>

                    <DonutProgressChart
                      studentData={activeStudentData}
                      lang={lang}
                      hoveredSegment={hoveredSegment}
                      setHoveredSegment={setHoveredSegment}
                    />

                    <div className="w-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40 p-3 rounded-xl text-xs text-slate-700 dark:text-slate-300 text-left">
                      {activeStudentData.creditsRemaining > 0
                        ? (lang === 'th' ? `คงเหลืออีก ${activeStudentData.creditsRemaining} หน่วยกิต เพื่อสำเร็จการศึกษาตามแผน` : `${activeStudentData.creditsRemaining} credits remaining to graduate.`)
                        : (lang === 'th' ? 'ผ่านครบตามเกณฑ์หลักสูตรแล้ว' : 'Curriculum requirements fulfilled.')}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl p-5 shadow-sm lg:col-span-6 flex flex-col justify-between">
                    <CategoryProgressList
                      studentData={activeStudentData}
                      lang={lang}
                    />
                  </div>
                </div>

                {/* Consultation Notes */}
                <div className="bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl p-5 shadow-sm flex flex-col gap-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ScrollText size={18} className="text-blue-600 dark:text-blue-400" />
                    {t.consultationNotesTitle}
                  </h3>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder={t.consultationPlaceholder}
                      value={newConsultationText}
                      onChange={(e) => setNewConsultationText(e.target.value)}
                      className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-slate-50 dark:bg-[#2A3038] text-xs"
                    />
                    <button
                      onClick={() => {
                        if (!newConsultationText.trim()) return;
                        const entry = {
                          id: Date.now(),
                          studentId: activeStudentData.id,
                          date: "2 ก.ย. 2569",
                          dateEn: "2 Sep 2026",
                          author: MOCK.advisor.name,
                          authorEn: MOCK.advisor.nameEn,
                          note: newConsultationText.trim(),
                          noteEn: newConsultationText.trim()
                        };
                        setAdvisorConsultations([entry, ...advisorConsultations]);
                        setNewConsultationText('');
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold active:scale-95 transition-transform"
                    >
                      {t.addConsultationBtn}
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 mt-2">
                    {advisorConsultations.filter(c => c.studentId === activeStudentData.id).map(c => (
                      <div key={c.id} className="p-3 rounded-xl bg-slate-50 dark:bg-[#2A3038] border border-slate-200 dark:border-[#2C2E33] text-xs">
                        <div className="flex justify-between items-center text-slate-500 dark:text-[#A8B4C7] mb-1">
                          <span className="font-semibold text-slate-800 dark:text-white">{lang === 'th' ? c.author : c.authorEn}</span>
                          <span className="tabular-nums">{lang === 'th' ? c.date : c.dateEn}</span>
                        </div>
                        <div className="text-slate-800 dark:text-slate-200">{lang === 'th' ? c.note : c.noteEn}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* VIEW: Advisor Department Overview */}
          {currentRoute === '/advisor/department' && (
            <div className="flex flex-col gap-5">
              <div className="bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl p-5 shadow-sm">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{t.deptStatsTitle}</h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A8B4C7] mt-1">
                  คณะวิทยาศาสตร์ มหาวิทยาลัยสงขลานครินทร์ วิทยาเขตหาดใหญ่
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl p-5 shadow-sm lg:col-span-6 flex flex-col justify-between">
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white mb-4">{t.studentsByYear}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { year: lang === 'th' ? 'ชั้นปีที่ 1' : 'Year 1', count: 120 },
                      { year: lang === 'th' ? 'ชั้นปีที่ 2' : 'Year 2', count: 110 },
                      { year: lang === 'th' ? 'ชั้นปีที่ 3' : 'Year 3', count: 98 },
                      { year: lang === 'th' ? 'ชั้นปีที่ 4' : 'Year 4', count: 85 }
                    ].map(item => (
                      <div key={item.year} className="p-4 rounded-xl bg-slate-50 dark:bg-[#2A3038] border border-slate-200 dark:border-[#2C2E33] text-center">
                        <span className="text-xs font-semibold text-slate-500 dark:text-[#A8B4C7]">{item.year}</span>
                        <div className="tabular-nums text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">{item.count}</div>
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{lang === 'th' ? 'คน' : 'Students'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl p-5 shadow-sm lg:col-span-6 flex flex-col justify-between">
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white mb-4">{t.studentsProportion}</h3>
                  <div className="flex flex-col gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#2A3038] border border-slate-200 dark:border-[#2C2E33] flex justify-between items-center text-xs">
                      <span className="font-semibold text-emerald-600">{lang === 'th' ? 'สถานะปกติ (On-track)' : 'Normal (On-track)'}</span>
                      <strong className="tabular-nums text-slate-800 dark:text-white">342 (82.8%)</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#2A3038] border border-slate-200 dark:border-[#2C2E33] flex justify-between items-center text-xs">
                      <span className="font-semibold text-amber-600">{lang === 'th' ? 'สถานะเสี่ยง (Warning)' : 'Warning'}</span>
                      <strong className="tabular-nums text-slate-800 dark:text-white">54 (13.1%)</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#2A3038] border border-slate-200 dark:border-[#2C2E33] flex justify-between items-center text-xs">
                      <span className="font-semibold text-red-600">{lang === 'th' ? 'ต้องติดตามด่วน (Critical)' : 'Critical'}</span>
                      <strong className="tabular-nums text-slate-800 dark:text-white">17 (4.1%)</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: Admin Analytics Dashboard */}
          {currentRoute === '/admin/stats' && (() => {
            const periodData = MOCK.admin.statsByPeriod[statsPeriod];
            return (
              <div id="tour-admin-stats" className="flex flex-col gap-5">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div className="flex gap-1 bg-slate-200 dark:bg-[#2A3038] p-1 rounded-xl">
                    {['daily', 'weekly', 'monthly', 'term', 'year'].map(p => (
                      <button
                        key={p}
                        onClick={() => setStatsPeriod(p)}
                        className={`py-1 px-3 rounded-lg text-xs font-semibold transition-all ${
                          statsPeriod === p ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {p === 'daily' ? 'รายวัน' : p === 'weekly' ? 'รายสัปดาห์' : p === 'monthly' ? 'รายเดือน' : p === 'term' ? 'รายภาค' : 'รายปี'}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-slate-500 dark:text-[#A8B4C7] font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    {lang === 'th' ? 'สถิติอัปเดตแบบเรียลไทม์' : 'Real-time telemetry'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <div className="bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl p-4 shadow-sm">
                    <span className="text-xs text-slate-500 dark:text-[#A8B4C7]">{lang === 'th' ? 'ผู้ใช้งานทั้งหมด' : 'Total Users'}</span>
                    <div className="tabular-nums text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{periodData.totalUsers}</div>
                    <div className="text-[11px] text-emerald-600 font-semibold mt-1">↑ {periodData.trend}</div>
                  </div>
                  <div className="bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl p-4 shadow-sm">
                    <span className="text-xs text-slate-500 dark:text-[#A8B4C7]">{lang === 'th' ? 'การตรวจสอบหน่วยกิต' : 'Checks'}</span>
                    <div className="tabular-nums text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">{periodData.checksCount}</div>
                  </div>
                  <div className="bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl p-4 shadow-sm">
                    <span className="text-xs text-slate-500 dark:text-[#A8B4C7]">{lang === 'th' ? 'ผู้ใช้งานใหม่' : 'New Users'}</span>
                    <div className="tabular-nums text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{periodData.newUsers}</div>
                  </div>
                  <div className="bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl p-4 shadow-sm">
                    <span className="text-xs text-slate-500 dark:text-[#A8B4C7]">{lang === 'th' ? 'รายงาน PDF' : 'PDF Exports'}</span>
                    <div className="tabular-nums text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{periodData.exportedPdfs}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  <div className="bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl p-5 shadow-sm lg:col-span-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1">
                        {lang === 'th' ? 'สัดส่วนการใช้งานแยกตาม 5 วิทยาเขต ม.อ.' : 'PSU Campuses Usage'}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-[#A8B4C7] mb-4">จำนวนการตรวจสอบสะสม</p>
                    </div>
                    <div className="flex flex-col gap-3">
                      {MOCK.admin.campusStats.map(c => (
                        <div key={c.campusTh} className="flex flex-col gap-1 text-xs">
                          <div className="flex justify-between items-center font-medium">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                              {lang === 'th' ? c.campusTh : c.campusEn}
                            </span>
                            <span className="tabular-nums">{c.checks} ({c.percent}%)</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div style={{ width: `${c.percent}%`, backgroundColor: c.color }} className="h-full rounded-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl p-5 shadow-sm lg:col-span-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1">
                        {lang === 'th' ? 'สถิติการตรวจสอบหน่วยกิตแยกตามคณะ' : 'Checks by Faculty'}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-[#A8B4C7] mb-4">คณะที่มีการตรวจสอบสูงสุด</p>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      {MOCK.admin.facultyStats.map(f => (
                        <div key={f.nameTh} className="p-3 rounded-xl bg-slate-50 dark:bg-[#2A3038] border border-slate-200 dark:border-[#2C2E33] flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: f.color }} />
                            {lang === 'th' ? f.nameTh : f.nameEn}
                          </span>
                          <span className="tabular-nums font-bold text-blue-600 dark:text-blue-400">{f.count} ({f.percent}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* VIEW: Admin Users Management */}
          {currentRoute === '/admin/users' && (
            <div className="bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl p-5 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                {lang === 'th' ? 'จัดการและตรวจสอบผู้ใช้งานระบบ' : 'User Accounts Directory'}
              </h3>
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-[#2C2E33] text-xs font-semibold text-slate-500 dark:text-[#A8B4C7] bg-slate-50 dark:bg-[#2A3038]">
                      <th className="p-3">{lang === 'th' ? 'ชื่อ-สกุล' : 'Full Name'}</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">{lang === 'th' ? 'บทบาท' : 'Role'}</th>
                      <th className="p-3">{lang === 'th' ? 'หน่วยงาน' : 'Department'}</th>
                      <th className="p-3">{lang === 'th' ? 'เข้าใช้ล่าสุด' : 'Last Login'}</th>
                      <th className="p-3">{lang === 'th' ? 'การกระทำ' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK.admin.users.map(u => (
                      <tr
                        key={u.id}
                        onClick={() => {
                          setSelectedAdminUser(u);
                          if (u.role === 'นักศึกษา' || u.roleEn === 'Student') setSelectedStudentId(u.id);
                          setCurrentRoute('/admin/user-detail');
                        }}
                        className="border-b border-slate-100 dark:border-[#2C2E33] hover:bg-slate-50 dark:hover:bg-[#222736] cursor-pointer"
                      >
                        <td className="p-3 font-semibold text-slate-800 dark:text-white">{lang === 'th' ? u.name : u.nameEn}</td>
                        <td className="p-3 text-xs text-slate-500 dark:text-[#A8B4C7] tabular-nums">{u.email}</td>
                        <td className="p-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                            u.role === 'นักศึกษา' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
                          }`}>
                            {lang === 'th' ? u.role : u.roleEn}
                          </span>
                        </td>
                        <td className="p-3 text-xs">{lang === 'th' ? u.department : u.departmentEn}</td>
                        <td className="p-3 text-xs text-slate-400 tabular-nums">{u.lastLogin}</td>
                        <td className="p-3">
                          <button className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-[#2C2E33] text-xs font-semibold flex items-center gap-1">
                            <Eye size={14} />
                            <span>{t.viewDetail}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW: Admin User Details */}
          {currentRoute === '/admin/user-detail' && (() => {
            const user = selectedAdminUser || MOCK.admin.users[0];
            return (
              <div className="flex flex-col gap-5 sm:gap-6">
                {/* Navigation Bar */}
                <div className="flex justify-between items-center flex-wrap gap-2.5">
                  <button
                    onClick={() => setCurrentRoute('/admin/users')}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#2C2E33] text-xs sm:text-sm font-bold bg-white dark:bg-[#191C24] hover:bg-slate-50 dark:hover:bg-[#2A3038] text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-all shadow-sm active:scale-95"
                  >
                    <ArrowLeft size={16} />
                    <span>{lang === 'th' ? 'กลับไปหน้ารายชื่อผู้ใช้งาน' : 'Back to User Directory'}</span>
                  </button>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40">
                      <UserCog size={14} />
                      {lang === 'th' ? `โหมดผู้ดูแลระบบ — ตรวจสอบ ${user.name}` : `Admin Audit — ${user.name}`}
                    </span>
                    <button
                      onClick={() => setIsPdfOpen(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95"
                    >
                      <Download size={15} />
                      <span>{t.exportPdfBtn}</span>
                    </button>
                  </div>
                </div>

                {/* Student Profile Header Card */}
                <div className="bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/40 flex items-center justify-center font-bold text-xl flex-shrink-0">
                      {lang === 'th'
                        ? (user.name ? user.name.replace(/^(นาย|นางสาว|นาง|ดร\.|ผศ\.ดร\.)\s*/, '').slice(0, 2) : 'นศ')
                        : (user.name ? user.name.replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.|Asst\. Prof\.)\s*/, '').slice(0, 2).toUpperCase() : 'US')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{user.name}</h2>
                        <span className="tabular-nums font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#2A3038] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#2C2E33]">
                          {user.id}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 capitalize">
                          {user.role}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A8B4C7] mt-0.5">
                        {user.faculty || (lang === 'th' ? activeStudentData.curriculum : activeStudentData.curriculumEn)}
                      </p>
                      <div className="text-xs text-slate-700 dark:text-slate-300 mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                        <span>{t.gpa}: <strong className="tabular-nums text-blue-600 dark:text-blue-400 text-sm font-extrabold">{activeStudentData.gpa.toFixed(2)}</strong></span>
                        <span>{t.advisor}: <strong>{lang === 'th' ? activeStudentData.advisor : activeStudentData.advisorEn}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Credits Counter Pill */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-[#2C2E33] gap-1">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                      {lang === 'th' ? 'หน่วยกิตสะสม' : 'Earned Credits'}
                    </span>
                    <div className="tabular-nums text-base sm:text-lg font-extrabold text-blue-600 dark:text-blue-400">
                      {activeStudentData.creditsEarned} <span className="text-xs font-medium text-slate-400">/ {activeStudentData.totalCreditsRequired}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
                  <div className="bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl p-5 shadow-sm lg:col-span-6 flex flex-col items-center justify-between">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white self-start">
                      {t.overallProgress}
                    </h3>
                    <DonutProgressChart
                      studentData={activeStudentData}
                      lang={lang}
                      hoveredSegment={hoveredSegment}
                      setHoveredSegment={setHoveredSegment}
                    />
                  </div>

                  <div className="bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl p-5 shadow-sm lg:col-span-6 flex flex-col justify-between">
                    <CategoryProgressList
                      studentData={activeStudentData}
                      lang={lang}
                    />
                  </div>
                </div>
              </div>
            );
          })()}

          {/* VIEW: Curriculums & Logs */}
          {currentRoute === '/admin/curriculums' && (
            <div className="bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl p-5 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">จัดการหลักสูตร</h3>
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-[#2C2E33] text-xs font-semibold text-slate-500 bg-slate-50 dark:bg-[#2A3038]">
                      <th className="p-3">ชื่อหลักสูตร</th>
                      <th className="p-3">ระดับ</th>
                      <th className="p-3">คณะ</th>
                      <th className="p-3">หน่วยกิต</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK.admin.curriculums.map(c => (
                      <tr key={c.id} className="border-b border-slate-100 dark:border-[#2C2E33]">
                        <td className="p-3 font-medium">{c.nameTh}</td>
                        <td className="p-3">{c.level}</td>
                        <td className="p-3">{c.faculty}</td>
                        <td className="p-3 tabular-nums">{c.credits}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentRoute === '/admin/logs' && (
            <div className="bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl p-5 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">บันทึกการใช้งานระบบ</h3>
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-[#2C2E33] text-xs font-semibold text-slate-500 bg-slate-50 dark:bg-[#2A3038]">
                      <th className="p-3">เวลา</th>
                      <th className="p-3">ผู้ใช้</th>
                      <th className="p-3">การกระทำ</th>
                      <th className="p-3">รายการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK.admin.logs.map(l => (
                      <tr key={l.id} className="border-b border-slate-100 dark:border-[#2C2E33]">
                        <td className="p-3 text-xs tabular-nums text-slate-400">{l.time}</td>
                        <td className="p-3 font-semibold text-xs">{l.user}</td>
                        <td className="p-3 text-xs font-bold text-blue-600">{l.action}</td>
                        <td className="p-3 text-xs">{l.target}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Floating Demo Role Switcher */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-1.5 p-1.5 bg-white/95 dark:bg-[#191C24]/95 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-[#2C2E33] shadow-lg">
        <button
          onClick={() => { setCurrentRole('student'); setCurrentRoute('/student'); }}
          className={`px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#2C2E33] shadow-sm flex items-center gap-1.5 transition-all text-xs ${
            currentRole === 'student'
              ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-blue-500/20'
              : 'bg-white dark:bg-[#191C24] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#2A3038]'
          }`}
        >
          <GraduationCap size={14} />
          <span>{t.roleStudent}</span>
        </button>
        <button
          onClick={() => { setCurrentRole('advisor'); setCurrentRoute('/advisor/students'); }}
          className={`px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#2C2E33] shadow-sm flex items-center gap-1.5 transition-all text-xs ${
            currentRole === 'advisor'
              ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-blue-500/20'
              : 'bg-white dark:bg-[#191C24] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#2A3038]'
          }`}
        >
          <Users size={14} />
          <span>{t.roleAdvisor}</span>
        </button>
        <button
          onClick={() => { setCurrentRole('admin'); setCurrentRoute('/admin/stats'); }}
          className={`px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#2C2E33] shadow-sm flex items-center gap-1.5 transition-all text-xs ${
            currentRole === 'admin'
              ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-blue-500/20'
              : 'bg-white dark:bg-[#191C24] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#2A3038]'
          }`}
        >
          <Settings size={14} />
          <span>{t.roleAdmin}</span>
        </button>
      </div>

      {/* Printable PDF Preview Modal */}
      {isPdfOpen && (() => {
        const studentForPdf = activeStudentData;
        const evalStatus = calculateStudentStatus(studentForPdf, lang);
        return (
          <div
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
            onClick={() => setIsPdfOpen(false)}
          >
            <div
              className="bg-white text-slate-900 w-full max-w-4xl rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-300 my-auto flex flex-col gap-6 max-h-[92vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Actions (Hidden when printing) */}
              <div className="flex justify-between items-center border-b border-slate-200 pb-3.5 print:hidden">
                <div className="flex items-center gap-2">
                  <FileText size={20} className="text-blue-600" />
                  <h3 className="font-bold text-base sm:text-lg text-slate-900">
                    {lang === 'th' ? 'ตัวอย่างใบรายงานการตรวจสอบหน่วยกิต (PDF Audit Sheet)' : 'Academic Credit Audit Sheet Preview'}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm active:scale-95 transition-all"
                  >
                    <Printer size={15} />
                    <span>{t.printPdfBtn}</span>
                  </button>
                  <button
                    onClick={() => setIsPdfOpen(false)}
                    className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs sm:text-sm font-semibold transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Official PSU Audit Sheet Document Container */}
              <div id="psu-audit-document" className="bg-white p-2 text-slate-900 flex flex-col gap-5">
                {/* Official University Header */}
                <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3.5">
                    <img src="/PSU-Logo-usual.png" alt="PSU Logo" className="h-14 w-auto object-contain" />
                    <div>
                      <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
                        มหาวิทยาลัยสงขลานครินทร์ (PRINCE OF SONGKLA UNIVERSITY)
                      </h1>
                      <h2 className="text-xs sm:text-sm font-bold text-blue-700 mt-0.5">
                        {lang === 'th' ? 'ใบรายงานผลการตรวจสอบและคำนวณหน่วยกิตสะสมตามโครงสร้างหลักสูตร' : 'Official Academic Credit Progression & Curriculum Audit Report'}
                      </h2>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                        วิทยาเขตหาดใหญ่ • {studentForPdf.faculty}
                      </p>
                    </div>
                  </div>
                  <div className="text-right sm:self-center">
                    <span className="text-[11px] font-mono text-slate-500 block">
                      {lang === 'th' ? 'วันที่ออกเอกสาร:' : 'Issue Date:'} 2 ก.ย. 2569
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 block">
                      Doc ID: PSU-CS-2026-{studentForPdf.id.slice(-4)}
                    </span>
                  </div>
                </div>

                {/* Student Info & Academic Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <div className="space-y-1.5">
                    <div><span className="text-slate-500 font-semibold">{lang === 'th' ? 'ชื่อ-สกุล:' : 'Full Name:'}</span> <strong className="text-slate-900 font-bold">{studentForPdf.name} ({studentForPdf.nameEn})</strong></div>
                    <div><span className="text-slate-500 font-semibold">{lang === 'th' ? 'รหัสนักศึกษา:' : 'Student ID:'}</span> <strong className="text-slate-900 font-mono">{studentForPdf.id}</strong></div>
                    <div><span className="text-slate-500 font-semibold">{lang === 'th' ? 'หลักสูตร:' : 'Curriculum:'}</span> <span className="text-slate-800">{studentForPdf.curriculum}</span></div>
                    <div><span className="text-slate-500 font-semibold">{lang === 'th' ? 'อาจารย์ที่ปรึกษา:' : 'Academic Advisor:'}</span> <span className="text-slate-800">{studentForPdf.advisor}</span></div>
                  </div>
                  <div className="space-y-1.5 sm:border-l sm:border-slate-200 sm:pl-4">
                    <div><span className="text-slate-500 font-semibold">{lang === 'th' ? 'ระดับชั้นปี:' : 'Year Level:'}</span> <strong>{t.year} {studentForPdf.year}</strong></div>
                    <div><span className="text-slate-500 font-semibold">{lang === 'th' ? 'เกรดเฉลี่ยสะสม (GPAX):' : 'Cumulative GPAX:'}</span> <strong className="text-blue-700 text-sm font-extrabold">{studentForPdf.gpa.toFixed(2)}</strong></div>
                    <div><span className="text-slate-500 font-semibold">{lang === 'th' ? 'สถานะความก้าวหน้า:' : 'Progression Status:'}</span> <span className={`inline-flex items-center px-2 py-0.5 rounded font-bold text-[11px] ${evalStatus.badgeStyle}`}>{evalStatus.statusText}</span></div>
                    <div><span className="text-slate-500 font-semibold">{lang === 'th' ? 'หน่วยกิตสะสมรวม:' : 'Total Earned Credits:'}</span> <strong className="text-slate-900 font-extrabold">{studentForPdf.creditsEarned} / {studentForPdf.totalCreditsRequired} หน่วยกิต ({((studentForPdf.creditsEarned / studentForPdf.totalCreditsRequired) * 100).toFixed(1)}%)</strong></div>
                  </div>
                </div>

                {/* Detailed Category Breakdown Table */}
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    {lang === 'th' ? 'สรุปผลการสะสมหน่วยกิตจำแนกตามหมวดหมู่วิชา' : 'Cumulative Credits Breakdown by Category'}
                  </h4>
                  <div className="w-full overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                          <th className="p-2.5">หมวดหมู่วิชา</th>
                          <th className="p-2.5 text-center">เกณฑ์กำหนด</th>
                          <th className="p-2.5 text-center">สะสมแล้ว</th>
                          <th className="p-2.5 text-center">คงเหลือ</th>
                          <th className="p-2.5 text-center">ความคืบหน้า</th>
                          <th className="p-2.5 text-center">ผลการประเมิน</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentForPdf.categories.map(cat => {
                          const isComplete = cat.earned >= cat.required;
                          const remaining = Math.max(0, cat.required - cat.earned);
                          const percent = Math.min(100, Math.round((cat.earned / cat.required) * 100));
                          return (
                            <tr key={cat.id} className="border-b border-slate-100 hover:bg-slate-50">
                              <td className="p-2.5 font-semibold text-slate-800">
                                {lang === 'th' ? cat.nameTh : cat.nameEn}
                              </td>
                              <td className="p-2.5 text-center tabular-nums font-semibold">{cat.required} หน่วยกิต</td>
                              <td className="p-2.5 text-center tabular-nums font-bold text-blue-700">{cat.earned} หน่วยกิต</td>
                              <td className="p-2.5 text-center tabular-nums text-slate-600">{remaining} หน่วยกิต</td>
                              <td className="p-2.5 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div style={{ width: `${percent}%` }} className={`h-full rounded-full ${isComplete ? 'bg-emerald-600' : 'bg-blue-600'}`} />
                                  </div>
                                  <span className="text-[10px] tabular-nums font-semibold text-slate-600">{percent}%</span>
                                </div>
                              </td>
                              <td className="p-2.5 text-center">
                                {isComplete ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                                    <Check size={12} strokeWidth={3} /> {lang === 'th' ? 'ผ่านเกณฑ์' : 'Fulfilled'}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                                    <AlertCircle size={12} /> {lang === 'th' ? `ขาด ${remaining} หน่วยกิต` : `Needs ${remaining} cr.`}
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Progress Summary & Certification Notice */}
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <span className="font-bold text-blue-900 block text-xs sm:text-sm">
                      {studentForPdf.creditsRemaining > 0
                        ? (lang === 'th' ? `สรุปภาพรวม: ยังขาดอีก ${studentForPdf.creditsRemaining} หน่วยกิต เพื่อสำเร็จการศึกษา` : `Summary: ${studentForPdf.creditsRemaining} credits remaining to graduate`)
                        : (lang === 'th' ? 'สรุปภาพรวม: ผ่านครบตามโครงสร้างหลักสูตรกำหนด 132 หน่วยกิต' : 'Summary: All 132 credits fulfilled')}
                    </span>
                    <span className="text-[11px] text-slate-600">
                      {evalStatus.explanationTh}
                    </span>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span className="px-3 py-1 rounded-md bg-blue-600 text-white font-bold text-xs">
                      {lang === 'th' ? 'คาดว่าจะจบ:' : 'Est. Graduation:'} {studentForPdf.expectedGraduation}
                    </span>
                  </div>
                </div>

                {/* Official Signatures Section */}
                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200 mt-2 text-center text-xs">
                  <div className="flex flex-col items-center">
                    <div className="w-44 border-b border-slate-400 pb-1 mb-1"></div>
                    <span className="font-semibold text-slate-800">({studentForPdf.name})</span>
                    <span className="text-[11px] text-slate-500 mt-0.5">{lang === 'th' ? 'นักศึกษาผู้ขอตรวจสอบ' : 'Student Signature'}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-44 border-b border-slate-400 pb-1 mb-1"></div>
                    <span className="font-semibold text-slate-800">({studentForPdf.advisor})</span>
                    <span className="text-[11px] text-slate-500 mt-0.5">{lang === 'th' ? 'อาจารย์ที่ปรึกษาทางวิชาการ' : 'Academic Advisor Signature'}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Close */}
              <div className="flex justify-end pt-3 border-t border-slate-200 print:hidden">
                <button
                  onClick={() => setIsPdfOpen(false)}
                  className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-all"
                >
                  {t.closeBtn}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Course Detail Modal */}
      {selectedCourseDetail && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedCourseDetail(null)}
        >
          <div
            className="bg-white dark:bg-[#191C24] text-slate-900 dark:text-white max-w-2xl w-full rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-[#2C2E33] shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-[#2C2E33] pb-4 mb-4">
              <div>
                <span className="tabular-nums text-sm font-bold text-blue-600 dark:text-blue-400">{selectedCourseDetail.code} ({selectedCourseDetail.credits} {t.credits})</span>
                <h4 className="text-lg sm:text-xl font-bold mt-1 text-black dark:text-white">{lang === 'th' ? selectedCourseDetail.nameTh : selectedCourseDetail.nameEn}</h4>
              </div>
              <button onClick={() => setSelectedCourseDetail(null)} className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#2A3038] text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all">
                <X size={20} />
              </button>
            </div>
            <div className="text-sm space-y-3 text-slate-700 dark:text-slate-200 py-2">
              <div><strong className="text-black dark:text-white">{lang === 'th' ? 'คำอธิบาย:' : 'Description:'}</strong> <span className="text-black dark:text-slate-200">{lang === 'th' ? selectedCourseDetail.description : selectedCourseDetail.descriptionEn}</span></div>
              <div><strong className="text-black dark:text-white">{lang === 'th' ? 'วิชาบังคับก่อน:' : 'Prerequisites:'}</strong> <span className="text-black dark:text-slate-200">{selectedCourseDetail.prerequisite}</span></div>
              <div><strong className="text-black dark:text-white">{lang === 'th' ? 'ตารางเรียน:' : 'Schedule:'}</strong> <span className="text-black dark:text-slate-200">{lang === 'th' ? selectedCourseDetail.schedule : selectedCourseDetail.scheduleEn}</span></div>
              <div><strong className="text-black dark:text-white">{lang === 'th' ? 'ผู้สอน:' : 'Instructor:'}</strong> <span className="text-black dark:text-slate-200">{lang === 'th' ? selectedCourseDetail.instructor : selectedCourseDetail.instructorEn}</span></div>

              {/* Dynamic Seat Availability Meter */}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-[#2C2E33]">
                <div className="flex justify-between items-center text-sm sm:text-base font-extrabold mb-2">
                  <span className="text-slate-900 dark:text-slate-100">
                    {lang === 'th' ? 'จำนวนที่นั่ง:' : 'Seat Availability:'}
                  </span>
                  <span className={`tabular-nums ${
                    selectedCourseDetail.seatsAvailable === 0
                      ? 'text-red-600'
                      : selectedCourseDetail.seatsAvailable / selectedCourseDetail.seatsMax <= 0.15
                      ? 'text-amber-600'
                      : 'text-blue-600 dark:text-blue-400'
                  }`}>
                    {selectedCourseDetail.seatsAvailable === 0
                      ? (lang === 'th' ? `ลงแล้ว ${selectedCourseDetail.seatsMax}/${selectedCourseDetail.seatsMax} คน (เต็ม)` : `Enrolled ${selectedCourseDetail.seatsMax}/${selectedCourseDetail.seatsMax} (Full)`)
                      : (lang === 'th' ? `ลงแล้ว ${selectedCourseDetail.seatsMax - selectedCourseDetail.seatsAvailable}/${selectedCourseDetail.seatsMax} คน` : `Enrolled ${selectedCourseDetail.seatsMax - selectedCourseDetail.seatsAvailable}/${selectedCourseDetail.seatsMax}`)}
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    style={{
                      width: `${Math.min(100, Math.round(((selectedCourseDetail.seatsMax - selectedCourseDetail.seatsAvailable) / selectedCourseDetail.seatsMax) * 100))}%`,
                      backgroundColor: selectedCourseDetail.seatsAvailable === 0
                        ? '#DC2626'
                        : selectedCourseDetail.seatsAvailable / selectedCourseDetail.seatsMax <= 0.15
                        ? '#D97706'
                        : '#2563EB'
                    }}
                    className="h-full rounded-full transition-all duration-300"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-[#2C2E33]">
              <button onClick={() => setSelectedCourseDetail(null)} className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#2A3038] dark:hover:bg-[#343b45] text-slate-800 dark:text-white text-xs sm:text-sm font-semibold transition-all">
                {t.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}