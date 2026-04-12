// ============================================
// FIREBASE LIVE CONFIG — JATIN BRAND STUDIO
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, onSnapshot, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAFVqoM9SDu_YkjWLo6O1MBM0pIv-GTrp0",
  authDomain: "jatinbrandstudio-fecc8.firebaseapp.com",
  projectId: "jatinbrandstudio-fecc8",
  storageBucket: "jatinbrandstudio-fecc8.firebasestorage.app",
  messagingSenderId: "895387928657",
  appId: "1:895387928657:web:9454f887b2e2259c379070"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, onSnapshot, getDoc, setDoc };

// ============================================
// CLOUDINARY
// ============================================
export const CLOUDINARY = { cloudName: "dxi4bsikl", uploadPreset: "JBS_default" };

export const uploadImage = async (file) => {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', CLOUDINARY.uploadPreset);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY.cloudName}/image/upload`, { method: 'POST', body: fd });
  const data = await res.json();
  return data.secure_url;
};

// ============================================
// ORDERS
// ============================================
export const listenOrders = (cb) => {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
};

export const updateOrderStatus = async (id, status) => {
  await updateDoc(doc(db, 'orders', id), { status, updatedAt: new Date().toISOString() });
};

export const deleteOrder = async (id) => {
  await deleteDoc(doc(db, 'orders', id));
};

// ============================================
// MESSAGES
// ============================================
export const listenMessages = (cb) => {
  const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
};

export const markMessageRead = async (id) => {
  await updateDoc(doc(db, 'messages', id), { read: true });
};

export const deleteMessage = async (id) => {
  await deleteDoc(doc(db, 'messages', id));
};

// ============================================
// PORTFOLIO
// ============================================
export const listenPortfolio = (cb) => {
  return onSnapshot(collection(db, 'portfolio'), snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
};

export const addPortfolio = async (data) => {
  return await addDoc(collection(db, 'portfolio'), { ...data, createdAt: new Date().toISOString() });
};

export const updatePortfolioItem = async (id, data) => {
  await updateDoc(doc(db, 'portfolio', id), data);
};

export const deletePortfolioItem = async (id) => {
  await deleteDoc(doc(db, 'portfolio', id));
};

// ============================================
// REVIEWS
// ============================================
export const listenReviews = (cb) => {
  return onSnapshot(collection(db, 'reviews'), snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
};

export const addReview = async (data) => {
  return await addDoc(collection(db, 'reviews'), { ...data, createdAt: new Date().toISOString() });
};

export const deleteReview = async (id) => {
  await deleteDoc(doc(db, 'reviews', id));
};

// ============================================
// BLOG
// ============================================
export const listenBlogs = (cb) => {
  const q = query(collection(db, 'blog'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
};

export const addBlog = async (data) => {
  return await addDoc(collection(db, 'blog'), { ...data, createdAt: new Date().toISOString() });
};

export const updateBlog = async (id, data) => {
  await updateDoc(doc(db, 'blog', id), data);
};

export const deleteBlog = async (id) => {
  await deleteDoc(doc(db, 'blog', id));
};

// ============================================
// SETTINGS (PIN + other settings)
// ============================================
export const getSettings = async () => {
  const snap = await getDoc(doc(db, 'settings', 'main'));
  return snap.exists() ? snap.data() : { pin: '123456' };
};

export const saveSettings = async (data) => {
  await setDoc(doc(db, 'settings', 'main'), data, { merge: true });
};

export const getPin = async () => {
  const snap = await getDoc(doc(db, 'settings', 'main'));
  return snap.exists() ? (snap.data().pin || '123456') : '123456';
};

export const updatePin = async (newPin) => {
  await setDoc(doc(db, 'settings', 'main'), { pin: newPin }, { merge: true });
};

// ============================================
// STATS (for dashboard)
// ============================================
export const getDashboardStats = async () => {
  const [orders, messages, portfolio, reviews] = await Promise.all([
    getDocs(collection(db, 'orders')),
    getDocs(collection(db, 'messages')),
    getDocs(collection(db, 'portfolio')),
    getDocs(collection(db, 'reviews'))
  ]);

  const ordersList = orders.docs.map(d => d.data());
  const newOrders = ordersList.filter(o => o.status === 'new').length;
  const pending = ordersList.filter(o => o.status === 'in-progress').length;
  const completed = ordersList.filter(o => o.status === 'completed').length;
  const unreadMsgs = messages.docs.filter(d => !d.data().read).length;

  return {
    totalOrders: orders.size,
    newOrders,
    pending,
    completed,
    totalMessages: messages.size,
    unreadMessages: unreadMsgs,
    totalPortfolio: portfolio.size,
    totalReviews: reviews.size
  };
};
