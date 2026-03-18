'use client'
// ════════════════════════════════════════════════════════════════════════════
//  MechanicDashboard.jsx  — complete mechanic panel (single file)
// ════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback } from 'react';

const API_BASE = 'http://localhost:3001/api/mechanics';

/* ── fetch helper hook ── */
const useApi = (accessToken) =>
  useCallback(async (path, options = {}) => {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        ...(options.headers || {}),
      },
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Request failed');
    return data;
  }, [accessToken]);

/* ── star rating ── */
const Stars = ({ value, readonly = false }) => (
  <div style={{ display: 'flex', gap: 3 }}>
    {[1, 2, 3, 4, 5].map(n => (
      <span key={n} style={{
        fontSize: readonly ? '.95rem' : '1.3rem',
        color: n <= value ? '#f59e0b' : 'rgba(255,255,255,.13)',
        userSelect: 'none',
      }}>★</span>
    ))}
  </div>
);

/* ── spinner ── */
const Spin = ({ size = 16 }) => (
  <span style={{
    display: 'inline-block', width: size, height: size,
    border: '2px solid rgba(255,255,255,.2)', borderTopColor: '#fff',
    borderRadius: '50%', animation: 'rot .65s linear infinite', verticalAlign: 'middle',
  }} />
);

/* ── toast ── */
const Toast = ({ msg, onClose }) => {
  if (!msg.text) return null;
  return (
    <div onClick={onClose} style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      padding: '.78rem 1.2rem', borderRadius: 12, fontSize: '.87rem', fontWeight: 600,
      cursor: 'pointer', animation: 'toastIn .3s ease',
      background: msg.type === 'error' ? 'rgba(239,68,68,.15)' : 'rgba(16,185,129,.14)',
      color: msg.type === 'error' ? '#fca5a5' : '#6ee7b7',
      border: `1px solid ${msg.type === 'error' ? 'rgba(239,68,68,.3)' : 'rgba(16,185,129,.3)'}`,
      backdropFilter: 'blur(12px)',
      maxWidth: 340,
    }}>
      {msg.type === 'error' ? '❌' : '✅'} {msg.text}
    </div>
  );
};

/* ── status badge ── */
const StatusBadge = ({ status }) => {
  const map = {
    pending:    { label: 'قيد الانتظار', color: '#f59e0b', bg: 'rgba(245,158,11,.14)' },
    approved:   { label: 'مقبول',        color: '#10b981', bg: 'rgba(16,185,129,.14)' },
    rejected:   { label: 'مرفوض',        color: '#ef4444', bg: 'rgba(239,68,68,.14)'  },
    accepted:   { label: 'مقبول',        color: '#10b981', bg: 'rgba(16,185,129,.14)' },
    inProgress: { label: 'جاري العمل',   color: '#38bdf8', bg: 'rgba(56,189,248,.14)' },
    completed:  { label: 'مكتمل',        color: '#a78bfa', bg: 'rgba(167,139,250,.14)'},
    cancelled:  { label: 'ملغي',         color: '#6b7280', bg: 'rgba(107,114,128,.14)'},
  };
  const s = map[status] || map.pending;
  return (
    <span style={{
      fontSize: '.72rem', fontWeight: 700, padding: '.2rem .6rem', borderRadius: 20,
      background: s.bg, color: s.color, border: `1px solid ${s.color}44`,
    }}>{s.label}</span>
  );
};

/* ════════════════════════════ PAGES ════════════════════════════ */

/* 1 ── Overview / Stats page */
const OverviewPage = ({ api, user, setToast }) => {
  const [reviews,    setReviews]    = useState(null);
  const [location,   setLocation]   = useState(null);
  const [notifs,     setNotifs]     = useState([]);
  const [breakdowns, setBreakdowns] = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [rv, loc, nt, bd] = await Promise.all([
          api('/reviews'),
          api('/location'),
          api('/notifications'),
          api('/all-breakdowns'),
        ]);
        setReviews(rv.data);
        setLocation(loc.data);
        setNotifs(nt.data);
        setBreakdowns(bd.data || []);
      } catch (err) {
        setToast({ type: 'error', text: err.message });
      } finally { setLoading(false); }
    };
    load();
  }, []);

  const unread  = notifs.filter(n => !n.read).length;
  const pending = breakdowns.filter(b => b.status === 'pending').length;

  if (loading) return <div className="center-msg"><Spin size={22} /><span>جاري التحميل...</span></div>;

  return (
    <div className="page">
      <div className="page-hdr">
        <div className="page-title">مرحباً، {user?.fullName?.split(' ')[0]} 👋</div>
        <div className="page-sub">لوحة تحكم الميكانيكي</div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-ico" style={{ background: 'rgba(245,158,11,.12)', color: '#f59e0b' }}>⭐</div>
          <div className="stat-val">{reviews?.averageRating || '0.0'}</div>
          <div className="stat-lbl">متوسط التقييم</div>
        </div>
        <div className="stat-card">
          <div className="stat-ico" style={{ background: 'rgba(14,165,233,.12)', color: '#38bdf8' }}>💬</div>
          <div className="stat-val">{reviews?.totalReviews || 0}</div>
          <div className="stat-lbl">إجمالي التقييمات</div>
        </div>
        <div className="stat-card">
          <div className="stat-ico" style={{ background: unread > 0 ? 'rgba(239,68,68,.12)' : 'rgba(16,185,129,.12)', color: unread > 0 ? '#fca5a5' : '#6ee7b7' }}>🔔</div>
          <div className="stat-val">{unread}</div>
          <div className="stat-lbl">إشعارات غير مقروءة</div>
        </div>
        <div className="stat-card">
          <div className="stat-ico" style={{ background: 'rgba(245,158,11,.12)', color: '#fbbf24' }}>🚗</div>
          <div className="stat-val">{pending}</div>
          <div className="stat-lbl">أعطال بانتظار الرد</div>
        </div>
        <div className="stat-card">
          <div className="stat-ico" style={{ background: location ? 'rgba(16,185,129,.12)' : 'rgba(239,68,68,.12)', color: location ? '#6ee7b7' : '#fca5a5' }}>📍</div>
          <div className="stat-val">{location ? 'محدد' : 'غير محدد'}</div>
          <div className="stat-lbl">الموقع</div>
        </div>
      </div>

      {location && (
        <div className="card-glass" style={{ marginTop: '1.2rem' }}>
          <div className="sec-title">📍 موقعي الحالي</div>
          <div className="loc-info-row">
            <div className="loc-pill">🏢 {location.businessName || 'بدون اسم تجاري'}</div>
            <div className="loc-pill">🗺️ {location.address}</div>
          </div>
          <div style={{ fontSize: '.76rem', color: 'rgba(255,255,255,.3)', marginTop: '.6rem' }}>
            آخر تحديث: {new Date(location.updatedAt).toLocaleString('ar')}
          </div>
        </div>
      )}

      {reviews?.reviews?.length > 0 && (
        <div className="card-glass" style={{ marginTop: '1.2rem' }}>
          <div className="sec-title" style={{ marginBottom: '1rem' }}>⭐ أحدث التقييمات</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
            {reviews.reviews.slice(0, 3).map(r => (
              <div key={r._id} className="mini-review">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.35rem' }}>
                  <span style={{ fontSize: '.85rem', fontWeight: 700, color: '#fff' }}>{r.userId?.fullName}</span>
                  <Stars value={r.rating} readonly />
                </div>
                <div style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.55)' }}>{r.comment}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* 2 ── Profile page */
const ProfilePage = ({ api, user, onUpdate, setToast }) => {
  const [form, setForm] = useState({
    username:  user?.username             || '',
    fullName:  user?.fullName             || '',
    email:     user?.email                || '',
    bio:       user?.profileData?.bio     || '',
    phone:     user?.profileData?.phone   || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api('/profile', {
        method: 'PUT',
        body: JSON.stringify({
          username:    form.username,
          fullName:    form.fullName,
          email:       form.email,
          profileData: { bio: form.bio, phone: form.phone },
        }),
      });
      onUpdate(res.data);
      setToast({ type: 'success', text: 'تم تحديث الملف الشخصي!' });
    } catch (err) {
      setToast({ type: 'error', text: err.message });
    } finally { setLoading(false); }
  };

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div className="page">
      <div className="page-hdr">
        <div className="page-title">الملف الشخصي</div>
        <div className="page-sub">بيانات حسابك كميكانيكي</div>
      </div>
      <div className="card-glass">
        <div className="profile-hero">
          <div className="hero-avatar">🔧</div>
          <div>
            <div className="hero-name">{user?.fullName}</div>
            <div className="hero-user">@{user?.username}</div>
            <span className="role-badge">ميكانيكي</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="fg">
            <label className="lbl">الاسم الكامل</label>
            <div className="inp-wrap"><span className="ico">👤</span>
              <input className="inp" value={form.fullName} onChange={f('fullName')} placeholder="الاسم الكامل" /></div>
          </div>
          <div className="fg">
            <label className="lbl">اسم المستخدم</label>
            <div className="inp-wrap"><span className="ico">🪪</span>
              <input className="inp" value={form.username} onChange={f('username')} placeholder="username" /></div>
          </div>
          <div className="fg full">
            <label className="lbl">البريد الإلكتروني</label>
            <div className="inp-wrap"><span className="ico">✉️</span>
              <input className="inp" type="email" value={form.email} onChange={f('email')} placeholder="email@example.com" /></div>
          </div>
          <div className="fg">
            <label className="lbl">رقم الهاتف</label>
            <div className="inp-wrap"><span className="ico">📞</span>
              <input className="inp" value={form.phone} onChange={f('phone')} placeholder="+966 5x xxx xxxx" /></div>
          </div>
          <div className="fg full">
            <label className="lbl">نبذة عن خدماتك</label>
            <textarea className="inp" rows={3} value={form.bio} onChange={f('bio')}
              placeholder="اكتب نبذة عن تخصصك وخبرتك..."
              style={{ resize: 'vertical', paddingTop: '.75rem', paddingRight: '.9rem' }} />
          </div>
          <div className="fg full">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <><Spin /> جاري الحفظ...</> : '💾 حفظ التغييرات'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* 3 ── Location page */
const LocationPage = ({ api, setToast }) => {
  const [location,   setLocation]   = useState(null);
  const [requests,   setRequests]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ businessName: '', address: '' });

  const load = useCallback(async () => {
    try {
      const [loc, reqs] = await Promise.all([
        api('/location'),
        api('/location-requests'),
      ]);
      setLocation(loc.data);
      setRequests(reqs.data);
    } catch (err) {
      setToast({ type: 'error', text: err.message });
    } finally { setLoading(false); }
  }, [api]);

  useEffect(() => { load(); }, [load]);

  const hasPending = requests.some(r => r.status === 'pending');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api('/location-requests', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setToast({ type: 'success', text: 'تم إرسال طلب الموقع بنجاح! بانتظار موافقة الإدارة.' });
      setForm({ businessName: '', address: '' });
      await load();
    } catch (err) {
      setToast({ type: 'error', text: err.message });
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="center-msg"><Spin size={22} /><span>جاري التحميل...</span></div>;

  return (
    <div className="page">
      <div className="page-hdr">
        <div className="page-title">إدارة الموقع</div>
        <div className="page-sub">موقعك الحالي وطلبات التحديث</div>
      </div>
      <div className="card-glass" style={{ marginBottom: '1.2rem' }}>
        <div className="sec-title">📍 موقعي الحالي</div>
        {location ? (
          <div style={{ marginTop: '.8rem' }}>
            <div className="detail-row"><span className="detail-lbl">الاسم التجاري</span><span className="detail-val">{location.businessName || '—'}</span></div>
            <div className="detail-row"><span className="detail-lbl">العنوان</span><span className="detail-val">{location.address}</span></div>
            {location.locationData && (
              <div className="detail-row">
                <span className="detail-lbl">الإحداثيات</span>
                <span className="detail-val" style={{ fontFamily: 'monospace', fontSize: '.8rem' }}>
                  {location.locationData.lat?.toFixed(5)}, {location.locationData.lng?.toFixed(5)}
                </span>
              </div>
            )}
            <div className="detail-row"><span className="detail-lbl">آخر تحديث</span><span className="detail-val">{new Date(location.updatedAt).toLocaleString('ar')}</span></div>
          </div>
        ) : (
          <div className="empty-inline">لم يتم تحديد موقع بعد</div>
        )}
      </div>
      <div className="card-glass" style={{ marginBottom: '1.2rem' }}>
        <div className="sec-title">📝 طلب تحديث الموقع</div>
        {hasPending ? (
          <div className="info-banner">
            ⏳ لديك طلب قيد الانتظار. يرجى الانتظار حتى تتم مراجعته من قِبل الإدارة.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="form-grid" style={{ marginTop: '.9rem' }}>
            <div className="fg">
              <label className="lbl">الاسم التجاري (اختياري)</label>
              <div className="inp-wrap"><span className="ico">🏢</span>
                <input className="inp" value={form.businessName}
                  onChange={e => setForm(p => ({ ...p, businessName: e.target.value }))}
                  placeholder="ورشة المثالية" /></div>
            </div>
            <div className="fg full">
              <label className="lbl">العنوان <span style={{ color: '#ef4444' }}>*</span></label>
              <div className="inp-wrap"><span className="ico">🗺️</span>
                <input className="inp" required value={form.address}
                  onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                  placeholder="شارع الملك فهد، الرياض..." /></div>
            </div>
            <div className="fg full">
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? <><Spin /> جاري الإرسال...</> : '📤 إرسال الطلب'}
              </button>
            </div>
          </form>
        )}
      </div>
      <div className="card-glass">
        <div className="sec-title">🕓 سجل الطلبات ({requests.length})</div>
        {requests.length === 0 ? (
          <div className="empty-inline">لا توجد طلبات سابقة</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem', marginTop: '.9rem' }}>
            {requests.map(r => (
              <div key={r._id} className="req-card">
                <div className="req-top">
                  <div>
                    {r.businessName && <div style={{ fontWeight: 700, color: '#fff', fontSize: '.9rem', marginBottom: '.15rem' }}>{r.businessName}</div>}
                    <div style={{ fontSize: '.85rem', color: 'rgba(255,255,255,.55)' }}>🗺️ {r.address}</div>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <div style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.3)', marginTop: '.5rem', display: 'flex', gap: '1.2rem' }}>
                  <span>طُلب: {new Date(r.requestedAt).toLocaleDateString('ar')}</span>
                  {r.processedAt && <span>عولج: {new Date(r.processedAt).toLocaleDateString('ar')}</span>}
                </div>
                {r.rejectionReason && (
                  <div style={{ marginTop: '.5rem', fontSize: '.8rem', color: '#fca5a5', background: 'rgba(239,68,68,.08)', padding: '.4rem .7rem', borderRadius: 8, borderRight: '3px solid #ef4444' }}>
                    سبب الرفض: {r.rejectionReason}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* 4 ── Notifications page */
const NotificationsPage = ({ api, setToast, onRead }) => {
  const [notifs,  setNotifs]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    api('/notifications')
      .then(r => setNotifs(r.data))
      .catch(err => setToast({ type: 'error', text: err.message }))
      .finally(() => setLoading(false));
  }, []);

  const markRead = async () => {
    try {
      setMarking(true);
      await api('/notifications/read', { method: 'POST' });
      setNotifs(prev => prev.map(n => ({ ...n, read: true })));
      onRead();
      setToast({ type: 'success', text: 'تم تحديد جميع الإشعارات كمقروءة.' });
    } catch (err) {
      setToast({ type: 'error', text: err.message });
    } finally { setMarking(false); }
  };

  const typeIcon = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌' };
  const unread = notifs.filter(n => !n.read).length;

  return (
    <div className="page">
      <div className="page-hdr" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="page-title">الإشعارات {unread > 0 && <span className="notif-count">{unread}</span>}</div>
          <div className="page-sub">{notifs.length} إشعار إجمالاً</div>
        </div>
        {unread > 0 && (
          <button className="btn-outline-sm" onClick={markRead} disabled={marking}>
            {marking ? <Spin size={13} /> : '✔'} تحديد الكل كمقروء
          </button>
        )}
      </div>
      {loading ? (
        <div className="center-msg"><Spin size={22} /><span>جاري التحميل...</span></div>
      ) : notifs.length === 0 ? (
        <div className="empty-state"><div style={{ fontSize: '3rem', marginBottom: '.6rem' }}>🔔</div><div>لا توجد إشعارات</div></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.65rem' }}>
          {notifs.map(n => (
            <div key={n._id} className={`notif-card ${n.read ? '' : 'notif-unread'}`}>
              <div className="notif-ico">{typeIcon[n.type] || 'ℹ️'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '.9rem', color: n.read ? 'rgba(255,255,255,.55)' : '#fff', fontWeight: n.read ? 400 : 600 }}>{n.message}</div>
                <div style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.28)', marginTop: '.25rem' }}>{new Date(n.createdAt).toLocaleString('ar')}</div>
              </div>
              {!n.read && <div className="unread-dot" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* 5 ── Reviews page */
const ReviewsPage = ({ api, setToast }) => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/reviews')
      .then(r => setData(r.data))
      .catch(err => setToast({ type: 'error', text: err.message }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="center-msg"><Spin size={22} /><span>جاري التحميل...</span></div>;

  return (
    <div className="page">
      <div className="page-hdr">
        <div className="page-title">تقييماتي</div>
        <div className="page-sub">ما يقوله العملاء عنك</div>
      </div>
      <div className="reviews-summary">
        <div className="rs-big">{data?.averageRating || '0.0'}</div>
        <div>
          <Stars value={Math.round(data?.averageRating || 0)} readonly />
          <div style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.4)', marginTop: '.3rem' }}>
            مبني على {data?.totalReviews || 0} تقييم
          </div>
        </div>
      </div>
      {!data?.reviews?.length ? (
        <div className="empty-state"><div style={{ fontSize: '3rem', marginBottom: '.6rem' }}>💬</div><div>لا توجد تقييمات بعد</div></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.9rem', marginTop: '1.2rem' }}>
          {data.reviews.map(r => (
            <div key={r._id} className="review-card">
              <div className="review-top">
                <div className="reviewer-row">
                  <div className="rev-avatar">👤</div>
                  <div>
                    <div className="rev-name">{r.userId?.fullName || 'مستخدم'}</div>
                    <div className="rev-user">@{r.userId?.username}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '.3rem' }}>
                  <Stars value={r.rating} readonly />
                  <div className="rev-date">{new Date(r.createdAt).toLocaleDateString('ar')}</div>
                </div>
              </div>
              <div className="rev-comment">{r.comment}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   6 ── Breakdowns page  🚗
   ══════════════════════════════════════════════════════════ */
const BreakdownsPage = ({ api, setToast }) => {
  const [breakdowns, setBreakdowns] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [filter,     setFilter]     = useState('all');   // all | pending | accepted | inProgress | completed
  const [selected,   setSelected]   = useState(null);    // expanded card _id
  const [acting,     setActing]     = useState(null);    // _id being actioned

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api('/all-breakdowns');
      setBreakdowns(res.data || []);
    } catch (err) {
      setToast({ type: 'error', text: err.message });
    } finally { setLoading(false); }
  }, [api]);

  useEffect(() => { load(); }, [load]);

  /* action helper — POST /api/mechanics/breakdowns/:id/action */
  const doAction = async (id, action) => {
    try {
      setActing(id);
      await api(`/breakdowns/${id}/${action}`, { method: 'POST' });
      const actionLabels = {
        accept:   'تم قبول الطلب ✅',
        reject:   'تم رفض الطلب',
        complete: 'تم تحديد الطلب كمكتمل ✅',
      };
      setToast({ type: 'success', text: actionLabels[action] || 'تمت العملية' });
      await load();
      setSelected(null);
    } catch (err) {
      setToast({ type: 'error', text: err.message });
    } finally { setActing(null); }
  };

  const filters = [
    { key: 'all',        label: 'الكل' },
    { key: 'pending',    label: 'قيد الانتظار' },
    { key: 'accepted',   label: 'مقبول' },
    { key: 'inProgress', label: 'جاري العمل' },
    { key: 'completed',  label: 'مكتمل' },
    { key: 'cancelled',  label: 'ملغي' },
  ];

  const visible = filter === 'all'
    ? breakdowns
    : breakdowns.filter(b => b.status === filter);

  const fuelIcon  = { بنزين: '⛽', كهربائي: '⚡', ديزل: '🛢️', هجين: '🔋' };
  const transIcon = { أوتوماتيك: '🔄', يدوي: '🕹️' };

  /* open google maps for a breakdown location */
  const openMap = (loc) => {
    if (!loc?.lat || !loc?.lng) return;
    window.open(`https://www.google.com/maps?q=${loc.lat},${loc.lng}`, '_blank');
  };

  return (
    <div className="page">
      <div className="page-hdr" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="page-title">طلبات الأعطال 🚗</div>
          <div className="page-sub">{breakdowns.length} طلب إجمالاً — {breakdowns.filter(b => b.status === 'pending').length} بانتظار ردك</div>
        </div>
        <button className="btn-outline-sm" onClick={load}>🔄 تحديث</button>
      </div>

      {/* filter tabs */}
      <div className="filter-tabs">
        {filters.map(f => {
          const count = f.key === 'all' ? breakdowns.length : breakdowns.filter(b => b.status === f.key).length;
          return (
            <button
              key={f.key}
              className={`filter-tab ${filter === f.key ? 'active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
              {count > 0 && <span className="tab-count">{count}</span>}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="center-msg"><Spin size={22} /><span>جاري التحميل...</span></div>
      ) : visible.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: '3rem', marginBottom: '.6rem' }}>🚗</div>
          <div>لا توجد طلبات في هذه الفئة</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.9rem', marginTop: '1rem' }}>
          {visible.map(b => {
            const isOpen = selected === b._id;
            const isActing = acting === b._id;
            const car = b.carInfo || {};
            const user = b.userId || {};
            const loc = b.location || {};
            const prob = b.problemDetails || {};

            return (
              <div
                key={b._id}
                className={`bd-card ${isOpen ? 'bd-open' : ''}`}
                onClick={() => setSelected(isOpen ? null : b._id)}
              >
                {/* ── card header ── */}
                <div className="bd-head">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', flex: 1, minWidth: 0 }}>
                    <div className="bd-car-ico">🚗</div>
                    <div style={{ minWidth: 0 }}>
                      <div className="bd-car-name">
                        {car.brand || '—'} {car.model || ''}
                        <span style={{ fontWeight: 400, opacity: .5, marginRight: '.4rem', fontSize: '.82rem' }}>({car.year || '—'})</span>
                      </div>
                      <div className="bd-user-name">
                        👤 {user.fullName || user.username || 'مجهول'}
                        {user.username && <span style={{ opacity: .4, marginRight: '.3rem' }}>@{user.username}</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', flexShrink: 0 }}>
                    <StatusBadge status={b.status} />
                    <span style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.25)', transition: 'transform .2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>▼</span>
                  </div>
                </div>

                {/* ── quick info row (always visible) ── */}
                <div className="bd-quick">
                  {car.fuelType && <span className="bd-tag">{fuelIcon[car.fuelType] || '⛽'} {car.fuelType}</span>}
                  {car.transmission && <span className="bd-tag">{transIcon[car.transmission] || '⚙️'} {car.transmission}</span>}
                  {car.mileage && <span className="bd-tag">📏 {car.mileage.toLocaleString()} كم</span>}
                  {prob.isRecurring && <span className="bd-tag bd-tag-warn">🔁 متكرر</span>}
                  {prob.warningLights && <span className="bd-tag bd-tag-warn">⚠️ أضواء تحذير</span>}
                  {prob.carRunning !== undefined && (
                    <span className={`bd-tag ${prob.carRunning ? '' : 'bd-tag-warn'}`}>
                      {prob.carRunning ? '✅ السيارة تعمل' : '❌ السيارة متوقفة'}
                    </span>
                  )}
                </div>

                {/* ── expanded details ── */}
                {isOpen && (
                  <div className="bd-details" onClick={e => e.stopPropagation()}>
                    <div className="bd-section-title">📋 تفاصيل العطل</div>

                    {b.title && (
                      <div className="bd-detail-item">
                        <span className="bd-detail-lbl">العنوان</span>
                        <span className="bd-detail-val">{b.title}</span>
                      </div>
                    )}
                    {b.description && (
                      <div className="bd-detail-item">
                        <span className="bd-detail-lbl">الوصف</span>
                        <span className="bd-detail-val">{b.description}</span>
                      </div>
                    )}

                    <div className="bd-section-title" style={{ marginTop: '.9rem' }}>🚘 معلومات السيارة</div>
                    <div className="bd-detail-grid">
                      <div className="bd-detail-item"><span className="bd-detail-lbl">الماركة</span><span className="bd-detail-val">{car.brand || '—'}</span></div>
                      <div className="bd-detail-item"><span className="bd-detail-lbl">الموديل</span><span className="bd-detail-val">{car.model || '—'}</span></div>
                      <div className="bd-detail-item"><span className="bd-detail-lbl">السنة</span><span className="bd-detail-val">{car.year || '—'}</span></div>
                      <div className="bd-detail-item"><span className="bd-detail-lbl">الكيلومترات</span><span className="bd-detail-val">{car.mileage ? car.mileage.toLocaleString() + ' كم' : '—'}</span></div>
                      <div className="bd-detail-item"><span className="bd-detail-lbl">الوقود</span><span className="bd-detail-val">{car.fuelType || '—'}</span></div>
                      <div className="bd-detail-item"><span className="bd-detail-lbl">ناقل الحركة</span><span className="bd-detail-val">{car.transmission || '—'}</span></div>
                    </div>

                    <div className="bd-section-title" style={{ marginTop: '.9rem' }}>👤 معلومات العميل</div>
                    <div className="bd-detail-grid">
                      <div className="bd-detail-item"><span className="bd-detail-lbl">الاسم</span><span className="bd-detail-val">{user.fullName || '—'}</span></div>
                      <div className="bd-detail-item"><span className="bd-detail-lbl">اسم المستخدم</span><span className="bd-detail-val">@{user.username || '—'}</span></div>
                    </div>

                    {(loc.lat || loc.note) && (
                      <>
                        <div className="bd-section-title" style={{ marginTop: '.9rem' }}>📍 الموقع</div>
                        {loc.note && (
                          <div className="bd-detail-item">
                            <span className="bd-detail-lbl">ملاحظة الموقع</span>
                            <span className="bd-detail-val">{loc.note}</span>
                          </div>
                        )}
                        {loc.lat && loc.lng && (
                          <button
                            className="btn-map"
                            onClick={() => openMap(loc)}
                          >
                            🗺️ فتح الموقع على الخريطة ({loc.lat?.toFixed(4)}, {loc.lng?.toFixed(4)})
                          </button>
                        )}
                      </>
                    )}

                    <div className="bd-section-title" style={{ marginTop: '.9rem' }}>🕐 التاريخ</div>
                    <div className="bd-detail-item">
                      <span className="bd-detail-lbl">تاريخ الطلب</span>
                      <span className="bd-detail-val">{new Date(b.createdAt).toLocaleString('ar')}</span>
                    </div>
                    {b.updatedAt && b.updatedAt !== b.createdAt && (
                      <div className="bd-detail-item">
                        <span className="bd-detail-lbl">آخر تحديث</span>
                        <span className="bd-detail-val">{new Date(b.updatedAt).toLocaleString('ar')}</span>
                      </div>
                    )}

                    {/* ── action buttons ── */}
                    {b.status === 'pending' && (
                      <div className="bd-actions">
                        <button
                          className="btn-accept"
                          disabled={isActing}
                          onClick={() => doAction(b._id, 'accept')}
                        >
                          {isActing ? <Spin size={14} /> : '✅'} قبول الطلب
                        </button>
                        <button
                          className="btn-reject"
                          disabled={isActing}
                          onClick={() => doAction(b._id, 'reject')}
                        >
                          {isActing ? <Spin size={14} /> : '❌'} رفض الطلب
                        </button>
                      </div>
                    )}
                    {b.status === 'accepted' && (
                      <div className="bd-actions">
                        <button
                          className="btn-accept"
                          disabled={isActing}
                          onClick={() => doAction(b._id, 'complete')}
                        >
                          {isActing ? <Spin size={14} /> : '🏁'} تحديد كمكتمل
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ════════════════════ MAIN APP ════════════════════ */
export default function MechanicDashboard() {
  const [accessToken] = useState(() =>
    (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : '') || ''
  );
  const [user,    setUser]    = useState(null);
  const [page,    setPage]    = useState('overview');
  const [toast,   setToastSt] = useState({ type: '', text: '' });
  const [unread,  setUnread]  = useState(0);
  const [mounted, setMounted] = useState(false);

  const api = useApi(accessToken);

  const setToast = (msg) => {
    setToastSt(msg);
    setTimeout(() => setToastSt({ type: '', text: '' }), 3500);
  };

  useEffect(() => {
    setMounted(true);
    if (!accessToken) return;
    Promise.all([api('/profile'), api('/notifications')])
      .then(([prof, notifs]) => {
        setUser(prof.data);
        setUnread(notifs.data.filter(n => !n.read).length);
      })
      .catch(() => {});
  }, []);

  const navItems = [
    { key: 'overview',      icon: '📊', label: 'نظرة عامة' },
    { key: 'profile',       icon: '👤', label: 'ملفي الشخصي' },
    { key: 'location',      icon: '📍', label: 'الموقع' },
    { key: 'breakdowns',    icon: '🚗', label: 'طلبات الأعطال' },
    { key: 'notifications', icon: '🔔', label: 'الإشعارات', badge: unread },
    { key: 'reviews',       icon: '⭐', label: 'التقييمات' },
  ];

  if (!mounted) return null;

  if (!accessToken) {
    return (
      <div style={{ minHeight: '100vh', background: '#06080f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Tajawal,sans-serif', color: '#fff', direction: 'rtl', fontSize: '1.1rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
          <div>يجب تسجيل الدخول أولاً</div>
          <div style={{ color: 'rgba(255,255,255,.4)', marginTop: '.5rem', fontSize: '.9rem' }}>لا يوجد accessToken في localStorage</div>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    if (page === 'overview')      return <OverviewPage      api={api} user={user} setToast={setToast} />;
    if (page === 'profile')       return <ProfilePage       api={api} user={user} onUpdate={setUser} setToast={setToast} />;
    if (page === 'location')      return <LocationPage      api={api} setToast={setToast} />;
    if (page === 'breakdowns')    return <BreakdownsPage    api={api} setToast={setToast} />;
    if (page === 'notifications') return <NotificationsPage api={api} setToast={setToast} onRead={() => setUnread(0)} />;
    if (page === 'reviews')       return <ReviewsPage       api={api} setToast={setToast} />;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&family=Sora:wght@600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body,html{background:#06080f;font-family:'Tajawal',sans-serif;direction:rtl;color:#e2e8f0;min-height:100vh}

        @keyframes rot{to{transform:rotate(360deg)}}
        @keyframes up{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes toastIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
        @keyframes bdSlide{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}

        .layout{display:flex;min-height:100vh}

        /* ── sidebar ── */
        .sidebar{
          width:235px;flex-shrink:0;
          background:rgba(255,255,255,.025);
          border-left:1px solid rgba(255,255,255,.065);
          display:flex;flex-direction:column;
          padding:1.4rem .9rem;
          position:sticky;top:0;height:100vh;
          backdrop-filter:blur(20px);
        }
        .sb-brand{display:flex;align-items:center;gap:.65rem;margin-bottom:1.8rem;padding:.25rem .5rem}
        .sb-logo{width:40px;height:40px;background:linear-gradient(135deg,#f59e0b,#ef4444);border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0}
        .sb-title{font-family:'Sora',sans-serif;font-size:1.1rem;font-weight:700;color:#fff}

        .user-chip{display:flex;align-items:center;gap:.65rem;background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.18);border-radius:13px;padding:.8rem .9rem;margin-bottom:1.5rem}
        .uc-av{width:38px;height:38px;background:linear-gradient(135deg,#f59e0b,#ef4444);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0}
        .uc-name{font-size:.86rem;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .uc-role{font-size:.7rem;color:rgba(245,158,11,.7)}

        .nav-btn{
          display:flex;align-items:center;justify-content:space-between;
          padding:.68rem .9rem;border-radius:11px;
          font-family:'Tajawal',sans-serif;font-size:.9rem;font-weight:500;
          color:rgba(255,255,255,.42);cursor:pointer;
          transition:all .2s;margin-bottom:.22rem;
          border:none;background:transparent;width:100%;text-align:right;
        }
        .nav-btn:hover{background:rgba(255,255,255,.055);color:rgba(255,255,255,.78)}
        .nav-btn.active{background:rgba(245,158,11,.12);color:#fbbf24;font-weight:700;border:1px solid rgba(245,158,11,.22)}
        .nav-left{display:flex;align-items:center;gap:.6rem}
        .nav-ico{font-size:1rem;width:20px;text-align:center}
        .nav-badge{background:#ef4444;color:#fff;font-size:.65rem;font-weight:800;padding:.15rem .45rem;border-radius:20px;min-width:18px;text-align:center;animation:pulse 2s infinite}

        /* ── main ── */
        .main{flex:1;overflow-y:auto;padding:2rem;max-width:900px}
        .page{animation:up .35s ease}
        .page-hdr{margin-bottom:1.8rem}
        .page-title{font-size:1.55rem;font-weight:900;color:#fff;display:flex;align-items:center;gap:.6rem}
        .page-sub{font-size:.88rem;color:rgba(255,255,255,.32);margin-top:.25rem}

        /* ── glass card ── */
        .card-glass{background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:1.6rem;backdrop-filter:blur(16px)}
        .sec-title{font-size:1rem;font-weight:700;color:#fff;display:flex;align-items:center;gap:.5rem}

        /* ── stat grid ── */
        .stat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:.9rem}
        .stat-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:1.2rem;text-align:center;transition:border-color .2s,transform .2s}
        .stat-card:hover{border-color:rgba(245,158,11,.25);transform:translateY(-2px)}
        .stat-ico{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;margin:0 auto .7rem}
        .stat-val{font-size:1.6rem;font-weight:900;color:#fff;margin-bottom:.2rem}
        .stat-lbl{font-size:.78rem;color:rgba(255,255,255,.38)}

        /* ── loc info ── */
        .loc-info-row{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.7rem}
        .loc-pill{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:.35rem .75rem;font-size:.82rem;color:rgba(255,255,255,.6)}

        /* ── form ── */
        .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
        .fg{display:flex;flex-direction:column}
        .fg.full{grid-column:1/-1}
        .lbl{font-size:.78rem;font-weight:600;color:rgba(255,255,255,.38);margin-bottom:.32rem}
        .inp-wrap{position:relative}
        .ico{position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:.88rem;opacity:.38;pointer-events:none}
        .inp{width:100%;padding:.76rem 2.5rem .76rem .9rem;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.09);border-radius:11px;color:#fff;font-family:'Tajawal',sans-serif;font-size:.95rem;outline:none;transition:border-color .2s,background .2s,box-shadow .2s;text-align:right}
        .inp::placeholder{color:rgba(255,255,255,.2)}
        .inp:focus{border-color:#f59e0b;background:rgba(245,158,11,.07);box-shadow:0 0 0 3px rgba(245,158,11,.14)}
        textarea.inp{padding-right:.9rem}

        /* ── profile ── */
        .profile-hero{display:flex;align-items:center;gap:1.1rem;margin-bottom:1.8rem;padding-bottom:1.4rem;border-bottom:1px solid rgba(255,255,255,.07)}
        .hero-avatar{width:62px;height:62px;background:linear-gradient(135deg,#f59e0b,#ef4444);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.7rem;flex-shrink:0}
        .hero-name{font-size:1.12rem;font-weight:700;color:#fff}
        .hero-user{font-size:.82rem;color:rgba(255,255,255,.38);margin:.18rem 0}
        .role-badge{display:inline-block;font-size:.7rem;font-weight:700;padding:.18rem .55rem;border-radius:20px;background:rgba(245,158,11,.15);color:#fbbf24;letter-spacing:.4px}

        /* ── buttons ── */
        .btn-primary{padding:.82rem;background:linear-gradient(135deg,#f59e0b,#ef4444);border:none;border-radius:12px;color:#fff;font-family:'Tajawal',sans-serif;font-size:1rem;font-weight:700;cursor:pointer;transition:transform .2s,box-shadow .2s,opacity .2s;box-shadow:0 4px 18px rgba(245,158,11,.35);width:100%}
        .btn-primary:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 6px 24px rgba(245,158,11,.5)}
        .btn-primary:disabled{opacity:.55;cursor:not-allowed}
        .btn-outline-sm{padding:.44rem .95rem;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:9px;color:rgba(255,255,255,.6);font-family:'Tajawal',sans-serif;font-size:.83rem;font-weight:600;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:.4rem}
        .btn-outline-sm:hover{background:rgba(255,255,255,.12);color:#fff}
        .btn-outline-sm:disabled{opacity:.5;cursor:not-allowed}

        /* ── detail rows ── */
        .detail-row{display:flex;justify-content:space-between;align-items:flex-start;padding:.55rem 0;border-bottom:1px solid rgba(255,255,255,.05)}
        .detail-row:last-child{border-bottom:none}
        .detail-lbl{font-size:.82rem;color:rgba(255,255,255,.38)}
        .detail-val{font-size:.88rem;color:#fff;font-weight:500;text-align:left;max-width:60%;word-break:break-word}

        /* ── info/empty ── */
        .info-banner{background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.2);border-radius:11px;padding:.85rem 1rem;font-size:.87rem;color:#fbbf24;margin-top:.9rem;display:flex;align-items:center;gap:.6rem}
        .empty-inline{font-size:.85rem;color:rgba(255,255,255,.3);padding:.9rem 0}
        .empty-state{text-align:center;padding:4rem 2rem;color:rgba(255,255,255,.3);font-size:.92rem}
        .center-msg{display:flex;align-items:center;justify-content:center;gap:.7rem;padding:3rem;color:rgba(255,255,255,.35);font-size:.92rem}

        /* ── location requests ── */
        .req-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:13px;padding:1rem 1.1rem}
        .req-top{display:flex;align-items:flex-start;justify-content:space-between;gap:.7rem}

        /* ── notifications ── */
        .notif-count{background:#ef4444;color:#fff;font-size:.7rem;font-weight:800;padding:.15rem .5rem;border-radius:20px;vertical-align:middle}
        .notif-card{display:flex;align-items:flex-start;gap:.8rem;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:13px;padding:.9rem 1rem;transition:border-color .2s}
        .notif-unread{border-color:rgba(245,158,11,.22);background:rgba(245,158,11,.04)}
        .notif-ico{font-size:1.1rem;flex-shrink:0;margin-top:.1rem}
        .unread-dot{width:8px;height:8px;border-radius:50%;background:#f59e0b;flex-shrink:0;margin-top:.35rem;animation:pulse 2s infinite}

        /* ── reviews ── */
        .reviews-summary{display:flex;align-items:center;gap:1.2rem;background:rgba(245,158,11,.07);border:1px solid rgba(245,158,11,.18);border-radius:18px;padding:1.3rem 1.5rem}
        .rs-big{font-size:3rem;font-weight:900;color:#f59e0b;line-height:1}
        .review-card{background:rgba(255,255,255,.038);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:1.1rem}
        .review-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.7rem}
        .reviewer-row{display:flex;align-items:center;gap:.65rem}
        .rev-avatar{width:38px;height:38px;background:rgba(99,102,241,.3);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.95rem;flex-shrink:0}
        .rev-name{font-size:.9rem;font-weight:700;color:#fff}
        .rev-user{font-size:.75rem;color:rgba(255,255,255,.33)}
        .rev-date{font-size:.74rem;color:rgba(255,255,255,.28)}
        .rev-comment{font-size:.87rem;color:rgba(255,255,255,.6);line-height:1.65}
        .mini-review{background:rgba(255,255,255,.03);border-radius:10px;padding:.7rem .9rem}

        /* ════ BREAKDOWNS ════ */
        .filter-tabs{display:flex;gap:.45rem;flex-wrap:wrap;margin-bottom:.5rem}
        .filter-tab{padding:.38rem .85rem;border-radius:20px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);color:rgba(255,255,255,.45);font-family:'Tajawal',sans-serif;font-size:.82rem;font-weight:600;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:.35rem}
        .filter-tab:hover{background:rgba(255,255,255,.09);color:#fff}
        .filter-tab.active{background:rgba(245,158,11,.14);border-color:rgba(245,158,11,.35);color:#fbbf24}
        .tab-count{background:rgba(255,255,255,.12);border-radius:20px;padding:.05rem .42rem;font-size:.72rem}
        .filter-tab.active .tab-count{background:rgba(245,158,11,.2);color:#f59e0b}

        .bd-card{background:rgba(255,255,255,.036);border:1px solid rgba(255,255,255,.08);border-radius:18px;padding:1.1rem 1.2rem;cursor:pointer;transition:border-color .2s,background .2s,transform .15s}
        .bd-card:hover{border-color:rgba(245,158,11,.2);background:rgba(255,255,255,.05);transform:translateY(-1px)}
        .bd-card.bd-open{border-color:rgba(245,158,11,.32);background:rgba(245,158,11,.04);transform:none}

        .bd-head{display:flex;align-items:center;justify-content:space-between;gap:.7rem}
        .bd-car-ico{width:44px;height:44px;background:rgba(245,158,11,.1);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0}
        .bd-car-name{font-size:.98rem;font-weight:700;color:#fff;margin-bottom:.18rem}
        .bd-user-name{font-size:.8rem;color:rgba(255,255,255,.4)}

        .bd-quick{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.75rem}
        .bd-tag{font-size:.74rem;padding:.22rem .62rem;border-radius:20px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.55)}
        .bd-tag-warn{background:rgba(245,158,11,.1);border-color:rgba(245,158,11,.25);color:#fbbf24}

        .bd-details{margin-top:1rem;padding-top:1rem;border-top:1px solid rgba(255,255,255,.07);animation:bdSlide .25s ease}
        .bd-section-title{font-size:.8rem;font-weight:700;color:rgba(255,255,255,.35);letter-spacing:.8px;text-transform:uppercase;margin-bottom:.55rem}
        .bd-detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:.3rem .9rem}
        .bd-detail-item{display:flex;justify-content:space-between;align-items:flex-start;padding:.4rem 0;border-bottom:1px solid rgba(255,255,255,.04)}
        .bd-detail-item:last-child{border-bottom:none}
        .bd-detail-lbl{font-size:.8rem;color:rgba(255,255,255,.35);flex-shrink:0}
        .bd-detail-val{font-size:.85rem;color:#fff;font-weight:500;text-align:left;word-break:break-word;max-width:58%}

        .btn-map{display:flex;align-items:center;gap:.5rem;margin-top:.6rem;padding:.55rem 1rem;background:rgba(56,189,248,.1);border:1px solid rgba(56,189,248,.25);border-radius:10px;color:#38bdf8;font-family:'Tajawal',sans-serif;font-size:.85rem;font-weight:600;cursor:pointer;transition:all .2s;width:100%;justify-content:center}
        .btn-map:hover{background:rgba(56,189,248,.2);border-color:rgba(56,189,248,.4)}

        .bd-actions{display:flex;gap:.7rem;margin-top:1rem;padding-top:.9rem;border-top:1px solid rgba(255,255,255,.07)}
        .btn-accept{flex:1;padding:.7rem;background:rgba(16,185,129,.14);border:1px solid rgba(16,185,129,.3);border-radius:11px;color:#6ee7b7;font-family:'Tajawal',sans-serif;font-size:.9rem;font-weight:700;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:.4rem}
        .btn-accept:hover:not(:disabled){background:rgba(16,185,129,.25);border-color:rgba(16,185,129,.5)}
        .btn-accept:disabled{opacity:.5;cursor:not-allowed}
        .btn-reject{flex:1;padding:.7rem;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.25);border-radius:11px;color:#fca5a5;font-family:'Tajawal',sans-serif;font-size:.9rem;font-weight:700;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:.4rem}
        .btn-reject:hover:not(:disabled){background:rgba(239,68,68,.2);border-color:rgba(239,68,68,.4)}
        .btn-reject:disabled{opacity:.5;cursor:not-allowed}

        /* ── mobile ── */
        @media(max-width:680px){
          .sidebar{display:none}
          .main{padding:1rem}
          .form-grid{grid-template-columns:1fr}
          .fg.full{grid-column:1}
          .bd-detail-grid{grid-template-columns:1fr}
          .bd-actions{flex-direction:column}
        }
      `}</style>

      <div className="layout">
        <nav className="sidebar">
          <div className="sb-brand">
            <div className="sb-logo">🔧</div>
            <div className="sb-title">MechPanel</div>
          </div>

          {user && (
            <div className="user-chip">
              <div className="uc-av">🔧</div>
              <div style={{ overflow: 'hidden' }}>
                <div className="uc-name">{user.fullName}</div>
                <div className="uc-role">ميكانيكي</div>
              </div>
            </div>
          )}

          {navItems.map(n => (
            <button key={n.key}
              className={`nav-btn ${page === n.key ? 'active' : ''}`}
              onClick={() => setPage(n.key)}>
              <div className="nav-left">
                <span className="nav-ico">{n.icon}</span>
                {n.label}
              </div>
              {n.badge > 0 && <span className="nav-badge">{n.badge}</span>}
            </button>
          ))}
        </nav>

        <main className="main">
          {renderPage()}
        </main>
      </div>

      <Toast msg={toast} onClose={() => setToastSt({ type: '', text: '' })} />
    </>
  );
}