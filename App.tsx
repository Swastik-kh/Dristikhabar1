import React, { useState, useEffect } from 'react';
import Header from './components/Header.tsx';
import Navbar from './components/Navbar.tsx';
import Advertisement from './components/Advertisement.tsx';
import LatestNewsTicker from './components/LatestNewsTicker.tsx';
import MainNewsSection from './components/MainNewsSection.tsx';
import PopularNewsSidebar from './components/PopularNewsSidebar.tsx';
import Footer from './components/Footer.tsx';
import LoginModal from './components/LoginModal.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import NewsDetailModal from './components/NewsDetailModal.tsx';
import { NEWS_STATUS, MOCK_USERS, NEWS_PORTAL_SLOGAN } from './constants.ts';
import { getExactNepaliDate } from './utils/nepaliDate.ts';

// Firebase Imports
import { db, analytics } from './firebase.ts'; 
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy, setDoc } from "firebase/firestore";


function App() {
  const [user, setUser] = useState<any | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // App Settings State
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [adsenseCode, setAdsenseCode] = useState<string>('');
  const [siteTitle, setSiteTitle] = useState('दृष्टि खबर');
  const [siteSlogan, setSiteSlogan] = useState(NEWS_PORTAL_SLOGAN);
  
  // Header Ad Settings
  const [headerAdImage, setHeaderAdImage] = useState<string | null>(null);
  const [headerAdType, setHeaderAdType] = useState<'code' | 'image'>('code');

  // Contact & Social State
  const [facebookLink, setFacebookLink] = useState('');
  const [twitterLink, setTwitterLink] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [instagramLink, setInstagramLink] = useState(''); // Added Instagram
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);
  const [selectedNews, setSelectedNews] = useState<any | null>(null);
  const [activeCategory, setActiveCategory] = useState('सबै');
  const [allNews, setAllNews] = useState<any[]>([]);
  // Initialize users as empty array; will be populated from Firestore
  const [users, setUsers] = useState<any[]>([]);

  // Firebase: Fetch and listen to news, settings, and USERS
  useEffect(() => {
    // 1. App Settings
    const settingsDocRef = doc(db, "settings", "app_settings");
    const unsubscribeSettings = onSnapshot(settingsDocRef, async (docSnap) => {
      if (docSnap.exists()) {
        const settingsData = docSnap.data();
        setLogoUrl(settingsData.logoUrl || null);
        setAdsenseCode(settingsData.adsenseCode || '');
        // New Header Ad Settings
        setHeaderAdImage(settingsData.headerAdImage || null);
        setHeaderAdType(settingsData.headerAdType || 'code');

        setSiteTitle(settingsData.siteTitle || 'दृष्टि खबर');
        setSiteSlogan(settingsData.siteSlogan || NEWS_PORTAL_SLOGAN);
        setFacebookLink(settingsData.facebookLink || '');
        setTwitterLink(settingsData.twitterLink || '');
        setYoutubeLink(settingsData.youtubeLink || '');
        setInstagramLink(settingsData.instagramLink || '');
        setContactEmail(settingsData.contactEmail || '');
        setContactPhone(settingsData.contactPhone || '');
      } else {
        try {
          await setDoc(settingsDocRef, {
            logoUrl: null,
            adsenseCode: '',
            headerAdImage: null,
            headerAdType: 'code',
            siteTitle: 'दृष्टि खबर',
            siteSlogan: NEWS_PORTAL_SLOGAN,
            facebookLink: '',
            twitterLink: '',
            youtubeLink: '',
            instagramLink: '',
            contactEmail: '',
            contactPhone: '',
          });
        } catch (e) {
          console.error('Error creating app_settings document:', e);
        }
      }
      setIsSettingsLoaded(true);
    }, (error) => {
      console.error("Error fetching app settings:", error);
      setIsSettingsLoaded(true);
    });

    // 2. News
    const q = query(collection(db, "news"), orderBy("creationTimestamp", "desc"));
    const unsubscribeNews = onSnapshot(q, (snapshot) => {
      const newsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as any
      }));
      setAllNews(newsData);
      
      const params = new URLSearchParams(window.location.search);
      const newsId = params.get('news');
      if (newsId) {
        const news = newsData.find(n => n.id === newsId);
        if (news && news.status === NEWS_STATUS.PUBLISHED) {
          setSelectedNews(news);
        }
      }
    }, (error) => {
      console.error("Error fetching news:", error);
    });

    // 3. Users (Authentication & Management)
    const usersCollection = collection(db, "users");
    const unsubscribeUsers = onSnapshot(usersCollection, async (snapshot) => {
      const firebaseUsers = snapshot.docs.map(doc => ({
        ...doc.data(),
        // CRITICAL: Ensure 'username' matches the document ID. 
        // This guarantees that deleting by 'username' deletes the correct document.
        username: doc.id 
      }));

      // Robust Seeding: Check if 'admin' exists specifically. 
      // If 'admin' is missing (even if other users exist), re-create it.
      // This solves the issue where the DB might be in a partial state or empty.
      const adminExists = firebaseUsers.some((u: any) => u.username === 'admin');

      if (!adminExists) {
        console.log("Admin user missing. Seeding default admin...");
        const defaultAdmin = MOCK_USERS[0];
        try {
          await setDoc(doc(db, "users", defaultAdmin.username), defaultAdmin);
          // Note: The snapshot listener will fire again automatically after this write.
        } catch (e) {
          console.error("Error seeding default admin:", e);
        }
      }
      
      setUsers(firebaseUsers);
      
    }, (error) => {
      console.error("Error fetching users from Firestore:", error);
      // Fallback to mock users if offline/error to allow at least local admin login
      setUsers(MOCK_USERS);
    });

    return () => {
      unsubscribeSettings();
      unsubscribeNews();
      unsubscribeUsers();
    };
  }, []);

  // Handle Initial Deep Link and Browser Navigation
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const newsId = params.get('news');
    if (newsId && allNews.length > 0) {
      const news = allNews.find(n => n.id === newsId);
      if (news && news.status === NEWS_STATUS.PUBLISHED) {
        setSelectedNews(news);
      }
    }

    const handlePopState = () => {
      const updatedParams = new URLSearchParams(window.location.search);
      const updatedId = updatedParams.get('news');
      if (updatedId) {
        const news = allNews.find(n => n.id === updatedId);
        setSelectedNews(news || null);
      } else {
        setSelectedNews(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [allNews]);

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Firestore Updates - Settings
  const handleLogoUpdate = async (newLogoUrl: string) => {
    try {
      await updateDoc(doc(db, "settings", "app_settings"), { logoUrl: newLogoUrl });
      setLogoUrl(newLogoUrl);
    } catch (e) {
      console.error("Error updating logo URL: ", e);
      alert('लोगो URL अपडेट गर्दा त्रुटि भयो।');
    }
  };

  const handleAdsenseUpdate = async (code: string) => {
    try {
      await updateDoc(doc(db, "settings", "app_settings"), { adsenseCode: code });
      setAdsenseCode(code);
    } catch (e) {
      console.error("Error updating adsense code: ", e);
      alert('Adsense कोड अपडेट गर्दा त्रुटि भयो।');
    }
  };

  // New Header Ad Handlers
  const handleHeaderAdImageUpdate = async (url: string | null) => {
    try {
      await updateDoc(doc(db, "settings", "app_settings"), { headerAdImage: url });
      setHeaderAdImage(url);
    } catch (e) {
      console.error("Error updating header ad image: ", e);
      alert('हेडर विज्ञापन फोटो अपडेट गर्दा त्रुटि भयो।');
    }
  };

  const handleHeaderAdTypeUpdate = async (type: 'code' | 'image') => {
    try {
      await updateDoc(doc(db, "settings", "app_settings"), { headerAdType: type });
      setHeaderAdType(type);
    } catch (e) {
      console.error("Error updating header ad type: ", e);
      alert('हेडर विज्ञापन प्रकार अपडेट गर्दा त्रुटि भयो।');
    }
  };


  const handleSiteTitleUpdate = async (newTitle: string) => {
    try {
      await updateDoc(doc(db, "settings", "app_settings"), { siteTitle: newTitle });
      setSiteTitle(newTitle);
    } catch (e) {
      console.error("Error updating site title: ", e);
      alert('साइटको शीर्षक अपडेट गर्दा त्रुटि भयो।');
    }
  };

  const handleSiteSloganUpdate = async (newSlogan: string) => {
    try {
      await updateDoc(doc(db, "settings", "app_settings"), { siteSlogan: newSlogan });
      setSiteSlogan(newSlogan);
    } catch (e) {
      console.error("Error updating site slogan: ", e);
      alert('साइटको स्लोगन अपडेट गर्दा त्रुटि भयो।');
    }
  };

  const handleFacebookLinkUpdate = async (link: string) => {
    try {
      await updateDoc(doc(db, "settings", "app_settings"), { facebookLink: link });
      setFacebookLink(link);
    } catch (e) {
      console.error("Error updating Facebook link: ", e);
      alert('फेसबुक लिङ्क अपडेट गर्दा त्रुटि भयो।');
    }
  };

  const handleTwitterLinkUpdate = async (link: string) => {
    try {
      await updateDoc(doc(db, "settings", "app_settings"), { twitterLink: link });
      setTwitterLink(link);
    } catch (e) {
      console.error("Error updating Twitter link: ", e);
      alert('ट्विटर लिङ्क अपडेट गर्दा त्रुटि भयो।');
    }
  };

  const handleYoutubeLinkUpdate = async (link: string) => {
    try {
      await updateDoc(doc(db, "settings", "app_settings"), { youtubeLink: link });
      setYoutubeLink(link);
    } catch (e) {
      console.error("Error updating YouTube link: ", e);
      alert('युट्युब लिङ्क अपडेट गर्दा त्रुटि भयो।');
    }
  };

  const handleInstagramLinkUpdate = async (link: string) => {
    try {
      await updateDoc(doc(db, "settings", "app_settings"), { instagramLink: link });
      setInstagramLink(link);
    } catch (e) {
      console.error("Error updating Instagram link: ", e);
      alert('इन्स्टाग्राम लिङ्क अपडेट गर्दा त्रुटि भयो।');
    }
  };

  const handleContactEmailUpdate = async (email: string) => {
    try {
      await updateDoc(doc(db, "settings", "app_settings"), { contactEmail: email });
      setContactEmail(email);
    } catch (e) {
      console.error("Error updating contact email: ", e);
      alert('सम्पर्क इमेल अपडेट गर्दा त्रुटि भयो।');
    }
  };

  const handleContactPhoneUpdate = async (phone: string) => {
    try {
      await updateDoc(doc(db, "settings", "app_settings"), { contactPhone: phone });
      setContactPhone(phone);
    } catch (e) {
      console.error("Error updating contact phone: ", e);
      alert('सम्पर्क फोन अपडेट गर्दा त्रुटि भयो।');
    }
  };


  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    // If news is open, go back to home on category click
    if (selectedNews) {
        setSelectedNews(null);
        try {
            const newUrl = `${window.location.origin}${window.location.pathname}`;
            window.history.pushState({ path: newUrl }, '', newUrl);
        } catch (e) {
            console.warn("Nav warning", e);
        }
    }
  };

  const handleNewsOpen = (news: any) => {
    setSelectedNews(news);
    const newUrl = `${window.location.origin}${window.location.pathname}?news=${news.id}`;
    try {
      window.history.pushState({ path: newUrl }, '', newUrl);
    } catch (error) {
      console.warn("Could not update URL using history.pushState:", error);
    }
  };

  const handleNewsClose = () => {
    setSelectedNews(null);
    const newUrl = `${window.location.origin}${window.location.pathname}`;
    try {
      window.history.pushState({ path: newUrl }, '', newUrl);
    } catch (error) {
      console.warn("Could not update URL using history.pushState (on close):", error);
    }
  };

  // Firestore Updates - News
  const handleAddNews = async (newsData: any) => {
    try {
      const { id, ...dataToStore } = newsData; 
      await addDoc(collection(db, "news"), {
        ...dataToStore,
        creationTimestamp: id,
      });
      // UPDATED MESSAGE: Explicitly stating it's saved to DB
      alert('समाचार डाटाबेसमा सुरक्षित गरियो (Pending)। अब तपाईंले "सबै समाचार" ट्याबबाट यसलाई हेर्न र स्वीकृत गर्न सक्नुहुन्छ।');
    } catch (e) {
      console.error("Error adding document: ", e);
      alert('समाचार थप्दा त्रुटि भयो। कृपया फोटोको साइज घटाएर पुनः प्रयास गर्नुहोस्।');
    }
  };

  const handleUpdateNewsContent = async (newsId: string, updatedData: any) => {
    try {
      const newsRef = doc(db, "news", newsId);
      await updateDoc(newsRef, updatedData);
      alert('समाचार अपडेट गरियो।');
    } catch (e) {
      console.error("Error updating news: ", e);
      alert('समाचार अपडेट गर्दा त्रुटि भयो।');
    }
  };

  const handleApproveNews = async (newsId: string) => {
    try {
      const newsRef = doc(db, "news", newsId);
      await updateDoc(newsRef, { 
        status: NEWS_STATUS.PUBLISHED,
        date: getExactNepaliDate() // Update date to current moment when approving
      });
      alert('समाचार स्वीकृत र प्रकाशित गरियो।');
    } catch (e) {
      console.error("Error approving news: ", e);
      alert('समाचार स्वीकृत गर्दा त्रुटि भयो।');
    }
  };

  const handleDeleteNews = async (newsId: string) => {
    if (!window.confirm('के तपाईं पक्का हुनुहुन्छ? यो समाचार स्थायी रूपमा हटाइनेछ।')) {
      return;
    }
    try {
      await deleteDoc(doc(db, "news", newsId));
      alert('समाचार सफलतापूर्वक हटाइयो।');
    } catch (e) {
      console.error("Error deleting news: ", e);
      alert('समाचार हटाउँदा त्रुटि भयो।');
    }
  };

  // Firestore Updates - Users
  const handleAddUser = async (newUser: any) => {
    try {
      // Use username as the Document ID for easy retrieval and uniqueness
      await setDoc(doc(db, "users", newUser.username), newUser);
      alert('नयाँ प्रयोगकर्ता सिस्टममा थपियो (Cloud Sync)। अब यो खाताबाट जुनसुकै ठाउँबाट लगइन गर्न सकिन्छ।');
    } catch (e) {
      console.error("Error adding user: ", e);
      alert('प्रयोगकर्ता थप्दा त्रुटि भयो।');
    }
  };

  const handleUpdateUser = async (updatedUser: any) => {
    try {
      // Overwrite/Merge user data
      await setDoc(doc(db, "users", updatedUser.username), updatedUser);
      alert('प्रयोगकर्ताको विवरण अपडेट गरियो।');
      
      // Update local session if the currently logged-in user modified themselves
      if (user && user.username === updatedUser.username) {
        setUser(updatedUser);
      }
    } catch (e) {
      console.error("Error updating user: ", e);
      alert('प्रयोगकर्ता अपडेट गर्दा त्रुटि भयो।');
    }
  };

  const handleDeleteUser = async (username: string) => {
    try {
      await deleteDoc(doc(db, "users", username));
      alert('प्रयोगकर्ता हटाइयो।');
    } catch (e) {
      console.error("Error deleting user: ", e);
      alert('प्रयोगकर्ता हटाउँदा त्रुटि भयो।');
    }
  };

  const publishedNews = allNews.filter(news => news.status === NEWS_STATUS.PUBLISHED);
  // Limit ticker news to 5 latest items
  const tickerNews = publishedNews.filter(news => news.showInTicker).slice(0, 5);

  if (user) {
    return (
      <AdminDashboard 
        user={user} 
        onLogout={handleLogout} 
        logoUrl={logoUrl} 
        onLogoUpdate={handleLogoUpdate}
        adsenseCode={adsenseCode}
        onAdsenseUpdate={handleAdsenseUpdate}
        
        // Header Ad Props
        headerAdImage={headerAdImage}
        onHeaderAdImageUpdate={handleHeaderAdImageUpdate}
        headerAdType={headerAdType}
        onHeaderAdTypeUpdate={handleHeaderAdTypeUpdate}

        siteTitle={siteTitle}
        onSiteTitleUpdate={handleSiteTitleUpdate}
        siteSlogan={siteSlogan}
        onSiteSloganUpdate={handleSiteSloganUpdate}
        facebookLink={facebookLink}
        onFacebookLinkUpdate={handleFacebookLinkUpdate}
        twitterLink={twitterLink}
        onTwitterLinkUpdate={handleTwitterLinkUpdate}
        youtubeLink={youtubeLink}
        onYoutubeLinkUpdate={handleYoutubeLinkUpdate}
        instagramLink={instagramLink}
        onInstagramLinkUpdate={handleInstagramLinkUpdate}
        contactEmail={contactEmail}
        onContactEmailUpdate={handleContactEmailUpdate}
        contactPhone={contactPhone}
        onContactPhoneUpdate={handleContactPhoneUpdate}
        allNews={allNews}
        users={users}
        onAddNews={handleAddNews}
        onUpdateNewsContent={handleUpdateNewsContent}
        onApproveNews={handleApproveNews}
        onDeleteNews={handleDeleteNews}
        onAddUser={handleAddUser}
        onUpdateUser={handleUpdateUser}
        onDeleteUser={handleDeleteUser}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header 
        user={user} 
        onLoginClick={() => setIsLoginModalOpen(true)} 
        onLogout={handleLogout} 
        logoUrl={logoUrl}
        adsenseCode={adsenseCode}
        // Header Ad Props Passed
        headerAdImage={headerAdImage}
        headerAdType={headerAdType}
        
        siteTitle={siteTitle}
        siteSlogan={siteSlogan}
        facebookLink={facebookLink}
        twitterLink={twitterLink}
        youtubeLink={youtubeLink}
        instagramLink={instagramLink}
        isSettingsLoaded={isSettingsLoaded}
      />
      <Navbar 
        logoUrl={logoUrl} 
        activeCategory={activeCategory} 
        onCategoryChange={handleCategoryChange} 
        isSettingsLoaded={isSettingsLoaded}
        siteTitle={siteTitle}
      />

      <main className="container mx-auto px-4 py-8 flex-grow">
        <Advertisement adsenseCode={adsenseCode} className="mb-8 h-32 md:h-40 lg:h-48" />

        {/* Conditional Rendering: Show NewsDetail OR Dashboard */}
        {selectedNews ? (
             <NewsDetailModal 
               news={selectedNews} 
               onClose={handleNewsClose} 
             />
        ) : (
            <>
                <LatestNewsTicker 
                  onNewsClick={handleNewsOpen} 
                  newsItems={tickerNews} 
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="main-news-area">
                  <div className="lg:col-span-2">
                    <MainNewsSection 
                      onNewsClick={handleNewsOpen} 
                      activeCategory={activeCategory} 
                      newsItems={publishedNews}
                    />
                    <Advertisement adsenseCode={adsenseCode} className="my-8 h-24 md:h-32" />
                  </div>

                  <div className="lg:col-span-1">
                    <PopularNewsSidebar 
                      onNewsClick={handleNewsOpen} 
                      newsItems={publishedNews.filter(n => n.isPopular)}
                    />
                  </div>
                </div>
            </>
        )}
      </main>

      <Footer 
        facebookLink={facebookLink}
        twitterLink={twitterLink}
        youtubeLink={youtubeLink}
        instagramLink={instagramLink}
        contactEmail={contactEmail}
        contactPhone={contactPhone}
      />

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
        users={users}
      />
    </div>
  );
}

export default App;