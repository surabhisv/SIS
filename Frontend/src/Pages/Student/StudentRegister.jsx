import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import dataService from "../../services/dataService";

export default function StudentRegister() {
  const nav = useNavigate();
  const location = useLocation();

  // Get college from login
  const collegeFromLogin = location.state?.college || "";
  const [college, setCollege] = useState(collegeFromLogin);
  const [collegeOptions, setCollegeOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const colleges = dataService.getAll("colleges");
    const departments = dataService.getAll("departments");

    setCollegeOptions(colleges);
    // Use department table data instead of courses
    if (departments && departments.length > 0) {
      setDepartmentOptions(departments);
    }
  }, []);

  const handleRegister = (e) => {
    e.preventDefault();

    //check for empty fields and password match
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !phone ||
      !address ||
      !department ||
      (!college && !collegeFromLogin)
    ) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setSuccess(true);

    // Payload includes both user and student details - ready for backend integration
    const selectedCollegeId = college || collegeFromLogin;
    const registrationPayload = {
      user: {
        full_name: name,
        email,
        password,
        role: "STUDENT",
        college_id: selectedCollegeId || null,
        status: "PENDING",
      },
      student: {
        phone,
        address,
        dept_id: department,
        college_id: selectedCollegeId || null,
        approval_status: "PENDING",
      },
    };

    console.log("Registration payload", registrationPayload);
    setTimeout(() => {
      nav("/student/Studentlogin");
    }, 2000);
  };

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1920')`,
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Compact Card */}
      <div className="relative z-10 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-md mx-4 p-8">
        <h1 className="text-2xl font-extrabold text-center text-gray-900 mb-6">
          📝 Student Registration
        </h1>

        {success ? (
          <p className="text-green-600 text-center font-medium text-lg">
            Registration successful! Redirecting to approval page...
          </p>
        ) : (
          <form onSubmit={handleRegister}>
            {/* Name */}
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mb-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm"
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mb-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm"
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mb-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm"
            />

            {/* Confirm Password */}
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mb-4 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm"
            />

            {/* Phone */}
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mb-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm"
            />

            {/* Address */}
            <textarea
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mb-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm"
            />

            {/* Department */}
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mb-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm"
            >
              <option value="">Select Department</option>
              {departmentOptions.map((dept) => (
                <option key={dept.dept_id || dept} value={dept.dept_id || dept}>
                  {dept.dept_name || dept}
                </option>
              ))}
            </select>

            {/* College */}
            {collegeFromLogin ? (
              <input
                type="text"
                value={collegeFromLogin}
                readOnly
                className="w-full border border-gray-300 bg-gray-100 text-gray-700 rounded-lg px-4 py-2.5 mb-4 cursor-not-allowed text-sm"
              />
            ) : (
              <select
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mb-4 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm"
              >
                <option value="">Select College</option>
                {collegeOptions.map((option) => (
                  <option
                    key={option.id || option.college_id}
                    value={option.id || option.college_id}
                  >
                    {option.college_name || option.name || option}
                  </option>
                ))}
              </select>
            )}

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-medium py-2.5 rounded-lg shadow-md hover:from-indigo-700 hover:to-indigo-600 transition-all duration-300 text-sm"
            >
              Register
            </button>
          </form>
        )}

        <p className="text-xs text-gray-700 text-center mt-5">
          Already registered?{" "}
          <span
            className="text-indigo-600 font-semibold cursor-pointer hover:underline"
            onClick={() => nav("/student/Studentlogin")}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}
