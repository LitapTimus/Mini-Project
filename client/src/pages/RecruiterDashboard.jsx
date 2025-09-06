import React from "react";

export default function RecruiterDashboard() {
  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">CareerCompass</h1>
        <div className="space-x-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Post Job
          </button>
          <button className="bg-gray-200 px-4 py-2 rounded-lg">Logout</button>
        </div>
      </nav>

      {/* Main Dashboard */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="bg-white shadow rounded-lg p-4 col-span-1 space-y-4">
          <h2 className="font-bold text-lg">Menu</h2>
          <ul className="space-y-2">
            <li>
              <a href="#" className="block p-2 rounded hover:bg-blue-50">
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="block p-2 rounded hover:bg-blue-50">
                Posted Jobs
              </a>
            </li>
            <li>
              <a href="#" className="block p-2 rounded hover:bg-blue-50">
                Applicants
              </a>
            </li>
            <li>
              <a href="#" className="block p-2 rounded hover:bg-blue-50">
                Company Profile
              </a>
            </li>
            <li>
              <a href="#" className="block p-2 rounded hover:bg-blue-50">
                Messages
              </a>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="col-span-3 space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <h3 className="text-sm text-gray-500">Jobs Posted</h3>
              <p className="text-2xl font-bold text-blue-600">12</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <h3 className="text-sm text-gray-500">Total Applicants</h3>
              <p className="text-2xl font-bold text-green-600">245</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <h3 className="text-sm text-gray-500">Interviews Scheduled</h3>
              <p className="text-2xl font-bold text-purple-600">18</p>
            </div>
          </div>

          {/* Recent Job Posts */}
          <section className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-bold text-lg mb-4">Recent Job Posts</h2>
            <ul className="space-y-3">
              <li className="flex justify-between items-center border-b pb-2">
                <div>
                  <h3 className="font-semibold">Frontend Developer</h3>
                  <p className="text-sm text-gray-500">
                    Posted 2 days ago • 34 applicants
                  </p>
                </div>
                <button className="text-blue-600 hover:underline">View</button>
              </li>
              <li className="flex justify-between items-center border-b pb-2">
                <div>
                  <h3 className="font-semibold">Data Analyst</h3>
                  <p className="text-sm text-gray-500">
                    Posted 5 days ago • 21 applicants
                  </p>
                </div>
                <button className="text-blue-600 hover:underline">View</button>
              </li>
              <li className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">UI/UX Designer</h3>
                  <p className="text-sm text-gray-500">
                    Posted 1 week ago • 45 applicants
                  </p>
                </div>
                <button className="text-blue-600 hover:underline">View</button>
              </li>
            </ul>
          </section>

          {/* Applicants Section */}
          <section className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-bold text-lg mb-4">Recent Applicants</h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Name</th>
                  <th className="p-2">Position</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">Amit Sharma</td>
                  <td className="p-2">Frontend Developer</td>
                  <td className="p-2 text-green-600">Shortlisted</td>
                  <td className="p-2">
                    <button className="text-blue-600 hover:underline">
                      View
                    </button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Priya Mehta</td>
                  <td className="p-2">Data Analyst</td>
                  <td className="p-2 text-yellow-600">Under Review</td>
                  <td className="p-2">
                    <button className="text-blue-600 hover:underline">
                      View
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="p-2">Rahul Verma</td>
                  <td className="p-2">UI/UX Designer</td>
                  <td className="p-2 text-red-600">Rejected</td>
                  <td className="p-2">
                    <button className="text-blue-600 hover:underline">
                      View
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </div>
  );
}
