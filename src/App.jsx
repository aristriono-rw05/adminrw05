import React, { useState, useEffect } from 'react';
import { db, initializeDefaultAdmins } from './firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  doc, 
  deleteDoc, 
  updateDoc, 
  getDoc,
  getDocs 
} from 'firebase/firestore';

// ==========================================
// IKON-IKON SVG UNTUK TAMPILAN DINAMIS
// ==========================================
const ExternalLink = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

const WalletIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
  </svg>
);

const TrendingUpIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const TrendingDownIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);

const PrinterIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
);

const BellIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const ImageIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const ChevronLeftIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const EditIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const BoxIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const ArrowRightIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

// DATA DEFAULT AWAL
const INITIAL_ANNOUNCEMENTS = [
  {
    category: 'JADWAL KEGIATAN',
    title: 'Kerja Bakti Masal Bersama Warga RW.05',
    content: 'Diberitahukan kepada seluruh warga RW.05 untuk mengikuti Kerja Bakti Kebersihan Lingkungan pada Hari Minggu besok mulai pukul 07.00 WIB. Titik kumpul di Lapangan RW.',
    date: '12 Oktober 2026'
  },
  {
    category: 'LAYANAN POSYANDU',
    title: 'Posyandu Balita & Lansia Bulan Oktober',
    content: 'Pelaksanaan Posyandu Rutin Balita dan Pemeriksaan Kesehatan Lansia akan dilaksanakan di Balai RW.05 pada Hari Rabu, 15 Oktober 2026 pukul 08.30 WIB.',
    date: '10 Oktober 2026'
  },
  {
    category: 'BANK SAMPAH',
    title: 'Penyetoran Sampah Anorganik Bank Sampah "BERSERI"',
    content: 'Penimbangan dan penyetoran sampah anorganik terpilah akan dibuka pada Hari Sabtu minggu kedua pukul 09.00 WIB. Mari tingkatkan kepedulian lingkungan!',
    date: '08 Oktober 2026'
  }
];

const INITIAL_GALLERY = [
  {
    title: 'Gotong Royong Pembersihan Saluran Air RW.05',
    date: '28 September 2026',
    url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=80'
  },
  {
    title: 'Kegiatan Penimbangan Sampah di Bank Sampah Berseri',
    date: '20 September 2026',
    url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1000&q=80'
  },
  {
    title: 'Panen Sayuran Organik Kelompok Wanita Tani (KWT)',
    date: '14 September 2026',
    url: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1000&q=80'
  },
  {
    title: 'Senam Sehat Bersama Ibu-Ibu PKK RW.05',
    date: '07 September 2026',
    url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=80'
  }
];

async function initializeDefaultPublicData() {
  try {
    const infoSnap = await getDocs(collection(db, "announcements"));
    if (infoSnap.empty) {
      for (const item of INITIAL_ANNOUNCEMENTS) {
        await addDoc(collection(db, "announcements"), item);
      }
    }

    const galSnap = await getDocs(collection(db, "gallery"));
    if (galSnap.empty) {
      for (const item of INITIAL_GALLERY) {
        await addDoc(collection(db, "gallery"), item);
      }
    }
  } catch (err) {
    console.error("Gagal inisialisasi data publik:", err);
  }
}

export default function App() {
  // ==========================================
  // STATE MANAJEMEN USER & AKUN
  // ==========================================
  const [currentUserRole, setCurrentUserRole] = useState(() => sessionStorage.getItem("rw_user_role") || null);
  const [currentUsername, setCurrentUsername] = useState(() => sessionStorage.getItem("rw_username") || null);
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [showChangePass, setShowChangePass] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  // ==========================================
  // STATE DATA KEUANGAN & ASET
  // ==========================================
  const [financeItems, setFinanceItems] = useState([]);
  const [assetItems, setAssetItems] = useState([]);
  const [currentViewedMonth, setCurrentViewedMonth] = useState(null);

  // State Pilihan Pengelola Aset
  const [selectedAssetCategory, setSelectedAssetCategory] = useState(null);

  // State Form Keuangan
  const [financeId, setFinanceId] = useState('');
  const [financeDate, setFinanceDate] = useState('');
  const [financeDesc, setFinanceDesc] = useState('');
  const [financeType, setFinanceType] = useState('IN');
  const [financeAmount, setFinanceAmount] = useState('');
  const [financeKet, setFinanceKet] = useState('');

  // State Form Aset
  const [assetId, setAssetId] = useState('');
  const [assetCategory, setAssetCategory] = useState('Aset RW');
  const [assetName, setAssetName] = useState('');
  const [assetQty, setAssetQty] = useState('');
  const [assetUnit, setAssetUnit] = useState('Unit');
  const [assetCondition, setAssetCondition] = useState('Baik');
  const [assetKet, setAssetKet] = useState('');

  // ==========================================
  // STATE PAPAN INFORMASI & GALERI
  // ==========================================
  const [announcements, setAnnouncements] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);

  // Controls Auto-Slide
  const [infoIndex, setInfoIndex] = useState(0);
  const [isInfoPaused, setIsInfoPaused] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [isGalleryPaused, setIsGalleryPaused] = useState(false);

  // Admin Forms
  const [editInfoId, setEditInfoId] = useState('');
  const [infoCategory, setInfoCategory] = useState('PENGUMUMAN');
  const [infoTitle, setInfoTitle] = useState('');
  const [infoContent, setInfoContent] = useState('');

  const [editGalId, setEditGalId] = useState('');
  const [galTitle, setGalTitle] = useState('');
  const [galUrl, setGalUrl] = useState('');
  const [galDate, setGalDate] = useState('');

  // Super Admin Modals
  const [showManageInfoModal, setShowManageInfoModal] = useState(false);
  const [showManageGalModal, setShowManageGalModal] = useState(false);

  // ==========================================
  // STATE MODAL CETAK & PRINTER ISOLATION
  // ==========================================
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [printTarget, setPrintTarget] = useState('finance'); // 'finance' | 'asset'
  const [printDateInput, setPrintDateInput] = useState('');
  const [printOfficerInput, setPrintOfficerInput] = useState('');
  const [printLeaderInput, setPrintLeaderInput] = useState('');
  const [printSignData, setPrintSignData] = useState({ date: '', officer: '', leader: '' });

  // ==========================================
  // FIRESTORE SNAPSHOTS
  // ==========================================
  useEffect(() => {
    initializeDefaultAdmins();
    initializeDefaultPublicData();

    const unsubAsset = onSnapshot(collection(db, "assets"), (snapshot) => {
      const data = [];
      snapshot.forEach(d => data.push({ id: d.id, ...d.data() }));
      setAssetItems(data);
    });

    const unsubFinance = onSnapshot(collection(db, "financial_reports"), (snapshot) => {
      const data = [];
      snapshot.forEach(d => data.push({ id: d.id, ...d.data() }));
      setFinanceItems(data);
    });

    const unsubInfo = onSnapshot(collection(db, "announcements"), (snapshot) => {
      const data = [];
      snapshot.forEach(d => data.push({ id: d.id, ...d.data() }));
      setAnnouncements(data);
    });

    const unsubGal = onSnapshot(collection(db, "gallery"), (snapshot) => {
      const data = [];
      snapshot.forEach(d => data.push({ id: d.id, ...d.data() }));
      setGalleryImages(data);
    });

    return () => {
      unsubAsset();
      unsubFinance();
      unsubInfo();
      unsubGal();
    };
  }, []);

  const activeAnnouncements = announcements;
  const activeGallery = galleryImages;

  const ASSET_MANAGERS = [
    { 
      id: 'Aset RW', 
      name: 'Pengelola Aset RW 05', 
      desc: 'Aset umum lingkungan & inventaris Balai RW 05', 
      badgeColor: 'bg-blue-100/80 text-blue-800 border-transparent' 
    },
    { 
      id: 'Aset KUB TRATAG', 
      name: 'Pengelola KUB Tratag', 
      desc: 'Peralatan terop, kursi, & perlengkapan hajatan warga', 
      badgeColor: 'bg-emerald-100/80 text-emerald-800 border-transparent' 
    },
    { 
      id: 'Aset BANK SAMPAH', 
      name: 'Pengelola Bank Sampah "Berseri"', 
      desc: 'Timbangan, gerobak, & fasilitas pilah sampah lingkungan', 
      badgeColor: 'bg-amber-100/80 text-amber-800 border-transparent' 
    },
    { 
      id: 'Aset KWT', 
      name: 'Pengelola KWT (Kelompok Wanita Tani)', 
      desc: 'Alat pertanian, bibit, & sarana kebun warga', 
      badgeColor: 'bg-purple-100/80 text-purple-800 border-transparent' 
    }
  ];

  // Auto-Slide Timers
  useEffect(() => {
    if (isInfoPaused || activeAnnouncements.length <= 1) return;
    const timer = setInterval(() => {
      setInfoIndex((prev) => (prev + 1) % activeAnnouncements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isInfoPaused, activeAnnouncements.length]);

  useEffect(() => {
    if (isGalleryPaused || activeGallery.length <= 1) return;
    const timer = setInterval(() => {
      setGalleryIndex((prev) => (prev + 1) % activeGallery.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isGalleryPaused, activeGallery.length]);

  // Auth Handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    const uname = loginUsername.trim().toLowerCase();
    try {
      const docRef = doc(db, "admin_users", uname);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().password === loginPassword) {
        const role = docSnap.data().role;
        setCurrentUserRole(role);
        setCurrentUsername(uname);
        sessionStorage.setItem("rw_user_role", role);
        sessionStorage.setItem("rw_username", uname);
        alert(`Login berhasil sebagai: ${role.toUpperCase()}`);
        setShowLoginModal(false);
        setLoginUsername('');
        setLoginPassword('');
      } else {
        alert("Username atau Password salah!");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat login.");
    }
  };

  const handleLogout = () => {
    setCurrentUserRole(null);
    setCurrentUsername(null);
    sessionStorage.removeItem("rw_user_role");
    sessionStorage.removeItem("rw_username");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert("Password minimal 6 karakter!");
      return;
    }
    try {
      await updateDoc(doc(db, "admin_users", currentUsername), { password: newPassword });
      alert("Password berhasil diubah!");
      setNewPassword('');
      setShowChangePass(false);
    } catch (err) {
      alert("Gagal mengubah password.");
    }
  };

  // Pengumuman Handlers
  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    const data = {
      category: infoCategory,
      title: infoTitle,
      content: infoContent,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };

    try {
      if (editInfoId) {
        await updateDoc(doc(db, "announcements", editInfoId), data);
        alert("Pengumuman berhasil diperbarui!");
        setEditInfoId('');
      } else {
        await addDoc(collection(db, "announcements"), data);
        alert("Pengumuman berhasil ditambahkan!");
      }
      setInfoTitle('');
      setInfoContent('');
      setInfoCategory('PENGUMUMAN');
    } catch (err) {
      alert("Terjadi kesalahan saat menyimpan pengumuman.");
    }
  };

  const handleStartEditInfo = (item) => {
    setEditInfoId(item.id);
    setInfoCategory(item.category || 'PENGUMUMAN');
    setInfoTitle(item.title || '');
    setInfoContent(item.content || '');
    setShowManageInfoModal(false);
  };

  const handleCancelEditInfo = () => {
    setEditInfoId('');
    setInfoCategory('PENGUMUMAN');
    setInfoTitle('');
    setInfoContent('');
  };

  const handleDeleteAnnouncement = async (id) => {
    if (confirm("Yakin ingin menghapus pengumuman ini?")) {
      await deleteDoc(doc(db, "announcements", id));
      alert("Pengumuman berhasil dihapus!");
      setInfoIndex(0);
      if (editInfoId === id) handleCancelEditInfo();
    }
  };

  // Galeri Handlers
  const handleGalSubmit = async (e) => {
    e.preventDefault();
    const data = {
      title: galTitle,
      url: galUrl,
      date: galDate || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };

    try {
      if (editGalId) {
        await updateDoc(doc(db, "gallery", editGalId), data);
        alert("Foto galeri berhasil diperbarui!");
        setEditGalId('');
      } else {
        await addDoc(collection(db, "gallery"), data);
        alert("Foto galeri berhasil ditambahkan!");
      }
      setGalTitle('');
      setGalUrl('');
      setGalDate('');
    } catch (err) {
      alert("Terjadi kesalahan saat menyimpan foto galeri.");
    }
  };

  const handleStartEditGal = (item) => {
    setEditGalId(item.id);
    setGalTitle(item.title || '');
    setGalUrl(item.url || '');
    setGalDate(item.date || '');
    setShowManageGalModal(false);
  };

  const handleCancelEditGal = () => {
    setEditGalId('');
    setGalTitle('');
    setGalUrl('');
    setGalDate('');
  };

  const handleDeleteGallery = async (id) => {
    if (confirm("Yakin ingin menghapus foto galeri ini?")) {
      await deleteDoc(doc(db, "gallery", id));
      alert("Foto galeri berhasil dihapus!");
      setGalleryIndex(0);
      if (editGalId === id) handleCancelEditGal();
    }
  };

  // Finance Handlers
  const handleFinanceSubmit = async (e) => {
    e.preventDefault();
    const data = {
      date: financeDate,
      description: financeDesc,
      type: financeType,
      amount: Number(financeAmount),
      ket: financeKet || ""
    };

    if (financeId) {
      await updateDoc(doc(db, "financial_reports", financeId), data);
      alert("Transaksi berhasil diperbarui!");
    } else {
      await addDoc(collection(db, "financial_reports"), data);
      alert("Transaksi berhasil dicatat!");
    }

    setFinanceId('');
    setFinanceDate('');
    setFinanceDesc('');
    setFinanceType('IN');
    setFinanceAmount('');
    setFinanceKet('');
  };

  const handleEditFinance = (item) => {
    setFinanceId(item.id);
    setFinanceDate(item.date);
    setFinanceDesc(item.description);
    setFinanceType(item.type);
    setFinanceAmount(item.amount);
    setFinanceKet(item.ket || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteFinance = async (id) => {
    if (confirm("Yakin ingin menghapus transaksi ini?")) {
      await deleteDoc(doc(db, "financial_reports", id));
      alert("Transaksi berhasil dihapus!");
    }
  };

  // Asset Handlers
  const handleAssetSubmit = async (e) => {
    e.preventDefault();
    const targetCat = selectedAssetCategory || assetCategory;
    const data = {
      category: targetCat,
      name: assetName,
      qty: Number(assetQty),
      unit: assetUnit || "Unit",
      condition: assetCondition,
      ket: assetKet || ""
    };

    if (assetId) {
      await updateDoc(doc(db, "assets", assetId), data);
      alert("Data aset berhasil diperbarui!");
    } else {
      await addDoc(collection(db, "assets"), data);
      alert("Data aset berhasil ditambahkan!");
    }

    setAssetId('');
    setAssetName('');
    setAssetQty('');
    setAssetUnit('Unit');
    setAssetCondition('Baik');
    setAssetKet('');
  };

  const handleEditAsset = (item) => {
    setAssetId(item.id);
    setAssetCategory(item.category || "Aset RW");
    setAssetName(item.name);
    setAssetQty(item.qty);
    setAssetUnit(item.unit || "Unit");
    setAssetCondition(item.condition);
    setAssetKet(item.ket || "");
    window.scrollTo({ top: document.getElementById("asset-section").offsetTop - 20, behavior: 'smooth' });
  };

  const handleDeleteAsset = async (id) => {
    if (confirm("Yakin ingin menghapus aset ini?")) {
      await deleteDoc(doc(db, "assets", id));
      alert("Aset berhasil dihapus!");
    }
  };

  const handleSelectManager = (categoryId) => {
    setSelectedAssetCategory(categoryId);
    setAssetCategory(categoryId);
    window.scrollTo({ top: document.getElementById("asset-section").offsetTop - 20, behavior: 'smooth' });
  };

  // Finance Monthly Calculations
  const sortedRawFinance = [...financeItems].sort((a, b) => new Date(a.date) - new Date(b.date));
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  let groupedFinance = {};
  let runningBalance = 0;
  let totalOverallIn = 0;
  let totalOverallOut = 0;

  sortedRawFinance.forEach((item) => {
    if (!item.date) return;
    const [year, month, day] = item.date.split("-");
    const dateObj = new Date(year, month - 1, day);
    const monthYear = `${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
    const sortKey = `${year}-${month}`;

    if (!groupedFinance[monthYear]) {
      groupedFinance[monthYear] = { sortKey, monthYear, in: 0, out: 0, balance: 0, items: [] };
    }

    const amount = Number(item.amount) || 0;
    if (item.type === "IN") {
      groupedFinance[monthYear].in += amount;
      runningBalance += amount;
      totalOverallIn += amount;
    } else {
      groupedFinance[monthYear].out += amount;
      runningBalance -= amount;
      totalOverallOut += amount;
    }

    groupedFinance[monthYear].balance = runningBalance;
    groupedFinance[monthYear].items.push({ ...item, day: Number(day) });
  });

  const summaryFinanceList = Object.values(groupedFinance).sort((a, b) => b.sortKey.localeCompare(a.sortKey));
  const activeMonthData = summaryFinanceList.find(g => g.monthYear === currentViewedMonth);

  // Print Handlers
  const openPrintDialog = (target) => {
    setPrintTarget(target);
    setPrintModalOpen(true);
  };

  const handleProcessPrint = (e) => {
    e.preventDefault();
    setPrintSignData({
      date: printDateInput,
      officer: printOfficerInput,
      leader: printLeaderInput
    });
    setPrintModalOpen(false);

    setTimeout(() => {
      window.print();
    }, 200);
  };

  const isSuperAdmin = currentUserRole === 'superadmin';
  const isFinanceAdmin = currentUserRole === 'superadmin' || currentUserRole === 'bendahara';
  const isAssetAdmin = currentUserRole === 'superadmin' || currentUserRole === 'aset';

  const currentInfo = activeAnnouncements[infoIndex] || activeAnnouncements[0];
  const currentPhoto = activeGallery[galleryIndex] || activeGallery[0];

  return (
    <div className="custom-app-bg min-h-screen text-slate-800 font-sans flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      <div>
        
        {/* NAVBAR HEADER AKSI DINAMIS */}
        <header className="no-print bg-gradient-to-r from-slate-900/90 via-indigo-950/90 to-slate-900/90 text-white shadow-lg border-b border-transparent sticky top-0 z-40 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center font-black text-lg shadow-md shadow-indigo-500/20">
                RW
              </div>
              <div>
                <h1 className="text-base md:text-lg font-bold tracking-tight leading-tight">RW.05 Tambakreja</h1>
                <p className="text-[11px] text-slate-400 font-medium">Sistem Keuangan, Aset & Informasi Warga</p>
              </div>
            </div>

            {/* LINK BANK SAMPAH BERSERI DI BAGIAN TENAS / ATAS */}
            <div className="flex-1 flex justify-center order-3 md:order-none w-full md:w-auto">
              <a 
                href="https://banksampahberseri05.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500/20 via-teal-500/30 to-emerald-500/20 hover:from-emerald-500/30 hover:to-teal-500/40 text-emerald-300 hover:text-white px-4 py-1.5 rounded-full border border-emerald-400/30 transition-all font-bold text-xs tracking-wide shadow-sm group hover:scale-105"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>BANK SAMPAH BERSERI</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 bg-slate-800/80 backdrop-blur px-3 py-1.5 rounded-full border border-transparent text-xs">
                <span className={`w-2 h-2 rounded-full ${currentUserRole ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                <span className="font-semibold text-slate-300">
                  {currentUserRole ? `${currentUserRole.toUpperCase()} (${currentUsername})` : "Akses Warga"}
                </span>
              </div>

              {currentUserRole && (
                <button 
                  onClick={() => setShowChangePass(!showChangePass)}
                  className="text-xs bg-indigo-600/80 hover:bg-indigo-600 text-white font-medium px-3 py-1.5 rounded-full transition-all border border-transparent"
                >
                  Ganti Password
                </button>
              )}

              {!currentUserRole ? (
                <button 
                  onClick={() => setShowLoginModal(true)}
                  className="text-xs md:text-sm bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold px-4 py-1.5 rounded-full shadow-md shadow-indigo-500/20 transition-all active:scale-95"
                >
                  Login Admin
                </button>
              ) : (
                <button 
                  onClick={handleLogout}
                  className="text-xs md:text-sm bg-rose-600/90 hover:bg-rose-600 text-white font-bold px-4 py-1.5 rounded-full transition-all active:scale-95 shadow-sm"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </header>

        {/* MODAL UBAH PASSWORD */}
        {showChangePass && (
          <div className="no-print max-w-7xl mx-auto px-4 mt-3">
            <div className="bg-indigo-950/90 text-white p-3.5 rounded-2xl border border-transparent shadow-lg backdrop-blur flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-semibold text-indigo-200">Keamanan Akun ({currentUsername}):</p>
              <form onSubmit={handleChangePassword} className="flex gap-2 flex-1 max-w-md">
                <input 
                  type="password"
                  placeholder="Password Baru (min 6 karakter)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="text-xs p-2 border border-transparent rounded-xl flex-1 bg-slate-900 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <button type="submit" className="text-xs bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-3 py-2 rounded-xl transition">
                  Simpan
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowChangePass(false)}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-3 py-2 rounded-xl transition"
                >
                  Batal
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL LOGIN ADMIN */}
        {showLoginModal && (
          <div className="no-print fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 w-full max-w-sm border border-transparent transform transition-all animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Login Pengurus RW</h2>
                <span className="p-2 bg-indigo-50/80 rounded-xl text-indigo-600">
                  <WalletIcon className="w-5 h-5" />
                </span>
              </div>
              <form onSubmit={handleLogin} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Username</label>
                  <input 
                    type="text" 
                    placeholder="superadmin / bendahara / aset" 
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="w-full p-2.5 border border-slate-200/50 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition bg-white/70"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
                  <input 
                    type="password" 
                    placeholder="Password" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full p-2.5 border border-slate-200/50 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition bg-white/70"
                    required
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm shadow-md shadow-indigo-600/20 transition active:scale-[0.98]">
                    Masuk
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowLoginModal(false)}
                    className="flex-1 bg-slate-100/80 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-sm transition"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CONTAINER UTAMA HALAMAN */}
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-5 space-y-6">

          {/* ========================================================= */}
          {/* SEKSI PUBLIC 1: PAPAN INFORMASI & GALERI FOTO DINAMIS */}
          {/* ========================================================= */}
          <div className="no-print grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* PAPAN INFORMASI PUBLIK */}
            <div className="lg:col-span-7 bg-white/80 backdrop-blur-md rounded-3xl p-5 shadow-sm border border-transparent flex flex-col justify-between relative overflow-hidden group">
              <div>
                <div className="flex items-center justify-between border-b border-slate-200/30 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-amber-50/80 rounded-xl text-amber-600 border border-transparent">
                      <BellIcon className="w-5 h-5" />
                    </span>
                    <div>
                      <h2 className="text-base md:text-lg font-bold text-slate-900 tracking-tight">Papan Informasi Publik</h2>
                      <p className="text-[11px] text-slate-500 font-medium">Pengumuman & agenda kegiatan warga RW.05</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isSuperAdmin && activeAnnouncements.length > 0 && (
                      <button 
                        onClick={() => setShowManageInfoModal(true)}
                        className="text-xs bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 font-bold px-3 py-1.5 rounded-xl transition border border-transparent"
                      >
                        Kelola Semua ({activeAnnouncements.length})
                      </button>
                    )}
                    {activeAnnouncements.length > 0 && (
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => setInfoIndex((prev) => (prev - 1 + activeAnnouncements.length) % activeAnnouncements.length)}
                          className="p-1.5 rounded-lg bg-slate-100/70 hover:bg-slate-200/80 text-slate-600 transition"
                          title="Sebelumnya"
                        >
                          <ChevronLeftIcon className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-bold text-slate-400 px-1">
                          {infoIndex + 1}/{activeAnnouncements.length}
                        </span>
                        <button 
                          onClick={() => setInfoIndex((prev) => (prev + 1) % activeAnnouncements.length)}
                          className="p-1.5 rounded-lg bg-slate-100/70 hover:bg-slate-200/80 text-slate-600 transition"
                          title="Selanjutnya"
                        >
                          <ChevronRightIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {activeAnnouncements.length === 0 ? (
                  <div className="bg-slate-900/90 text-white rounded-2xl p-8 text-center text-xs text-slate-400 italic">
                    Belum ada informasi publik. Silakan tambah melalui form di bawah.
                  </div>
                ) : (
                  <div 
                    className="bg-gradient-to-br from-slate-900/90 via-indigo-950/90 to-slate-900/90 text-white rounded-2xl p-5 shadow-inner relative overflow-hidden transition-all duration-300 min-h-[190px] flex flex-col justify-between border border-transparent"
                    onMouseEnter={() => setIsInfoPaused(true)}
                    onMouseLeave={() => setIsInfoPaused(false)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black tracking-widest uppercase bg-indigo-500/30 text-indigo-300 px-2.5 py-1 rounded-full border border-transparent">
                          {currentInfo?.category || 'PENGUMUMAN'}
                        </span>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400 font-medium">
                            {currentInfo?.date || ''}
                          </span>

                          {isSuperAdmin && currentInfo?.id && (
                            <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-transparent">
                              <button 
                                onClick={() => handleStartEditInfo(currentInfo)}
                                className="p-1 text-amber-400 hover:text-amber-300 transition"
                                title="Edit Informasi Ini"
                              >
                                <EditIcon className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteAnnouncement(currentInfo.id)}
                                className="p-1 text-rose-400 hover:text-rose-300 transition"
                                title="Hapus Informasi Ini"
                              >
                                <TrashIcon className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <h3 className="text-base md:text-lg font-bold text-white tracking-tight leading-snug">
                        {currentInfo?.title || ''}
                      </h3>
                      <p className="text-xs md:text-sm text-slate-300/90 leading-relaxed font-normal">
                        {currentInfo?.content || ''}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-2 border-t border-indigo-800/20 text-[10px] text-indigo-300/70">
                      <span className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${isInfoPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-ping'}`}></span>
                        {isInfoPaused ? 'Auto-slide dijeda (Arahkan kursor)' : 'Berjalan Otomatis'}
                      </span>

                      <div className="flex gap-1.5">
                        {activeAnnouncements.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setInfoIndex(idx)}
                            className={`h-1.5 rounded-full transition-all ${idx === infoIndex ? 'w-5 bg-indigo-400' : 'w-1.5 bg-indigo-800'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {isSuperAdmin && (
                <form onSubmit={handleInfoSubmit} className="mt-4 pt-3 border-t border-slate-200/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider">
                      {editInfoId ? '📝 Edit Informasi Publik' : '➕ Tambah Informasi Publik Baru'}
                    </span>
                    {editInfoId && (
                      <button 
                        type="button" 
                        onClick={handleCancelEditInfo}
                        className="text-[11px] text-slate-500 hover:text-slate-700 font-semibold underline"
                      >
                        Batal Edit
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <select 
                      value={infoCategory}
                      onChange={(e) => setInfoCategory(e.target.value)}
                      className="p-2 border border-transparent rounded-xl text-xs bg-slate-50/80 font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="PENGUMUMAN">PENGUMUMAN</option>
                      <option value="JADWAL KEGIATAN">JADWAL KEGIATAN</option>
                      <option value="LAYANAN POSYANDU">LAYANAN POSYANDU</option>
                      <option value="BANK SAMPAH">BANK SAMPAH</option>
                    </select>
                    <input 
                      type="text"
                      placeholder="Judul Pengumuman"
                      value={infoTitle}
                      onChange={(e) => setInfoTitle(e.target.value)}
                      className="md:col-span-2 p-2 border border-transparent rounded-xl text-xs bg-slate-50/80 outline-none focus:ring-2 focus:ring-indigo-500/20"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="Isi Pengumuman Ringkas"
                      value={infoContent}
                      onChange={(e) => setInfoContent(e.target.value)}
                      className="flex-1 p-2 border border-transparent rounded-xl text-xs bg-slate-50/80 outline-none focus:ring-2 focus:ring-indigo-500/20"
                      required
                    />
                    <button type="submit" className="bg-indigo-600 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-indigo-700 transition active:scale-95">
                      {editInfoId ? 'Simpan Update' : 'Post'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* GALERI FOTO KEGIATAN RW */}
            <div className="lg:col-span-5 bg-white/80 backdrop-blur-md rounded-3xl p-5 shadow-sm border border-transparent flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-200/30 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-indigo-50/80 rounded-xl text-indigo-600 border border-transparent">
                      <ImageIcon className="w-5 h-5" />
                    </span>
                    <div>
                      <h2 className="text-base md:text-lg font-bold text-slate-900 tracking-tight">Galeri Kegiatan RW</h2>
                      <p className="text-[11px] text-slate-500 font-medium">Dokumentasi momen & aktivitas warga</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isSuperAdmin && activeGallery.length > 0 && (
                      <button 
                        onClick={() => setShowManageGalModal(true)}
                        className="text-xs bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 font-bold px-3 py-1.5 rounded-xl transition border border-transparent"
                      >
                        Kelola Semua ({activeGallery.length})
                      </button>
                    )}
                    {activeGallery.length > 0 && (
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => setGalleryIndex((prev) => (prev - 1 + activeGallery.length) % activeGallery.length)}
                          className="p-1.5 rounded-lg bg-slate-100/70 hover:bg-slate-200/80 text-slate-600 transition"
                          title="Sebelumnya"
                        >
                          <ChevronLeftIcon className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-bold text-slate-400 px-1">
                          {galleryIndex + 1}/{activeGallery.length}
                        </span>
                        <button 
                          onClick={() => setGalleryIndex((prev) => (prev + 1) % activeGallery.length)}
                          className="p-1.5 rounded-lg bg-slate-100/70 hover:bg-slate-200/80 text-slate-600 transition"
                          title="Selanjutnya"
                        >
                          <ChevronRightIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {activeGallery.length === 0 ? (
                  <div className="bg-slate-900/90 text-white rounded-2xl aspect-video flex items-center justify-center text-xs text-slate-400 italic p-4">
                    Belum ada foto galeri. Silakan upload melalui form di bawah.
                  </div>
                ) : (
                  <div 
                    className="relative rounded-2xl overflow-hidden aspect-video bg-slate-900 border border-transparent shadow-md group"
                    onMouseEnter={() => setIsGalleryPaused(true)}
                    onMouseLeave={() => setIsGalleryPaused(false)}
                  >
                    <img 
                      src={currentPhoto?.url || ''} 
                      alt={currentPhoto?.title || 'Galeri Kegiatan'} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-semibold text-indigo-300 tracking-wider uppercase">
                          {currentPhoto?.date || ''}
                        </span>

                        {isSuperAdmin && currentPhoto?.id && (
                          <div className="flex items-center gap-1 bg-black/60 p-1 rounded-lg backdrop-blur">
                            <button 
                              onClick={() => handleStartEditGal(currentPhoto)}
                              className="p-1 text-amber-400 hover:text-amber-300 transition"
                              title="Edit Foto Ini"
                            >
                              <EditIcon className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteGallery(currentPhoto.id)}
                              className="p-1 text-rose-400 hover:text-rose-300 transition"
                              title="Hapus Foto Ini"
                            >
                              <TrashIcon className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                      <h4 className="text-xs md:text-sm font-bold line-clamp-2 leading-snug">
                        {currentPhoto?.title || ''}
                      </h4>
                    </div>
                  </div>
                )}

                {activeGallery.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {activeGallery.map((item, idx) => (
                      <button
                        key={item.id || idx}
                        onClick={() => setGalleryIndex(idx)}
                        className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all ${idx === galleryIndex ? 'border-indigo-500 scale-95 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                      >
                        <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {isSuperAdmin && (
                <form onSubmit={handleGalSubmit} className="mt-4 pt-3 border-t border-slate-200/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider">
                      {editGalId ? '🖼️ Edit Foto Galeri' : '➕ Tambah Foto Kegiatan Baru'}
                    </span>
                    {editGalId && (
                      <button 
                        type="button" 
                        onClick={handleCancelEditGal}
                        className="text-[11px] text-slate-500 hover:text-slate-700 font-semibold underline"
                      >
                        Batal Edit
                      </button>
                    )}
                  </div>
                  <input 
                    type="text"
                    placeholder="Judul Kegiatan"
                    value={galTitle}
                    onChange={(e) => setGalTitle(e.target.value)}
                    className="w-full p-2 border border-transparent rounded-xl text-xs bg-slate-50/80 outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                  <div className="flex gap-2">
                    <input 
                      type="url"
                      placeholder="URL Gambar (https://...)"
                      value={galUrl}
                      onChange={(e) => setGalUrl(e.target.value)}
                      className="flex-1 p-2 border border-transparent rounded-xl text-xs bg-slate-50/80 outline-none focus:ring-2 focus:ring-indigo-500/20"
                      required
                    />
                    <input 
                      type="text"
                      placeholder="Tgl Foto"
                      value={galDate}
                      onChange={(e) => setGalDate(e.target.value)}
                      className="w-24 p-2 border border-transparent rounded-xl text-xs bg-slate-50/80 outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <button type="submit" className="bg-indigo-600 text-white font-bold text-xs px-3 py-2 rounded-xl hover:bg-indigo-700 transition active:scale-95">
                      {editGalId ? 'Simpan' : 'Upload'}
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>

          {/* DASHBOARD STATS METRICS SUMMARY */}
          <div className="no-print grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-indigo-900/85 via-indigo-950/85 to-slate-900/85 backdrop-blur-md text-white rounded-3xl p-5 shadow-lg relative overflow-hidden group border border-transparent">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Saldo Kas Berjalan</span>
                <span className="p-2.5 bg-indigo-800/40 border border-transparent rounded-2xl text-indigo-300">
                  <WalletIcon className="w-5 h-5" />
                </span>
              </div>
              <p className="text-2xl md:text-3xl font-black tracking-tight text-white mb-1">
                Rp {runningBalance.toLocaleString('id-ID')}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-indigo-300/80 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Terakumulasi Realtime</span>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 shadow-sm border border-transparent flex items-center justify-between hover:shadow-md transition">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Total Pemasukan</span>
                <p className="text-xl md:text-2xl font-black text-emerald-600">
                  Rp {totalOverallIn.toLocaleString('id-ID')}
                </p>
                <span className="text-[11px] text-slate-500 font-medium">Seluruh Transaksi Masuk</span>
              </div>
              <div className="p-3 bg-emerald-50/80 rounded-2xl text-emerald-600 border border-transparent">
                <TrendingUpIcon className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 shadow-sm border border-transparent flex items-center justify-between hover:shadow-md transition">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Total Pengeluaran</span>
                <p className="text-xl md:text-2xl font-black text-rose-600">
                  Rp {totalOverallOut.toLocaleString('id-ID')}
                </p>
                <span className="text-[11px] text-slate-500 font-medium">Seluruh Transaksi Keluar</span>
              </div>
              <div className="p-3 bg-rose-50/80 rounded-2xl text-rose-600 border border-transparent">
                <TrendingDownIcon className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 1. SEKSI KEUANGAN BENDAHARA */}
          {/* ========================================================= */}
          <section className={`printable-section bg-white/80 backdrop-blur-md rounded-3xl p-4 md:p-6 shadow-sm border border-transparent transition-all ${printTarget !== 'finance' ? 'print:hidden' : ''}`}>
            
            {/* HEADER JUDUL SEKSI DIBERI 'no-print' AGAR HILANG SAAT DICETAK */}
            <div className="no-print flex items-center justify-between border-b border-slate-200/30 pb-4 mb-4">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
                  Laporan Keuangan Bulanan
                </h2>
                <p className="text-xs text-slate-500 font-medium">Pengelolaan dana kas warga RW.05 Kelurahan Tambakreja</p>
              </div>
              <span className="hidden md:flex items-center gap-1 text-xs font-bold px-3 py-1.5 bg-indigo-50/80 text-indigo-700 rounded-full">
                <WalletIcon className="w-4 h-4" /> Kas RW
              </span>
            </div>

            {/* Form Input Transaksi */}
            {isFinanceAdmin && (
              <form onSubmit={handleFinanceSubmit} className="no-print bg-slate-50/70 p-4 rounded-2xl border border-transparent mb-5 space-y-3">
                <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  {financeId ? 'Edit Catatan Transaksi' : 'Tambah Catatan Kas Baru'}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Tanggal Transaksi</label>
                    <input 
                      type="date" 
                      value={financeDate}
                      onChange={(e) => setFinanceDate(e.target.value)}
                      className="w-full p-2.5 bg-white/80 border border-transparent rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" 
                      required 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Rincian Transaksi</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: Iuran Warga RT 01" 
                      value={financeDesc}
                      onChange={(e) => setFinanceDesc(e.target.value)}
                      className="w-full p-2.5 bg-white/80 border border-transparent rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Jenis Transaksi</label>
                    <select 
                      value={financeType}
                      onChange={(e) => setFinanceType(e.target.value)}
                      className="w-full p-2.5 bg-white/80 border border-transparent rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-semibold text-slate-700"
                    >
                      <option value="IN">Pemasukan (+)</option>
                      <option value="OUT">Pengeluaran (-)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Jumlah (Rp)</label>
                    <input 
                      type="number" 
                      placeholder="Nilai Rupiah" 
                      value={financeAmount}
                      onChange={(e) => setFinanceAmount(e.target.value)}
                      className="w-full p-2.5 bg-white/80 border border-transparent rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" 
                      required 
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-3 items-end">
                  <div className="flex-1 w-full">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Keterangan Opsional</label>
                    <input 
                      type="text" 
                      placeholder="Keterangan atau kwitansi" 
                      value={financeKet}
                      onChange={(e) => setFinanceKet(e.target.value)}
                      className="w-full p-2.5 bg-white/80 border border-transparent rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" 
                    />
                  </div>
                  <button type="submit" className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold p-2.5 px-6 rounded-xl text-xs shadow-md shadow-indigo-600/20 transition active:scale-[0.98]">
                    {financeId ? 'Update Transaksi' : 'Catat Transaksi'}
                  </button>
                </div>
              </form>
            )}

            {/* VIEW 1: REKAP BULANAN */}
            {!currentViewedMonth && (
              <div>
                <p className="no-print text-xs text-slate-500 font-medium mb-3">* Klik pada baris bulan di bawah ini untuk membuka rincian kas bulanan.</p>
                <div className="overflow-x-auto rounded-2xl border border-transparent printable-container">
                  <table className="w-full text-xs md:text-sm text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100/70 text-slate-600 font-bold border-b border-slate-200/30 uppercase tracking-wider text-[11px]">
                        <th className="p-3">NO</th>
                        <th className="p-3">PERIODE (BULAN & TAHUN)</th>
                        <th className="p-3">PEMASUKAN</th>
                        <th className="p-3">PENGELUARAN</th>
                        <th className="p-3">SALDO AKHIR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/40 bg-white/50">
                      {summaryFinanceList.map((group, index) => (
                        <tr 
                          key={group.monthYear} 
                          onClick={() => setCurrentViewedMonth(group.monthYear)}
                          className="cursor-pointer hover:bg-indigo-50/50 transition-colors duration-150 group"
                        >
                          <td className="p-3 text-slate-400 font-medium">{index + 1}</td>
                          <td className="p-3 text-indigo-700 font-bold group-hover:text-indigo-900 transition flex items-center gap-2">
                            <span>{group.monthYear}</span>
                            <span className="text-[10px] text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">Buka Rincian &rarr;</span>
                          </td>
                          <td className="p-3 text-emerald-600 font-bold">Rp {group.in.toLocaleString('id-ID')}</td>
                          <td className="p-3 text-rose-600 font-bold">Rp {group.out.toLocaleString('id-ID')}</td>
                          <td className="p-3 font-extrabold text-slate-800">Rp {group.balance.toLocaleString('id-ID')}</td>
                        </tr>
                      ))}
                      {summaryFinanceList.length === 0 && (
                        <tr>
                          <td colSpan="5" className="p-6 text-center text-slate-400 italic">Belum ada data transaksi keuangan.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VIEW 2: RINCIAN PER BULAN */}
            {currentViewedMonth && activeMonthData && (
              <div>
                <div className="no-print flex gap-2 mb-4">
                  <button 
                    onClick={() => setCurrentViewedMonth(null)}
                    className="bg-slate-100/80 hover:bg-slate-200 text-slate-700 font-bold text-xs md:text-sm px-4 py-2 rounded-xl transition flex items-center gap-1.5"
                  >
                    &larr; Kembali ke Rekap Bulanan
                  </button>

                  {isFinanceAdmin && (
                    <button 
                      onClick={() => openPrintDialog('finance')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs md:text-sm px-4 py-2 rounded-xl shadow-md shadow-emerald-600/20 transition active:scale-[0.98] flex items-center gap-2"
                    >
                      <PrinterIcon className="w-4 h-4" /> Cetak Laporan Keuangan
                    </button>
                  )}
                </div>

                {/* KOP SURAT RESMI KEUANGAN */}
                <div className="hidden print:flex items-center justify-center relative pb-3 mb-4 border-b-4 border-double border-black text-center">
                  <img src="/logo_clp.jpg" alt="Logo Cilacap" className="absolute left-2 w-16 h-auto" />
                  <div className="w-full text-center text-black">
                    <h3 className="text-sm font-bold m-0 leading-tight">PEMERINTAH KABUPATEN CILACAP</h3>
                    <h3 className="text-sm font-bold m-0 leading-tight">KECAMATAN CILACAP SELATAN</h3>
                    <h2 className="text-base font-bold my-0.5 leading-tight">KELURAHAN TAMBAKREJA</h2>
                    <h1 className="text-lg font-bold m-0 leading-tight">RUKUN WARGA 05</h1>
                  </div>
                </div>

                <div className="bg-slate-100/70 p-3 rounded-2xl font-bold text-xs md:text-sm uppercase mb-4 flex flex-wrap gap-4 text-slate-700 border border-transparent printable-header-box">
                  <span>LAPORAN KAS BULAN : <span className="text-indigo-900 font-black print:text-black">{activeMonthData.monthYear.split(" ")[0]}</span></span>
                  <span>TAHUN : <span className="text-indigo-900 font-black print:text-black">{activeMonthData.monthYear.split(" ")[1]}</span></span>
                </div>

                {/* TABEL RINCIAN KAS */}
                <div className="overflow-x-auto rounded-2xl border border-transparent printable-container">
                  <table className="w-full text-xs md:text-sm border-collapse bg-white/60">
                    <thead>
                      <tr className="bg-slate-100/80 text-slate-700 font-bold text-center border-b border-slate-200/50 uppercase tracking-wider text-[11px]">
                        <th className="p-2.5 border border-slate-200/40">NO</th>
                        <th className="p-2.5 border border-slate-200/40">TGL</th>
                        <th className="p-2.5 border border-slate-200/40 text-left">KETERANGAN / RINCIAN</th>
                        <th className="p-2.5 border border-slate-200/40">PEMASUKAN</th>
                        <th className="p-2.5 border border-slate-200/40">PENGELUARAN</th>
                        <th className="p-2.5 border border-slate-200/40">SALDO</th>
                        <th className="p-2.5 border border-slate-200/40">KETERANGAN</th>
                        {isFinanceAdmin && <th className="no-print p-2.5 border border-slate-200/40">AKSI</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const sortedItems = [...activeMonthData.items].sort((a, b) => {
                          if (a.day !== b.day) return a.day - b.day;
                          return (a.description || "").localeCompare(b.description || "");
                        });

                        let rowBalance = activeMonthData.balance - activeMonthData.in + activeMonthData.out;
                        let totalIn = 0;
                        let totalOut = 0;

                        const rows = [];

                        rows.push(
                          <tr key="saldo-awal" className="bg-slate-50/60 font-semibold">
                            <td className="p-2.5 text-center border border-slate-200/30 text-slate-400">-</td>
                            <td className="p-2.5 text-center border border-slate-200/30 text-slate-400">-</td>
                            <td className="p-2.5 font-bold italic text-slate-700 border border-slate-200/30">Saldo Awal dari Bulan Sebelumnya</td>
                            <td className="p-2.5 border border-slate-200/30"></td>
                            <td className="p-2.5 border border-slate-200/30"></td>
                            <td className="p-2.5 text-right font-extrabold text-slate-800 border border-slate-200/30">{rowBalance.toLocaleString('id-ID')}</td>
                            <td className="p-2.5 border border-slate-200/30"></td>
                            {isFinanceAdmin && <td className="no-print p-2.5 border border-slate-200/30"></td>}
                          </tr>
                        );

                        sortedItems.forEach((item, idx) => {
                          const isIncome = item.type === "IN";
                          const amount = Number(item.amount) || 0;
                          if (isIncome) {
                            rowBalance += amount;
                            totalIn += amount;
                          } else {
                            rowBalance -= amount;
                            totalOut += amount;
                          }

                          rows.push(
                            <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="p-2.5 text-center border border-slate-200/30 font-medium text-slate-400">{idx + 1}</td>
                              <td className="p-2.5 text-center border border-slate-200/30 font-bold text-slate-700">{item.day}</td>
                              <td className="p-2.5 border border-slate-200/30 font-medium text-slate-800">{item.description}</td>
                              <td className="p-2.5 text-right border border-slate-200/30 font-bold text-emerald-600">{isIncome ? amount.toLocaleString('id-ID') : ''}</td>
                              <td className="p-2.5 text-right border border-slate-200/30 font-bold text-rose-600">{!isIncome ? amount.toLocaleString('id-ID') : ''}</td>
                              <td className="p-2.5 text-right font-extrabold border border-slate-200/30 text-slate-900">{rowBalance.toLocaleString('id-ID')}</td>
                              <td className="p-2.5 border border-slate-200/30 text-slate-500">{item.ket || ''}</td>
                              {isFinanceAdmin && (
                                <td className="no-print p-2.5 text-center border border-slate-200/30">
                                  <button 
                                    onClick={() => handleEditFinance(item)}
                                    className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-2.5 py-1 rounded-lg font-semibold mr-1 transition"
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteFinance(item.id)}
                                    className="bg-rose-600 hover:bg-rose-700 text-white text-xs px-2.5 py-1 rounded-lg font-semibold transition"
                                  >
                                    Hapus
                                  </button>
                                </td>
                              )}
                            </tr>
                          );
                        });

                        rows.push(
                          <tr key="total-row" className="bg-slate-100/80 font-black border-t-2 border-slate-300/60 text-slate-900">
                            <td colSpan="3" className="p-3 text-right border border-slate-200/40">TOTAL PEMASUKAN/PENGELUARAN & SALDO AKHIR :</td>
                            <td className="p-3 text-right text-emerald-600 border border-slate-200/40">{totalIn.toLocaleString('id-ID')}</td>
                            <td className="p-3 text-right text-rose-600 border border-slate-200/40">{totalOut.toLocaleString('id-ID')}</td>
                            <td className="p-3 text-right border border-slate-200/40">{activeMonthData.balance.toLocaleString('id-ID')}</td>
                            <td className="p-3 border border-slate-200/40"></td>
                            {isFinanceAdmin && <td className="no-print p-3 border border-slate-200/40"></td>}
                          </tr>
                        );

                        return rows;
                      })()}
                    </tbody>
                  </table>
                </div>

                {/* TANDA TANGAN CETAK KEUANGAN */}
                <div className="hidden print:flex justify-between mt-12 px-10 text-sm text-black">
                  <div className="text-center">
                    <p>Mengetahui,</p>
                    <p>Ketua RW. 05</p>
                    <div className="h-16"></div>
                    <p className="font-bold">( {printSignData.leader || '..............................................'} )</p>
                  </div>
                  <div className="text-center">
                    <p>{printSignData.date || 'Cilacap, ........................'}</p>
                    <p>Bendahara</p>
                    <div className="h-16"></div>
                    <p className="font-bold">( {printSignData.officer || '..............................................'} )</p>
                  </div>
                </div>

              </div>
            )}
          </section>


          {/* ========================================================= */}
          {/* 2. SEKSI ASET / INVENTARIS */}
          {/* ========================================================= */}
          <section id="asset-section" className={`printable-section bg-white/80 backdrop-blur-md rounded-3xl p-4 md:p-6 shadow-sm border border-transparent transition-all ${printTarget !== 'asset' ? 'print:hidden' : ''}`}>
            
            {/* KOP SURAT RESMI ASET */}
            <div className="hidden print:flex items-center justify-center relative pb-3 mb-4 border-b-4 border-double border-black text-center">
              <img src="/logo_clp.jpg" alt="Logo Cilacap" className="absolute left-2 w-16 h-auto" />
              <div className="w-full text-center text-black">
                <h3 className="text-sm font-bold m-0 leading-tight">PEMERINTAH KABUPATEN CILACAP</h3>
                <h3 className="text-sm font-bold m-0 leading-tight">KECAMATAN CILACAP SELATAN</h3>
                <h2 className="text-base font-bold my-0.5 leading-tight">KELURAHAN TAMBAKREJA</h2>
                <h1 className="text-lg font-bold m-0 leading-tight">RUKUN WARGA 05</h1>
              </div>
            </div>

            <div className="no-print flex items-center justify-between border-b border-slate-200/30 pb-4 mb-4">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
                  {selectedAssetCategory ? `Inventaris Barang - ${selectedAssetCategory}` : 'Daftar Pengelola Aset RW 05'}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedAssetCategory 
                    ? `Menampilkan rincian daftar aset yang dikelola oleh ${selectedAssetCategory}` 
                    : 'Pilih salah satu pengelola di bawah ini untuk melihat rincian inventaris aset'}
                </p>
              </div>

              {isAssetAdmin && (
                <button 
                  onClick={() => openPrintDialog('asset')}
                  className="no-print bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs md:text-sm px-4 py-2 rounded-xl shadow-md shadow-emerald-600/20 transition active:scale-[0.98] flex items-center gap-2"
                >
                  <PrinterIcon className="w-4 h-4" /> Cetak Aset
                </button>
              )}
            </div>

            {/* DASHBOARD KARTU DAFTAR PENGELOLA ASET */}
            {!selectedAssetCategory && (
              <div className="no-print">
                <p className="text-xs text-slate-500 font-medium mb-4">* Ketuk pada kartu pengelola di bawah untuk membuka rincian barang yang dikelola.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ASSET_MANAGERS.map((mgr) => {
                    const itemCount = assetItems.filter(a => (a.category || "Aset RW") === mgr.id).length;
                    return (
                      <div 
                        key={mgr.id}
                        onClick={() => handleSelectManager(mgr.id)}
                        className="bg-slate-50/60 border border-transparent hover:border-indigo-400/40 rounded-3xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer group flex flex-col justify-between relative overflow-hidden backdrop-blur-sm"
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full pointer-events-none group-hover:bg-indigo-500/10 transition-colors"></div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="p-3 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20 group-hover:scale-110 transition-transform">
                              <BoxIcon className="w-6 h-6" />
                            </span>
                            
                            <span className={`text-xs font-black px-3 py-1 rounded-full ${mgr.badgeColor}`}>
                              {itemCount} Jenis Barang
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                            {mgr.name}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            {mgr.desc}
                          </p>
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-200/30 flex items-center justify-between">
                          <span className="text-xs font-bold text-indigo-600 group-hover:text-indigo-800">
                            Buka Rincian Daftar Aset
                          </span>
                          <span className="p-2 bg-indigo-50/80 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                            <ArrowRightIcon className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* RINCIAN DAFTAR ASET UNTUK PENGELOLA TERPILIH */}
            {selectedAssetCategory && (
              <div className="no-print">
                <div className="flex items-center justify-between mb-4">
                  <button 
                    onClick={() => setSelectedAssetCategory(null)}
                    className="bg-slate-100/80 hover:bg-slate-200 text-slate-700 font-bold text-xs md:text-sm px-4 py-2 rounded-xl transition flex items-center gap-1.5"
                  >
                    &larr; Kembali ke Daftar Pengelola
                  </button>

                  <span className="text-xs font-bold text-indigo-900 bg-indigo-50/80 px-3 py-1.5 rounded-xl border border-transparent">
                    Kategori: {selectedAssetCategory}
                  </span>
                </div>

                {isAssetAdmin && (
                  <form onSubmit={handleAssetSubmit} className="bg-slate-50/70 p-4 rounded-2xl border border-transparent mb-5 space-y-3">
                    <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                      {assetId ? 'Edit Data Barang Aset' : `Tambah Barang Baru (${selectedAssetCategory})`}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Nama Barang</label>
                        <input 
                          type="text" 
                          placeholder="Nama Barang" 
                          value={assetName}
                          onChange={(e) => setAssetName(e.target.value)}
                          className="w-full p-2.5 bg-white/80 border border-transparent rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" 
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Jumlah</label>
                        <input 
                          type="number" 
                          placeholder="Jumlah" 
                          value={assetQty}
                          onChange={(e) => setAssetQty(e.target.value)}
                          className="w-full p-2.5 bg-white/80 border border-transparent rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" 
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Satuan</label>
                        <input 
                          type="text" 
                          placeholder="Buah/Unit/Set" 
                          value={assetUnit}
                          onChange={(e) => setAssetUnit(e.target.value)}
                          className="w-full p-2.5 bg-white/80 border border-transparent rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" 
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Kondisi</label>
                        <input 
                          type="text" 
                          placeholder="Baik / Rusak" 
                          value={assetCondition}
                          onChange={(e) => setAssetCondition(e.target.value)}
                          className="w-full p-2.5 bg-white/80 border border-transparent rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" 
                          required 
                        />
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-3 items-end">
                      <div className="flex-1 w-full">
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Keterangan Opsional</label>
                        <input 
                          type="text" 
                          placeholder="Keterangan tambahan" 
                          value={assetKet}
                          onChange={(e) => setAssetKet(e.target.value)}
                          className="w-full p-2.5 bg-white/80 border border-transparent rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" 
                        />
                      </div>
                      <button type="submit" className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold p-2.5 px-6 rounded-xl text-xs shadow-md shadow-indigo-600/20 transition active:scale-[0.98]">
                        {assetId ? 'Update Aset' : 'Simpan Barang'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="overflow-x-auto rounded-2xl border border-transparent printable-container">
                  <table className="w-full text-xs md:text-sm border-collapse bg-white/60">
                    <thead>
                      <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200/50 uppercase tracking-wider text-[11px]">
                        <th className="p-3 border border-slate-200/40 text-center">NO</th>
                        <th className="p-3 border border-slate-200/40 text-left">NAMA BARANG</th>
                        <th className="p-3 border border-slate-200/40 text-center">JUMLAH</th>
                        <th className="p-3 border border-slate-200/40 text-center">SATUAN</th>
                        <th className="p-3 border border-slate-200/40 text-center">KONDISI</th>
                        <th className="p-3 border border-slate-200/40 text-left">KETERANGAN</th>
                        {isAssetAdmin && <th className="p-3 border border-slate-200/40 text-center">AKSI</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const filteredAssets = assetItems.filter(a => (a.category || "Aset RW") === selectedAssetCategory);

                        if (filteredAssets.length === 0) {
                          return (
                            <tr>
                              <td colSpan={isAssetAdmin ? 7 : 6} className="p-6 text-center text-slate-400 italic border border-slate-200/40">
                                Belum ada daftar barang yang dicatat untuk pengelola {selectedAssetCategory}.
                              </td>
                            </tr>
                          );
                        }

                        return filteredAssets.map((item, idx) => (
                          <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-2.5 text-center border border-slate-200/30 font-medium text-slate-400">{idx + 1}</td>
                            <td className="p-2.5 border border-slate-200/30 font-semibold text-slate-800">{item.name}</td>
                            <td className="p-2.5 text-center border border-slate-200/30 font-bold text-indigo-700">{item.qty}</td>
                            <td className="p-2.5 text-center border border-slate-200/30 text-slate-600">{item.unit || 'Unit'}</td>
                            <td className="p-2.5 text-center border border-slate-200/30 font-medium text-slate-700">{item.condition}</td>
                            <td className="p-2.5 border border-slate-200/30 text-slate-500">{item.ket || '-'}</td>
                            {isAssetAdmin && (
                              <td className="p-2.5 text-center border border-slate-200/30">
                                <button 
                                  onClick={() => handleEditAsset(item)}
                                  className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-2.5 py-1 rounded-lg font-semibold mr-1 transition"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleDeleteAsset(item.id)}
                                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs px-2.5 py-1 rounded-lg font-semibold transition"
                                >
                                  Hapus
                                </button>
                              </td>
                            )}
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TABEL PENGELOLA ASET KHUSUS CETAK PRINTER */}
            <div className="hidden print:block border-none">
              {ASSET_MANAGERS.map((mgr) => {
                const filtered = assetItems.filter(a => (a.category || "Aset RW") === mgr.id);
                if (selectedAssetCategory && selectedAssetCategory !== mgr.id) return null;

                return (
                  <div key={mgr.id} className="mb-6">
                    <h4 className="font-bold text-sm bg-slate-200 p-2 text-black uppercase">PENGELOLA: {mgr.id}</h4>
                    <table className="w-full text-xs border-collapse border border-slate-300">
                      <thead>
                        <tr className="bg-slate-100 text-black font-bold">
                          <th className="p-2 border border-slate-300 text-left">Nama Barang</th>
                          <th className="p-2 border border-slate-300 text-center">Jumlah</th>
                          <th className="p-2 border border-slate-300 text-center">Satuan</th>
                          <th className="p-2 border border-slate-300 text-center">Kondisi</th>
                          <th className="p-2 border border-slate-300 text-left">Keterangan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.length === 0 ? (
                          <tr><td colSpan="5" className="p-2 text-center text-slate-500 italic">Tidak ada barang</td></tr>
                        ) : (
                          filtered.map((item) => (
                            <tr key={item.id}>
                              <td className="p-2 border border-slate-300">{item.name}</td>
                              <td className="p-2 border border-slate-300 text-center">{item.qty}</td>
                              <td className="p-2 border border-slate-300 text-center">{item.unit || 'Unit'}</td>
                              <td className="p-2 border border-slate-300 text-center">{item.condition}</td>
                              <td className="p-2 border border-slate-300">{item.ket || ''}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>

            {/* TANDA TANGAN CETAK ASET */}
            <div className="hidden print:flex justify-between mt-12 px-10 text-sm text-black">
              <div className="text-center">
                <p>Mengetahui,</p>
                <p>Ketua RW. 05</p>
                <div className="h-16"></div>
                <p className="font-bold">( {printSignData.leader || '..............................................'} )</p>
              </div>
              <div className="text-center">
                <p>{printSignData.date || 'Cilacap, ........................'}</p>
                <p>Pengelola Barang</p>
                <div className="h-16"></div>
                <p className="font-bold">( {printSignData.officer || '..............................................'} )</p>
              </div>
            </div>

          </section>
        </div>

        {/* MODAL KELOLA SEMUA PENGUMUMAN */}
        {showManageInfoModal && (
          <div className="no-print fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 w-full max-w-2xl border border-transparent max-h-[85vh] flex flex-col justify-between transform transition-all animate-in fade-in zoom-in-95">
              <div>
                <div className="flex items-center justify-between border-b border-slate-200/30 pb-3 mb-4">
                  <h3 className="text-base font-bold text-slate-900">Kelola Semua Informasi Publik</h3>
                  <button 
                    onClick={() => setShowManageInfoModal(false)}
                    className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs"
                  >
                    &times; Tutup
                  </button>
                </div>

                <div className="overflow-y-auto max-h-[55vh] space-y-2 pr-1">
                  {activeAnnouncements.map((item, idx) => (
                    <div key={item.id || idx} className="p-3 bg-slate-50/70 rounded-2xl border border-transparent flex items-center justify-between gap-3 hover:bg-slate-100/80 transition">
                      <div className="space-y-0.5 max-w-md">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                            {item.category || 'INFORMASI'}
                          </span>
                          <span className="text-[10px] text-slate-400">{item.date || ''}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 leading-snug">{item.title}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{item.content}</p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button 
                          onClick={() => handleStartEditInfo(item)}
                          className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition flex items-center gap-1"
                        >
                          <EditIcon className="w-3 h-3" /> Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteAnnouncement(item.id)}
                          className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1"
                        >
                          <TrashIcon className="w-3 h-3" /> Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200/30 text-right">
                <button 
                  onClick={() => setShowManageInfoModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-xl text-xs transition"
                >
                  Selesai
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL KELOLA SEMUA GALERI FOTO */}
        {showManageGalModal && (
          <div className="no-print fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 w-full max-w-2xl border border-transparent max-h-[85vh] flex flex-col justify-between transform transition-all animate-in fade-in zoom-in-95">
              <div>
                <div className="flex items-center justify-between border-b border-slate-200/30 pb-3 mb-4">
                  <h3 className="text-base font-bold text-slate-900">Kelola Semua Galeri Foto</h3>
                  <button 
                    onClick={() => setShowManageGalModal(false)}
                    className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs"
                  >
                    &times; Tutup
                  </button>
                </div>

                <div className="overflow-y-auto max-h-[55vh] space-y-2 pr-1">
                  {activeGallery.map((item, idx) => (
                    <div key={item.id || idx} className="p-3 bg-slate-50/70 rounded-2xl border border-transparent flex items-center justify-between gap-3 hover:bg-slate-100/80 transition">
                      <div className="flex items-center gap-3 max-w-md">
                        <img src={item.url} alt={item.title} className="w-14 h-10 object-cover rounded-xl border border-transparent shrink-0" />
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-400 font-medium block">{item.date || ''}</span>
                          <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{item.title}</h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button 
                          onClick={() => handleStartEditGal(item)}
                          className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition flex items-center gap-1"
                        >
                          <EditIcon className="w-3 h-3" /> Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteGallery(item.id)}
                          className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1"
                        >
                          <TrashIcon className="w-3 h-3" /> Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200/30 text-right">
                <button 
                  onClick={() => setShowManageGalModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-xl text-xs transition"
                >
                  Selesai
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL PENGATURAN CETAK LAPORAN */}
        {printModalOpen && (
          <div className="no-print fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 w-full max-w-sm border border-transparent transform transition-all animate-in fade-in zoom-in-95">
              <h3 className="text-base font-bold text-slate-900 mb-3">
                Pengaturan Cetak {printTarget === 'finance' ? 'Laporan Keuangan' : 'Laporan Aset'}
              </h3>
              <form onSubmit={handleProcessPrint} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Tanggal & Tempat Laporan</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Cilacap, 10 Oktober 2026" 
                    value={printDateInput}
                    onChange={(e) => setPrintDateInput(e.target.value)}
                    className="w-full p-2.5 border border-slate-200/50 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white/80"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    {printTarget === 'finance' ? 'Nama Bendahara:' : 'Nama Pengelola Barang:'}
                  </label>
                  <input 
                    type="text" 
                    placeholder="Nama Terang" 
                    value={printOfficerInput}
                    onChange={(e) => setPrintOfficerInput(e.target.value)}
                    className="w-full p-2.5 border border-slate-200/50 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white/80"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Ketua RW 05</label>
                  <input 
                    type="text" 
                    placeholder="Nama Terang" 
                    value={printLeaderInput}
                    onChange={(e) => setPrintLeaderInput(e.target.value)}
                    className="w-full p-2.5 border border-slate-200/50 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white/80"
                    required
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs md:text-sm shadow-md shadow-emerald-600/20 transition active:scale-[0.98]">
                    Proses Cetak
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setPrintModalOpen(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs md:text-sm transition"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER APLIKASI */}
      <footer className="no-print mt-16 bg-white/80 backdrop-blur-md border-t border-transparent py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <p className="font-bold text-slate-800 text-sm">BANK SAMPAH "BERSERI" RW.05</p>
            <p className="text-xs text-slate-500 mt-0.5">Kelurahan Tambakreja, Kecamatan Cilacap Selatan, Kabupaten Cilacap</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 justify-center md:justify-end">
            <a 
              href="https://www.instagram.com/rw_05_tambakreja" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 hover:opacity-90 text-white font-bold rounded-xl transition shadow-md group"
            >
              <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span className="text-xs font-semibold">@rw_05_tambakreja</span>
              <ExternalLink className="w-3 h-3 text-white/70 group-hover:text-white" />
            </a>

            <a 
              href="https://www.tiktok.com/@rw_05_tambakreja" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-900 border border-transparent text-white font-bold rounded-xl transition shadow-md group"
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/3/34/Ionicons_logo-tiktok.svg" 
                alt="TikTok Logo" 
                className="w-5 h-5 shrink-0 brightness-0 invert" 
              />
              <span className="text-xs font-semibold">@rw_05_tambakreja</span>
              <ExternalLink className="w-3 h-3 text-white/70 group-hover:text-white" />
            </a>
          </div>
        </div>
      </footer>

      {/* STYLESHEET KHUSUS BACKGROUND WEB & MARGIN PRINT */}
      <style>
        {`
          /* BACKGROUND UTAMA WEB */
          .custom-app-bg {
            background-image: url('/bonsayur.jpg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            background-attachment: fixed;
          }

          @media print {
            @page {
              size: auto;
              margin-top: 1.5cm;
              margin-bottom: 1.5cm;
              margin-left: 2cm;
              margin-right: 2cm;
            }

            /* Hapus Background saat Cetak */
            .custom-app-bg {
              background-image: none !important;
              background-color: transparent !important;
            }

            /* Hapus Bingkai, Shadow, Rounded, dan Padding Outer pada Seksi Cetak */
            .printable-section {
              border: none !important;
              box-shadow: none !important;
              border-radius: 0 !important;
              padding: 0 !important;
              margin: 0 !important;
              background: transparent !important;
            }

            .printable-container {
              border: none !important;
              border-radius: 0 !important;
            }

            .printable-header-box {
              background-color: transparent !important;
              border: none !important;
              padding-left: 0 !important;
              padding-right: 0 !important;
            }
          }
        `}
      </style>
    </div>
  );
}