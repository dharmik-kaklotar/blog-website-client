import React, { useEffect, useState } from "react";
import {
  Save,
  Eye,
  Upload,
  Tag,
  Calendar,
  ChartBarStacked,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams , useNavigate} from "react-router-dom";
const CreateBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const token = localStorage.getItem("adminToken");
  const apiUrl = process.env.REACT_APP_API_URL;
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    // excerpt: '',
    // tags: '',
    featuredMedia: null,
    // status: 'draft',
  });

  const fetchDashboardDetails = async (id, token, setFormData) => {
    try {
      const response = await axios.post(
        `${apiUrl}/admin/get_blog`,
        { id }, // Assuming ID is required in body — change to {} if not
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      if (data?.status) {
        setMediaType("url");
        setFormData({
          title: data?.data?.title,
          content: data?.data?.description,
          category: data?.data?.categoty_id,
          featuredMedia: data?.data?.media_url,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (id) {
      fetchDashboardDetails(id, token, setFormData);
    }
  }, [id]);

  const [mediaType, setMediaType] = useState("image"); // 'image' | 'video' | 'url'
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [categories, setCategories] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, featuredMedia: file }));
    }
  };
  const findAllcategories = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/admin/get_all_categories`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.data;

      if (data?.status) {
        setCategories(data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    findAllcategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      //   await new Promise((resolve) => setTimeout(resolve, 1000));
      //   console.log("formData=>>",formData);
      const form = new FormData();
      form.append("title", formData?.title);
      form.append("description", formData.content);
      form.append("categoty_id", formData.category);
      form.append("media", formData.featuredMedia);
      let baseUrl = "";
      if (id) {
        baseUrl = `${apiUrl}/admin/update_blog/${id}`;
      } else {
        baseUrl = `${apiUrl}/admin/create_blog`;
      }
      try {
        const response = await axios.post(baseUrl, form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.data;
        if (data?.status) {
          if (id) {
            toast.success("Blog Updated Successfully!!");
          } else {
            toast.success("Blog Created Successfully!!");
          }
        } else {
          if (id) {
            toast.error(data?.message || "Blog Not Created!!" );
          } else {
            toast.error(data?.message || "Blog Not Created!!");
          }
        }
      } catch (error) {
        if (id) {
          toast.error("Eror Updating Blog!!");
        } else {
          toast.error("Eror Creating Blog!!");
        }

        console.log("Error", error);
      }

      setFormData({
        title: "",
        content: "",
        category: "",
        // excerpt: '',
        // tags: '',
        featuredMedia: null,
        // status: 'draft',
      });
    } catch (error) {
      alert("Error saving blog post. Please try again.");
    } finally {
      setIsLoading(false);
      navigate("/admin/blog-list")
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
           {id ?  "Update Blog detail":"Create New Blog Post"}
          </h1>
          <p className="text-gray-600 mt-2">
            Share your thoughts with the world
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? "Edit" : "Preview"}
          </button>
        </div>
      </div>

      {previewMode ? (
        /* Preview Mode */
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <article className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              {formData.title || "Your Blog Title"}
            </h1>

            {formData.featuredMedia && (
              <div className="mb-6">
                {mediaType === "image" || mediaType === "url" ? (
                  <img
                    src={
                      mediaType === "url"
                        ? formData.featuredMedia
                        : URL.createObjectURL(formData.featuredMedia)
                    }
                    alt="Featured"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ) : (
                  <video
                    src={URL.createObjectURL(formData.featuredMedia)}
                    controls
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}
              </div>
            )}

            <div className="text-gray-600 mb-6">
              <p className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="text-gray-600 mb-6">
              <p className="flex items-center text-sm">
                <ChartBarStacked className="h-4 w-4 mr-2" />
                {categories.find((el) => el.id == formData.category)?.name ||
                  "Blog Category"}
              </p>
            </div>

            <div
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html:
                  formData.content ||
                  "<p>Your blog content will appear here...</p>",
              }}
            />

            {/* 
            {formData.tags && (
              <div className="mt-6 flex flex-wrap gap-2">
                {formData.tags.split(',').map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            )} */}
          </article>
        </div>
      ) : (
        /* Edit Mode */
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {/* Title */}
            <div className="mb-6">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Blog Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium"
                placeholder="Enter your blog title..."
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>
                  -- Select a category --
                </option>
                {categories.map((el) => (
                  <option key={el?.id} value={el?.id}>
                    {el?.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Media Type Toggle */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Media Type
              </label>
              <div className="flex gap-3">
                {["image", "url"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setMediaType(type);
                      setFormData((prev) => ({ ...prev, featuredMedia: null }));
                    }}
                    className={`px-4 py-2 rounded-lg border text-sm capitalize ${
                      mediaType === type
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Media */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Media
              </label>

              {mediaType === "image" && (
                <label
                  htmlFor="featuredImage"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer"
                >
                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="text-sm text-gray-500">
                    {formData.featuredMedia
                      ? formData.featuredMedia.name
                      : "Click to upload image"}
                  </p>
                  <input
                    id="featuredImage"
                    name="featuredImage"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}

              {mediaType === "video" && (
                <label
                  htmlFor="featuredVideo"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer"
                >
                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="text-sm text-gray-500">
                    {formData.featuredMedia
                      ? formData.featuredMedia.name
                      : "Click to upload video"}
                  </p>
                  <input
                    id="featuredVideo"
                    name="featuredVideo"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}

              {mediaType === "url" && (
                <input
                  type="text"
                  name="featuredMedia"
                  placeholder="Paste direct image URL (https://...)"
                  value={formData.featuredMedia || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      featuredMedia: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              )}
            </div>

            {/* Content */}
            <div className="mb-6">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Content
              </label>
              <textarea
                id="content"
                name="content"
                rows={12}
                required
                value={formData.content}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Write your blog content here..."
              />
              <p className="text-sm text-gray-500 mt-2">
                Rich text editor would be integrated here in a full
                implementation
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 font-medium"
              >
                <Save className="h-5 w-5 mr-2" />
                
                {!id ? isLoading ? "Creating..." : "Create Blog Post" : isLoading ? "Updating..." : "Update Blog Post"  }
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateBlog;
