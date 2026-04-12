// ============================================
// FIREBASE + CLOUDINARY CONFIG — LIVE
// JATIN BRAND STUDIO
// ============================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js';

// ✅ FIREBASE — LIVE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAFVqoM9SDu_YkjWLo6O1MBM0pIv-GTrp0",
  authDomain: "jatinbrandstudio-fecc8.firebaseapp.com",
  projectId: "jatinbrandstudio-fecc8",
  storageBucket: "jatinbrandstudio-fecc8.firebasestorage.app",
  messagingSenderId: "895387928657",
  appId: "1:895387928657:web:9454f887b2e2259c379070"
};

// ✅ CLOUDINARY — LIVE CONFIG
export const CLOUDINARY = {
  cloudName: "dxi4bsikl",
  apiKey: "844265352226548",
  uploadPreset: "JBS_default"
};

// ✅ WHATSAPP
export const WA_NUMBER = "919256990806";

// Init Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// ============================================
// CLOUDINARY UPLOAD
// ============================================
export const uploadToCloudinary = async (file) => {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', CLOUDINARY.uploadPreset);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY.cloudName}/image/upload`, { method: 'POST', body: fd });
  if (!res.ok) throw new Error('Cloudinary upload failed');
  const data = await res.json();
  return data.secure_url;
};

// ============================================
// WHATSAPP NOTIFICATION (CallMeBot)
// ============================================
export const sendWhatsAppNotif = async (message, apiKey) => {
  if (!apiKey) return;
  const url = `https://api.callmebot.com/whatsapp.php?phone=${WA_NUMBER}&text=${encodeURIComponent(message)}&apikey=${apiKey}`;
  try { await fetch(url); } catch(e) { console.log('WA notif:', e); }
};

// ============================================
// ORDERS
// ============================================
export const saveOrder = async (data) => {
  return await addDoc(collection(db, 'orders'), { ...data, status: 'new', read: false, timestamp: new Date(), createdAt: new Date().toISOString() });
};

export const getOrders = async () => {
  const q = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const listenOrders = (cb) => {
  const q = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
  return onSnapshot(q, snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
};

export const updateOrderStatus = async (id, status) => {
  return await updateDoc(doc(db, 'orders', id), { status, updatedAt: new Date().toISOString() });
};

export const deleteOrder = async (id) => await deleteDoc(doc(db, 'orders', id));

// ============================================
// PORTFOLIO
// ============================================
export const savePortfolio = async (data) => await addDoc(collection(db, 'portfolio'), { ...data, createdAt: new Date().toISOString() });
export const getPortfolio = async () => { const s = await getDocs(collection(db, 'portfolio')); return s.docs.map(d => ({ id: d.id, ...d.data() })); };
export const updatePortfolio = async (id, data) => await updateDoc(doc(db, 'portfolio', id), data);
export const deletePortfolio = async (id) => await deleteDoc(doc(db, 'portfolio', id));

// ============================================
// MESSAGES
// ============================================
export const saveMessage = async (data) => await addDoc(collection(db, 'messages'), { ...data, read: false, createdAt: new Date().toISOString() });
export const getMessages = async () => { const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc')); const s = await getDocs(q); return s.docs.map(d => ({ id: d.id, ...d.data() })); };
export const listenMessages = (cb) => { const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc')); return onSnapshot(q, s => cb(s.docs.map(d => ({ id: d.id, ...d.data() })))); };
export const markRead = async (id) => await updateDoc(doc(db, 'messages', id), { read: true });
export const deleteMessage = async (id) => await deleteDoc(doc(db, 'messages', id));

// ============================================
// REVIEWS
// ============================================
export const saveReview = async (data) => await addDoc(collection(db, 'reviews'), { ...data, createdAt: new Date().toISOString() });
export const getReviews = async () => { const s = await getDocs(collection(db, 'reviews')); return s.docs.map(d => ({ id: d.id, ...d.data() })); };
export const deleteReview = async (id) => await deleteDoc(doc(db, 'reviews', id));

// ============================================
// BLOG
// ============================================
export const saveBlog = async (data) => await addDoc(collection(db, 'blog'), { ...data, createdAt: new Date().toISOString() });
export const getBlogs = async () => { const q = query(collection(db, 'blog'), orderBy('createdAt', 'desc')); const s = await getDocs(q); return s.docs.map(d => ({ id: d.id, ...d.data() })); };
export const deleteBlog = async (id) => await deleteDoc(doc(db, 'blog', id));

// ============================================
// SETTINGS
// ============================================
export const getSettings = async () => { const s = await getDocs(collection(db, 'settings')); return s.docs[0]?.data() || {}; };
export const saveSettings = async (data) => {
  const s = await getDocs(collection(db, 'settings'));
  if (s.docs.length > 0) return await updateDoc(doc(db, 'settings', s.docs[0].id), data);
  return await addDoc(collection(db, 'settings'), data);
};