"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowDownRight, ArrowRight, Bell, Check, ChevronDown, CircleHelp, ExternalLink, LayoutDashboard, Link2, Menu, MoreHorizontal, Package, Plus, Search, Settings2, ShieldCheck, Sparkles, TrendingDown, X } from "lucide-react";

const history = [
  { tag: "12. Okt", wert: 999 }, { tag: "19. Okt", wert: 979 }, { tag: "26. Okt", wert: 989 },
  { tag: "02. Nov", wert: 949 }, { tag: "09. Nov", wert: 969 }, { tag: "12. Nov", wert: 929 },
];

const offers = [
  { name: "Amazon", initials: "a", tone: "amazon", price: "929,00 €", shipping: "Kostenloser Versand", delivery: "Morgen", best: true },
  { name: "MediaMarkt", initials: "M", tone: "media", price: "949,00 €", shipping: "+ 4,99 € Versand", delivery: "2–3 Tage", best: false },
  { name: "Cyberport", initials: "C", tone: "cyber", price: "969,00 €", shipping: "Kostenloser Versand", delivery: "2–4 Tage", best: false },
  { name: "Apple Store", initials: "●", tone: "apple", price: "999,00 €", shipping: "Kostenloser Versand", delivery: "1–2 Tage", best: false },
];

export default function Home() {
  const [showAdd, setShowAdd] = useState(false);
  const [url, setUrl] = useState("");
  const [notice, setNotice] = useState("");

  function addProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!url.trim()) return;
    setNotice("Link gespeichert – die automatische Preissuche richten wir als nächsten Schritt ein.");
    setUrl("");
    setShowAdd(false);
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#"><span className="brand-mark"><TrendingDown size={20} strokeWidth={2.5} /></span><span>preis<span className="brand-light">pilot</span></span></a>
        <div className="workspace-label">DEIN ÜBERBLICK</div>
        <nav className="side-nav"><a className="nav-item active" href="#"><LayoutDashboard size={18} />Übersicht</a><a className="nav-item" href="#produkte"><Package size={18} />Meine Produkte<span className="nav-count">4</span></a><a className="nav-item" href="#"><Bell size={18} />Preisalarm</a></nav>
        <div className="side-bottom"><div className="source-note"><span className="source-icon"><ShieldCheck size={17} /></span><div><strong>Preise, denen du<br />vertrauen kannst.</strong><p>Jedes Angebot mit<br />Quelle &amp; Zeitstempel.</p></div></div><button className="nav-item settings"><Settings2 size={18} />Einstellungen</button><div className="profile"><div className="avatar">P</div><div><strong>Paul</strong><span>Mein PreisPilot</span></div><MoreHorizontal size={19} className="profile-more" /></div></div>
      </aside>

      <section className="main-area">
        <header className="topbar"><button className="mobile-menu" aria-label="Menü"><Menu size={20} /></button><div className="breadcrumb">Mein Bereich <span>/</span> <strong>Übersicht</strong></div><div className="top-actions"><span className="live-dot" />Alle Preise aktuell <button className="icon-button" aria-label="Benachrichtigungen"><Bell size={18} /><i /></button></div></header>
        <div className="content">
          <div className="welcome-row"><div><div className="eyebrow"><Sparkles size={13} /> MIT GUTEM GEFÜHL SPAREN</div><h1>Guten Morgen, Paul<span className="wave">✳</span></h1><p className="subheading">Hier ist dein persönlicher Preisüberblick.</p></div><button className="primary-button" onClick={() => { setNotice(""); setShowAdd(true); }}><Plus size={17} />Produkt hinzufügen</button></div>
          {notice && <div className="notice"><Check size={17} />{notice}<button onClick={() => setNotice("")} aria-label="Meldung schließen"><X size={16} /></button></div>}
          <div className="summary-grid"><article className="summary-card"><div className="summary-top"><span>Produkte im Blick</span><span className="summary-icon blue"><Package size={17} /></span></div><div className="summary-value">04 <small>Produkte</small></div><div className="summary-foot"><span className="mini-dots"><i /><i /><i /><i /></span> Davon 2 mit Preisalarm</div></article><article className="summary-card"><div className="summary-top"><span>Gesamtersparnis</span><span className="summary-icon green"><ArrowDownRight size={18} /></span></div><div className="summary-value">128,50 <small>€</small></div><div className="summary-foot positive"><TrendingDown size={14} /> Im Vergleich zum Startpreis</div></article><article className="summary-card"><div className="summary-top"><span>Beste Gelegenheit</span><span className="summary-icon amber"><Sparkles size={17} /></span></div><div className="summary-value opportunity">iPhone 16 Pro</div><div className="summary-foot"><span className="deal-dot" /> 70 € unter dem 30-Tage-Schnitt</div></article></div>

          <div className="section-heading" id="produkte"><div><h2>Deine Preisbeobachtungen</h2><p>Deine Produkte und ihre Entwicklung auf einen Blick.</p></div><button className="text-button">Alle Produkte <ArrowRight size={15} /></button></div>

          <div className="product-layout"><article className="product-card"><div className="product-head"><div className="product-title-wrap"><div className="product-image"><div className="phone"><span /></div></div><div><div className="product-kicker">SMARTPHONE · APPLE</div><h3>iPhone 16 Pro</h3><div className="product-variant">128 GB · Titan Natur</div></div></div><button className="dots-button" aria-label="Weitere Optionen"><MoreHorizontal size={19} /></button></div>
            <div className="price-row"><div><span className="muted-label">Bester Preis gerade</span><div className="big-price">929,00 <small>€</small></div></div><div className="savings-pill"><ArrowDownRight size={14} /> −70,00 €</div></div>
            <div className="chart-title"><span>Preisentwicklung</span><button>30 Tage <ChevronDown size={14} /></button></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={history} margin={{ top: 8, right: 6, left: -25, bottom: 0 }}><defs><linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#20a879" stopOpacity={0.18} /><stop offset="95%" stopColor="#20a879" stopOpacity={0.01} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#edf0ed" strokeDasharray="3 5" /><XAxis dataKey="tag" axisLine={false} tickLine={false} tick={{ fill: "#98a19c", fontSize: 10 }} dy={9} /><YAxis domain={[900, 1020]} ticks={[920, 960, 1000]} axisLine={false} tickLine={false} tick={{ fill: "#98a19c", fontSize: 10 }} tickFormatter={(v) => `${v} €`} /><Tooltip formatter={(v) => [`${Number(v).toLocaleString("de-DE")} €`, "Preis"]} contentStyle={{ borderRadius: 10, border: "1px solid #e8ece8", fontSize: 12 }} /><Area type="monotone" dataKey="wert" stroke="#1ca477" strokeWidth={2.5} fill="url(#priceFill)" activeDot={{ r: 5, fill: "#1ca477", stroke: "white", strokeWidth: 2 }} /></AreaChart></ResponsiveContainer></div><div className="chart-legend"><span><i /> Bester Angebotspreis</span><span>Aktualisiert vor 12 Min.</span></div>
            <div className="target-box"><div className="target-icon"><Bell size={16} /></div><div className="target-copy"><strong>Dein Wunschpreis</strong><span>Wir sagen dir Bescheid, sobald dein Ziel erreicht ist.</span></div><div className="target-price">899 €</div><button className="edit-target">Ändern</button></div>
          </article>

          <article className="offers-card"><div className="offers-heading"><div><h3>Preisvergleich</h3><p>Dasselbe Produkt, verschiedene Händler.</p></div><button className="help-button" aria-label="Information"><CircleHelp size={17} /></button></div><div className="best-banner"><div className="best-banner-icon"><Sparkles size={16} /></div><div><strong>Der beste Preis, den wir gefunden haben</strong><span>Ein guter Moment, genauer hinzuschauen.</span></div></div><div className="offer-list">{offers.map((offer) => <div className={`offer-row ${offer.best ? "best-offer" : ""}`} key={offer.name}><div className={`merchant-logo ${offer.tone}`}>{offer.initials}</div><div className="merchant-detail"><strong>{offer.name}{offer.best && <span className="best-label">BESTER PREIS</span>}</strong><span>{offer.shipping}</span></div><div className="offer-price"><strong>{offer.price}</strong><span>{offer.delivery}</span></div><a className="offer-link" href="#angebote" aria-label={`${offer.name} öffnen`}><ExternalLink size={15} /></a></div>)}</div><div className="offers-footer"><span><ShieldCheck size={14} /> Preise inkl. Versand, soweit verfügbar</span><button>Alle Angebote <ArrowRight size={14} /></button></div></article></div>

          <div className="bottom-note"><span><ShieldCheck size={15} /></span><p><strong>Transparenz ist uns wichtig.</strong> Preise können sich jederzeit ändern. Wir zeigen dir, wann und wo wir sie gefunden haben.</p><button aria-label="Mehr erfahren"><CircleHelp size={16} /></button></div>
          <footer>© 2026 PreisPilot <span>·</span> Preise clever im Blick <a href="#">Datenschutz</a><a href="#">Impressum</a></footer>
        </div>
      </section>

      {showAdd && <div className="modal-backdrop" onClick={(event) => { if (event.target === event.currentTarget) setShowAdd(false); }}><section className="add-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="modal-close" onClick={() => setShowAdd(false)} aria-label="Schließen"><X size={19} /></button><div className="modal-icon"><Link2 size={21} /></div><div className="eyebrow">NEUES PRODUKT</div><h2 id="modal-title">Was möchtest du beobachten?</h2><p>Füge einen Produktlink ein. PreisPilot merkt sich das Produkt für deinen Preisvergleich.</p><form onSubmit={addProduct}><label htmlFor="product-url">Produktlink</label><div className="input-wrap"><Link2 size={17} /><input id="product-url" type="url" required placeholder="https://www.amazon.de/dp/…" value={url} onChange={(event) => setUrl(event.target.value)} autoFocus /></div><div className="supported-sites"><span>Beliebte Shops</span><b>amazon</b><b>MediaMarkt</b><b>OTTO</b></div><button className="primary-button submit-button" type="submit"><Search size={16} />Produkt vormerken <ArrowRight size={15} /></button></form><div className="modal-foot"><ShieldCheck size={15} /> Deine Links bleiben privat.</div></section></div>}
    </main>
  );
}
