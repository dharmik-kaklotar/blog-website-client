import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Button from "./common/Button";
import Input from "./common/Input";
import BlogSlider from "./blog/BlogSlider";
import BlogCard from "./blog/BlogCard";
import CategoryFilter from "./blog/CategoryFilter";
import axios from "axios";

const BlogHome = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
    const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState({
    search:"",
    categoty_id:""
  });
  const [allBlogs, setAllBlogs] = useState([]);

  const fetchTrendingBlogs = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/user/get_trending_blog`,
        {} // body (if no data to send)
      );
      const data = await response.data;
      if (data?.status) {
        setFeaturedBlogs(data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchAllBlogs = async () => {
    try {
        const form = new FormData()
        filter?.search && form.append("search",filter?.search)
        selectedCategory && form.append("category_id",selectedCategory)

      const response = await axios.post(
        `${apiUrl}/user/get_blog`,
        form // body (if no data to send)
      );
      const data = await response.data;
      if (data?.status) {
        setAllBlogs(data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const findAllcategories = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/user/get_all_categories`,
        {},
      );
      const data = await response.data;

      if (data?.status) {
        setCategories(data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
    fetchTrendingBlogs()
    findAllcategories()
    // fetchAllBlogs()
  },[])
  useEffect(()=>{
    fetchAllBlogs()
  },[filter,selectedCategory])
  

  const filteredBlogs = allBlogs;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TradingBlogs
            </h1>
            {/* <nav className="flex items-center space-x-6">
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Home</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Categories</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">About</a>
              <Button variant="outline">Subscribe</Button>
            </nav> */}
          </div>
        </div>
      </header>

      {/* Featured Blogs Slider */}
      <section className="py-12 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Trading Insights
            </h2>
            <p className="text-lg text-gray-600">
              Stay ahead with the latest trading strategies and market analysis
            </p>
          </div>
          <BlogSlider blogs={featuredBlogs} />
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search blogs..."
                value={filter.search}
                onChange={(e) => setFilter((prev) => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Latest Articles
            </h2>
            <p className="text-gray-600">
              Discover insights from trading experts and market analysts
            </p>
          </div>

          {filteredBlogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No blogs found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-gray-300 mb-8">
            Get the latest trading insights delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input placeholder="Enter your email" className="flex-1" />
            <Button className="bg-blue-600 hover:bg-blue-700">Subscribe</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 TradingBlogs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default BlogHome;
