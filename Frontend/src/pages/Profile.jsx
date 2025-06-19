import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaUser, 
  FaHistory, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaDownload, 
  FaSpinner, 
  FaChartLine,
  FaFileAlt, 
  FaSignOutAlt, 
  FaArrowLeft, 
  FaUserCircle, 
  FaBuilding, 
  FaBriefcase, 
  FaEnvelope, 
  FaCog,
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaSave,
  FaTimes,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    position: '',
    profileImage: ''
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }
        
        const { data } = await axios.get('/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Backend returns { user: {...}, documents: [...] }
        const userData = data.user || data;
        
        setProfile(userData);
        setFormData({
          name: userData.username || '',
          email: userData.email || '',
          company: userData.company || userData.companyName || '',
          position: userData.position || userData.jobTitle || '',
          profileImage: userData.profileImage || ''
        });
        
        // If documents are included in the profile response, use them
        if (Array.isArray(data.documents)) {
          setDocuments(data.documents);
        }
        
        // Fetch document history
        const docsResponse = await axios.get('/api/profile/documents', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Handle both response formats - direct array or nested in documents property
        if (Array.isArray(docsResponse.data)) {
          setDocuments(docsResponse.data);
        } else if (docsResponse.data && Array.isArray(docsResponse.data.documents)) {
          setDocuments(docsResponse.data.documents);
        } else {
          setDocuments([]);
        }
        
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data');
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const { data } = await axios.put('/api/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setProfile(data);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      await axios.delete('/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Error deleting account:', error);
      setError('Failed to delete account');
      setLoading(false);
    }
  };

  const handleViewDocument = (documentId) => {
    navigate('/results', { state: { documentId } });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getMembershipDays = () => {
    if (!profile?.createdAt) return 0;
    const created = new Date(profile.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading && !profile) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <FaSpinner className="animate-spin text-indigo-500 text-6xl mb-4 mx-auto" />
          <p className="text-white text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#ffffff"
            fillOpacity="0.05"
            d="M0,96L60,106.7C120,117,240,139,360,138.7C480,139,600,117,720,128C840,139,960,181,1080,186.7C1200,192,1320,160,1380,144L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          ></path>
        </svg>
        
        {/* Floating particles */}
        <div className="absolute h-4 w-4 rounded-full bg-white opacity-10 animate-pulse" style={{ top: "15%", left: "10%", animationDelay: "0s", animationDuration: "3s" }}></div>
        <div className="absolute h-6 w-6 rounded-full bg-white opacity-10 animate-pulse" style={{ top: "25%", left: "80%", animationDelay: "0.5s", animationDuration: "4s" }}></div>
        <div className="absolute h-3 w-3 rounded-full bg-white opacity-10 animate-pulse" style={{ top: "60%", left: "25%", animationDelay: "1s", animationDuration: "3.5s" }}></div>
        <div className="absolute h-5 w-5 rounded-full bg-white opacity-10 animate-pulse" style={{ top: "70%", left: "70%", animationDelay: "1.5s", animationDuration: "4.5s" }}></div>
      </div>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-900 border-b border-indigo-700 border-opacity-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link 
              to="/" 
              className="flex items-center space-x-2 px-5 py-2 border border-white/30 text-white font-medium rounded-lg bg-gradient-to-r from-transparent to-transparent hover:from-indigo-700 hover:to-purple-700 hover:border-indigo-400 transition-all duration-300 shadow-sm"
            >
              Back to Home
            </Link>
            
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/');
              }}
              className="px-5 py-2 bg-white text-indigo-700 font-medium rounded-lg relative overflow-hidden shadow-md hover:bg-indigo-50 transition-all duration-300 cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-black bg-opacity-20 backdrop-blur-sm rounded-xl border border-gray-700 border-opacity-30 p-6 sticky top-8">
              {/* Profile Card */}
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  {profile?.profileImage ? (
                    <img 
                      src={profile.profileImage} 
                      alt="Profile" 
                      className="w-24 h-24 rounded-full border-4 border-indigo-500 shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-indigo-500 shadow-lg">
                      <FaUserCircle className="text-white text-4xl" />
                    </div>
                  )}
                </div>
                
                <h2 className="text-xl font-bold text-white mt-4">
                  {profile?.username || profile?.name || 'User'}
                </h2>
                <p className="text-indigo-300 font-medium">
                  {profile?.position || profile?.jobTitle || ''}
                </p>
                <p className="text-gray-400 text-sm">
                  {profile?.company || profile?.companyName || ''}
                </p>

                <p className="text-gray-500 text-xs mt-2">
                  Member since {formatDate(profile?.createdAt)}
                </p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'profile'
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-700 hover:bg-opacity-50'
                  }`}
                >
                  <FaUser />
                  <span>Profile Information</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'documents'
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-700 hover:bg-opacity-50'
                  }`}
                >
                  <FaHistory />
                  <span>Document History</span>
                </button>
                
                <Link
                  to="/upload"
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all"
                >
                  <FaFileAlt />
                  <span>Upload a Document</span>
                </Link>
                
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900 hover:bg-opacity-30 transition-all mt-8"
                >
                  <FaTrash />
                  <span>Delete Account</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-black bg-opacity-20 backdrop-blur-sm rounded-xl border border-gray-700 border-opacity-30 p-8">
              {/* Profile Information Tab */}
              {activeTab === 'profile' && (
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-white flex items-center">
                      <FaUser className="mr-3 text-indigo-400" />
                      Profile Information
                    </h1>
                    
                    {!editMode ? (
                      <button
                        onClick={() => setEditMode(true)}
                        className="bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-800 hover:to-purple-800 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex space-x-3">
                        <button
                          onClick={handleSaveProfile}
                          disabled={loading}
                          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {loading ? <FaSpinner className="animate-spin mr-2" /> : null}
                          Save Changes
                        </button>
                        <button
                          onClick={() => {
                            setEditMode(false);
                            setFormData({
                              name: profile?.username || profile?.name || '',
                              email: profile?.email || '',
                              company: profile?.company || '',
                              position: profile?.position || '',
                              profileImage: profile?.profileImage || ''
                            });
                          }}
                          className="border border-indigo-500 text-indigo-300 hover:bg-indigo-900 hover:bg-opacity-30 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="bg-red-900 bg-opacity-30 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6">
                      {error}
                    </div>
                  )}

                  {!editMode ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-800 bg-opacity-30 p-6 rounded-lg border border-gray-700 border-opacity-30">
                        <div className="flex items-center mb-3">
                          <FaUser className="text-indigo-400 mr-3" />
                          <h3 className="text-lg font-semibold text-white">Full Name</h3>
                        </div>
                        <p className="text-gray-300">{profile?.username || profile?.name || 'Not provided'}</p>
                      </div>

                      <div className="bg-gray-800 bg-opacity-30 p-6 rounded-lg border border-gray-700 border-opacity-30">
                        <div className="flex items-center mb-3">
                          <FaEnvelope className="text-indigo-400 mr-3" />
                          <h3 className="text-lg font-semibold text-white">Email</h3>
                        </div>
                        <p className="text-gray-300">{profile?.email || 'Not provided'}</p>
                      </div>

                      <div className="bg-gray-800 bg-opacity-30 p-6 rounded-lg border border-gray-700 border-opacity-30">
                        <div className="flex items-center mb-3">
                          <FaBuilding className="text-indigo-400 mr-3" />
                          <h3 className="text-lg font-semibold text-white">Company</h3>
                        </div>
                        <p className="text-gray-300">{profile?.company || profile?.companyName || 'Not provided'}</p>
                      </div>

                      <div className="bg-gray-800 bg-opacity-30 p-6 rounded-lg border border-gray-700 border-opacity-30">
                        <div className="flex items-center mb-3">
                          <FaBriefcase className="text-indigo-400 mr-3" />
                          <h3 className="text-lg font-semibold text-white">Position</h3>
                        </div>
                        <p className="text-gray-300">{profile?.position || profile?.jobTitle || 'Not provided'}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800 bg-opacity-50 border border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800 bg-opacity-50 border border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Enter your email"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Company
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800 bg-opacity-50 border border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Enter your company"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Position
                        </label>
                        <input
                          type="text"
                          name="position"
                          value={formData.position}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800 bg-opacity-50 border border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Enter your position"
                        />
                      </div>
                    </div>
                  )}

                  {/* Account Statistics */}
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-6 rounded-lg text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-indigo-100 text-sm">Documents Processed</p>
                          <p className="text-2xl font-bold">{Array.isArray(documents) ? documents.length : 0}</p>
                        </div>
                        <FaFileAlt className="text-3xl text-indigo-200" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-6 rounded-lg text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100 text-sm">Days as Member</p>
                          <p className="text-2xl font-bold">{getMembershipDays()}</p>
                        </div>
                        <FaCalendarAlt className="text-3xl text-blue-200" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Document History Tab */}
              {activeTab === 'documents' && (
                <div className="bg-gray-800 bg-opacity-50 rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Document History</h3>
                  
                  {Array.isArray(documents) && documents.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-gray-700 bg-opacity-50 text-gray-300 uppercase text-sm">
                          <tr>
                            <th className="py-3 px-6">Document</th>
                            <th className="py-3 px-6">Date</th>
                            <th className="py-3 px-6">Status</th>
                            <th className="py-3 px-6">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                          {documents
                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                            .map((doc) => (
                              <tr key={doc._id} className="hover:bg-gray-700 hover:bg-opacity-30 transition-colors">
                                <td className="py-4 px-6">
                                  <div className="flex items-center space-x-3">
                                    <div className="bg-indigo-600 bg-opacity-30 p-2 rounded-lg">
                                      <FaFileAlt className="text-indigo-400" />
                                    </div>
                                    <div>
                                      <p className="text-white font-medium">{doc.fileName || doc.name || 'Unnamed Document'}</p>
                                      <p className="text-gray-400 text-sm">{doc.fileSize ? `${doc.fileSize} KB` : ''}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-6 text-gray-300">
                                  {formatDate(doc.createdAt)}
                                </td>
                                <td className="py-4 px-6">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-900 bg-opacity-30 text-green-300 border border-green-700">
                                    <FaCheckCircle className="mr-2" />
                                    Completed
                                  </span>
                                </td>
                                <td className="py-4 px-6">
                                  <div>
                                    <button
                                      onClick={() => handleViewDocument(doc._id)}
                                      className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-800 hover:to-purple-800 text-white cursor-pointer"
                                    >
                                      <FaEye className="mr-2" />
                                      View Results
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                      
                      {/* Pagination */}
                      {documents.length > itemsPerPage && (
                        <div className="flex justify-center items-center space-x-2 mt-6">
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded-md ${currentPage === 1 
                              ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                              : 'bg-indigo-700 text-white hover:bg-indigo-600 cursor-pointer'}`}
                          >
                            <FaChevronLeft />
                          </button>
                          
                          {/* Page numbers */}
                          {Array.from({ length: Math.ceil(documents.length / itemsPerPage) }).map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentPage(index + 1)}
                              className={`px-3 py-1 rounded-md ${currentPage === index + 1 
                                ? 'bg-indigo-600 text-white' 
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 cursor-pointer'}`}
                            >
                              {index + 1}
                            </button>
                          ))}
                          
                          <button
                            onClick={() => setCurrentPage(prev => 
                              Math.min(prev + 1, Math.ceil(documents.length / itemsPerPage)))}
                            disabled={currentPage === Math.ceil(documents.length / itemsPerPage)}
                            className={`px-3 py-1 rounded-md ${currentPage === Math.ceil(documents.length / itemsPerPage) 
                              ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                              : 'bg-indigo-700 text-white hover:bg-indigo-600 cursor-pointer'}`}
                          >
                            <FaChevronRight />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <FaFileAlt className="mx-auto text-gray-500 text-6xl mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No documents found</h3>
                      <p className="text-gray-400 mb-6">You haven't processed any documents yet.</p>
                      <Link 
                        to="/upload"
                        className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors"
                      >
                        <FaFileAlt />
                        <span>Upload Your First Document</span>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 bg-opacity-95 rounded-xl p-8 max-w-md w-full mx-4 border border-red-500 border-opacity-30 shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="bg-red-900 bg-opacity-30 p-3 rounded-full mr-4">
                <FaExclamationTriangle className="text-red-400 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white">Delete Account</h3>
            </div>
            
            <p className="text-gray-300 mb-8 leading-relaxed">
              Are you sure you want to delete your account? This action{' '}
              <span className="text-red-400 font-semibold">cannot be undone</span>{' '}
              and all your data will be permanently removed.
            </p>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="px-5 py-2 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 rounded-lg text-white transition-all flex items-center disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FaTrash className="mr-2" />
                    Delete Account
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
