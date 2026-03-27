"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [counters, setCounters] = useState({ mechanics: 0, users: 0, cities: 0, reviews: 0 });
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [heroVisible, setHeroVisible] = useState(false);
  const sceneRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setHeroVisible(true);
  }, []);

  useEffect(() => {
    const handleMouse = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!statsVisible) return;
    const targets = { mechanics: 340, users: 12000, cities: 18, reviews: 8400 };
    const duration = 2000;
    const start = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCounters({
        mechanics: Math.floor(ease * targets.mechanics),
        users: Math.floor(ease * targets.users),
        cities: Math.floor(ease * targets.cities),
        reviews: Math.floor(ease * targets.reviews),
      });
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [statsVisible]);

  const features = [
    {
      icon: "🔧",
      title: "ميكانيكيون معتمدون",
      desc: "كل ميكانيكي على المنصة مُراجَع ومعتمد من فريقنا. لا تخاطر بسيارتك مع غرباء.",
      color: "#FF6B35",
    },
    {
      icon: "📍",
      title: "ابحث بالموقع",
      desc: "اعثر على أقرب ميكانيكي لمكانك الآن. GPS دقيق، مواقع محدثة لحظياً.",
      color: "#4ECDC4",
    },
    {
      icon: "⭐",
      title: "تقييمات حقيقية",
      desc: "آراء مستخدمين حقيقيين، لا تقييمات مزيفة. اختر بثقة بناءً على تجارب الآخرين.",
      color: "#FFE66D",
    },
  ];

  const steps = [
    { num: "١", title: "سجّل حسابك", desc: "بدقيقة واحدة، أنشئ حسابك واحصل على وصول كامل للمنصة.", icon: "👤" },
    { num: "٢", title: "ابحث عن ميكانيكي", desc: "استعرض الميكانيكيين القريبين منك مع تقييماتهم ومواقعهم.", icon: "🔍" },
    { num: "٣", title: "قيّم تجربتك", desc: "بعد الخدمة، شارك تجربتك وساعد الآخرين على الاختيار الصحيح.", icon: "⭐" },
  ];

  const tiltX = mousePos.y * -8;
  const tiltY = mousePos.x * 8;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&family=Bebas+Neue&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --orange: #FF6B35;
          --orange2: #FF3D00;
          --teal: #4ECDC4;
          --yellow: #FFE66D;
          --dark: #08080E;
          --dark2: #0E0E18;
          --dark3: #141420;
          --card: #13131C;
          --card2: #1A1A28;
          --border: rgba(255,255,255,0.07);
          --border2: rgba(255,255,255,0.12);
          --text: #F0EEF8;
          --muted: #7A7A9A;
          --font: 'Tajawal', sans-serif;
        }

        html { scroll-behavior: smooth; direction: rtl; }
        body {
          background: var(--dark);
          color: var(--text);
          font-family: var(--font);
          overflow-x: hidden;
        }

        /* ===== NAV ===== */
        nav {
          position: fixed; top: 0; width: 100%; z-index: 100;
          padding: 0 5%;
          display: flex; align-items: center; justify-content: space-between;
          height: 72px;
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }
        nav.scrolled {
          background: rgba(8,8,14,0.88);
          backdrop-filter: blur(24px) saturate(1.4);
          border-bottom: 1px solid var(--border2);
          box-shadow: 0 8px 40px rgba(0,0,0,0.4);
        }
        .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .logo-icon {
          width: 42px; height: 42px; border-radius: 12px;
          background: linear-gradient(135deg, var(--orange), var(--orange2));
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          box-shadow: 0 0 24px rgba(255,107,53,0.45);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .logo-icon:hover { transform: scale(1.1) rotate(-5deg); box-shadow: 0 0 36px rgba(255,107,53,0.65); }
        .logo-text { font-weight: 900; font-size: 22px; color: var(--text); letter-spacing: -0.5px; }
        .logo-text span { color: var(--orange); }
        .nav-links { display: flex; align-items: center; gap: 32px; list-style: none; }
        .nav-links a {
          color: var(--muted); text-decoration: none; font-size: 15px; font-weight: 500;
          transition: color 0.25s;
          position: relative;
        }
        .nav-links a::after {
          content: ''; position: absolute; bottom: -4px; right: 0; left: 0;
          height: 1px; background: var(--orange);
          transform: scaleX(0); transition: transform 0.25s ease;
        }
        .nav-links a:hover { color: var(--text); }
        .nav-links a:hover::after { transform: scaleX(1); }
        .nav-cta { display: flex; gap: 12px; }
        .btn-ghost {
          padding: 9px 22px; border-radius: 10px; font-size: 14px; font-weight: 600;
          border: 1px solid var(--border2); color: var(--text); background: transparent;
          cursor: pointer; transition: all 0.25s cubic-bezier(0.23, 1, 0.32, 1);
          font-family: var(--font); text-decoration: none;
        }
        .btn-ghost:hover { border-color: var(--orange); color: var(--orange); transform: translateY(-1px); }
        .btn-primary {
          padding: 9px 22px; border-radius: 10px; font-size: 14px; font-weight: 700;
          border: none;
          background: linear-gradient(135deg, var(--orange), var(--orange2));
          color: white; cursor: pointer; transition: all 0.25s cubic-bezier(0.23, 1, 0.32, 1);
          font-family: var(--font); text-decoration: none;
          box-shadow: 0 4px 20px rgba(255,107,53,0.4);
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(255,107,53,0.55); }

        /* ===== HERO ===== */
        .hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          padding: 100px 5% 60px;
          position: relative;
          overflow: hidden;
          gap: 40px;
        }

        /* Ambient background */
        .hero-bg {
          position: absolute; inset: 0; z-index: 0;
          background:
            radial-gradient(ellipse 60% 80% at 70% 40%, rgba(255,107,53,0.1) 0%, transparent 65%),
            radial-gradient(ellipse 50% 60% at 10% 70%, rgba(78,205,196,0.06) 0%, transparent 55%),
            radial-gradient(ellipse 80% 40% at 50% 100%, rgba(255,107,53,0.04) 0%, transparent 60%);
        }
        .hero-grid {
          position: absolute; inset: 0; z-index: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size: 55px 55px;
          mask-image: radial-gradient(ellipse 90% 90% at 60% 50%, black 20%, transparent 80%);
        }

        /* ===== LEFT TEXT ===== */
        .hero-text-col {
          position: relative; z-index: 2;
          display: flex; flex-direction: column; gap: 28px;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,107,53,0.1); border: 1px solid rgba(255,107,53,0.28);
          padding: 8px 18px; border-radius: 50px;
          font-size: 13px; font-weight: 600; color: var(--orange);
          width: fit-content;
          opacity: 0; transform: translateY(-16px);
          animation: fadeDown 0.7s 0.1s cubic-bezier(0.23,1,0.32,1) forwards;
        }
        .hero-badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--orange); animation: pulse 1.8s infinite;
        }
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.4; transform:scale(1.5); }
        }
        .hero-title {
          font-weight: 900;
          font-size: clamp(40px, 5.5vw, 78px);
          line-height: 1.05; letter-spacing: -2px;
          opacity: 0; transform: translateY(28px);
          animation: fadeUp 0.8s 0.25s cubic-bezier(0.23,1,0.32,1) forwards;
        }
        .hero-title .line1 { display: block; color: var(--text); }
        .hero-title .line2 {
          display: block;
          background: linear-gradient(100deg, var(--orange) 0%, #FF3D00 45%, var(--yellow) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .hero-title .line3 { display: block; color: var(--teal); }
        .hero-sub {
          font-size: clamp(15px, 1.8vw, 18px); color: var(--muted);
          line-height: 1.75; font-weight: 400; max-width: 480px;
          opacity: 0; transform: translateY(20px);
          animation: fadeUp 0.8s 0.4s cubic-bezier(0.23,1,0.32,1) forwards;
        }
        .hero-actions {
          display: flex; gap: 14px; flex-wrap: wrap;
          opacity: 0; transform: translateY(20px);
          animation: fadeUp 0.8s 0.55s cubic-bezier(0.23,1,0.32,1) forwards;
        }
        .btn-xl {
          padding: 16px 34px; border-radius: 14px; font-size: 16px; font-weight: 700;
          background: linear-gradient(135deg, var(--orange), var(--orange2));
          color: white; border: none; cursor: pointer; font-family: var(--font);
          text-decoration: none; display: inline-block;
          box-shadow: 0 6px 30px rgba(255,107,53,0.42);
          transition: all 0.3s cubic-bezier(0.23,1,0.32,1);
          position: relative; overflow: hidden;
        }
        .btn-xl::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0; transition: opacity 0.3s;
        }
        .btn-xl:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 14px 44px rgba(255,107,53,0.55); }
        .btn-xl:hover::before { opacity: 1; }
        .btn-xl-outline {
          padding: 16px 34px; border-radius: 14px; font-size: 16px; font-weight: 700;
          background: rgba(255,255,255,0.04); color: var(--text); font-family: var(--font);
          border: 1.5px solid var(--border2); cursor: pointer; text-decoration: none; display: inline-block;
          transition: all 0.3s cubic-bezier(0.23,1,0.32,1);
          backdrop-filter: blur(8px);
        }
        .btn-xl-outline:hover { border-color: var(--teal); color: var(--teal); transform: translateY(-2px); background: rgba(78,205,196,0.05); }

        /* ===== 3D SCENE ===== */
        .hero-scene-col {
          position: relative; z-index: 2;
          display: flex; align-items: center; justify-content: center;
          opacity: 0; animation: fadeUp 1s 0.3s cubic-bezier(0.23,1,0.32,1) forwards;
        }
        .scene-3d-wrapper {
          width: 100%; max-width: 580px;
          perspective: 1200px;
          perspective-origin: 50% 50%;
        }
        .scene-3d {
          width: 100%;
          transform-style: preserve-3d;
          transition: transform 0.15s ease-out;
        }
        .scene-svg-container {
          width: 100%;
          filter: drop-shadow(0 40px 80px rgba(255,107,53,0.22)) drop-shadow(0 0 120px rgba(78,205,196,0.1));
        }

        /* Glow orbs behind scene */
        .scene-glow {
          position: absolute; border-radius: 50%;
          pointer-events: none; filter: blur(80px);
        }
        .sg1 {
          width: 340px; height: 340px;
          background: radial-gradient(circle, rgba(255,107,53,0.18), transparent 70%);
          top: 10%; left: 5%;
          animation: orbFloat 6s ease-in-out infinite;
        }
        .sg2 {
          width: 260px; height: 260px;
          background: radial-gradient(circle, rgba(78,205,196,0.12), transparent 70%);
          bottom: 5%; right: 10%;
          animation: orbFloat 8s 2s ease-in-out infinite reverse;
        }
        @keyframes orbFloat {
          0%,100% { transform: translate(0,0); }
          50% { transform: translate(20px, -20px); }
        }

        /* Wrench spin badge */
        .scene-badge-live {
          position: absolute; top: 8%; left: -8%;
          background: var(--card2); border: 1px solid rgba(78,205,196,0.3);
          border-radius: 14px; padding: 12px 16px;
          display: flex; align-items: center; gap: 10px;
          font-size: 13px; font-weight: 600;
          box-shadow: 0 16px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(78,205,196,0.1);
          animation: floatBadge1 4.5s ease-in-out infinite;
          backdrop-filter: blur(16px);
          white-space: nowrap;
        }
        .scene-badge-rating {
          position: absolute; bottom: 12%; right: -6%;
          background: var(--card2); border: 1px solid rgba(255,230,109,0.3);
          border-radius: 14px; padding: 12px 16px;
          display: flex; align-items: center; gap: 10px;
          font-size: 13px; font-weight: 600;
          box-shadow: 0 16px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,230,109,0.1);
          animation: floatBadge2 5s 1s ease-in-out infinite;
          backdrop-filter: blur(16px);
          white-space: nowrap;
        }
        @keyframes floatBadge1 {
          0%,100% { transform: translateY(0) rotate(-1.5deg); }
          50% { transform: translateY(-12px) rotate(1deg); }
        }
        @keyframes floatBadge2 {
          0%,100% { transform: translateY(0) rotate(1.5deg); }
          50% { transform: translateY(-10px) rotate(-1deg); }
        }
        .badge-dot-live {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--teal);
          box-shadow: 0 0 10px var(--teal);
          animation: pulse 1.4s infinite;
        }
        .badge-stars { color: var(--yellow); font-size: 11px; letter-spacing: 1px; }
        .badge-label { color: var(--muted); font-size: 11px; }
        .badge-val { color: var(--text); font-weight: 800; }

        /* Scroll hint */
        .hero-scroll-hint {
          display: flex; flex-direction: column; align-items: flex-start; gap: 8px;
          color: var(--muted); font-size: 12px;
          opacity: 0; animation: fadeUp 0.8s 0.9s ease forwards;
        }
        .scroll-line {
          width: 1px; height: 38px;
          background: linear-gradient(var(--orange), transparent);
          animation: scrollPulse 2.2s infinite;
        }
        @keyframes scrollPulse {
          0% { opacity: 0.2; transform: scaleY(0.4); }
          50% { opacity: 1; transform: scaleY(1); }
          100% { opacity: 0.2; transform: scaleY(0.4); }
        }

        /* ===== STATS ===== */
        .stats-section {
          padding: 80px 5%;
          background: linear-gradient(180deg, var(--dark) 0%, var(--dark2) 100%);
          position: relative; z-index: 1;
        }
        .stats-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px;
          background: var(--border);
          border-radius: 22px; overflow: hidden;
          border: 1px solid var(--border);
          max-width: 1100px; margin: 0 auto;
        }
        .stat-item {
          background: var(--card);
          padding: 44px 28px; text-align: center;
          transition: background 0.3s ease, transform 0.3s ease;
          position: relative; overflow: hidden;
        }
        .stat-item::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, var(--orange), transparent);
          opacity: 0; transition: opacity 0.3s;
        }
        .stat-item:hover { background: var(--dark3); }
        .stat-item:hover::before { opacity: 1; }
        .stat-num {
          font-weight: 900;
          font-size: clamp(36px, 4vw, 54px);
          line-height: 1;
          background: linear-gradient(135deg, var(--orange), var(--yellow));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .stat-suffix { font-size: 0.55em; }
        .stat-label { color: var(--muted); font-size: 14px; margin-top: 10px; font-weight: 500; }

        /* ===== FEATURES ===== */
        .features-section { padding: 110px 5%; position: relative; z-index: 1; }
        .features-inner {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center;
        }
        .features-text { display: flex; flex-direction: column; gap: 0; }
        .feature-tab {
          border-right: 2px solid var(--border);
          padding: 28px 32px 28px 0;
          cursor: pointer; transition: all 0.35s cubic-bezier(0.23,1,0.32,1);
        }
        .feature-tab.active { border-right-color: var(--orange); }
        .feature-tab-title {
          font-size: 20px; font-weight: 800; color: var(--muted);
          display: flex; align-items: center; gap: 12px;
          transition: color 0.3s;
        }
        .feature-tab.active .feature-tab-title { color: var(--text); }
        .feature-tab-desc {
          font-size: 15px; color: var(--muted); line-height: 1.7;
          margin-top: 10px; max-height: 0; overflow: hidden;
          transition: max-height 0.5s cubic-bezier(0.23,1,0.32,1), opacity 0.35s;
          opacity: 0;
        }
        .feature-tab.active .feature-tab-desc { max-height: 120px; opacity: 1; }
        .features-visual {
          background: var(--card); border: 1px solid var(--border);
          border-radius: 28px; padding: 48px; text-align: center;
          position: relative; overflow: hidden;
          min-height: 320px; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 20px;
          transition: border-color 0.4s;
        }
        .features-visual:hover { border-color: rgba(255,107,53,0.25); }
        .features-visual::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse 70% 70% at 50% 0%, rgba(255,107,53,0.09), transparent);
          pointer-events: none;
        }
        .feature-emoji {
          font-size: 72px;
          animation: featurePop 0.45s cubic-bezier(0.34,1.56,0.64,1);
          display: block;
        }
        @keyframes featurePop {
          from { transform: scale(0.6) rotate(-10deg); opacity: 0; }
          to { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .feature-visual-title { font-size: 24px; font-weight: 800; transition: color 0.4s; }
        .feature-visual-desc { font-size: 15px; color: var(--muted); max-width: 260px; line-height: 1.6; }
        .feature-visual-dot {
          width: 10px; height: 10px; border-radius: 50%;
          background: var(--orange); box-shadow: 0 0 20px var(--orange);
          position: absolute; top: 24px; left: 24px; animation: pulse 2s infinite;
        }

        /* section labels */
        section { position: relative; z-index: 1; }
        .section-label {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 12px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase;
          color: var(--orange); margin-bottom: 16px;
        }
        .section-label::before {
          content: ''; display: block; width: 24px; height: 2px; background: var(--orange);
        }
        .section-title {
          font-size: clamp(30px, 4vw, 50px); font-weight: 900;
          line-height: 1.1; letter-spacing: -1.5px; color: var(--text);
          margin-bottom: 16px;
        }
        .section-sub { font-size: 17px; color: var(--muted); max-width: 520px; line-height: 1.7; }

        /* ===== STEPS ===== */
        .steps-section {
          padding: 110px 5%;
          background: linear-gradient(180deg, var(--dark2), var(--dark3));
        }
        .steps-inner { max-width: 1100px; margin: 0 auto; }
        .steps-header { text-align: center; margin-bottom: 64px; }
        .steps-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; position: relative;
        }
        .steps-grid::before {
          content: '';
          position: absolute; top: 52px; right: calc(33.3% + 24px); left: calc(33.3% + 24px);
          height: 1px; background: linear-gradient(90deg, var(--orange), var(--teal));
          z-index: 0;
        }
        .step-card {
          background: var(--card); border: 1px solid var(--border);
          border-radius: 22px; padding: 36px 28px;
          text-align: center; position: relative;
          transition: transform 0.4s cubic-bezier(0.23,1,0.32,1), border-color 0.3s, box-shadow 0.4s;
        }
        .step-card:hover {
          transform: translateY(-8px);
          border-color: rgba(255,107,53,0.35);
          box-shadow: 0 24px 60px rgba(0,0,0,0.35), 0 0 40px rgba(255,107,53,0.08);
        }
        .step-num {
          width: 52px; height: 52px; border-radius: 50%;
          background: linear-gradient(135deg, var(--orange), var(--orange2));
          color: white; font-size: 22px; font-weight: 900;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px; position: relative; z-index: 1;
          box-shadow: 0 4px 24px rgba(255,107,53,0.45);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .step-card:hover .step-num {
          transform: scale(1.1);
          box-shadow: 0 8px 32px rgba(255,107,53,0.6);
        }
        .step-icon { font-size: 32px; margin-bottom: 12px; }
        .step-title { font-size: 20px; font-weight: 800; margin-bottom: 10px; }
        .step-desc { font-size: 14px; color: var(--muted); line-height: 1.7; }

        /* ===== WHO ===== */
        .who-section { padding: 110px 5%; }
        .who-inner { max-width: 1100px; margin: 0 auto; }
        .who-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 56px; }
        .who-card {
          background: var(--card); border: 1px solid var(--border);
          border-radius: 28px; padding: 44px;
          transition: transform 0.4s cubic-bezier(0.23,1,0.32,1), border-color 0.3s, box-shadow 0.4s;
          position: relative; overflow: hidden;
        }
        .who-card:hover { transform: translateY(-8px); box-shadow: 0 32px 80px rgba(0,0,0,0.4); }
        .who-card.user-card { border-color: rgba(78,205,196,0.2); }
        .who-card.user-card:hover { border-color: rgba(78,205,196,0.5); box-shadow: 0 32px 80px rgba(0,0,0,0.4), 0 0 60px rgba(78,205,196,0.06); }
        .who-card.mech-card { border-color: rgba(255,107,53,0.2); }
        .who-card.mech-card:hover { border-color: rgba(255,107,53,0.5); box-shadow: 0 32px 80px rgba(0,0,0,0.4), 0 0 60px rgba(255,107,53,0.06); }
        .who-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
        }
        .user-card::before { background: linear-gradient(90deg, var(--teal), transparent); }
        .mech-card::before { background: linear-gradient(90deg, var(--orange), transparent); }
        .who-icon { font-size: 52px; margin-bottom: 20px; }
        .who-title { font-size: 26px; font-weight: 900; margin-bottom: 12px; }
        .who-sub { font-size: 15px; color: var(--muted); line-height: 1.7; margin-bottom: 28px; }
        .who-list { list-style: none; display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
        .who-list li { display: flex; align-items: center; gap: 10px; font-size: 15px; font-weight: 500; }
        .who-list li::before { content: '✓'; color: var(--teal); font-weight: 900; }
        .mech-card .who-list li::before { content: '✓'; color: var(--orange); }
        .who-btn {
          display: inline-block; padding: 14px 28px; border-radius: 12px;
          font-size: 15px; font-weight: 700; text-decoration: none; font-family: var(--font);
          transition: all 0.3s cubic-bezier(0.23,1,0.32,1);
        }
        .user-card .who-btn {
          background: rgba(78,205,196,0.1); color: var(--teal);
          border: 1.5px solid rgba(78,205,196,0.35);
        }
        .user-card .who-btn:hover { background: var(--teal); color: var(--dark); transform: translateY(-2px); }
        .mech-card .who-btn {
          background: rgba(255,107,53,0.1); color: var(--orange);
          border: 1.5px solid rgba(255,107,53,0.35);
        }
        .mech-card .who-btn:hover { background: var(--orange); color: white; transform: translateY(-2px); }

        /* ===== CTA ===== */
        .cta-section {
          padding: 110px 5%;
          background: linear-gradient(180deg, var(--dark3), var(--dark));
        }
        .cta-inner {
          max-width: 820px; margin: 0 auto; text-align: center;
          background: var(--card); border: 1px solid var(--border);
          border-radius: 36px; padding: 80px 60px;
          position: relative; overflow: hidden;
          transition: border-color 0.4s;
        }
        .cta-inner:hover { border-color: rgba(255,107,53,0.2); }
        .cta-inner::before {
          content: ''; position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 90% 70% at 50% -10%, rgba(255,107,53,0.13), transparent),
            radial-gradient(ellipse 60% 60% at 110% 110%, rgba(78,205,196,0.07), transparent);
          pointer-events: none;
        }
        .cta-title {
          font-size: clamp(32px, 4.5vw, 54px); font-weight: 900;
          letter-spacing: -1.5px; margin-bottom: 16px; position: relative;
        }
        .cta-sub { font-size: 17px; color: var(--muted); margin-bottom: 40px; line-height: 1.7; position: relative; }
        .cta-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; position: relative; }
        .cta-note { font-size: 13px; color: var(--muted); margin-top: 20px; position: relative; }

        /* ===== FOOTER ===== */
        footer {
          padding: 48px 5%; border-top: 1px solid var(--border);
          background: var(--dark);
        }
        .footer-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 24px;
        }
        .footer-copy { font-size: 14px; color: var(--muted); }
        .footer-links { display: flex; gap: 28px; }
        .footer-links a { font-size: 14px; color: var(--muted); text-decoration: none; transition: color 0.25s; }
        .footer-links a:hover { color: var(--text); }

        /* ===== ANIMATIONS ===== */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* SVG 3D scene animations */
        .car-body { animation: carBob 4s ease-in-out infinite; }
        @keyframes carBob {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .wheel-fl { animation: wheelSpin 2s linear infinite; transform-origin: 114px 285px; }
        .wheel-rl { animation: wheelSpin 2s linear infinite; transform-origin: 370px 285px; }
        @keyframes wheelSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .mechanic-arm { animation: armWork 0.8s ease-in-out infinite alternate; transform-origin: 420px 200px; }
        @keyframes armWork {
          from { transform: rotate(-15deg); }
          to { transform: rotate(12deg); }
        }
        .wrench { animation: wrenchBob 0.8s ease-in-out infinite alternate; transform-origin: 455px 220px; }
        @keyframes wrenchBob {
          from { transform: rotate(-20deg) translate(0, 0); }
          to { transform: rotate(15deg) translate(5px, -5px); }
        }
        .spark1 { animation: sparkAnim 0.6s 0.1s ease-in-out infinite alternate; }
        .spark2 { animation: sparkAnim 0.6s 0.25s ease-in-out infinite alternate; }
        .spark3 { animation: sparkAnim 0.6s ease-in-out infinite alternate; }
        @keyframes sparkAnim {
          from { opacity: 0; transform: scale(0.5) translate(-3px, 3px); }
          to { opacity: 1; transform: scale(1.2) translate(3px, -3px); }
        }
        .toolbox-shine { animation: shineMove 3s ease-in-out infinite; }
        @keyframes shineMove {
          0%,100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        .exhaust1 { animation: exhaust 1.5s ease-out infinite; transform-origin: 60px 260px; }
        .exhaust2 { animation: exhaust 1.5s 0.5s ease-out infinite; transform-origin: 60px 260px; }
        @keyframes exhaust {
          from { opacity: 0.6; transform: scale(0.5) translateX(0); }
          to { opacity: 0; transform: scale(1.8) translateX(-30px); }
        }
        .ground-shadow { animation: shadowPulse 4s ease-in-out infinite; }
        @keyframes shadowPulse {
          0%,100% { rx: 140; opacity: 0.35; }
          50% { rx: 130; opacity: 0.25; }
        }
        .diagnostic-blink { animation: diagBlink 1.2s ease-in-out infinite; }
        @keyframes diagBlink {
          0%,100% { opacity: 1; }
          50% { opacity: 0.2; }
        }

        /* Mobile */
        .hamburger { display: none; background: none; border: none; color: var(--text); font-size: 24px; cursor: pointer; }
        @media (max-width: 1000px) {
          .hero { grid-template-columns: 1fr; padding: 120px 5% 80px; text-align: center; }
          .hero-text-col { align-items: center; }
          .hero-sub { text-align: center; }
          .hero-scroll-hint { align-items: center; }
          .hero-scene-col { margin-top: 20px; }
          .scene-badge-live { left: 0; top: -5%; }
          .scene-badge-rating { right: 0; }
        }
        @media (max-width: 900px) {
          .nav-links, .nav-cta { display: none; }
          .hamburger { display: block; }
          .features-inner { grid-template-columns: 1fr; gap: 40px; }
          .steps-grid { grid-template-columns: 1fr; gap: 16px; }
          .steps-grid::before { display: none; }
          .who-grid { grid-template-columns: 1fr; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .cta-inner { padding: 48px 28px; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr 1fr; }
          .hero-actions { flex-direction: column; }
          .btn-xl, .btn-xl-outline { width: 100%; text-align: center; }
        }
      `}</style>

      {/* NAV */}
      <nav className={scrollY > 40 ? "scrolled" : ""}>
        <Link href="/" className="nav-logo">
          <div className="logo-icon">🔧</div>
          <span className="logo-text">يلا <span>ميكانيكي</span></span>
        </Link>
        <ul className="nav-links">
          <li><a href="#features">المميزات</a></li>
          <li><a href="#how">كيف يعمل</a></li>
          <li><a href="#for-who">لمن المنصة</a></li>
        </ul>
        <div className="nav-cta">
          <Link href="/auth" className="btn-ghost">تسجيل الدخول</Link>
          <Link href="/auth" className="btn-primary">انضم الآن</Link>
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />

        {/* LEFT: Text */}
        <div className="hero-text-col">
          <div className="hero-badge">
            <div className="hero-badge-dot" />
            المنصة الأولى للميكانيكيين في المنطقة
          </div>

          <h1 className="hero-title">
            <span className="line1">سيارتك تعطّلت؟</span>
            <span className="line2">يلا ميكانيكي</span>
            <span className="line3">بأقرب وقت</span>
          </h1>

          <p className="hero-sub">
            ابحث عن أفضل الميكانيكيين المعتمدين في منطقتك، قارن التقييمات، وتواصل معهم مباشرة. سريع، موثوق، وشفاف.
          </p>

          <div className="hero-actions">
            <Link href="/auth" className="btn-xl">ابدأ الآن مجاناً ←</Link>
            <a href="#how" className="btn-xl-outline">كيف يعمل التطبيق</a>
          </div>

          <div className="hero-scroll-hint">
            <div className="scroll-line" />
            <span>اسحب للأسفل</span>
          </div>
        </div>

        {/* RIGHT: 3D Scene */}
        <div className="hero-scene-col">
          <div className="scene-glow sg1" />
          <div className="scene-glow sg2" />

          {/* Live badge */}
          <div className="scene-badge-live">
            <div className="badge-dot-live" />
            <div>
              <div className="badge-label">ميكانيكيون متاحون الآن</div>
              <div className="badge-val">١٢ ميكانيكي قريب منك</div>
            </div>
          </div>

          {/* Rating badge */}
          <div className="scene-badge-rating">
            <span style={{ fontSize: 22 }}>⭐</span>
            <div>
              <div className="badge-stars">★★★★★</div>
              <div className="badge-val">4.9 / 5.0</div>
            </div>
          </div>

          <div className="scene-3d-wrapper">
            <div
              className="scene-3d"
              style={{
                transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
              }}
            >
              <svg
                className="scene-svg-container"
                viewBox="0 0 560 340"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Car body gradient */}
                  <linearGradient id="carBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2A2A3A" />
                    <stop offset="50%" stopColor="#1E1E2E" />
                    <stop offset="100%" stopColor="#141420" />
                  </linearGradient>
                  {/* Car roof gradient */}
                  <linearGradient id="carRoofGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3A3A4E" />
                    <stop offset="100%" stopColor="#252535" />
                  </linearGradient>
                  {/* Car hood shine */}
                  <linearGradient id="hoodShine" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255,107,53,0.3)" />
                    <stop offset="40%" stopColor="rgba(255,255,255,0.12)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                  </linearGradient>
                  {/* Wheel gradient */}
                  <radialGradient id="wheelGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#3A3A4E" />
                    <stop offset="70%" stopColor="#1A1A2A" />
                    <stop offset="100%" stopColor="#0D0D18" />
                  </radialGradient>
                  {/* Tire gradient */}
                  <radialGradient id="tireGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#2A2A35" />
                    <stop offset="85%" stopColor="#0A0A12" />
                    <stop offset="100%" stopColor="#050508" />
                  </radialGradient>
                  {/* Ground gradient */}
                  <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1A1A28" />
                    <stop offset="100%" stopColor="#0A0A15" />
                  </linearGradient>
                  {/* Orange glow */}
                  <radialGradient id="engineGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#FF3D00" stopOpacity="0" />
                  </radialGradient>
                  {/* Headlight glow */}
                  <radialGradient id="headGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFE66D" stopOpacity="1" />
                    <stop offset="100%" stopColor="#FF9A3C" stopOpacity="0" />
                  </radialGradient>
                  {/* Glass tint */}
                  <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4ECDC4" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2A4A6A" stopOpacity="0.45" />
                  </linearGradient>
                  {/* Mechanic skin */}
                  <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#D4956A" />
                    <stop offset="100%" stopColor="#B87A52" />
                  </linearGradient>
                  {/* Mechanic uniform */}
                  <linearGradient id="uniformGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2D4A6A" />
                    <stop offset="100%" stopColor="#1A2E42" />
                  </linearGradient>
                  {/* Wrench metal */}
                  <linearGradient id="wrenchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9AABB8" />
                    <stop offset="50%" stopColor="#C8D8E4" />
                    <stop offset="100%" stopColor="#7A8D9A" />
                  </linearGradient>
                  {/* Ground floor */}
                  <linearGradient id="floorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1C1C28" />
                    <stop offset="100%" stopColor="#101018" />
                  </linearGradient>
                  {/* Tool box */}
                  <linearGradient id="toolboxGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#CC3300" />
                    <stop offset="100%" stopColor="#881F00" />
                  </linearGradient>
                  {/* filter for glow */}
                  <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="sparksGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* === FLOOR === */}
                <ellipse cx="280" cy="315" rx="260" ry="18" fill="url(#floorGrad)" opacity="0.7" />
                {/* Floor line details */}
                <line x1="50" y1="310" x2="510" y2="310" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                <line x1="80" y1="316" x2="480" y2="316" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

                {/* === GROUND SHADOW === */}
                <ellipse className="ground-shadow" cx="250" cy="308" rx="140" ry="12" fill="rgba(0,0,0,0.5)" />

                {/* === ENGINE GLOW === */}
                <ellipse cx="165" cy="258" rx="45" ry="28" fill="url(#engineGlow)" opacity="0.25" filter="url(#softGlow)" />

                {/* === EXHAUST CLOUDS === */}
                <circle className="exhaust1" cx="60" cy="268" r="12" fill="rgba(120,120,150,0.25)" />
                <circle className="exhaust2" cx="55" cy="262" r="8" fill="rgba(100,100,130,0.2)" />

                {/* === CAR GROUP (bobbing) === */}
                <g className="car-body">

                  {/* --- REAR BUMPER --- */}
                  <rect x="58" y="252" width="28" height="22" rx="5" fill="#1A1A28" />
                  <rect x="62" y="256" width="20" height="8" rx="3" fill="#252535" />
                  {/* Tail light */}
                  <rect x="65" y="256" width="14" height="6" rx="2" fill="#FF3D00" opacity="0.85" filter="url(#glowFilter)" />

                  {/* --- MAIN BODY LOWER --- */}
                  <rect x="82" y="230" width="340" height="52" rx="8" fill="url(#carBodyGrad)" />

                  {/* --- DOOR PANEL DETAIL --- */}
                  <rect x="130" y="238" width="88" height="36" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
                  <rect x="228" y="238" width="88" height="36" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
                  {/* Door handles */}
                  <rect x="195" y="251" width="14" height="4" rx="2" fill="rgba(255,255,255,0.15)" />
                  <rect x="293" y="251" width="14" height="4" rx="2" fill="rgba(255,255,255,0.15)" />

                  {/* --- HOOD (slant) --- */}
                  <path d="M 330 230 L 420 230 L 430 200 L 340 200 Z" fill="url(#carBodyGrad)" />
                  <path d="M 330 230 L 420 230 L 430 200 L 340 200 Z" fill="url(#hoodShine)" />
                  {/* Hood crease */}
                  <line x1="375" y1="200" x2="373" y2="230" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" />

                  {/* --- FRONT BUMPER --- */}
                  <path d="M 422 230 L 456 235 L 456 255 L 422 252 Z" fill="#1C1C2C" rx="4" />
                  <rect x="424" y="243" width="28" height="7" rx="3" fill="#252535" />

                  {/* --- HEADLIGHT --- */}
                  <ellipse cx="445" cy="237" rx="12" ry="7" fill="#FFE66D" opacity="0.9" filter="url(#glowFilter)" />
                  <ellipse cx="445" cy="237" rx="8" ry="4" fill="white" opacity="0.9" />
                  {/* Headlight beam */}
                  <path d="M 455 234 L 530 218 L 530 244 L 455 242 Z" fill="rgba(255,230,109,0.07)" />

                  {/* --- ROOF / CABIN --- */}
                  <path d="M 128 230 L 152 170 L 320 165 L 340 200 L 340 230 Z" fill="url(#carRoofGrad)" />
                  {/* Roof shine */}
                  <path d="M 155 173 L 170 170 L 310 165 L 320 168 L 180 178 Z" fill="rgba(255,255,255,0.06)" />

                  {/* --- WINDSHIELD (front) --- */}
                  <path d="M 310 167 L 338 200 L 338 230 L 306 230 L 295 196 Z" fill="url(#glassGrad)" stroke="rgba(78,205,196,0.15)" strokeWidth="1" />
                  {/* Windshield reflection */}
                  <path d="M 313 172 L 322 187 L 310 185 Z" fill="rgba(255,255,255,0.12)" />

                  {/* --- REAR WINDSHIELD --- */}
                  <path d="M 154 173 L 175 195 L 175 230 L 148 230 L 132 204 Z" fill="url(#glassGrad)" stroke="rgba(78,205,196,0.12)" strokeWidth="1" />

                  {/* --- SIDE WINDOWS --- */}
                  <path d="M 176 172 L 285 168 L 292 195 L 176 198 Z" fill="url(#glassGrad)" stroke="rgba(78,205,196,0.1)" strokeWidth="0.8" />
                  {/* window reflection */}
                  <path d="M 180 174 L 230 172 L 232 180 L 180 183 Z" fill="rgba(255,255,255,0.08)" />

                  {/* --- ROOF RACK DETAILS --- */}
                  <rect x="200" y="164" width="80" height="3" rx="1.5" fill="rgba(255,255,255,0.08)" />

                  {/* --- SIDE SKIRT --- */}
                  <rect x="120" y="272" width="290" height="10" rx="3" fill="#111118" />
                  <line x1="120" y1="275" x2="410" y2="275" stroke="rgba(255,107,53,0.3)" strokeWidth="1" />

                  {/* Hood badge / emblem */}
                  <circle cx="380" cy="215" r="8" fill="#1A1A28" stroke="var(--orange)" strokeWidth="1.5" />
                  <text x="380" y="219" textAnchor="middle" fontSize="8" fill="#FF6B35" fontWeight="bold">م</text>

                </g>

                {/* === FRONT WHEEL === */}
                <g className="wheel-fl">
                  {/* Tire */}
                  <circle cx="380" cy="290" r="32" fill="url(#tireGrad)" />
                  {/* Tire tread */}
                  <circle cx="380" cy="290" r="32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" strokeDasharray="8,6" />
                  {/* Rim */}
                  <circle cx="380" cy="290" r="22" fill="url(#wheelGrad)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                  {/* Spokes */}
                  {[0, 72, 144, 216, 288].map((angle) => (
                    <line
                      key={angle}
                      x1={380 + Math.cos((angle * Math.PI) / 180) * 8}
                      y1={290 + Math.sin((angle * Math.PI) / 180) * 8}
                      x2={380 + Math.cos((angle * Math.PI) / 180) * 20}
                      y2={290 + Math.sin((angle * Math.PI) / 180) * 20}
                      stroke="rgba(200,210,220,0.45)"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  ))}
                  {/* Hub cap */}
                  <circle cx="380" cy="290" r="7" fill="#2A2A3A" stroke="rgba(255,107,53,0.6)" strokeWidth="1.5" />
                  <circle cx="380" cy="290" r="3" fill="#FF6B35" />
                </g>

                {/* === REAR WHEEL === */}
                <g className="wheel-rl">
                  {/* Tire */}
                  <circle cx="130" cy="290" r="32" fill="url(#tireGrad)" />
                  <circle cx="130" cy="290" r="32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" strokeDasharray="8,6" />
                  {/* Rim */}
                  <circle cx="130" cy="290" r="22" fill="url(#wheelGrad)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                  {/* Spokes */}
                  {[0, 72, 144, 216, 288].map((angle) => (
                    <line
                      key={angle}
                      x1={130 + Math.cos((angle * Math.PI) / 180) * 8}
                      y1={290 + Math.sin((angle * Math.PI) / 180) * 8}
                      x2={130 + Math.cos((angle * Math.PI) / 180) * 20}
                      y2={290 + Math.sin((angle * Math.PI) / 180) * 20}
                      stroke="rgba(200,210,220,0.45)"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  ))}
                  <circle cx="130" cy="290" r="7" fill="#2A2A3A" stroke="rgba(255,107,53,0.6)" strokeWidth="1.5" />
                  <circle cx="130" cy="290" r="3" fill="#FF6B35" />
                </g>

                {/* === MECHANIC === */}
                <g>
                  {/* Shadow */}
                  <ellipse cx="468" cy="312" rx="30" ry="7" fill="rgba(0,0,0,0.4)" />

                  {/* Legs */}
                  <rect x="450" y="265" width="14" height="45" rx="5" fill="#1F3050" />
                  <rect x="468" y="265" width="14" height="45" rx="5" fill="#1A2840" />
                  {/* Boots */}
                  <rect x="448" y="302" width="18" height="10" rx="3" fill="#1A1A25" />
                  <rect x="466" y="302" width="18" height="10" rx="3" fill="#141420" />

                  {/* Torso */}
                  <rect x="443" y="210" width="46" height="60" rx="10" fill="url(#uniformGrad)" />
                  {/* Uniform pocket */}
                  <rect x="448" y="225" width="14" height="10" rx="2" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                  {/* Logo patch */}
                  <circle cx="474" cy="222" r="6" fill="rgba(255,107,53,0.3)" stroke="var(--orange)" strokeWidth="1" />
                  <text x="474" y="226" textAnchor="middle" fontSize="6" fill="#FF6B35" fontWeight="bold">م</text>
                  {/* Collar */}
                  <path d="M 455 210 L 466 218 L 477 210" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />

                  {/* LEFT ARM (resting) */}
                  <path d="M 443 218 L 432 250 L 440 255 L 449 225" fill="#1F3050" rx="6" />
                  <circle cx="435" cy="253" r="7" fill="url(#skinGrad)" />

                  {/* RIGHT ARM (working - animated) */}
                  <g className="mechanic-arm">
                    <path d="M 489 218 L 500 235 L 508 228 L 495 212" fill="#1A2840" />
                    <circle cx="504" cy="232" r="7" fill="url(#skinGrad)" />
                    {/* Wrench in hand */}
                    <g className="wrench">
                      {/* Wrench handle */}
                      <rect x="500" y="224" width="5" height="30" rx="2.5" fill="url(#wrenchGrad)" transform="rotate(-30 502 240)" />
                      {/* Wrench head top */}
                      <ellipse cx="498" cy="222" rx="7" ry="5" fill="url(#wrenchGrad)" transform="rotate(-30 502 240)" />
                      {/* Wrench head opening */}
                      <ellipse cx="498" cy="222" rx="3.5" ry="2.5" fill="#1A1A28" transform="rotate(-30 502 240)" />
                      {/* Wrench bottom head */}
                      <ellipse cx="506" cy="246" rx="5" ry="4" fill="url(#wrenchGrad)" transform="rotate(-30 502 240)" />
                    </g>
                  </g>

                  {/* Head */}
                  <circle cx="466" cy="200" r="20" fill="url(#skinGrad)" />
                  {/* Hair */}
                  <path d="M 448 195 Q 452 178 466 178 Q 480 178 484 195 Q 476 188 466 188 Q 456 188 448 195 Z" fill="#2A1A0A" />
                  {/* Ear */}
                  <ellipse cx="447" cy="202" rx="4" ry="5" fill="#C0845A" />
                  <ellipse cx="485" cy="202" rx="4" ry="5" fill="#C0845A" />
                  {/* Eyes */}
                  <ellipse cx="460" cy="200" rx="3.5" ry="4" fill="#1A0E06" />
                  <ellipse cx="472" cy="200" rx="3.5" ry="4" fill="#1A0E06" />
                  <circle cx="461" cy="199" r="1.2" fill="white" />
                  <circle cx="473" cy="199" r="1.2" fill="white" />
                  {/* Eyebrows (focused) */}
                  <path d="M 457 194 L 464 195" stroke="#2A1A0A" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 469 195 L 476 194" stroke="#2A1A0A" strokeWidth="2" strokeLinecap="round" />
                  {/* Mouth (slight smile) */}
                  <path d="M 461 208 Q 466 212 471 208" fill="none" stroke="#8B5A3A" strokeWidth="1.5" strokeLinecap="round" />
                  {/* Safety helmet */}
                  <path d="M 447 196 Q 447 178 466 176 Q 485 178 485 196 Z" fill="#FF6B35" />
                  <rect x="444" y="193" width="44" height="5" rx="2.5" fill="#CC4A1A" />
                  {/* Helmet brim line */}
                  <path d="M 448 196 Q 466 190 484 196" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

                </g>

                {/* === TOOLBOX === */}
                <g>
                  {/* Box body */}
                  <rect x="505" y="260" width="45" height="38" rx="5" fill="url(#toolboxGrad)" />
                  <rect x="505" y="260" width="45" height="38" rx="5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                  {/* Lid */}
                  <rect x="503" y="256" width="49" height="12" rx="4" fill="#E03A00" />
                  {/* Handle */}
                  <path d="M 518 256 Q 527 248 537 256" fill="none" stroke="#C03000" strokeWidth="3" strokeLinecap="round" />
                  {/* Shine */}
                  <rect className="toolbox-shine" x="508" y="258" width="18" height="3" rx="1.5" fill="rgba(255,255,255,0.35)" />
                  {/* Drawer lines */}
                  <line x1="507" y1="273" x2="548" y2="273" stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
                  <line x1="507" y1="283" x2="548" y2="283" stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
                  {/* Drawer handles */}
                  <rect x="520" y="275" width="15" height="3" rx="1.5" fill="rgba(255,200,100,0.5)" />
                  <rect x="520" y="285" width="15" height="3" rx="1.5" fill="rgba(255,200,100,0.5)" />
                  {/* Wrench sticking out */}
                  <rect x="535" y="249" width="4" height="15" rx="2" fill="url(#wrenchGrad)" transform="rotate(15 537 256)" />
                </g>

                {/* === SPARKS at engine area === */}
                <g filter="url(#sparksGlow)">
                  <line className="spark1" x1="412" y1="220" x2="420" y2="212" stroke="#FFE66D" strokeWidth="2" strokeLinecap="round" />
                  <line className="spark2" x1="415" y1="215" x2="425" y2="218" stroke="#FF9A3C" strokeWidth="1.5" strokeLinecap="round" />
                  <line className="spark3" x1="408" y1="218" x2="402" y2="210" stroke="#FFE66D" strokeWidth="2" strokeLinecap="round" />
                  <circle className="spark1" cx="420" cy="212" r="2" fill="#FFE66D" />
                  <circle className="spark2" cx="425" cy="218" r="1.5" fill="#FF9A3C" />
                  <circle className="spark3" cx="402" cy="210" r="2" fill="#FFE66D" />
                </g>

                {/* === OBD DIAGNOSTIC DEVICE (on car) === */}
                <g>
                  <rect x="328" y="225" width="16" height="10" rx="2" fill="#1A2840" stroke="rgba(78,205,196,0.5)" strokeWidth="0.8" />
                  <rect className="diagnostic-blink" x="330" y="227" width="5" height="3" rx="1" fill="#4ECDC4" />
                  <rect x="337" y="228" width="4" height="2" rx="0.5" fill="rgba(78,205,196,0.4)" />
                  {/* Cable */}
                  <path d="M 344 230 Q 360 240 370 235" fill="none" stroke="rgba(78,205,196,0.5)" strokeWidth="1.5" strokeDasharray="3,2" />
                </g>

                {/* === AMBIENT LIGHT REFLECTIONS === */}
                {/* Orange floor reflection */}
                <ellipse cx="300" cy="313" rx="200" ry="6" fill="rgba(255,107,53,0.06)" />

              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section" ref={statsRef}>
        <div className="stats-grid">
          {[
            { num: counters.mechanics, suffix: "+", label: "ميكانيكي معتمد" },
            { num: counters.users.toLocaleString("ar-SA"), suffix: "+", label: "مستخدم نشط" },
            { num: counters.cities, suffix: "", label: "مدينة مغطاة" },
            { num: counters.reviews.toLocaleString("ar-SA"), suffix: "+", label: "تقييم حقيقي" },
          ].map((s, i) => (
            <div key={i} className="stat-item">
              <div className="stat-num">{s.num}<span className="stat-suffix">{s.suffix}</span></div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section" id="features">
        <div className="features-inner">
          <div className="features-text">
            <div className="section-label">المميزات</div>
            <h2 className="section-title">لماذا يلا ميكانيكي؟</h2>
            <p className="section-sub" style={{ marginBottom: 40 }}>
              منصة مصممة بعناية لتوصيل أصحاب السيارات بالمختصين الموثوقين، بدون عناء ومن غير مفاجآت.
            </p>
            {features.map((f, i) => (
              <div
                key={i}
                className={`feature-tab ${activeFeature === i ? "active" : ""}`}
                onClick={() => setActiveFeature(i)}
              >
                <div className="feature-tab-title">
                  <span>{f.icon}</span> {f.title}
                </div>
                <div className="feature-tab-desc">{f.desc}</div>
              </div>
            ))}
          </div>
          <div className="features-visual">
            <div className="feature-visual-dot" />
            <div key={activeFeature} className="feature-emoji">{features[activeFeature].icon}</div>
            <div className="feature-visual-title" style={{ color: features[activeFeature].color }}>
              {features[activeFeature].title}
            </div>
            <div className="feature-visual-desc">{features[activeFeature].desc}</div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="steps-section" id="how">
        <div className="steps-inner">
          <div className="steps-header">
            <div className="section-label" style={{ justifyContent: "center" }}>كيف يعمل</div>
            <h2 className="section-title">ثلاث خطوات فقط</h2>
            <p className="section-sub" style={{ margin: "0 auto" }}>من التسجيل إلى إيجاد ميكانيكي في دقائق معدودة</p>
          </div>
          <div className="steps-grid">
            {steps.map((s, i) => (
              <div className="step-card" key={i}>
                <div className="step-num">{s.num}</div>
                <div className="step-icon">{s.icon}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IS IT FOR */}
      <section className="who-section" id="for-who">
        <div className="who-inner">
          <div className="section-label">لمن المنصة</div>
          <h2 className="section-title">منصة للجميع</h2>
          <div className="who-grid">
            <div className="who-card user-card">
              <div className="who-icon">🚗</div>
              <div className="who-title">أنت صاحب سيارة</div>
              <div className="who-sub">لا تضيع وقتك في البحث عشوائياً. الحل بين يديك.</div>
              <ul className="who-list">
                <li>ابحث عن الميكانيكيين القريبين منك</li>
                <li>اقرأ تقييمات حقيقية قبل الاختيار</li>
                <li>قيّم تجربتك وساعد الآخرين</li>
                <li>أدر ملفك الشخصي بسهولة</li>
              </ul>
              <Link href="/auth" className="who-btn">ابدأ كمستخدم →</Link>
            </div>
            <div className="who-card mech-card">
              <div className="who-icon">🔧</div>
              <div className="who-title">أنت ميكانيكي محترف</div>
              <div className="who-sub">وسّع قاعدة عملائك وابنِ سمعتك الرقمية.</div>
              <ul className="who-list">
                <li>سجّل موقع ورشتك ليجدك العملاء</li>
                <li>تابع طلبات الموقع ومتطلباتها</li>
                <li>استقبل التقييمات وبنِ ثقة العملاء</li>
                <li>لوحة تحكم خاصة بك كميكانيكي</li>
              </ul>
              <Link href="/auth" className="who-btn">انضم كميكانيكي →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2 className="cta-title">جاهز تبدأ؟<br /><span style={{ color: "var(--orange)" }}>يلا ميكانيكي</span></h2>
          <p className="cta-sub">
            انضم إلى آلاف المستخدمين والميكانيكيين على المنصة.<br />
            التسجيل مجاني ويستغرق أقل من دقيقة.
          </p>
          <div className="cta-btns">
            <Link href="/auth" className="btn-xl">إنشاء حساب مجاني</Link>
            <Link href="/auth" className="btn-xl-outline">تسجيل الدخول</Link>
          </div>
          <p className="cta-note">لا يلزم بطاقة ائتمانية · مجاني تماماً للمستخدمين</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div className="logo-icon" style={{ width: 32, height: 32, borderRadius: 8, fontSize: 16 }}>🔧</div>
              <span className="logo-text" style={{ fontSize: 18 }}>يلا <span>ميكانيكي</span></span>
            </div>
            <p className="footer-copy">المنصة الأولى للميكانيكيين المعتمدين</p>
          </div>
          <div className="footer-links">
            <a href="#">سياسة الخصوصية</a>
            <a href="#">شروط الاستخدام</a>
            <a href="#">تواصل معنا</a>
          </div>
          <p className="footer-copy">© 2025 يلا ميكانيكي. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </>
  );
}