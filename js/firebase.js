// ============================================
// FIREBASE CONFIG - JATIN BRAND STUDIO
// ============================================
// Replace with your Firebase credentials when ready

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js';

// ⚠️ REPLACE THESE WITH YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// ============================================
// DATABASE FUNCTIONS
// ============================================

// ORDERS
export const saveOrder = async (data) => {
  return await addDoc(collection(db, 'orders'), {
    ...data,
    status: 'new',
    timestamp: new Date(),
    createdAt: new Date().toISOString()
  });
};

export const getOrders = async () => {
  const q = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const updateOrderStatus = async (id, status) => {
  return await updateDoc(doc(db, 'orders', id), { status, updatedAt: new Date().toISOString() });
};

export const deleteOrder = async (id) => {
  return await deleteDoc(doc(db, 'orders', id));
};

// PORTFOLIO
export const savePortfolio = async (data) => {
  return await addDoc(collection(db, 'portfolio'), { ...data, createdAt: new Date().toISOString() });
};

export const getPortfolio = async () => {
  const snap = await getDocs(collection(db, 'portfolio'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const updatePortfolio = async (id, data) => {
  return await updateDoc(doc(db, 'portfolio', id), data);
};

export const deletePortfolio = async (id) => {
  return await deleteDoc(doc(db, 'portfolio', id));
};

// TESTIMONIALS
export const saveReview = async (data) => {
  return await addDoc(collection(db, 'reviews'), { ...data, createdAt: new Date().toISOString() });
};

export const getReviews = async () => {
  const snap = await getDocs(collection(db, 'reviews'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const deleteReview = async (id) => {
  return await deleteDoc(doc(db, 'reviews', id));
};

// MESSAGES
export const saveMessage = async (data) => {
  return await addDoc(collection(db, 'messages'), {
    ...data,
    read: false,
    createdAt: new Date().toISOString()
  });
};

export const getMessages = async () => {
  const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const markRead = async (id) => {
  return await updateDoc(doc(db, 'messages', id), { read: true });
};

// SETTINGS
export const saveSettings = async (data) => {
  return await updateDoc(doc(db, 'settings', 'main'), data);
};

export const getSettings = async () => {
  const snap = await getDocs(collection(db, 'settings'));
  return snap.docs[0]?.data() || {};
};

// BLOG
export const saveBlog = async (data) => {
  return await addDoc(collection(db, 'blog'), { ...data, createdAt: new Date().toISOString() });
};

export const getBlogs = async () => {
  const q = query(collection(db, 'blog'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const deleteBlog = async (id) => {
  return await deleteDoc(doc(db, 'blog', id));
};

// CLOUDINARY UPLOAD
export const uploadToCloudinary = async (file) => {
  // ⚠️ REPLACE WITH YOUR CLOUDINARY CONFIG
  const CLOUD_NAME = 'YOUR_CLOUD_NAME';
  const UPLOAD_PRESET = 'YOUR_UPLOAD_PRESET';

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST', body: formData
  });
  const data = await res.json();
  return data.secure_url;
};
