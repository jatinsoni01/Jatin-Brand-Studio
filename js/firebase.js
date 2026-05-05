// ============================================
// FIREBASE CONFIG — JATIN BRAND STUDIO
// Only: Save to Firestore + WhatsApp open
// NO CallMeBot, NO extra APIs
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  collection, addDoc,
  getDocs,
  doc, getDoc, setDoc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// ✅ LIVE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAFVqoM9SDu_YkjWLo6O1MBM0pIv-GTrp0",
  authDomain: "jatinbrandstudio-fecc8.firebaseapp.com",
  projectId: "jatinbrandstudio-fecc8",
  storageBucket: "jatinbrandstudio-fecc8.firebasestorage.app",
  messagingSenderId: "895387928657",
  appId: "1:895387928657:web:9454f887b2e2259c379070"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ WhatsApp number
export const WA = "919256990806";

// ============================================
// SAVE ORDER → admin orders mein jayega
// ============================================
export const saveOrder = async (data) => {
  return await addDoc(collection(db, 'orders'), {
    name:    data.name    || '',
    phone:   data.phone   || '',
    email:   data.email   || '',
    service: data.service || '',
    budget:  data.budget  || '',
    message: data.message || '',
    source:  data.source  || 'website',
    status:  'new',
    read:    false,
    createdAt: new Date().toISOString()
  });
};

// ============================================
// SAVE MESSAGE → admin messages mein jayega
// ============================================
export const saveMessage = async (data) => {
  return await addDoc(collection(db, 'messages'), {
    name:    data.name    || '',
    phone:   data.phone   || '',
    email:   data.email   || '',
    service: data.service || '',
    budget:  data.budget  || '',
    message: data.message || '',
    read:    false,
    createdAt: new Date().toISOString()
  });
};

// ============================================
// GET REVIEWS → website testimonials mein
// ============================================
export const getReviews = async () => {
  try {
    const snap = await getDocs(collection(db, 'reviews'));
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(r => r.status !== 'hidden');
  } catch(e) {
    return [];
  }
};

// ============================================
// GET PORTFOLIO → website portfolio mein
// ============================================
export const getPortfolio = async () => {
  try {
    const snap = await getDocs(collection(db, 'portfolio'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch(e) {
    return [];
  }
};

// ============================================
// GET SERVICES → website services page mein
// ============================================
export const getServices = async () => {
  try {
    const snap = await getDocs(collection(db, 'services'));
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(s => s.status !== 'hidden');
  } catch(e) {
    return [];
  }
};

// ============================================
// GET PRICING → website pricing page mein
// ============================================
export const getPricing = async () => {
  try {
    const snap = await getDocs(collection(db, 'pricing'));
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (a.price || 0) - (b.price || 0));
  } catch(e) {
    return [];
  }
};

// ============================================
// GET BLOGS → website blog page mein
// ============================================
export const getBlogs = async () => {
  try {
    const snap = await getDocs(collection(db, 'blog'));
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(b => b.status !== 'draft')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch(e) {
    return [];
  }
};