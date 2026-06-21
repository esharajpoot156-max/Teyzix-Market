import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("info");

  const [form, setForm] = useState({
    bio: "",
    skills: "",
    experience: "",
    socialLinks: {
      linkedin: "",
      github: "",
      website: "",
    },
  });

  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);

  const [portfolio, setPortfolio] = useState([]);
  const [portfolioForm, setPortfolioForm] = useState({
    title: "",
    description: "",
  });
  const [portfolioImg, setPortfolioImg] = useState(null);
  const [addingPortfolio, setAddingPortfolio] = useState(false);

  useEffect(() => {
    if (!user) return navigate("/login");
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get(`/profiles/${user._id}`);
      setProfile(res.data);
      setPortfolio(res.data.portfolio || []);
      setForm({
        bio:        res.data.bio || "",
        skills:     res.data.skills?.join(", ") || "",
        experience: res.data.experience || "",
        socialLinks: res.data.socialLinks || {
          linkedin: "",
          github:   "",
          website:  "",
        },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    setImgFile(file);
    setImgPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError("");
    setSuccess("");
    try {
      const formData = new FormData();
      formData.append("bio", form.bio);
      formData.append("skills", form.skills);
      formData.append("experience", form.experience);
      formData.append("socialLinks", JSON.stringify(form.socialLinks));
      if (imgFile) formData.append("img", imgFile);

      await axiosInstance.put("/profiles", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Profile updated successfully!");
      fetchProfile();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setUpdating(false);
    }
  };

  const handlePortfolioSubmit = async (e) => {
    e.preventDefault();
    setAddingPortfolio(true);
    try {
      const formData = new FormData();
      formData.append("title", portfolioForm.title);
      formData.append("description", portfolioForm.description);
      if (portfolioImg) formData.append("image", portfolioImg);

      await axiosInstance.post("/profiles/portfolio", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPortfolioForm({ title: "", description: "" });
      setPortfolioImg(null);
      fetchProfile();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong!");
    } finally {
      setAddingPortfolio(false);
    }
  };

  const handleDeletePortfolio = async (portfolioId) => {
    if (!window.confirm("Delete this portfolio item?")) return;
    try {
      await axiosInstance.delete(`/profiles/portfolio/${portfolioId}`);
      fetchProfile();
    } catch (err) {
      alert("Could not delete!");
    }
  };

  if (loading) return (
    <div style={{ backgroundColor: "#FCF5EE" }} className="min-h-screen flex items-center justify-center">
      <div style={{ borderColor: "#393c56" }} className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div style={{ backgroundColor: "#FCF5EE" }} className="min-h-screen">

      {/* Header Banner */}
      <div style={{ backgroundColor: "#393c56" }} className="px-6 py-10">
        <div className="max-w-4xl mx-auto flex items-center gap-6">

          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white border-opacity-30">
            {imgPreview || user?.img ? (
              <img
                src={imgPreview || user?.img}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-3xl font-bold text-white"
                style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              >
                {user?.username?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-2xl font-bold text-white">
              {user?.username}
            </h1>
            <p className="text-blue-100 text-sm">{user?.email}</p>
            <span
              className="text-xs px-3 py-1 rounded-full mt-2 inline-block font-medium"
              style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#fff" }}
            >
              {user?.role === "provider" ? "💼 Service Provider" :
               user?.role === "admin"    ? "🛡️ Admin" : "👤 Customer"}
            </span>
          </div>

          {/* Social Links */}
          <div className="ml-auto flex items-center gap-4">
            {profile?.socialLinks?.linkedin && (
              <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-blue-400 transition">
                💼
              </a>
            )}
            {profile?.socialLinks?.github && (
              <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-gray-400 transition">
                💻
              </a>  
            )}
            {profile?.socialLinks?.website && (
              <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-green-200 hover:text-green-400 transition">
                🌐
              </a>
            )}
          </div>
        </div>
            
        {/* Skills  — Provider Only */}
        {user?.role === "provider" && profile?.skills?.length > 0 && (
          <div className="max-w-4xl mx-auto mt-4 flex gap-2 flex-wrap">
            {profile.skills.map((skill, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff" }}
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1 border border-[#e5e0d8] w-fit">
          {[
            "info",
            "edit",
            ...(user?.role === "provider" ? ["portfolio"] : []),
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                backgroundColor: activeTab === tab ? "#393c56" : "transparent",
                color: activeTab === tab ? "#fff" : "#6b7280",
              }}
              className="px-5 py-2 rounded-xl text-sm font-medium transition-all"
            >
              {tab === "info"      ? "📋 Info" :
               tab === "edit"      ? "✏️ Edit" :
               tab === "portfolio" ? "🖼️ Portfolio" : tab}
            </button>
          ))}
        </div>

        {/* INFO TAB */}
        {activeTab === "info" && (
          <div className="space-y-4">

            <div className="bg-white rounded-2xl p-6 border border-[#e5e0d8]">
              <h3 style={{ color: "#1a1a2e" }} className="font-semibold mb-3">
                About Me
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {profile?.bio || "No bio added yet!"}
              </p>
            </div>

            {user?.role === "provider" && profile?.experience && (
              <div className="bg-white rounded-2xl p-6 border border-[#e5e0d8]">
                <h3 style={{ color: "#1a1a2e" }} className="font-semibold mb-3">
                  Experience
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {profile.experience}
                </p>
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 border border-[#e5e0d8]">
              <h3 style={{ color: "#1a1a2e" }} className="font-semibold mb-3">
                Contact Info
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span>📧</span>
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span>📱</span>
                  <span>{user?.phoneNumber || "Not added"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EDIT TAB */}
        {activeTab === "edit" && (
          <div className="bg-white rounded-2xl p-6 border border-[#e5e0d8]">

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-xl mb-4 text-sm">
                ✅ {success}
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Profile Pic */}
              <div>
                <label style={{ color: "#1a1a2e" }} className="block text-sm font-medium mb-2">
                  Profile Picture
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#e5e0d8]">
                    {imgPreview || user?.img ? (
                      <img
                        src={imgPreview || user?.img}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        style={{ backgroundColor: "#393c56" }}
                        className="w-full h-full flex items-center justify-center text-white font-bold text-xl"
                      >
                        {user?.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <label
                    style={{ borderColor: "#393c56", color: "#393c56" }}
                    className="cursor-pointer border-2 border-dashed px-4 py-2 rounded-xl text-sm font-medium hover:opacity-70 transition"
                  >
                    Choose Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImgChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label style={{ color: "#1a1a2e" }} className="block text-sm font-medium mb-1">
                  Bio
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about yourself..."
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                  onFocus={(e) => e.target.style.boxShadow = "0 0 0 2px #393c5640"}
                  onBlur={(e) => e.target.style.boxShadow = "none"}
                />
              </div>

              {/* Skills — Provider Only */}
              {user?.role === "provider" && (
                <div>
                  <label style={{ color: "#1a1a2e" }} className="block text-sm font-medium mb-1">
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. React, Node.js, Design"
                    value={form.skills}
                    onChange={(e) => setForm({ ...form, skills: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                    onFocus={(e) => e.target.style.boxShadow = "0 0 0 2px #393c5640"}
                    onBlur={(e) => e.target.style.boxShadow = "none"}
                  />
                </div>
              )}

              {/* Experience — Provider Only */}
              {user?.role === "provider" && (
                <div>
                  <label style={{ color: "#1a1a2e" }} className="block text-sm font-medium mb-1">
                    Experience
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe your experience..."
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                    onFocus={(e) => e.target.style.boxShadow = "0 0 0 2px #393c5640"}
                    onBlur={(e) => e.target.style.boxShadow = "none"}
                  />
                </div>
              )}

              {/* Social Links */}
              <div>
                <label style={{ color: "#1a1a2e" }} className="block text-sm font-medium mb-2">
                  Social Links
                </label>
                <div className="space-y-2">
                  {[
                    { key: "linkedin", placeholder: "LinkedIn URL", emoji: "💼" },
                    { key: "github",   placeholder: "GitHub URL",   emoji: "💻" },
                    { key: "website",  placeholder: "Website URL",  emoji: "🌐" },
                  ].map((item) => (
                    <div key={item.key} className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">
                        {item.emoji}
                      </span>
                      <input
                        type="text"
                        placeholder={item.placeholder}
                        value={form.socialLinks[item.key]}
                        onChange={(e) => setForm({
                          ...form,
                          socialLinks: { ...form.socialLinks, [item.key]: e.target.value },
                        })}
                        className="w-full pl-10 pr-4 border border-gray-200 rounded-xl py-3 text-sm focus:outline-none"
                        onFocus={(e) => e.target.style.boxShadow = "0 0 0 2px #393c5640"}
                        onBlur={(e) => e.target.style.boxShadow = "none"}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={updating}
                style={{ backgroundColor: "#393c56" }}
                className="w-full text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition"
              >
                {updating ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Updating...
                  </span>
                ) : "Save Changes →"}
              </button>
            </form>
          </div>
        )}

        {/* PORTFOLIO TAB — Provider Only */}
        {activeTab === "portfolio" && user?.role === "provider" && (
          <div className="space-y-6">

            {portfolio.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-[#e5e0d8]">
                <p className="text-4xl mb-2">🖼️</p>
                <p style={{ color: "#1a1a2e" }} className="font-semibold mb-1">
                  No portfolio items yet!
                </p>
                <p className="text-gray-400 text-sm">Add your best work below</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {portfolio.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-2xl overflow-hidden border border-[#e5e0d8] hover:shadow-md transition"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <div
                        style={{ backgroundColor: "#393c5615" }}
                        className="w-full h-40 flex items-center justify-center text-4xl"
                      >
                        🖼️
                      </div>
                    )}
                    <div className="p-4">
                      <h3 style={{ color: "#1a1a2e" }} className="font-semibold text-sm mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-400 mb-3">
                        {item.description}
                      </p>
                      <button
                        onClick={() => handleDeletePortfolio(item._id)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Portfolio Form */}
            <div className="bg-white rounded-2xl p-6 border border-[#e5e0d8]">
              <h3 style={{ color: "#1a1a2e" }} className="font-semibold mb-4">
                ➕ Add Portfolio Item
              </h3>
              <form onSubmit={handlePortfolioSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Project Title"
                  value={portfolioForm.title}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, title: e.target.value })}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                  onFocus={(e) => e.target.style.boxShadow = "0 0 0 2px #393c5640"}
                  onBlur={(e) => e.target.style.boxShadow = "none"}
                />
                <textarea
                  rows={2}
                  placeholder="Project Description"
                  value={portfolioForm.description}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                  onFocus={(e) => e.target.style.boxShadow = "0 0 0 2px #393c5640"}
                  onBlur={(e) => e.target.style.boxShadow = "none"}
                />
                <label
                  style={{ borderColor: "#393c56", color: "#393c56" }}
                  className="cursor-pointer border-2 border-dashed px-4 py-3 rounded-xl text-sm font-medium hover:opacity-70 transition flex items-center gap-2 justify-center"
                >
                  📸 Choose Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPortfolioImg(e.target.files[0])}
                    className="hidden"
                  />
                </label>
                {portfolioImg && (
                  <p className="text-xs text-gray-400">
                    Selected: {portfolioImg.name}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={addingPortfolio}
                  style={{ backgroundColor: "#393c56" }}
                  className="w-full text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition"
                >
                  {addingPortfolio ? "Adding..." : "Add to Portfolio →"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}