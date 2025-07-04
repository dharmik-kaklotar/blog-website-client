import React, { useEffect, useState } from "react";
import { Edit, Trash2, Eye, Calendar, Heart } from "lucide-react";
import axios from "axios";
import moment from "moment";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleDelete = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const token = localStorage.getItem("adminToken");
  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchDashboardDetails = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/admin/get_blog`,
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
        setBlogs(data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchDashboardDetails();
  }, []);
    const navigate = useNavigate();
  const handleEdit = (id) => {
    navigate(`/admin/blog-edit/${id}`)
    // console.log("Edit blog with id:", id);
    
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/admin/delete_blog/${selectedId}`,
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
        //
        toast.success("Blog Deleted!!");
        fetchDashboardDetails();
      }
    } catch (error) {
      toast.success("Failed To delete Blog!!");
      console.log(error);
    }

    // setBlogs((prev) => prev.filter((blog) => blog.id !== selectedId));
    setShowConfirm(false);
    setSelectedId(null);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setSelectedId(null);
  };
  //   const formatDate = (dateString) => {
  //     return new Date(dateString).toLocaleDateString("en-US", {
  //       year: "numeric",
  //       month: "short",
  //       day: "numeric",
  //     });
  //   };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-600 mt-1">Manage all your blog posts</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer" onClick={()=>{navigate(`/admin/create-blog`)}}>
          Create New Post
        </button>
      </div>

      {/* confirm delete  */}

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/10">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Confirm Deletion
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this blog post?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{blogs.length}</div>
          <div className="text-sm text-gray-600">Total Posts</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {blogs.filter((b) => b.deleted_at == null).length}
          </div>
          <div className="text-sm text-gray-600">Published</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-red-600">
            {blogs.filter((b) => b.deleted_at != null).length}
          </div>
          <div className="text-sm text-gray-600">Deleted</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {blogs.reduce((sum, blog) => sum + +blog.likes, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Likes</div>
        </div>
      </div>

      {/* Blog Table */}
      {blogs?.length ? <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-4 w-[40%] font-semibold">Title</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-center">Likes</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr
                key={blog.id}
                className={`border-t ${
                  blog.deleted_at
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                    : "hover:bg-gray-50"
                }`}
                aria-disabled={!!blog.deleted_at}
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{blog.title}</div>
                  <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {blog.description}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {moment(blog.created_at).format("DD-MM-YYYY")}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      blog.deleted_at == null
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {blog.deleted_at == null ? "Published" : "Removed"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 text-center">
                  <div className="flex items-center justify-center gap-4">
                    {/* <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {blog.views}
                    </div> */}
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      {blog.likes}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      disabled={!!blog.deleted_at}
                      onClick={() => handleEdit(blog.id)}
                      className={`${
                        blog.deleted_at != null
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                      } p-2 border border-gray-300 rounded-md hover:bg-gray-100`}
                    >
                      <Edit className="h-4 w-4 text-gray-700" />
                    </button>
                    <button
                      disabled={!!blog.deleted_at}
                      onClick={() => handleDelete(blog.id)}
                      className={`${
                        blog.deleted_at != null
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                      } p-2 border border-red-200 text-red-600 rounded-md hover:bg-red-50`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> : <h1 className="text-center mt-54">No Blogs Found!!</h1>}

      {/* Pagination */}
      {/* <div className="flex justify-center mt-6">
        <nav className="inline-flex gap-1 text-sm">
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">
            &laquo;
          </button>
          <button className="px-3 py-1 border border-blue-600 text-white bg-blue-600 rounded">
            1
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">
            2
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">
            3
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">
            &raquo;
          </button>
        </nav>
      </div> */}
    </div>
  );
};

export default BlogList;
