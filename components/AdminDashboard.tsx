import React, { useState, useRef, useEffect } from 'react';
import { ROLES, NEWS_STATUS, CATEGORIES, PERMISSIONS, NEWS_PORTAL_SLOGAN } from '../constants.ts';
import { getExactNepaliDate } from '../utils/nepaliDate.ts';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
  logoUrl: string | null;
  onLogoUpdate: (url: string) => void;
  adsenseCode: string;
  onAdsenseUpdate: (code: string) => void;
  
  // Header Ad Props
  headerAdImage: string | null;
  onHeaderAdImageUpdate: (url: string | null) => void;
  headerAdType: 'code' | 'image';
  onHeaderAdTypeUpdate: (type: 'code' | 'image') => void;

  siteTitle: string; // New prop for site title
  onSiteTitleUpdate: (title: string) => void; // Callback for site title update
  siteSlogan: string; // New prop for site slogan
  onSiteSloganUpdate: (slogan: string) => void; // Callback for site slogan update
  
  facebookLink: string;
  onFacebookLinkUpdate: (link: string) => void;
  twitterLink: string;
  onTwitterLinkUpdate: (link: string) => void;
  youtubeLink: string;
  onYoutubeLinkUpdate: (link: string) => void;
  instagramLink: string;
  onInstagramLinkUpdate: (link: string) => void;
  contactEmail: string;
  onContactEmailUpdate: (email: string) => void;
  contactPhone: string;
  onContactPhoneUpdate: (phone: string) => void;

  allNews: any[];
  users: any[];
  onAddNews: (news: any) => void;
  onUpdateNewsContent: (id: string, news: any) => void; // New prop for updating news
  onApproveNews: (id: string) => void; // Changed to string for Firestore doc ID
  onDeleteNews: (id: string) => void; // Changed to string for Firestore doc ID
  onAddUser: (user: any) => void;
  onUpdateUser: (user: any) => void;
  onDeleteUser: (username: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  user, onLogout, logoUrl, onLogoUpdate, adsenseCode, onAdsenseUpdate, 
  headerAdImage, onHeaderAdImageUpdate, headerAdType, onHeaderAdTypeUpdate,
  siteTitle, onSiteTitleUpdate, siteSlogan, onSiteSloganUpdate,
  facebookLink, onFacebookLinkUpdate, twitterLink, onTwitterLinkUpdate, youtubeLink, onYoutubeLinkUpdate, instagramLink, onInstagramLinkUpdate,
  contactEmail, onContactEmailUpdate, contactPhone, onContactPhoneUpdate,
  allNews, users, onAddNews, onUpdateNewsContent, onApproveNews, onDeleteNews,
  onAddUser, onUpdateUser, onDeleteUser
}) => {
  const [activeTab, setActiveTab] = useState(user.permissions?.includes(PERMISSIONS.VIEW_DASHBOARD) ? 'dashboard' : 'post');
  // Default to 'general' ONLY if Chief Editor, otherwise 'security'
  const [activeSettingsSubTab, setActiveSettingsSubTab] = useState(user.role === ROLES.CHIEF_EDITOR ? 'general' : 'security');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const headerAdInputRef = useRef<HTMLInputElement>(null);
  
  // News Form State
  const [newsTitle, setNewsTitle] = useState('');
  const [newsDesc, setNewsDesc] = useState('');
  const [newsCat, setNewsCat] = useState(CATEGORIES[0]);
  const [showInTicker, setShowInTicker] = useState(true);
  const [showAuthor, setShowAuthor] = useState(true);
  const [newsImage, setNewsImage] = useState<string | null>(null);
  const [publishImmediately, setPublishImmediately] = useState(false); // State for immediate publish
  
  // Edit News State
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  
  // Filter State for "All News" Tab
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // User Form State
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [userForm, setUserForm] = useState({ 
    name: '', 
    username: '', 
    password: '', 
    role: ROLES.REPORTER,
    permissions: [PERMISSIONS.VIEW_DASHBOARD, PERMISSIONS.POST_NEWS, PERMISSIONS.MANAGE_SECURITY] as string[]
  });

  // Local states for settings inputs, to be synced with props on save
  const [tempLogo, setTempLogo] = useState<string | null>(logoUrl);
  const [tempAdsense, setTempAdsense] = useState<string>(adsenseCode);
  const [tempHeaderAdImage, setTempHeaderAdImage] = useState<string | null>(headerAdImage);
  const [tempHeaderAdType, setTempHeaderAdType] = useState<'code' | 'image'>(headerAdType);

  const [tempSiteTitle, setTempSiteTitle] = useState(siteTitle);
  const [tempSiteSlogan, setTempSiteSlogan] = useState(siteSlogan);
  const [tempFacebookLink, setTempFacebookLink] = useState(facebookLink);
  const [tempTwitterLink, setTempTwitterLink] = useState(twitterLink);
  const [tempYoutubeLink, setTempYoutubeLink] = useState(youtubeLink);
  const [tempInstagramLink, setTempInstagramLink] = useState(instagramLink);
  const [tempContactEmail, setTempContactEmail] = useState(contactEmail);
  const [tempContactPhone, setTempContactPhone] = useState(contactPhone);


  // Sync props to temp states
  useEffect(() => {
    setTempLogo(logoUrl);
    setTempAdsense(adsenseCode);
    setTempHeaderAdImage(headerAdImage);
    setTempHeaderAdType(headerAdType);
    setTempSiteTitle(siteTitle);
    setTempSiteSlogan(siteSlogan);
    setTempFacebookLink(facebookLink);
    setTempTwitterLink(twitterLink);
    setTempYoutubeLink(youtubeLink);
    setTempInstagramLink(instagramLink);
    setTempContactEmail(contactEmail);
    setTempContactPhone(contactPhone);
  }, [logoUrl, adsenseCode, headerAdImage, headerAdType, siteTitle, siteSlogan, facebookLink, twitterLink, youtubeLink, instagramLink, contactEmail, contactPhone]);

  // Password Change State
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');

  const hasPermission = (perm: string) => user.permissions?.includes(perm);

  const stats = [
    { label: 'जम्मा समाचार', count: allNews.length, icon: '📝', color: 'bg-blue-500' },
    { label: 'प्रकाशित', count: allNews.filter(n => n.status === NEWS_STATUS.PUBLISHED).length, icon: '✅', color: 'bg-green-500' },
    { label: 'पेन्डिङ', count: allNews.filter(n => n.status === NEWS_STATUS.PENDING).length, icon: '⏳', color: 'bg-yellow-500' },
    { label: 'प्रयोगकर्ता', count: users.length, icon: '👥', color: 'bg-purple-500' },
  ];

  // Helper function to resize and compress images
  const compressImage = (file: File, callback: (result: string) => void) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Resize logic: Max dimension 800px
        const MAX_SIZE = 800;
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
           ctx.drawImage(img, 0, 0, width, height);
           // Convert to JPEG with 0.7 quality to reduce size significantly
           const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
           callback(dataUrl);
        } else {
            // Fallback if canvas fails
            callback(readerEvent.target?.result as string);
        }
      };
      img.src = readerEvent.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      compressImage(file, (compressedData) => {
        setNewsImage(compressedData);
      });
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      compressImage(file, (compressedData) => {
        setTempLogo(compressedData);
      });
    }
  };

  const handleHeaderAdImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      compressImage(file, (compressedData) => {
        setTempHeaderAdImage(compressedData);
      });
    }
  };

  const removeImage = () => {
    setNewsImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEditNewsClick = (news: any) => {
    setNewsTitle(news.title);
    setNewsDesc(news.description);
    setNewsCat(news.category);
    setNewsImage(news.imageUrl);
    setShowInTicker(news.showInTicker || false);
    setShowAuthor(news.showAuthor || false);
    // If news is already published, check the box.
    setPublishImmediately(news.status === NEWS_STATUS.PUBLISHED);
    
    setEditingNewsId(news.id);
    setActiveTab('post');
    window.scrollTo(0, 0);
  };

  const handlePostNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsImage) {
      alert('कृपया एउटा फिचर फोटो छान्नुहोस्।');
      return;
    }

    // Determine Status: If user has MANAGE_NEWS and checked "Publish Immediately", it is PUBLISHED. Otherwise PENDING.
    // Explicitly exclude REPORTER from direct publishing even if permissions allow
    const canPublish = hasPermission(PERMISSIONS.MANAGE_NEWS) && user.role !== ROLES.REPORTER;
    const finalStatus = (canPublish && publishImmediately) ? NEWS_STATUS.PUBLISHED : NEWS_STATUS.PENDING;

    const commonData = {
      title: newsTitle,
      description: newsDesc,
      category: newsCat,
      imageUrl: newsImage,
      showInTicker,
      showAuthor,
      status: finalStatus
    };

    if (editingNewsId) {
       // UPDATE Mode
       onUpdateNewsContent(editingNewsId, commonData);
       setEditingNewsId(null);
    } else {
       // CREATE Mode
       const newNews = {
         id: Date.now(), // This ID will be used as creationTimestamp in Firestore
         author: user.name,
         date: getExactNepaliDate(), // Use dynamic date instead of hardcoded
         isPopular: false,
         ...commonData
       };
       onAddNews(newNews);
    }
    
    // Alert is handled in App.tsx (handleAddNews/onUpdateNewsContent) 
    // but we clear the form here
    
    setNewsTitle('');
    setNewsDesc('');
    setNewsCat(CATEGORIES[0]);
    setShowInTicker(true);
    setShowAuthor(true);
    setNewsImage(null);
    setPublishImmediately(false);
    if (fileInputRef.current) fileInputRef.current.value = '';

    setActiveTab('all-news');
    setFilterStatus('ALL'); // Reset filter to see the new item
  };

  const openAddUser = () => {
    setEditingUser(null);
    setUserForm({ 
      name: '', 
      username: '', 
      password: '', 
      role: ROLES.REPORTER,
      permissions: [PERMISSIONS.VIEW_DASHBOARD, PERMISSIONS.POST_NEWS, PERMISSIONS.MANAGE_SECURITY]
    });
    setIsUserModalOpen(true);
  };

  const openEditUser = (u: any) => {
    setEditingUser(u);
    // Safe spread: ensure permissions is an array, defaulting to empty array if missing
    setUserForm({ 
      ...u,
      permissions: Array.isArray(u.permissions) ? u.permissions : [] 
    });
    setIsUserModalOpen(true);
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      onUpdateUser(userForm);
      alert('प्रयोगकर्ताको विवरण र अनुमति अपडेट गरियो।');
    } else {
      if (users.some(u => u.username === userForm.username)) {
        alert('यो युजरनेम पहिले नै प्रयोगमा छ।');
        return;
      }
      onAddUser(userForm);
      alert('नयाँ प्रयोगकर्ता थपियो।');
    }
    setIsUserModalOpen(false);
  };

  // Helper to set default permissions based on role
  const handleRoleChange = (role: string) => {
    let perms: string[] = [];
    switch (role) {
        case ROLES.CHIEF_EDITOR:
            perms = Object.values(PERMISSIONS);
            break;
        case ROLES.EDITOR:
            perms = [PERMISSIONS.VIEW_DASHBOARD, PERMISSIONS.POST_NEWS, PERMISSIONS.MANAGE_NEWS, PERMISSIONS.MANAGE_SECURITY];
            break;
        case ROLES.REPORTER:
            perms = [PERMISSIONS.VIEW_DASHBOARD, PERMISSIONS.POST_NEWS, PERMISSIONS.MANAGE_SECURITY];
            break;
        default:
            perms = [];
    }
    setUserForm(prev => ({ ...prev, role, permissions: perms }));
  };

  const togglePermission = (perm: string) => {
    setUserForm(prev => {
        // Safe access to permissions array
        const currentPerms = Array.isArray(prev.permissions) ? prev.permissions : [];
        const newPerms = currentPerms.includes(perm)
            ? currentPerms.filter(p => p !== perm)
            : [...currentPerms, perm];
        return { ...prev, permissions: newPerms };
    });
  };

  const handleDeleteUserClick = (targetUsername: string) => {
    if (targetUsername === user.username) {
        alert('तपाईंले आफ्नो आईडी हटाउन सक्नुहुन्न।');
        return;
    }
    if (confirm(`के तपाईं पक्का हुनुहुन्छ? '${targetUsername}' प्रयोगकर्ता स्थायी रूपमा हटाइनेछ।`)) {
      onDeleteUser(targetUsername);
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPwd !== user.password) {
      alert('हालको पासवर्ड मिलेन।');
      return;
    }
    if (newPwd !== confirmPwd) {
      alert('नयाँ पासवर्ड र कन्फर्म पासवर्ड मिलेन।');
      return;
    }
    if (newPwd.length < 4) {
      alert('नयाँ पासवर्ड कम्तिमा ४ अक्षरको हुनुपreछ।');
      return;
    }

    const updatedUser = { ...user, password: newPwd };
    onUpdateUser(updatedUser);
    alert('पासवर्ड सफलतापुर्वक परिवर्तन गरियो।');
    setCurrentPwd('');
    setNewPwd('');
    setConfirmPwd('');
  };

  const handleSaveGeneralSettings = () => {
    onLogoUpdate(tempLogo || null); // Pass null if tempLogo is empty
    onAdsenseUpdate(tempAdsense);
    onHeaderAdImageUpdate(tempHeaderAdImage);
    onHeaderAdTypeUpdate(tempHeaderAdType);
    onSiteTitleUpdate(tempSiteTitle);
    onSiteSloganUpdate(tempSiteSlogan);
    onFacebookLinkUpdate(tempFacebookLink);
    onTwitterLinkUpdate(tempTwitterLink);
    onYoutubeLinkUpdate(tempYoutubeLink);
    onInstagramLinkUpdate(tempInstagramLink);
    onContactEmailUpdate(tempContactEmail);
    onContactPhoneUpdate(tempContactPhone);
    alert('सेटिङ्हरू सफलतापुर्वक सुरक्षित गरियो।');
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setEditingNewsId(null); // Clear editing state when switching tabs
    // Reset form when switching tabs if not in post mode
    if (tab !== 'post') {
        setNewsTitle('');
        setNewsDesc('');
        setNewsCat(CATEGORIES[0]);
        setShowInTicker(true);
        setShowAuthor(true);
        setNewsImage(null);
        setPublishImmediately(false);
    }
    setIsSidebarOpen(false);
  };

  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case ROLES.CHIEF_EDITOR: return 'bg-red-100 text-red-700 border-red-200';
      case ROLES.EDITOR: return 'bg-blue-100 text-blue-700 border-blue-200';
      case ROLES.REPORTER: return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Filter News Logic
  const filteredNews = allNews.filter(n => {
    if (filterStatus === 'ALL') return true;
    return n.status === filterStatus;
  });

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden relative">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed md:relative z-40 inset-y-0 left-0 w-64 bg-gray-800 text-white flex-shrink-0 flex flex-col transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 flex-shrink-0">
              {logoUrl ? <img src={logoUrl} className="w-full h-full object-contain rounded-md" alt="Site Logo" /> : <div className="w-full h-10 flex items-center justify-center font-black bg-red-600 rounded-md">D</div>}
            </div>
            <div className="truncate">
              <h2 className="text-xl font-black text-red-500 italic leading-none">{siteTitle} प्यानल</h2>
              <p className="text-[9px] text-gray-400 mt-1 uppercase tracking-widest">{user.role}</p>
            </div>
          </div>
        </div>
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          {hasPermission(PERMISSIONS.VIEW_DASHBOARD) && (
            <button onClick={() => handleTabClick('dashboard')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-red-600' : 'hover:bg-gray-700'}`}>
              <span>📊</span> <span>ड्यासबोर्ड</span>
            </button>
          )}
          {hasPermission(PERMISSIONS.POST_NEWS) && (
            <button onClick={() => handleTabClick('post')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'post' ? 'bg-red-600' : 'hover:bg-gray-700'}`}>
              <span>✍️</span> <span>समाचार लेख्नुहोस्</span>
            </button>
          )}
          <button onClick={() => handleTabClick('all-news')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'all-news' ? 'bg-red-600' : 'hover:bg-gray-700'}`}>
            <span>📰</span> <span>सबै समाचारहरू</span>
          </button>
          {hasPermission(PERMISSIONS.MANAGE_USERS) && (
            <button onClick={() => handleTabClick('users')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-red-600' : 'hover:bg-gray-700'}`}>
              <span>👥</span> <span>प्रयोगकर्ताहरू</span>
            </button>
          )}
          {/* Settings Tab: Visible if Chief Editor OR has Security Permission */}
          {(user.role === ROLES.CHIEF_EDITOR || hasPermission(PERMISSIONS.MANAGE_SECURITY)) && (
            <button onClick={() => handleTabClick('settings')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-red-600' : 'hover:bg-gray-700'}`}>
              <span>⚙️</span> <span>सेटिङ्हरू</span>
            </button>
          )}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <div className="px-4 py-2 mb-2">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">एकाउन्ट</p>
            <p className="text-sm font-medium text-gray-300 truncate">{user.name}</p>
          </div>
          <button onClick={onLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-900 transition-colors text-red-400">
            <span>🚪</span> <span>लगआउट</span>
          </button>
          <p className="text-[10px] text-gray-500 text-center mt-4">Developed by: Swastik Khatiwada</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow overflow-y-auto w-full">
        <header className="bg-white shadow-sm px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-gray-600 hover:text-red-600 focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
            <h2 className="text-lg md:text-xl font-bold text-gray-800">
              {activeTab === 'users' ? 'प्रयोगकर्ता व्यवस्थापन' : 
               activeTab === 'settings' ? (activeSettingsSubTab === 'general' ? 'वेबसाइट सेटिङ्हरू' : 'सुरक्षा सेटिङ्हरू') : 
               activeTab === 'post' ? (editingNewsId ? 'समाचार सम्पादन (Update)' : 'नयाँ समाचार (Create)') :
               activeTab.toUpperCase()}
            </h2>
          </div>
        </header>

        <div className="p-4 md:p-8">
          {activeTab === 'dashboard' && hasPermission(PERMISSIONS.VIEW_DASHBOARD) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-2xl text-white shadow-lg`}>{stat.icon}</div>
                  <div><p className="text-gray-500 text-sm font-medium">{stat.label}</p><p className="text-2xl font-black text-gray-900">{stat.count}</p></div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'post' && hasPermission(PERMISSIONS.POST_NEWS) && (
            <div className="bg-white p-4 md:p-8 rounded-xl shadow-sm border border-gray-100 max-w-5xl mx-auto">
              <div className="mb-6 flex justify-between items-center">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                    {editingNewsId ? 'समाचार सम्पादन गर्नुहोस्' : 'नयाँ समाचार थप्नुहोस्'}
                </h3>
                {editingNewsId && (
                    <button 
                        onClick={() => {
                            setEditingNewsId(null);
                            setNewsTitle('');
                            setNewsDesc('');
                            setNewsCat(CATEGORIES[0]);
                            setNewsImage(null);
                        }}
                        className="text-sm text-red-600 font-bold hover:underline"
                    >
                        नयाँ लेख्नुहोस् (Cancel Edit)
                    </button>
                )}
              </div>
              <form onSubmit={handlePostNews} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">शीर्षक (Title)</label>
                  <input value={newsTitle} onChange={e => setNewsTitle(e.target.value)} required type="text" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" placeholder="समाचारको मुख्य शीर्षक..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">विवरण (Description)</label>
                  <textarea value={newsDesc} onChange={e => setNewsDesc(e.target.value)} required rows={10} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" placeholder="यहाँ समाचार लेख्नुहोस्..."></textarea>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">क्याटेगोरी छान्नुहोस्</label>
                    <select value={newsCat} onChange={e => setNewsCat(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none bg-gray-50 focus:bg-white transition-colors">
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>

                    <div className="mt-6 space-y-4">
                      <label className="block text-sm font-bold text-gray-700 mb-2">थप विकल्पहरू</label>
                      <div className="flex flex-col space-y-3">
                        <label className="flex items-center space-x-3 cursor-pointer group">
                          <input type="checkbox" checked={showInTicker} onChange={e => setShowInTicker(e.target.checked)} className="w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500" />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">ताजा अपडेट (Ticker) मा देखाउने</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer group">
                          <input type="checkbox" checked={showAuthor} onChange={e => setShowAuthor(e.target.checked)} className="w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500" />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">लेखकको नाम देखाउने</span>
                        </label>
                        
                        {/* Only show "Publish Immediately" checkbox if user has permission to manage news AND is not a REPORTER */}
                        {hasPermission(PERMISSIONS.MANAGE_NEWS) && user.role !== ROLES.REPORTER && (
                          <label className="flex items-center space-x-3 cursor-pointer group bg-green-50 p-2 rounded border border-green-100">
                            <input 
                              type="checkbox" 
                              checked={publishImmediately} 
                              onChange={e => setPublishImmediately(e.target.checked)} 
                              className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500" 
                            />
                            <div>
                                <span className="text-sm font-bold text-green-800 block">सीधै प्रकाशित गर्नुहोस्</span>
                                <span className="text-[10px] text-green-600">चेक नगरेमा "पेन्डिङ" मा बस्नेछ</span>
                            </div>
                          </label>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">फिचर फोटो (Feature Photo)</label>
                    {!newsImage ? (
                      <div onClick={() => fileInputRef.current?.click()} className="w-full h-48 md:h-64 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-red-400 transition-all group">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                          <svg className="w-8 h-8 text-gray-400 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </div>
                        <p className="text-sm font-bold text-gray-500">फोटो अपलोड गर्न यहाँ क्लिक गर्नुहोस् (Auto-Compressed)</p>
                      </div>
                    ) : (
                      <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden shadow-inner bg-gray-100 group">
                        <img src={newsImage} alt="Feature Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <button type="button" onClick={removeImage} className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:bg-red-700 transition-colors">फोटो हटाउनुहोस्</button>
                        </div>
                      </div>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </div>
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 shadow-lg transform active:scale-95 transition-all">
                      {editingNewsId 
                        ? 'समाचार अपडेट गर्नुहोस् (Update News)' 
                        : (hasPermission(PERMISSIONS.MANAGE_NEWS) && user.role !== ROLES.REPORTER && publishImmediately ? 'प्रकाशित गर्नुहोस् (Publish Now)' : 'डाटाबेसमा सेभ गर्नुहोस् (Save to Pending)')
                      }
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'all-news' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-4 border-b bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h3 className="font-bold text-gray-800">समाचारहरूको व्यवस्थापन</h3>
                    <div className="text-xs font-medium text-gray-500 italic">स्वीकृत समाचार मात्र सर्वसाधारणले हेर्न सक्छन्।</div>
                  </div>
                  
                  {/* Status Filter */}
                  <div className="flex bg-gray-100 p-1 rounded-lg">
                     <button 
                       onClick={() => setFilterStatus('ALL')}
                       className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${filterStatus === 'ALL' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                     >
                        सबै (All)
                     </button>
                     <button 
                       onClick={() => setFilterStatus(NEWS_STATUS.PENDING)}
                       className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${filterStatus === NEWS_STATUS.PENDING ? 'bg-yellow-400 shadow-sm text-yellow-900' : 'text-gray-500 hover:text-gray-700'}`}
                     >
                        पेन्डिङ (Approve गर्न बाँकी)
                     </button>
                     <button 
                       onClick={() => setFilterStatus(NEWS_STATUS.PUBLISHED)}
                       className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${filterStatus === NEWS_STATUS.PUBLISHED ? 'bg-green-500 shadow-sm text-white' : 'text-gray-500 hover:text-gray-700'}`}
                     >
                        प्रकाशित (Published)
                     </button>
                  </div>
               </div>
               
               <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[700px]">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                      <tr>
                        <th className="px-6 py-4">फोटो</th>
                        <th className="px-6 py-4">शीर्षक</th>
                        <th className="px-6 py-4">लेखक</th>
                        <th className="px-6 py-4">अवस्था</th>
                        <th className="px-6 py-4 text-right">कार्य</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredNews.length > 0 ? (
                        filteredNews.map((news) => (
                            <tr key={news.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="w-16 h-10 rounded overflow-hidden bg-gray-100 border">
                                    <img src={news.imageUrl} alt="" className="w-full h-full object-cover" />
                                </div>
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-900 truncate max-w-xs">{news.title}</td>
                            <td className="px-6 py-4 text-gray-600">{news.author}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${news.status === NEWS_STATUS.PUBLISHED ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {news.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                {news.status === NEWS_STATUS.PENDING && hasPermission(PERMISSIONS.MANAGE_NEWS) && (
                                <button onClick={() => onApproveNews(news.id)} className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-700 shadow-sm transition-colors animate-pulse">स्वीकृत गर्नुहोस्</button>
                                )}
                                {/* Edit Button for Chief Editor / Managers */}
                                {hasPermission(PERMISSIONS.MANAGE_NEWS) && (
                                <button onClick={() => handleEditNewsClick(news)} className="text-blue-600 hover:text-blue-800 text-xs font-bold transition-colors">सम्पादन</button>
                                )}
                                {/* Delete Button for Chief Editor / Managers */}
                                {hasPermission(PERMISSIONS.MANAGE_NEWS) && (
                                <button onClick={() => onDeleteNews(news.id)} className="text-red-500 hover:text-red-700 text-xs font-bold transition-colors">हटाउनुहोस्</button>
                                )}
                                {!hasPermission(PERMISSIONS.MANAGE_NEWS) && <span className="text-xs text-gray-400 italic">अनुमति छैन</span>}
                            </td>
                            </tr>
                        ))
                      ) : (
                          <tr>
                              <td colSpan={5} className="px-6 py-8 text-center text-gray-400 italic text-sm">
                                  कुनै समाचार फेला परेन।
                              </td>
                          </tr>
                      )}
                    </tbody>
                  </table>
               </div>
            </div>
          )}

          {activeTab === 'users' && hasPermission(PERMISSIONS.MANAGE_USERS) && (
             <div className="space-y-6">
                <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div>
                        <h3 className="text-xl font-black text-gray-900">प्रयोगकर्ताहरू</h3>
                        <p className="text-sm text-gray-500 mt-1">तपाईं यहाँबाट नयाँ स्टाफ थप्न र उनीहरूको एक्सेस म्यानेज गर्न सक्नुहुन्छ।</p>
                    </div>
                    <button 
                        onClick={openAddUser}
                        className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 shadow-md flex items-center space-x-2 transition-all active:scale-95"
                    >
                        <span>➕</span> <span>नयाँ प्रयोगकर्ता</span>
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                          <tr>
                            <th className="px-6 py-4">नाम</th>
                            <th className="px-6 py-4">युजरनेम</th>
                            <th className="px-6 py-4">पद (Role)</th>
                            <th className="px-6 py-4 text-right">कार्य</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {users.map(u => (
                            <tr key={u.username} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 text-xs">{u.name.charAt(0)}</div>
                                        <span className="font-bold text-gray-900">{u.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-500 font-mono text-sm">@{u.username}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-black border uppercase ${getRoleBadgeColor(u.role)}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-4">
                                    <button onClick={() => openEditUser(u)} className="text-blue-600 hover:text-blue-800 text-xs font-bold transition-colors">सम्पादन</button>
                                    <button onClick={() => handleDeleteUserClick(u.username)} className="text-red-500 hover:text-red-700 text-xs font-bold transition-colors">हटाउनुहोस्</button>
                                </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'settings' && (
             <div className="max-w-4xl mx-auto space-y-6">
                {/* Settings Sub-Navigation */}
                <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 w-fit mx-auto md:mx-0">
                   {/* Restricted: Only Chief Editor sees General Settings */}
                   {user.role === ROLES.CHIEF_EDITOR && (
                     <button 
                       onClick={() => setActiveSettingsSubTab('general')}
                       className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeSettingsSubTab === 'general' ? 'bg-red-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                     >
                       🌐 पहिचान (General)
                     </button>
                   )}
                   {hasPermission(PERMISSIONS.MANAGE_SECURITY) && (
                     <button 
                       onClick={() => setActiveSettingsSubTab('security')}
                       className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeSettingsSubTab === 'security' ? 'bg-red-600' : 'text-gray-500 hover:bg-gray-50'}`}
                     >
                       🔒 सुरक्षा (Security)
                     </button>
                   )}
                </div>

                {activeSettingsSubTab === 'general' && user.role === ROLES.CHIEF_EDITOR && (
                   <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                         <div className="flex items-center space-x-4 mb-8">
                            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center text-xl">🏠</div>
                            <div>
                               <h3 className="text-xl font-black text-gray-900">वेबसाइट पहिचान (Identity)</h3>
                               <p className="text-sm text-gray-500">साइटको नाम, स्लोगन र लोगो यहाँबाट मिलाउनुहोस्।</p>
                            </div>
                         </div>

                         <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div>
                                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">वेबसाइटको नाम</label>
                                  <input 
                                     type="text" 
                                     value={tempSiteTitle} 
                                     onChange={e => setTempSiteTitle(e.target.value)}
                                     className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all" 
                                  />
                               </div>
                               <div>
                                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">स्लोगन (Tagline)</label>
                                  <input 
                                     type="text" 
                                     value={tempSiteSlogan} 
                                     onChange={e => setTempSiteSlogan(e.target.value)}
                                     className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all" 
                                  />
                               </div>
                            </div>

                            <div>
                               <label className="block text-xs font-bold text-gray-500 uppercase mb-3">वेबसाइट लोगो</label>
                               <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                                  <div className="w-48 h-24 bg-white rounded-lg border flex items-center justify-center p-4 shadow-sm">
                                     {tempLogo ? (
                                        <img src={tempLogo} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                                     ) : (
                                        <div className="text-gray-300 font-bold italic">No Logo</div>
                                     )}
                                  </div>
                                  <div className="flex-1 space-y-3 text-center md:text-left">
                                     <p className="text-xs text-gray-500">सिफारिस गरिएको साइज: ५००x२०० पिक्xel (PNG Format).</p>
                                     <button 
                                        onClick={() => logoInputRef.current?.click()}
                                        type="button" // Important for not submitting form
                                        className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-sm"
                                     >
                                        लोगो परिवर्तन गर्नुहोस्
                                     </button>
                                     <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                         <div className="flex items-center space-x-4 mb-8">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl">📱</div>
                            <div>
                               <h3 className="text-xl font-black text-gray-900">सम्पर्क र सामाजिक सञ्जाल</h3>
                               <p className="text-sm text-gray-500">फेसबुक, ट्विटर, युट्युब, इन्स्टाग्राम, इमेल र सम्पर्क नम्बर अपडेट गर्नुहोस्।</p>
                            </div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                               <label className="block text-xs font-bold text-gray-500 uppercase mb-2">फेसबुक लिंक (Facebook)</label>
                               <input type="text" value={tempFacebookLink} onChange={e => setTempFacebookLink(e.target.value)} placeholder="https://facebook.com/drishti" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" />
                            </div>
                            <div>
                               <label className="block text-xs font-bold text-gray-500 uppercase mb-2">ट्विटर लिंक (Twitter)</label>
                               <input type="text" value={tempTwitterLink} onChange={e => setTempTwitterLink(e.target.value)} placeholder="https://twitter.com/drishti" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" />
                            </div>
                            <div>
                               <label className="block text-xs font-bold text-gray-500 uppercase mb-2">युट्युब च्यानल लिंक (YouTube)</label>
                               <input type="text" value={tempYoutubeLink} onChange={e => setTempYoutubeLink(e.target.value)} placeholder="https://youtube.com/channel/..." className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" />
                            </div>
                            <div>
                               <label className="block text-xs font-bold text-gray-500 uppercase mb-2">इन्स्टाग्राम लिंक (Instagram)</label>
                               <input type="text" value={tempInstagramLink} onChange={e => setTempInstagramLink(e.target.value)} placeholder="https://instagram.com/drishti" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" />
                            </div>
                            <div>
                               <label className="block text-xs font-bold text-gray-500 uppercase mb-2">इमेल ठेगाना (Email)</label>
                               <input type="email" value={tempContactEmail} onChange={e => setTempContactEmail(e.target.value)} placeholder="info@drishtikhabar.com" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" />
                            </div>
                            <div>
                               <label className="block text-xs font-bold text-gray-500 uppercase mb-2">सम्पर्क नम्बर (Phone)</label>
                               <input type="text" value={tempContactPhone} onChange={e => setTempContactPhone(e.target.value)} placeholder="+९७७-०१-xxxxxxx" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" />
                            </div>
                         </div>
                      </div>

                      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                         <div className="flex items-center space-x-4 mb-8">
                            <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center text-xl">📢</div>
                            <div>
                               <h3 className="text-xl font-black text-gray-900">हेडर विज्ञापन (Header Advertisement)</h3>
                               <p className="text-sm text-gray-500">वेबसाइटको माथिल्लो भाग (लोगोको छेउ) मा देखिने विज्ञापन व्यवस्थापन।</p>
                            </div>
                         </div>

                         <div className="space-y-6">
                            {/* Ad Type Toggle */}
                            <div className="flex space-x-6 border-b border-gray-100 pb-4">
                               <label className="flex items-center space-x-2 cursor-pointer">
                                  <input 
                                     type="radio" 
                                     name="headerAdType" 
                                     value="code" 
                                     checked={tempHeaderAdType === 'code'} 
                                     onChange={() => setTempHeaderAdType('code')}
                                     className="w-5 h-5 text-red-600 border-gray-300 focus:ring-red-500" 
                                  />
                                  <span className={`font-bold text-sm ${tempHeaderAdType === 'code' ? 'text-gray-900' : 'text-gray-500'}`}>Script / Text Code</span>
                               </label>
                               <label className="flex items-center space-x-2 cursor-pointer">
                                  <input 
                                     type="radio" 
                                     name="headerAdType" 
                                     value="image" 
                                     checked={tempHeaderAdType === 'image'} 
                                     onChange={() => setTempHeaderAdType('image')}
                                     className="w-5 h-5 text-red-600 border-gray-300 focus:ring-red-500" 
                                  />
                                  <span className={`font-bold text-sm ${tempHeaderAdType === 'image' ? 'text-gray-900' : 'text-gray-500'}`}>Image Banner</span>
                               </label>
                            </div>

                            {/* Conditional Input */}
                            {tempHeaderAdType === 'code' ? (
                               <div>
                                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">AdSense / HTML Script कोड</label>
                                  <textarea 
                                     value={tempAdsense} 
                                     onChange={e => setTempAdsense(e.target.value)}
                                     rows={6}
                                     className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-mono text-xs bg-gray-50" 
                                     placeholder="<script async src='https://pagead2.googlesyndication.com/...'></script>"
                                  ></textarea>
                                  <div className="mt-2 text-[10px] text-gray-500 italic">
                                     नोट: यो कोड हेडरमा र 'Advertisement' कम्पोनेन्ट प्रयोग भएका अन्य ठाउँहरूमा (यदि ओभरराइड गरिएको छैन भने) प्रयोग हुन सक्छ।
                                  </div>
                               </div>
                            ) : (
                               <div>
                                   <label className="block text-xs font-bold text-gray-500 uppercase mb-3">विज्ञापन ब्यानर फोटो</label>
                                   <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                                      <div className="w-full md:w-96 h-24 bg-white rounded-lg border flex items-center justify-center p-2 shadow-sm overflow-hidden">
                                         {tempHeaderAdImage ? (
                                            <img src={tempHeaderAdImage} alt="Ad Preview" className="w-full h-full object-contain" />
                                         ) : (
                                            <div className="text-gray-300 font-bold italic text-xs">No Image Selected</div>
                                         )}
                                      </div>
                                      <div className="flex-1 space-y-3 text-center md:text-left">
                                         <p className="text-xs text-gray-500">सिफारिस गरिएको साइज: ९७०x९० पिक्सेल (Landscape).</p>
                                         <button 
                                            onClick={() => headerAdInputRef.current?.click()}
                                            type="button" 
                                            className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-sm"
                                         >
                                            फोटो अपलोड गर्नुहोस्
                                         </button>
                                         <input ref={headerAdInputRef} type="file" accept="image/*" onChange={handleHeaderAdImageChange} className="hidden" />
                                      </div>
                                   </div>
                               </div>
                            )}
                         </div>
                      </div>

                      <div className="flex justify-end pt-4">
                         <button 
                            onClick={handleSaveGeneralSettings}
                            type="button" // Important for not submitting form
                            className="bg-green-600 text-white px-10 py-4 rounded-2xl font-black shadow-lg hover:bg-green-700 transform active:scale-95 transition-all w-full md:w-auto"
                         >
                            सबै सुरक्षित गर्नुहोस्
                         </button>
                      </div>
                   </div>
                )}

                {activeSettingsSubTab === 'security' && hasPermission(PERMISSIONS.MANAGE_SECURITY) && (
                   <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
                      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                         <div className="flex items-center space-x-4 mb-8">
                            <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center text-xl">🔐</div>
                            <div>
                               <h3 className="text-xl font-black text-gray-900">पासवर्ड परिवर्तन</h3>
                               <p className="text-sm text-gray-500">तपाईंको एकाउन्ट सुरक्षित राख्न पासवर्ड नियमित परिवर्तन गर्नुहोस्।</p>
                            </div>
                         </div>

                         <form onSubmit={handlePasswordChange} className="space-y-6">
                            <div>
                               <label className="block text-xs font-bold text-gray-500 uppercase mb-2">हालको पासवर्ड</label>
                               <input 
                                  required
                                  type="password" 
                                  value={currentPwd}
                                  onChange={e => setCurrentPwd(e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" 
                                  placeholder="हालको पासवर्ड हाल्नुहोस्"
                               />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div>
                                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">नयाँ पासवर्ड</label>
                                  <input 
                                     required
                                     type="password" 
                                     value={newPwd}
                                     onChange={e => setNewPwd(e.target.value)}
                                     className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" 
                                     placeholder="नयाँ पासवर्ड"
                                  />
                               </div>
                               <div>
                                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">नयाँ पासवर्ड कन्फर्म गर्नुहोस्</label>
                                  <input 
                                     required
                                     type="password" 
                                     value={confirmPwd}
                                     onChange={e => setConfirmPwd(e.target.value)}
                                     className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" 
                                     placeholder="दोहोर्याउनुहोस्"
                                  />
                               </div>
                            </div>

                            <div className="pt-4">
                               <button 
                                  type="submit"
                                  className="w-full bg-red-600 text-white py-4 rounded-xl font-black shadow-lg hover:bg-red-700 transform active:scale-95 transition-all"
                               >
                                  पासवर्ड परिवर्तन गर्नुहोस्
                               </button>
                            </div>
                         </form>
                      </div>
                   </div>
                )}
             </div>
          )}
        </div>
      </main>

      {/* User Management Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] flex flex-col overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
                    <h3 className="text-lg font-black text-gray-800">{editingUser ? 'प्रयोगकर्ता सम्पादन' : 'नयाँ प्रयोगकर्ता थप्नुहोस्'}</h3>
                    <button onClick={() => setIsUserModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <form onSubmit={handleUserSubmit} className="p-6 flex-grow overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {/* Column 1: Personal Info */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-black text-gray-900 border-b pb-2 uppercase tracking-wide">व्यक्तिगत विवरण (Personal Info)</h4>
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">पूरा नाम (Full Name)</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={userForm.name} 
                                    onChange={e => setUserForm({...userForm, name: e.target.value})} 
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" 
                                    placeholder="नाम थर"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">युजरनेम (Username)</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={userForm.username} 
                                    onChange={e => setUserForm({...userForm, username: e.target.value})} 
                                    disabled={!!editingUser}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none disabled:bg-gray-100 disabled:text-gray-500" 
                                    placeholder="username"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">पासवर्ड (Password)</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={userForm.password} 
                                    onChange={e => setUserForm({...userForm, password: e.target.value})} 
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" 
                                    placeholder="password"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">पद (Role)</label>
                                <div className="relative">
                                    <select 
                                        value={userForm.role} 
                                        onChange={(e) => handleRoleChange(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none appearance-none bg-white"
                                    >
                                        {Object.values(ROLES).map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1">पद परिवर्तन गर्दा अनुमतिहरू स्वतः अपडेट हुनेछन्।</p>
                            </div>
                        </div>

                        {/* Column 2: Permissions */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-black text-gray-900 border-b pb-2 uppercase tracking-wide">मेनु पहुँच अनुमति (Menu Access)</h4>
                            <p className="text-[10px] text-gray-400 mb-2 italic">यहाँबाट यो प्रयोगकर्ताले कुन मेनु र सब-मेनु देख्न पाउने हो छान्नुहोस्:</p>
                            
                            <div className="grid grid-cols-1 gap-2">
                                <label className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer group transition-colors">
                                    <input type="checkbox" checked={Array.isArray(userForm.permissions) && userForm.permissions.includes(PERMISSIONS.VIEW_DASHBOARD)} onChange={() => togglePermission(PERMISSIONS.VIEW_DASHBOARD)} className="w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500" />
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-gray-800 group-hover:text-red-600">📊 ड्यासबोर्ड (Dashboard)</p>
                                        <p className="text-[10px] text-gray-400">मुख्य तथ्याङ्कहरू हेर्न</p>
                                    </div>
                                </label>

                                <label className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer group transition-colors">
                                    <input type="checkbox" checked={Array.isArray(userForm.permissions) && userForm.permissions.includes(PERMISSIONS.POST_NEWS)} onChange={() => togglePermission(PERMISSIONS.POST_NEWS)} className="w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500" />
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-gray-800 group-hover:text-red-600">✍️ समाचार लेख्ने (Post News)</p>
                                        <p className="text-[10px] text-gray-400">नयाँ समाचार थप्ने अधिकार</p>
                                    </div>
                                </label>

                                <label className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer group transition-colors">
                                    <input type="checkbox" checked={Array.isArray(userForm.permissions) && userForm.permissions.includes(PERMISSIONS.MANAGE_NEWS)} onChange={() => togglePermission(PERMISSIONS.MANAGE_NEWS)} className="w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500" />
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-gray-800 group-hover:text-red-600">📰 समाचार व्यवस्थापन (Approval)</p>
                                        <p className="text-[10px] text-gray-400">समाचार स्वीकृत र हटाउने अधिकार</p>
                                    </div>
                                </label>

                                <label className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer group transition-colors">
                                    <input type="checkbox" checked={Array.isArray(userForm.permissions) && userForm.permissions.includes(PERMISSIONS.MANAGE_USERS)} onChange={() => togglePermission(PERMISSIONS.MANAGE_USERS)} className="w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500" />
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-gray-800 group-hover:text-red-600">👥 प्रयोगकर्ता (User Mgmt)</p>
                                        <p className="text-[10px] text-gray-400">स्टाफहरू थप्ने र अनुमति दिने अधिकार</p>
                                    </div>
                                </label>

                                <label className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer group transition-colors">
                                    <input type="checkbox" checked={Array.isArray(userForm.permissions) && userForm.permissions.includes(PERMISSIONS.MANAGE_SETTINGS)} onChange={() => togglePermission(PERMISSIONS.MANAGE_SETTINGS)} className="w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500" />
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-gray-800 group-hover:text-red-600">🌐 वेबसाइट सेटिङ् (General)</p>
                                        <p className="text-[10px] text-gray-400">लोगो र नाम परिवर्तन गर्ने अधिकार (Role Restricted)</p>
                                    </div>
                                </label>

                                <label className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer group transition-colors">
                                    <input type="checkbox" checked={Array.isArray(userForm.permissions) && userForm.permissions.includes(PERMISSIONS.MANAGE_SECURITY)} onChange={() => togglePermission(PERMISSIONS.MANAGE_SECURITY)} className="w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500" />
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-gray-800 group-hover:text-red-600">🔒 सुरक्षा (Security)</p>
                                        <p className="text-[10px] text-gray-400">आफ्नो पासवर्ड परिवर्तन गर्ने अधिकार</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t flex space-x-4">
                        <button type="button" onClick={() => setIsUserModalOpen(false)} className="flex-1 px-4 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">रद्द गर्नुहोस्</button>
                        <button type="submit" className="flex-1 px-4 py-4 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 shadow-lg transform active:scale-95 transition-all">परिवर्तन सुरक्षित गर्नुहोस्</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;