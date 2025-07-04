import React, { useEffect, useState } from "react";
import {
  FileText,
  Heart,
  TrendingUp,
  Users,
  Eye,
  Calendar,
  Trash,
  BookCheck,
} from "lucide-react";
import axios from "axios";
import moment from "moment"

const Dashboard = () => {
  // Mock data - in a real app, this would come from an API
  const stats = {
    totalBlogs: 24,
    totalLikes: 1247,
    totalViews: 8542,
    totalComments: 389,
  };
  const token = localStorage.getItem("adminToken");
  const apiUrl = process.env.REACT_APP_API_URL;
  const [dashboardData, setDashboardData] = useState({
    totalBlog: 0,
    totalSuccessCount: 0,
    totalDeletedCount: 0,
    totalLikes: 0,
  });
  const [recentBlogs, setRecentBlogs] = useState([]);

  const fetchDashboardDetails = async () => {
    try {
      
    
    const response = await axios.post(
      `${apiUrl}/admin/dashboard_info`,
      {}, // body (if no data to send)
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    //   return response.data;
    const data = await response.data;
    // console.log(data);
    
    if (data?.status) {
      setDashboardData({ ...data?.data?.dashboardOverview });
      setRecentBlogs([...data?.data?.recentBlogs ]);
    }
    } catch (error) {
      console.log(error);
      
    }
  };

  useEffect(()=>{
    fetchDashboardDetails()
  },[])

  // const recentBlogs = [
  //   {
  //     id: 1,
  //     title: "Getting Started with React Hooks",
  //     date: "2024-01-15",
  //     likes: 45,
  //     views: 234,
  //     status: "published",
  //   },
  //   {
  //     id: 2,
  //     title: "Advanced TypeScript Patterns",
  //     date: "2024-01-12",
  //     likes: 67,
  //     views: 412,
  //     status: "published",
  //   },
  //   {
  //     id: 3,
  //     title: "Building Responsive Layouts",
  //     date: "2024-01-10",
  //     likes: 23,
  //     views: 156,
  //     status: "draft",
  //   },
  // ];

  const StatCard = ({ icon: Icon, title, value, change, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className="text-sm text-green-600 mt-1 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              {change}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome to Your Blog Dashboard
        </h1>
        <p className="text-blue-100">
          Manage your content and track your blog's performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FileText}
          title="Total Blogs"
          value={dashboardData.totalBlog}
          color="bg-blue-500"
        />
        <StatCard
          icon={Heart}
          title="Total Likes"
          value={dashboardData?.totalLikes?.toLocaleString() || 0}
          color="bg-red-500"
        />
        <StatCard
          icon={BookCheck}
          title="Published Blogs"
          value={dashboardData?.totalSuccessCount?.toLocaleString() || 0}
          color="bg-green-500"
        />
        <StatCard
          icon={Trash}
          title="Deleted Blogs"
          value={dashboardData?.totalDeletedCount?.toLocaleString() || 0}
          color="bg-red-500"
        />
      </div>

      {/* Recent Blogs */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Blog Posts
          </h2>
        </div>
        { recentBlogs?.length ?  <div className="p-6">
          <div className="space-y-4">
            {recentBlogs.map((blog) => (
              <div
                key={blog.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{blog.title}</h3>
                  <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {moment(blog.created_at).format("DD-MM-YYYY")}
                    </span>
                    <span className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      {blog.likes}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    blog.deleted_at == null
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {blog.deleted_at == null ? "Published" : "Deleted"}
                </span>
              </div>
            ))}
          </div>
        </div> : <h1 className="text-center m-10">Recent Blogs Not Found!! </h1>}
      </div> 

      {/* Quick Actions */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Quick Actions</h3>
          <p className="text-blue-700 mb-4">Get started with common tasks</p>
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-2 bg-white rounded-lg hover:bg-blue-50 transition-colors text-blue-800 font-medium">
              Create New Blog Post
            </button>
            <button className="w-full text-left px-4 py-2 bg-white rounded-lg hover:bg-blue-50 transition-colors text-blue-800 font-medium">
              View All Posts
            </button>
            <button className="w-full text-left px-4 py-2 bg-white rounded-lg hover:bg-blue-50 transition-colors text-blue-800 font-medium">
              Manage Comments
            </button>
          </div>
        </div> */}

      {/* <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">Analytics Overview</h3>
          <p className="text-purple-700 mb-4">Your blog's performance this month</p>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-purple-800">Page Views</span>
              <span className="font-semibold text-purple-900">+15%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-800">Engagement Rate</span>
              <span className="font-semibold text-purple-900">+8%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-800">New Subscribers</span>
              <span className="font-semibold text-purple-900">+23%</span>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;
