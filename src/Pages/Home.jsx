import { useNavigate } from "react-router-dom";
export default function Home() {
  const nav = useNavigate();
  //function that handles role selection and navigation
  const handleRoleSelect = (role) => {
    if (role === "student") {
      nav("/student/Studentlogin");
    } else {
      nav("/CollegeAdmin/CollegeAdminlogin");
    }
  };
  return (
    <div
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1920')`,
        backgroundAttachment: "fixed",
      }}
    >
      
      <div className="absolute inset-0 bg-black/60"></div>
      {/* Content */}
      <div className="relative z-10 text-center px-6 sm:px-12 max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
          EduLink
        </h1>
        {/* Subtitle */}
        <p className="text-gray-100 text-lg md:text-xl mb-14 leading-relaxed max-w-3xl mx-auto font-light">
          A secure portal for{" "}
          <span className="font-semibold text-blue-200">Students</span> and{" "}
          <span className="font-semibold text-blue-200">Administrators</span>{" "}
          to manage academic information, course enrollments, and institutional
          workflows seamlessly.
        </p>
        {/* Role Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          {/* Student Portal */}
          <button
            onClick={() => handleRoleSelect("student")}
            className="px-6 py-2 rounded-full font-semibold text-white shadow-xl
               bg-white/10 border-2 border-white/30
               transition-all duration-200 ease-out transform hover:-translate-y-1 hover:scale-105
               hover:bg-white/20 hover:border-white/50 hover:shadow-2xl
               backdrop-blur-sm"
          >
            <span className="text-sm">Student Portal</span>
          </button>
          {/* Admin Portal */}
          <button
            onClick={() => handleRoleSelect("admin")}
            className="px-6 py-2 rounded-full font-semibold text-white shadow-xl
               bg-white/10 border-2 border-white/30
               transition-all duration-200 ease-out transform hover:-translate-y-1 hover:scale-105
               hover:bg-white/20 hover:border-white/50 hover:shadow-2xl
               backdrop-blur-sm"
          >
            <span className="text-sm">Admin Portal</span>
          </button>
        </div>
        {/* Footer Text */}
        <p className="text-sm text-gray-200 mt-14 tracking-widest uppercase">
          Secure • Smart • Student-Centric
        </p>
      </div>
    </div>
  );
}