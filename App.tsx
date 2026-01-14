
import React, { useState, useEffect, createContext, useContext, useCallback, useRef, PropsWithChildren } from 'react';
import { MenuIcon, CloseIcon, PhoneIcon, InstagramIcon, FacebookIcon, MapPinIcon, ChevronDownIcon } from './components/Icons';

// --- DATABASE & DATA MANAGEMENT ---

const DEFAULT_SITE_DATA = {
  translations: {
    me: {
      logo: "Kod Tunje",
      navHome: "Početna",
      navAbout: "O Nama",
      navMenu: "Meni",
      navOffers: "Ponude",
      navEvents: "Proslave",
      heroTitle: "DOBRODOŠLI U KONOBU NA VRBANJU",
      heroCta: "POZOVITE NAS",
      aboutTitle: "Ako tražite iskreno gostoprimstvo, miran ambijent i pravu domaću hranu, Konoba kod Tunje je pravo mjesto za vas.",
      aboutText1: "U prijatnom ambijentu Vrbanja nudimo autentična crnogorska jela, pripremana na tradicionalan način, po receptima koji se prenose generacijama.",
      aboutText2: "Koristimo domaće namirnice i kuvamo s ljubavlju, kako bi svaki zalogaj imao pravi ukus domaće trpeze.",
      openingHours: "Radno Vrijeme",
      reserveTable: "REZERVIŠITE STO",
      quoteText: "“Ako tražite iskreno gostoprimstvo, miran ambijent i pravu domaću hranu, Konoba kod Tunje je pravo mjesto za vas.”",
      eventsTitle: "Sala za proslave, novitet u našoj ponudi!",
      eventsText: "Uživajte u kulinarskom putovanju kao nijednom drugom. Smješteni u srcu prirode, mi smo utočište za ljubitelje hrane koji traže izvanredne ukuse i nezaboravno iskustvo. Naš restoran kombinuje topao i primamljiv ambijent sa besprekornom uslugom kako bismo stvorili savršeno okruženje za svaku priliku.",
      footerDine: "Ručajte kod nas. Naručite za ponijeti. Ketering.",
      footerAddress: "Vrbanj b.b., Herceg Novi, Crna Gora",
      footerOrder: "NARUČITE ONLINE",
    },
    en: { /* ... English translations ... */ },
  },
  openingHours: [
    { day: 'Mon', hours: '11am - 9pm' }, { day: 'Tue', hours: '11am - 9pm' }, { day: 'Wed', hours: 'Closed' },
    { day: 'Thu', hours: '11am - 9pm' }, { day: 'Fri', hours: '11am - 10pm' }, { day: 'S&S', hours: '12am - 10pm' },
  ],
  menu: {
    starters: [{name: 'Lorem Ipsum Dolor Sit Amet', price: '$15.95'}, {name: 'Donec Sed Finibus Nisi', price: '$19.95'}],
    lunch: [{name: 'Quisque Aliquet Velit Sit Amet', price: '$9.95'}, {name: 'Morbi Tortor Nibh Fringilla', price: '$22.95'}],
    dinner: [{name: 'Curabitur Nisi Odio Vel', price: '$35.95'}],
    dessert: [{name: 'Pellentesque Congue Nec', price: '$12.95'}],
  },
  galleryImages: [
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
    "https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
    "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
    "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
  ],
  sliderImages: [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600",
    "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600",
  ],
  slider2Images: [
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600",
    "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600",
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600",
  ],
};

// Custom hook for localStorage
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) { console.error(error); return initialValue; }
  });
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) { console.error(error); }
  };
  return [storedValue, setValue];
}

// Custom hook for sessionStorage (for auth)
function useSessionStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) { console.error(error); return initialValue; }
  });
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) { console.error(error); }
  };
  return [storedValue, setValue];
}


// --- LANGUAGE & TRANSLATION CONTEXT ---
type LangCode = 'me' | 'en' | 'sr' | 'hr' | 'ru' | 'de' | 'uk' | 'tr' | 'es' | 'zh-HK' | 'zh-CN' | 'ja' | 'hi';

type LanguageDetails = {
  name: string;
  short: string;
  flag: string;
};

const languageMap: Record<LangCode, LanguageDetails> = {
  me: { name: 'Montenegrin', short: 'ME', flag: '🇲🇪' },
  sr: { name: 'Serbian', short: 'SR', flag: '🇷🇸' },
  hr: { name: 'Croatian', short: 'HR', flag: '🇭🇷' },
  en: { name: 'English', short: 'EN', flag: '🇬🇧' },
  ru: { name: 'Russian', short: 'RU', flag: '🇷🇺' },
  de: { name: 'German', short: 'DE', flag: '🇩🇪' },
  uk: { name: 'Ukrainian', short: 'UA', flag: '🇺🇦' },
  tr: { name: 'Turkish', short: 'TR', flag: '🇹🇷' },
  es: { name: 'Spanish', short: 'ES', flag: '🇪🇸' },
  'zh-HK': { name: 'Cantonese', short: 'HK', flag: '🇭🇰' },
  'zh-CN': { name: 'Mandarin', short: 'CN', flag: '🇨🇳' },
  ja: { name: 'Japanese', short: 'JP', flag: '🇯🇵' },
  hi: { name: 'Hindi', short: 'IN', flag: '🇮🇳' },
};

const LanguageContext = createContext(null);
// FIX: Use PropsWithChildren for correct typing of components with children.
const LanguageProvider = ({ children, translations }: PropsWithChildren<{ translations: any }>) => {
  const [lang, setLang] = useState<LangCode>('me');
  useEffect(() => {
    const browserLang = navigator.language.split('-')[0];
    if (Object.keys(languageMap).includes(browserLang)) setLang(browserLang as LangCode);
  }, []);
  const t = useCallback((key) => translations[lang]?.[key] || translations['me'][key] || key, [lang, translations]);
  return <LanguageContext.Provider value={{ lang, setLang, t, translations }}>{children}</LanguageContext.Provider>;
};
const useTranslation = () => useContext(LanguageContext);

// --- ADMIN LOGIN COMPONENT ---
const LoginPage = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Hardcoded credentials for this example
        if (username === 'admin' && password === 'password') {
            onLogin();
        } else {
            setError('Invalid username or password');
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center text-gray-800">Admin Login</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required/>
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};


// --- ADMIN DASHBOARD COMPONENT ---
const AdminDashboard = ({ data, onSave }) => {
    const [formData, setFormData] = useState(JSON.parse(JSON.stringify(data)));
    const [message, setMessage] = useState('');
    const handleSave = () => { onSave(formData); setMessage('Changes saved successfully!'); setTimeout(() => setMessage(''), 3000); };
    const handleTextChange = (lang, key, value) => { setFormData(prev => ({...prev, translations: {...prev.translations, [lang]: {...prev.translations[lang], [key]: value}}})); };
    // FIX: Add default value for 'category' to allow calls with 3 arguments.
    const handleListChange = (list, index, value, category = null) => {
      if (category) { setFormData(prev => { const newItems = [...prev.menu[category]]; newItems[index] = value; return {...prev, menu: {...prev.menu, [category]: newItems }}; });
      } else { setFormData(prev => { const newList = [...prev[list]]; newList[index] = value; return ({ ...prev, [list]: newList }); }); }
    };
    const addListItem = (list) => {
      const newItem = list === 'menu' ? { name: 'New Item', price: '$0.00' } : 'https://via.placeholder.com/800';
      const category = list === 'menu' ? prompt("Enter category (starters, lunch, dinner, dessert):", "starters") : null;
      if (list === 'menu' && category && formData.menu[category]) { setFormData(prev => ({...prev, menu: {...prev.menu, [category]: [...prev.menu[category], newItem]}}));
      } else if (list !== 'menu') { setFormData(prev => ({ ...prev, [list]: [...prev[list], newItem] })); }
    };
    const removeListItem = (list, index, category = null) => {
      if(category) { setFormData(prev => ({...prev, menu: {...prev.menu, [category]: prev.menu[category].filter((_, i) => i !== index)}}));
      } else { setFormData(prev => ({ ...prev, [list]: prev[list].filter((_, i) => i !== index) })); }
    };
    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
            <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-xl">
                <div className="flex justify-between items-center mb-6 border-b pb-4"><h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1><div><a href="/#" className="text-blue-600 hover:underline mr-4">← Back to Site</a><button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg">Save</button></div></div>
                {message && <div className="bg-green-100 border-green-400 text-green-700 px-4 py-3 rounded mb-4">{message}</div>}
                <div className="mb-8"><h2 className="text-2xl font-semibold mb-4 text-gray-700">Page Content (Montenegrin)</h2><div className="grid md:grid-cols-2 gap-4">{Object.keys(formData.translations.me).map(key => (<div key={key}><label className="block text-sm font-medium text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label><textarea value={formData.translations.me[key]} onChange={e => handleTextChange('me', key, e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/></div>))}</div></div>
                <div className="grid md:grid-cols-2 gap-8 mb-8"><div><h2 className="text-2xl font-semibold mb-4 text-gray-700">Slider Images</h2>{formData.sliderImages.map((url, i) => (<div key={i} className="flex items-center mb-2"><input value={url} onChange={e => handleListChange('sliderImages', i, e.target.value)} className="flex-grow p-2 border rounded-l-md"/><button onClick={() => removeListItem('sliderImages', i)} className="bg-red-500 text-white px-3 py-2 rounded-r-md">X</button></div>))}<button onClick={() => addListItem('sliderImages')} className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md">+ Add</button></div><div><h2 className="text-2xl font-semibold mb-4 text-gray-700">Gallery Images</h2>{formData.galleryImages.map((url, i) => (<div key={i} className="flex items-center mb-2"><input value={url} onChange={e => handleListChange('galleryImages', i, e.target.value)} className="flex-grow p-2 border rounded-l-md"/><button onClick={() => removeListItem('galleryImages', i)} className="bg-red-500 text-white px-3 py-2 rounded-r-md">X</button></div>))}<button onClick={() => addListItem('galleryImages')} className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md">+ Add</button></div></div>
                <div className="mb-8"><h2 className="text-2xl font-semibold mb-4 text-gray-700">Slider 2 Images</h2>{formData.slider2Images.map((url, i) => (<div key={i} className="flex items-center mb-2"><input value={url} onChange={e => handleListChange('slider2Images', i, e.target.value)} className="flex-grow p-2 border rounded-l-md"/><button onClick={() => removeListItem('slider2Images', i)} className="bg-red-500 text-white px-3 py-2 rounded-r-md">X</button></div>))}<button onClick={() => addListItem('slider2Images')} className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md">+ Add</button></div>
                <div><h2 className="text-2xl font-semibold mb-4 text-gray-700">Menu</h2><button onClick={() => addListItem('menu')} className="mb-4 bg-green-500 text-white px-4 py-2 rounded-md">+ Add</button><div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-4">{Object.entries(formData.menu).map(([cat, items]) => (<div key={cat}><h3 className="font-bold capitalize text-lg mb-2">{cat}</h3>{(items as any[]).map((item, i) => (<div key={i} className="flex mb-2"><input value={item.name} onChange={e => handleListChange('menu', i, {...item, name: e.target.value}, cat)} className="w-2/3 p-1 border rounded-l-md"/><input value={item.price} onChange={e => handleListChange('menu', i, {...item, price: e.target.value}, cat)} className="w-1/3 p-1 border-t border-b"/><button onClick={() => removeListItem('menu', i, cat)} className="bg-red-500 text-white px-3 py-1 rounded-r-md">X</button></div>))}</div>))}</div></div>
            </div>
        </div>
    );
};

// --- PUBLIC SITE COMPONENTS ---
const HomePage = ({ data }) => {
    const { t } = useTranslation();
    return (
        <main>
            <section className="h-screen bg-cover bg-center flex items-center justify-center text-white" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600')" }}>
                <div className="bg-black bg-opacity-60 text-center p-8 rounded-lg max-w-4xl mx-auto"><h1 className="text-4xl md:text-7xl font-bold mb-4">{t('heroTitle')}</h1><a href="tel:+382" className="bg-[#075e54] hover:bg-[#054c43] text-white font-bold py-3 px-8 rounded-md inline-block mt-4">{t('heroCta')}</a></div>
            </section>
            <section className="py-16 md:py-24 bg-[#F8F5F2]">
              <div className="container mx-auto px-4 text-center max-w-4xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('aboutTitle')}</h2>
                <p className="mb-4 text-lg">{t('aboutText1')}</p>
                <p className="text-lg">{t('aboutText2')}</p>
              </div>
            </section>
            <section className="w-full bg-black"><div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">{data.sliderImages.map((src, i) => (<div key={i} className="flex-shrink-0 w-full h-[70vh] snap-center relative"><img src={src} alt={`R view ${i + 1}`} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black bg-opacity-20"></div></div>))}</div></section>
            <section className="py-16 md:py-24 bg-[#F8F5F2]">
              <div className="container mx-auto px-4 flex justify-center">
                <div className="max-w-md w-full">
                  <OpeningHoursCard hours={data.openingHours} />
                </div>
              </div>
            </section>
            <section className="py-16 md:py-24 bg-cover bg-center bg-fixed" style={{backgroundImage: "url('https://images.unsplash.com/photo-1598515750914-e592735b1a37?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600')"}}><div className="container mx-auto px-4 grid md:grid-cols-2 gap-8">{Object.entries(data.menu).map(([category, items]) => (<div key={category}><h3 className="text-3xl font-bold mb-6 capitalize text-white">{category}</h3>{(items as any[]).map(item => (<div key={item.name} className="mb-4 text-white"><div className="flex justify-between items-end"><h4 className="text-xl font-semibold">{item.name}</h4><p className="text-xl font-bold ml-4">{item.price}</p></div><p className="text-gray-300 text-sm">Lorem ipsum dolor sit amet.</p></div>))}</div>))}</div></section>
            <section className="bg-slate-800 text-white py-20 md:py-28"><div className="container mx-auto px-4 text-center max-w-3xl"><p className="text-3xl md:text-4xl font-bold">{t('quoteText')}</p></div></section>
            <section className="container mx-auto px-4 py-16 md:py-24"><div className="grid grid-cols-2 md:grid-cols-3 gap-4">{data.galleryImages.map((src, i) => (<div key={i} className="aspect-square overflow-hidden rounded-lg shadow-lg"><img src={src} alt={`G image ${i+1}`} className="w-full h-full object-cover hover:scale-105 transition-transform"/></div>))}</div></section>
            <section className="py-16 md:py-24 bg-[#F8F5F2]">
              <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 max-w-2xl mx-auto">{t('eventsTitle')}</h2>
                <p className="text-lg max-w-3xl mx-auto">{t('eventsText')}</p>
              </div>
            </section>
            <section className="w-full bg-black"><div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">{data.slider2Images.map((src, i) => (<div key={i} className="flex-shrink-0 w-full h-[70vh] snap-center relative"><img src={src} alt={`Slider 2 Image ${i + 1}`} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black bg-opacity-20"></div></div>))}</div></section>
        </main>
    );
};
const OpeningHoursCard = ({ hours }) => {
    const { t } = useTranslation();
    return (<div className="bg-white p-8 border border-gray-200 shadow-lg"><h3 className="text-2xl font-bold mb-6 text-center">{t('openingHours')}</h3><div className="space-y-3 text-lg text-gray-600 mb-8">{hours.map(item => (<div key={item.day} className="flex justify-between"><span>{item.day}:</span><span className="font-medium">{item.hours}</span></div>))}</div><a href="#" className="w-full text-center bg-[#075e54] hover:bg-[#054c43] text-white font-bold py-3 px-8 rounded-md">{t('reserveTable')}</a></div>);
};
const Header = ({ setPage }) => {
    const { lang, setLang, t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const [visible, setVisible] = useState(true);
    const langRef = useRef(null);
    const lastScrollY = useRef(0);
    const navItems = [ { page: 'home', label: t('navHome') }, { page: 'about', label: t('navAbout') }];
    const handleScroll = useCallback(() => { setVisible(window.scrollY <= 100 || window.scrollY < lastScrollY.current); lastScrollY.current = window.scrollY; }, []);
    useEffect(() => { window.addEventListener('scroll', handleScroll, { passive: true }); return () => window.removeEventListener('scroll', handleScroll); }, [handleScroll]);
    useEffect(() => { const handleClickOutside = (e) => { if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false); }; document.addEventListener("mousedown", handleClickOutside); return () => document.removeEventListener("mousedown", handleClickOutside); }, [langRef]);
    return (<header className={`bg-black shadow-md fixed bottom-0 w-full z-40 transition-transform ${visible ? 'translate-y-0' : 'translate-y-full'}`}>{isOpen && (<div className="absolute bottom-full w-full bg-black pb-4 border-t border-gray-700">{navItems.map(item => <a key={item.page} href="#" onClick={() => { setPage(item.page); setIsOpen(false); }} className="block text-center py-2 text-lg text-gray-300 hover:text-[#097267]">{item.label}</a>)}</div>)}
    <div className="container mx-auto px-4 h-20 flex justify-between items-center relative">
        <div className="relative" ref={langRef}>
            <button onClick={() => setLangOpen(!langOpen)} className="flex items-center text-gray-300 hover:text-[#097267]">
                <span className="mr-2 text-lg">{languageMap[lang].flag}</span>
                {languageMap[lang].short}
                <ChevronDownIcon className={`w-5 h-5 ml-1 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>
            {langOpen && (
                <div className="absolute bottom-full left-0 mb-2 py-2 w-56 bg-white rounded-md shadow-xl z-50">
                    {Object.entries(languageMap).map(([code, { name, short, flag }]) => (
                        <a key={code} href="#" onClick={(e) => { e.preventDefault(); setLang(code as LangCode); setLangOpen(false);}} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#D4E9E7] w-full">
                           <span className="mr-3 text-lg">{flag}</span>
                           <span>{short} - {name}</span>
                        </a>
                    ))}
                </div>
            )}
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <a href="#" onClick={(e) => { e.preventDefault(); setPage('home'); }}>
                <img src="https://ik.imagekit.io/j6wdxvinv/Kod%20Tunje/Menu%20logo%20Kod%20Tunje%20small%20cut%20header.png" alt="Kod Tunje Logo" className="h-16 w-auto"/>
            </a>
        </div>

        <div>
            <nav className="hidden md:flex items-center space-x-6 text-gray-300">
                {navItems.map(item => <a key={item.page} href="#" onClick={() => setPage(item.page)} className="hover:text-[#097267] font-medium">{item.label}</a>)}
            </nav>
            <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <CloseIcon className="w-8 h-8"/> : <MenuIcon className="w-8 h-8"/>}</button>
        </div>
    </div>
</header>);
};
const Footer = () => {
  const { t } = useTranslation();
  return (<footer className="bg-black text-white py-12 pb-32"><div className="container mx-auto px-4 text-center"><h3 className="text-2xl font-semibold mb-4">{t('footerDine')}</h3><p className="text-lg text-gray-400 mb-6">{t('footerAddress')}</p><a href="#" className="bg-[#075e54] hover:bg-[#054c43] text-white font-bold py-3 px-8 rounded-md mb-8">{t('footerOrder')}</a><div className="flex justify-center space-x-6 mb-8"><a href="#" className="hover:text-[#097267]"><FacebookIcon/></a><a href="#" className="hover:text-[#097267]"><InstagramIcon/></a></div><a href="/#/admin" className="text-gray-500 hover:text-gray-400">&copy; {new Date().getFullYear()} {t('logo')}. All Rights Reserved.</a></div></footer>);
};
const PublicSite = ({ data }) => {
    const [page, setPage] = useState('home');
    return (<LanguageProvider translations={data.translations}><Header setPage={setPage} /><HomePage data={data} /><Footer /></LanguageProvider>);
}

// --- MAIN APP ROUTER ---
const App = () => {
    const [route, setRoute] = useState(window.location.hash);
    const [siteData, setSiteData] = useLocalStorage('kod-tunje-data', DEFAULT_SITE_DATA);
    const [isAuthenticated, setIsAuthenticated] = useSessionStorage('isAuthenticated', false);

    useEffect(() => {
        const handleHashChange = () => setRoute(window.location.hash);
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    if (route === '#/admin') {
        if (isAuthenticated) {
            return <AdminDashboard data={siteData} onSave={setSiteData} />;
        }
        return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
    }

    return <PublicSite data={siteData} />;
};

export default App;
