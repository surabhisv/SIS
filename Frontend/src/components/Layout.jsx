import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children, role = "student", userName = "User" }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role={role} />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar role={role} userName={userName} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
