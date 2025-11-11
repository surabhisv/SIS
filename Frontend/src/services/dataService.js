// Service for managing mock data with localStorage
class DataService {
  constructor() {
    this.initializeData();
  }

  initializeData() {
    // Initialize data in localStorage if not exists
    if (!localStorage.getItem("students")) {
      import("../data/students.json").then((data) => {
        localStorage.setItem("students", JSON.stringify(data.default));
      });
    }
    if (!localStorage.getItem("courses")) {
      import("../data/courses.json").then((data) => {
        localStorage.setItem("courses", JSON.stringify(data.default));
      });
    }
    if (!localStorage.getItem("enrollments")) {
      import("../data/enrollments.json").then((data) => {
        localStorage.setItem("enrollments", JSON.stringify(data.default));
      });
    }
    if (!localStorage.getItem("colleges")) {
      import("../data/colleges.json").then((data) => {
        localStorage.setItem("colleges", JSON.stringify(data.default));
      });
    }
    // No longer loading users.json - authentication removed
  }

  // Generic CRUD operations
  getAll(entity) {
    const data = localStorage.getItem(entity);
    return data ? JSON.parse(data) : [];
  }

  getById(entity, id) {
    const data = this.getAll(entity);
    return data.find((item) => item.id === id);
  }

  create(entity, item) {
    const data = this.getAll(entity);
    data.push(item);
    localStorage.setItem(entity, JSON.stringify(data));
    return item;
  }

  update(entity, id, updatedItem) {
    const data = this.getAll(entity);
    const index = data.findIndex((item) => item.id === id);
    if (index !== -1) {
      data[index] = { ...data[index], ...updatedItem };
      localStorage.setItem(entity, JSON.stringify(data));
      return data[index];
    }
    return null;
  }

  delete(entity, id) {
    const data = this.getAll(entity);
    const filtered = data.filter((item) => item.id !== id);
    localStorage.setItem(entity, JSON.stringify(filtered));
    return true;
  }

  // Specific queries
  getStudentsByCollege(collegeId) {
    return this.getAll("students").filter((s) => s.collegeId === collegeId);
  }

  getCoursesByCollege(collegeId) {
    return this.getAll("courses").filter((c) => c.collegeId === collegeId);
  }

  getEnrollmentsByStudent(studentId) {
    return this.getAll("enrollments").filter(
      (e) => (e.student_id || e.studentId) === studentId
    );
  }

  getCourseById(courseId) {
    return (
      this.getAll("courses").find((c) => (c.course_id || c.id) === courseId) ||
      null
    );
  }

  getEnrollmentsByCourse(courseId) {
    return this.getAll("enrollments").filter(
      (e) => (e.course_id || e.courseId) === courseId
    );
  }

  getPendingEnrollments(collegeId = null) {
    let enrollments = this.getAll("enrollments").filter(
      (e) => e.status === "Pending"
    );

    if (collegeId) {
      const students = this.getStudentsByCollege(collegeId);
      const studentIds = students.map((s) => s.id);
      enrollments = enrollments.filter((e) => studentIds.includes(e.studentId));
    }

    return enrollments;
  }
}

export default new DataService();
