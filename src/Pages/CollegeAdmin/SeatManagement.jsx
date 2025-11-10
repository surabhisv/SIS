import CollegeAdminLayout from "../../components/CollegeAdminLayout";

export default function SeatManagementPage() {
  return (
    <CollegeAdminLayout activePage="seat-management">
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Seat Management</h2>
          <p className="text-gray-500 text-lg">
            🚧 This feature is currently under development. Stay tuned!
          </p>
        </div>
      </div>
    </CollegeAdminLayout>
  );
}
