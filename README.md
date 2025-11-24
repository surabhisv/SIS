# 🎓 Student Information System (SIS)

A full-stack web application designed for managing colleges, students, and course enrollments.  
This system includes three major roles:

- **Super Admin**
- **College Admin**
- **Student**

The platform supports **college approvals**, **user authentication**, **course management**, and **student enrollments**.

---

## 🚀 Features

### 🔹 **Super Admin**
- Approves or rejects new college requests
- Manages all colleges & admins
- Views platform-level analytics
- Handles pending requests

### 🔹 **College Admin**
- Logs in after college approval
- Manages courses offered by the college
- Views student enrollments
- Manages college details

### 🔹 **Student**
- Registers only if college exists
- Logs in & browses available courses
- Enrolls in courses
- Views profile & progress

---

## 🏗️ System Architecture

The project follows a clean **3-layer architecture**:

### **1️⃣ Client Layer (Frontend – React)**
- Component-based UI
- React Router v6 for navigation
- Context API for authentication
- JWT stored in localStorage
- Axios interceptors for auto token injection

### **2️⃣ Application Layer (Backend – Spring Boot)**
- REST API with Controller → Service → Repository pattern
- JWT Authentication + Authorization
- Role-based access (Admin, Student)
- Business logic handled in service layer

### **3️⃣ Data Layer (MySQL)**
- 7+ core relational tables
- Course, Enrollment, Student, College, etc.
- Managed using Spring Data JPA

---

## 🛠️ Tech Stack

### **Frontend**
- React
- Context API
- Axios + Axios Interceptors
- React Router

### **Backend**
- Spring Boot
- Spring Security + JWT
- Spring Data JPA

### **Database**
- MySQL

---

## 🔐 Authentication Flow

- User logs in → Backend validates credentials  
- Backend returns **JWT token + roles**  
- Token is stored in localStorage  
- Axios interceptor attaches token automatically  
- Protected routes check user role before access  

---

## 🔄 User Flow

### **Super Admin**
1. Login  
2. View pending college requests  
3. Approve / Reject  
4. Manage all colleges and admins  

### **College Admin**
1. Register new college request  
2. Wait for approval  
3. Admin becomes active → Login  
4. Manage courses, analytics, students  

### **Student**
1. Select college  
2. Register  
3. Login  
4. Browse courses → Enroll → View progress  



