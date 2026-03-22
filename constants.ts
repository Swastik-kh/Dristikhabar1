
export const LIVE_TEXT = 'LIVE';
export const LOGIN_TEXT = 'LOGIN';
export const LOGOUT_TEXT = 'LOGOUT';
export const NEWS_PORTAL_SLOGAN = 'सत्य, तथ्य र निष्पक्ष समाचारको संवाहक';
export const ADVERTISEMENT_TEXT = 'ADVERTISEMENT';
export const LATEST_UPDATE_TEXT = 'ताजा अपडेट'; 
export const MAIN_NEWS_TITLE = 'मुख्य समाचार'; 
export const POPULAR_NEWS_TITLE = 'लोकप्रिय'; 

export const ROLES = {
  CHIEF_EDITOR: 'प्रधान सम्पादक',
  EDITOR: 'सम्पादक',
  REPORTER: 'रिपोर्टर'
};

export const PERMISSIONS = {
  VIEW_DASHBOARD: 'view_dashboard',
  POST_NEWS: 'post_news',
  MANAGE_NEWS: 'manage_news',
  MANAGE_USERS: 'manage_users',
  MANAGE_SETTINGS: 'manage_settings',
  MANAGE_SECURITY: 'manage_security'
};

export const MOCK_USERS = [
  { 
    username: 'admin', 
    password: 'admin', 
    name: 'राम बहादुर थापा', 
    role: ROLES.CHIEF_EDITOR,
    permissions: Object.values(PERMISSIONS) 
  },
  { 
    username: 'editor', 
    password: 'editor', 
    name: 'श्याम हरि', 
    role: ROLES.EDITOR,
    // Removed MANAGE_NEWS so the editor cannot approve news. 
    // They can only post (which goes to pending) and view dashboard.
    permissions: [PERMISSIONS.VIEW_DASHBOARD, PERMISSIONS.POST_NEWS, PERMISSIONS.MANAGE_SECURITY]
  },
  { 
    username: 'reporter', 
    password: 'reporter', 
    name: 'सिता कुमारी', 
    role: ROLES.REPORTER,
    permissions: [PERMISSIONS.VIEW_DASHBOARD, PERMISSIONS.POST_NEWS, PERMISSIONS.MANAGE_SECURITY]
  }
];

export const CATEGORIES = [
  'राजनीति',
  'समाज',
  'अर्थतन्त्र',
  'खेलकुद',
  'शिक्षा',
  'स्वास्थ्य',
  'प्रविधि',
  'अन्तर्राष्ट्रिय'
];

// Moving NEWS_STATUS up before INITIAL_NEWS to fix "used before its declaration" errors
export const NEWS_STATUS = {
  PENDING: 'पेन्डिङ',
  PUBLISHED: 'प्रकाशित'
};

export const FOOTER_TEXT = '© २०२४ दृष्टि खबर. सबै अधिकार सुरक्षित.';