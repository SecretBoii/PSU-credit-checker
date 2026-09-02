# PSU Credit Checker — Design & Development Guidelines

> ระบบตรวจสอบและคำนวณหน่วยกิตสะสมตามโครงสร้างหลักสูตร มหาวิทยาลัยสงขลานครินทร์ (Prince of Songkla University)

---

## 1. Design System & Iconography Guidelines

### No Emoji Rule (ข้อกำหนดการใช้ไอคอนแทน Emoji)
* **ใช้ Lucide Icons เสมอ**: ห้ามใช้ Unicode Emojis (เช่น หมวกปริญญา, คุณครู, ฟันเฟือง, กราฟ, สมุด ฯลฯ) ในทุกองค์ประกอบของ UI ให้ใช้ SVG/Lucide Icons ที่คมชัด เป็นมืออาชีพ และจัดสัดส่วนได้สวยงาม
* **ขอบเขตการใช้งาน**:
  * **ปุ่มกดและสลับบทบาท (Buttons & Role Switchers)**:
    * นักศึกษา (Student): `<GraduationCap size={14} />`
    * อาจารย์ที่ปรึกษา (Advisor): `<Users size={14} />`
    * ผู้ดูแลระบบ (Admin): `<Settings size={14} />`
  * **ป้ายข้อความและจุดเด่น (Checkmarks & Badges)**:
    * จุดเด่นระบบ: `<CheckCircle2 size={15} />`
    * สถานะแจ้งเตือน: `<AlertCircle size={15} />`
  * **เมนูนำทางและแท็บ (Navigation Tabs & Menus)**:
    * ภาพรวม: `<LayoutDashboard size={18} />`
    * รายวิชาตามหมวด: `<List size={18} />`
    * ประวัติการเรียน: `<History size={18} />`
    * นักศึกษาในความดูแล: `<Users size={18} />`
    * สถิติผู้ดูแลระบบ: `<BarChart3 size={18} />`
    * คู่มือการใช้งาน: `<HelpCircle size={18} />`
  * **Interactive Tour (`driver.js`)**:
    * หัวข้อและคำอธิบายใน Popover ต้องใช้ Typography ที่สะอาด ปราศจาก Emoji ปน
* **การจัดวางไอคอน (Icon Alignment)**:
  * ใช้คลาส `inline-flex items-center gap-1.5` หรือ `gap-2` เพื่อจัดตำแหน่งกึ่งกลางระหว่างไอคอนกับข้อความ
  * กำหนดขนาดไอคอนให้ได้สัดส่วนตามระดับ UI:
    * **ปุ่ม / ป้ายขนาดเล็ก**: `size={13}` ถึง `size={14}`
    * **เมนู / ตาราง**: `size={16}` ถึง `size={18}`
    * **หัวข้อการ์ด / โมดอล**: `size={18}` ถึง `size={20}`
    * **Hero Banner / กล่องสำคัญ**: `size={24}` ขึ้นไป

### Color Palette & PSU Branding
* **Primary Brand**: PSU Royal Blue `#2563EB` (Hover: `#1D4ED8`, Background Tint: `rgba(37, 99, 235, 0.12)`)
* **หมวดวิชา 4 หมวด**:
  * **หมวดศึกษาทั่วไป (Gen-Ed)**: เขียวมรกต `#16A34A`
  * **หมวดเฉพาะบังคับ (Core Req)**: น้ำเงิน `#2563EB`
  * **หมวดเฉพาะเลือก (Core Elec)**: ม่วง `#9333EA`
  * **หมวดเลือกเสรี (Free Elec)**: ส้มอำพัน `#D97706`
* **Dark Mode**: รองรับเต็มรูปแบบด้วย Tailwind v4 (`.dark`, `dark:bg-[#191C24]`, `dark:border-[#2C2E33]`, `dark:text-white`)
* **Typography**: ฟอนต์ `Sarabun` (Google Fonts) พร้อมตัวเลขแบบ `tabular-nums` สำหรับสถิติและหน่วยกิต

---

## 2. Brand Assets & Logo Usage

ไฟล์ภาพทั้งหมดจัดเก็บไว้ในโฟลเดอร์ `public/`:
* **`/PSU-Logo-usual.png`**: โลโก้หลักของระบบ ใช้ในหน้า Login ฝั่งขวา, Desktop Sidebar และ Mobile Drawer (ใส่คลาส `dark:brightness-0 dark:invert` สำหรับ Dark Mode)
* **`/PSU_Logo.png`**: ตราสัญลักษณ์มหาวิทยาลัย ใช้ในกระจก Glassmorphic ของ Login Scenery Panel ฝั่งซ้าย
* **`/PSU-brand.png`**: ป้ายแบรนด์ตัวหนังสือ ม.อ. ขนาดใหญ่ (Large Lockup) ใน Login Scenery Panel
* **`/PSU-view.jpg`**: ภาพพื้นหลังอาคาร ม.อ. คุณภาพสูงฝั่งซ้ายของหน้าเข้าสู่ระบบ

---

## 3. Core Architecture & Features

### 3.1 Role-Based Views & Navigation
* **Student Dashboard (`/student`)**:
  * ข้อมูลนักศึกษา, ผลการเรียนสะสม (GPAX), อาจารย์ที่ปรึกษา
  * Donut Chart คำนวณความคืบหน้ารวม พร้อมพยากรณ์ภาคการศึกษาที่สำเร็จการศึกษา
  * รายการสรุปหน่วยกิต 4 หมวดวิชา (คลิกเพื่อเจาะลึกได้ทันที)
  * ตารางรายวิชาที่ลงทะเบียนในภาคเรียนปัจจุบัน
* **Categories & Open Catalog (`/student/categories`)**:
  * กรองรายวิชาตามหมวดหมู่ พร้อมค้นหาและตัวกรองเฉพาะวิชาที่ยังไม่เคยลง
  * Dynamic Seat Availability Meter แสดงจำนวนที่นั่งว่างและเปอร์เซ็นต์แบบเรียลไทม์
  * โมดอลรายละเอียดวิชา (Course Detail Modal)
* **Enrollment History (`/student/history`)**:
  * สรุปผลการศึกษา, หน่วยกิต และ GPA ประจำภาคที่เลือก
  * ทรานสคริปต์ประวัติผลการเรียนทุกภาคการศึกษา พร้อมเกรดที่ได้รับ
* **Advisor Portal (`/advisor/students`)**:
  * รายชื่อนักศึกษาในความดูแล พร้อมตัวบ่งชี้สถานะ (On-track / Warning / Critical)
  * บันทึกการให้คำปรึกษาทางวิชาการ (Consultation Notes)
* **Admin Analytics (`/admin/stats`)**:
  * แดชบอร์ด Telemetry สถิติการใช้งาน และการตรวจสอบหน่วยกิตของทั้ง 5 วิทยาเขต ม.อ.
  * ข้อมูลจำแนกตามช่วงเวลา (รายวัน / รายสัปดาห์ / รายเดือน / รายภาค / รายปี)

### 3.2 Interactive Guided Tour (`driver.js`)
* ติดตั้งและเชื่อมต่อผ่าน `driver.js` พร้อมสไตล์ Custom ใน `src/index.css`
* ปรับเปลี่ยน Step และข้อความแนะนำตามหน้าที่กำลังเปิดอยู่และบทบาทของผู้ใช้
* รองรับ 2 ภาษา (TH / EN) และ Dark Mode อัตโนมัติ

### 3.3 Internationalization (i18n) & Theme Switch
* สลับภาษาได้ทุกหน้าผ่านปุ่ม `TH / EN`
* สวิตช์ปรับธีมแบบ Custom Pill Switch พร้อมไอคอน `Sun` และ `Moon` ขนาดใหญ่ คมชัด

---

## 4. Code Quality & Verification Commands

ก่อนส่งมอบงานทุกครั้ง ต้องผ่านการตรวจสอบคุณภาพโค้ด 100%:
```bash
# 1. ตรวจสอบ Linting
npm run lint

# 2. ตรวจสอบ Production Build
npm run build
```
