import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Share2,
  Clock,
  User,
  Calendar,
  Tag,
} from "lucide-react";
import Button from "./common/Button";
import axios from "axios";
import moment from "moment";

const BlogDetail = () => {
  const { id } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [blog, setBlog] = useState({
    id: 1,
    title: "Test Blog",
    description: "",
    media_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHv1x1OZn88aSBxgb88-6UJO0t2KrWqdzX1g&s",
    likes: 3,
    created_at: "2025-07-04T05:02:12.000Z",
    category: {
      id: 3,
      name: "Other",
    },
    admin: {
      id: 1,
      email: "test@mail.com",
      name: "test Writer",
    },
  });

  const apiUrl = process.env.REACT_APP_API_URL;
  const fetchBlog = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/user/get_blog`,
        { id: id } // body (if no data to send)
      );
      const data = await response.data;
      if (data?.status) {
        setBlog(data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Mock blog data - in a real app, this would come from an API based on the ID
  //   const blog = {
  //     id: parseInt(id || '1'),
  //     title: 'Advanced Trading Strategies for 2024',
  //     content: `
  //       <p>The financial markets are constantly evolving, and 2024 presents unique opportunities and challenges for traders. In this comprehensive guide, we'll explore advanced trading strategies that can help you navigate today's volatile markets successfully.</p>

  //       <h2>1. Algorithmic Trading Integration</h2>
  //       <p>Modern traders are increasingly relying on algorithmic trading systems to execute trades with precision and speed. These systems can analyze market data, identify patterns, and execute trades faster than any human trader could.</p>

  //       <h3>Key Benefits:</h3>
  //       <ul>
  //         <li>Reduced emotional decision-making</li>
  //         <li>Faster execution speeds</li>
  //         <li>24/7 market monitoring</li>
  //         <li>Backtesting capabilities</li>
  //       </ul>

  //       <h2>2. Risk Management in Volatile Markets</h2>
  //       <p>Effective risk management is crucial in today's unpredictable market environment. Professional traders use sophisticated risk management techniques to protect their capital while maximizing returns.</p>

  //       <blockquote>
  //         "Risk comes from not knowing what you're doing." - Warren Buffett
  //       </blockquote>

  //       <h3>Essential Risk Management Tools:</h3>
  //       <ul>
  //         <li>Position sizing calculators</li>
  //         <li>Stop-loss orders</li>
  //         <li>Portfolio diversification</li>
  //         <li>Correlation analysis</li>
  //       </ul>

  //       <h2>3. Technical Analysis in Modern Trading</h2>
  //       <p>Technical analysis remains a cornerstone of successful trading. However, modern technical analysis incorporates advanced indicators and machine learning algorithms to improve accuracy.</p>

  //       <h2>Conclusion</h2>
  //       <p>The key to successful trading in 2024 lies in combining traditional trading wisdom with modern technology. By implementing these advanced strategies while maintaining strict risk management protocols, traders can position themselves for success in any market condition.</p>
  //     `,
  //     excerpt: 'Discover the most effective trading strategies that professional traders use to maximize profits in volatile markets.',
  //     image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=600&fit=crop',
  //     category: 'Trading',
  //     author: 'John Smith',
  //     date: '2024-01-15',
  //     likes: 156,
  //     readTime: '5 min read',
  //     tags: ['Trading', 'Strategies', 'Risk Management', 'Technical Analysis']
  //   };

  useEffect(() => {
    fetchBlog();
  }, []);

  useEffect(() => {
    setLikeCount(blog.likes);
  }, [blog.likes]);

  const updateLike = async (id, isLiked) => {
    try {
      const form = new FormData();
      form.append("isLiked", !isLiked ? 1 : 0);
      form.append("id", id);

      const response = await axios.post(
        `${apiUrl}/user/like_blog`,
        form // body (if no data to send)
      );
      const data = await response.data;
      // if (data?.status) {
      //   setAllBlogs(data?.data);
      // }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = () => {
    if (isLiked) {
      setLikeCount((prev) => prev - 1);
      setIsLiked(false);
    } else {
      setLikeCount((prev) => prev + 1);
      setIsLiked(true);
    }
    updateLike(blog.id, isLiked);
    console.log("Toggled like for blog:", blog.id);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      console.log("Blog shared:", blog.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Blogs
              </Link>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Blogsy
            </h1>
          </div>
        </div>
      </header>

      {/* Blog Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Image */}
        <div className="relative mb-8">
          <img
            src={blog.media_url}
            alt={blog.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded">
              {blog.category?.name}
            </span>
          </div>
        </div>

        {/* Blog Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>{blog.admin?.name}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{moment(blog.created_at).format("DD-MM-YYYY")}</span>
            </div>
            {/* <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{blog.readTime}</span>
            </div> */}
          </div>

          {/* Tags */}
          {/* <div className="flex flex-wrap gap-2 mb-6">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
          </div> */}

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-b border-gray-200 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`flex items-center space-x-2 ${
                  isLiked ? "text-red-500" : "text-gray-500"
                }`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                <span>{likeCount}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="flex items-center space-x-2 text-gray-500 hover:text-blue-600"
              >
                <Share2 className="h-5 w-5" />
                <span>Share</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Blog Content */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.description }}
          style={{
            lineHeight: "1.7",
            fontSize: "1.1rem",
          }}
        />

        {/* Author Bio */}
        {/* <div className="mt-12 p-6 bg-white rounded-lg shadow-sm border">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {blog.admin?.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {blog.admin?.name}
              </h3>
              <p className="text-gray-600">
                Professional trader and market analyst with over 10 years of
                experience in financial markets. Specializes in technical
                analysis and risk management strategies.
              </p>
            </div>
          </div>
        </div> */}
      </article>
    </div>
  );
};

export default BlogDetail;
