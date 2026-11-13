"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowDownRight, ArrowRight, Bell, Check, ChevronDown, CircleHelp, ExternalLink, LayoutDashboard, Link2, Menu, Moon, MoreHorizontal, Package, Plus, Search, ShieldCheck, Sparkles, Sun, TrendingDown, X } from "lucide-react";

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

type TrackedProduct = { id: string; url: string; shop: string; createdAt: string; targetPriceCents: number | null };
type PriceObservation = { id: string; amountCents: number; shippingCents: number; source: string; observedAt: string };

export default function Home() {
  const [showAdd, setShowAdd] = useState(false);
  const [url, setUrl] = useState("");
  const [notice, setNotice] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [trackedProducts, setTrackedProducts] = useState<TrackedProduct[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [targetPrice, setTargetPrice] = useState("899");
  const [targetInput, setTargetInput] = useState("899");
  const [editingTarget, setEditingTarget] = useState(false);
  const [priceEntryId, setPriceEntryId] = useState<string | null>(null);
  const [priceInputs, setPriceInputs] = useState({ amount: "", shipping: "0", source: "Manuell beobachtet" });
  const [latestPrices, setLatestPrices] = useState<Record<string, PriceObservation>>({});
  const [priceHistories, setPriceHistories] = useState<Record<string, PriceObservation[]>>({});
  const [visibleHistoryId, setVisibleHistoryId] = useState<string | null>(null);
  const [targetProductId, setTargetProductId] = useState<string | null>(null);
  const [productTargetInput, setProductTargetInput] = useState("");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("preispilot-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(savedTheme ? savedTheme === "dark" : prefersDark);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    window.localStorage.setItem("preispilot-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    let active = true;
    async function loadProducts() {
      try {
        const legacyProducts = JSON.parse(window.localStorage.getItem("preispilot-products") ?? "[]") as Array<{ url?: string }>;
        for (const legacyProduct of legacyProducts) {
          if (legacyProduct.url) {
            await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: legacyProduct.url }) });
          }
        }
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Produkte konnten nicht geladen werden.");
        const result = (await response.json()) as { products: TrackedProduct[] };
        if (active) {
          setTrackedProducts(result.products);
          const histories = await Promise.all(result.products.map(async (product) => {
            const historyResponse = await fetch(`/api/products/${encodeURIComponent(product.id)}/prices`);
            if (!historyResponse.ok) return null;
            const historyResult = (await historyResponse.json()) as { observations: PriceObservation[] };
            return historyResult.observations[0] ? [product.id, historyResult.observations[0]] as const : null;
          }));
          setLatestPrices(Object.fromEntries(histories.filter((entry): entry is readonly [string, PriceObservation] => entry !== null)));
        }
        window.localStorage.removeItem("preispilot-products");
      } catch {
        if (active) setNotice("Produkte konnten nicht aus der lokalen Datenbank geladen werden. Bitte prüfe, ob die Datenbank eingerichtet ist.");
      } finally {
        if (active) setProductsLoaded(true);
      }
    }
    const savedTarget = window.localStorage.getItem("preispilot-target-price");
    if (savedTarget && Number.isFinite(Number(savedTarget)) && Number(savedTarget) > 0) {
      setTargetPrice(savedTarget);
      setTargetInput(savedTarget);
    }
    void loadProducts();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (productsLoaded) window.localStorage.setItem("preispilot-target-price", targetPrice);
  }, [productsLoaded, targetPrice]);

  async function addProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!url.trim()) return;
    try {
      const parsedUrl = new URL(url.trim());
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error("Ungültiges Protokoll");
      const response = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: parsedUrl.toString() }) });
      const result = (await response.json()) as { product?: TrackedProduct; error?: string };
      if (!response.ok || !result.product) throw new Error(result.error ?? "Produkt konnte nicht gespeichert werden.");
      setTrackedProducts((products) => [result.product!, ...products]);
      setNotice("Produktlink wurde in deiner lokalen Datenbank gespeichert. Eine Preisabfrage folgt später.");
      setUrl("");
      setShowAdd(false);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Produkt konnte nicht gespeichert werden.");
    }
  }

  async function removeProduct(id: string) {
    try {
      const response = await fetch(`/api/products/${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Produkt konnte nicht entfernt werden.");
      setTrackedProducts((products) => products.filter((product) => product.id !== id));
      setLatestPrices((prices) => { const next = { ...prices }; delete next[id]; return next; });
      setPriceHistories((histories) => { const next = { ...histories }; delete next[id]; return next; });
      if (visibleHistoryId === id) setVisibleHistoryId(null);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Produkt konnte nicht entfernt werden.");
    }
  }

  async function saveProductTarget(event: React.FormEvent<HTMLFormElement>, productId: string) {
    event.preventDefault();
    const parsed = Number(productTargetInput.replace(",", "."));
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setNotice("Der Wunschpreis muss größer als null sein.");
      return;
    }
    try {
      const response = await fetch(`/api/products/${encodeURIComponent(productId)}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetPriceCents: Math.round(parsed * 100) }),
      });
      const result = (await response.json()) as { product?: TrackedProduct; error?: string };
      if (!response.ok || !result.product) throw new Error(result.error ?? "Wunschpreis konnte nicht gespeichert werden.");
      setTrackedProducts((products) => products.map((product) => product.id === productId ? result.product! : product));
      setTargetProductId(null);
      setNotice("Wunschpreis wurde für dieses Produkt gespeichert.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Wunschpreis konnte nicht gespeichert werden.");
    }
  }

  async function savePriceObservation(event: React.FormEvent<HTMLFormElement>, productId: string) {
    event.preventDefault();
    const amount = Number(priceInputs.amount.replace(",", "."));
    const shipping = Number(priceInputs.shipping.replace(",", "."));
    if (!Number.isFinite(amount) || amount <= 0 || !Number.isFinite(shipping) || shipping < 0) {
      setNotice("Bitte gib gültige Preise für Artikel und Versand ein.");
      return;
    }
    try {
      const response = await fetch(`/api/products/${encodeURIComponent(productId)}/prices`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountCents: Math.round(amount * 100), shippingCents: Math.round(shipping * 100), source: priceInputs.source }),
      });
      const result = (await response.json()) as { observation?: PriceObservation; error?: string };
      if (!response.ok || !result.observation) throw new Error(result.error ?? "Preis konnte nicht gespeichert werden.");
      setLatestPrices((prices) => ({ ...prices, [productId]: result.observation! }));
      setPriceHistories((histories) => histories[productId]
        ? { ...histories, [productId]: [result.observation!, ...histories[productId]] }
        : histories);
      setPriceEntryId(null);
      setPriceInputs({ amount: "", shipping: "0", source: "Manuell beobachtet" });
      setNotice("Preisbeobachtung wurde gespeichert.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Preis konnte nicht gespeichert werden.");
    }
  }

  async function togglePriceHistory(productId: string) {
    if (visibleHistoryId === productId) {
      setVisibleHistoryId(null);
      return;
    }
    setVisibleHistoryId(productId);
    if (priceHistories[productId]) return;
    try {
      const response = await fetch(`/api/products/${encodeURIComponent(productId)}/prices`);
      const result = (await response.json()) as { observations?: PriceObservation[]; error?: string };
      if (!response.ok || !result.observations) throw new Error(result.error ?? "Preisverlauf konnte nicht geladen werden.");
      setPriceHistories((histories) => ({ ...histories, [productId]: result.observations! }));
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Preisverlauf konnte nicht geladen werden.");
    }
  }

  function saveTargetPrice(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = Number(targetInput.replace(",", "."));
    if (!Number.isFinite(parsed) || parsed <= 0) return;
    setTargetPrice(parsed.toString());
    setTargetInput(parsed.toString());
    setEditingTarget(false);
    setNotice("Wunschpreis wurde auf diesem Gerät gespeichert. Benachrichtigungen folgen mit der Backend-Anbindung.");
  }

  return (
    <main className="app-shell">
      {showMobileNav && <button className="mobile-nav-backdrop" onClick={() => setShowMobileNav(false)} aria-label="Menü schließen" />}
      <aside className={`sidebar ${showMobileNav ? "mobile-open" : ""}`}>
        <a className="brand" href="#"><span className="brand-mark"><TrendingDown size={20} strokeWidth={2.5} /></span><span>preis<span className="brand-light">pilot</span></span></a>
        <div className="workspace-label">DEIN ÜBERBLICK</div>
        <nav className="side-nav"><a className="nav-item active" href="#" onClick={() => setShowMobileNav(false)}><LayoutDashboard size={18} />Übersicht</a><a className="nav-item" href="#produkte" onClick={() => setShowMobileNav(false)}><Package size={18} />Meine Produkte<span className="nav-count">{trackedProducts.length + 4}</span></a><a className="nav-item" href="#preisalarm" onClick={() => setShowMobileNav(false)}><Bell size={18} />Preisalarm</a></nav>
        <div className="side-bottom"><div className="source-note"><span className="source-icon"><ShieldCheck size={17} /></span><div><strong>Preise transparent<br />vergleichen.</strong><p>Quellen und Zeitstempel<br />folgen mit Live-Daten.</p></div></div><button className="nav-item settings" onClick={() => setDarkMode((current) => !current)} aria-label={darkMode ? "Zum hellen Modus wechseln" : "Zum dunklen Modus wechseln"}>{darkMode ? <Sun size={18} /> : <Moon size={18} />}{darkMode ? "Helles Design" : "Dunkles Design"}<span className={`theme-switch ${darkMode ? "on" : ""}`}><i /></span></button><div className="profile"><div className="avatar">P</div><div><strong>Paul</strong><span>Mein PreisPilot</span></div><MoreHorizontal size={19} className="profile-more" /></div></div>
      </aside>

      <section className="main-area">
        <header className="topbar"><button className="mobile-menu" onClick={() => setShowMobileNav((open) => !open)} aria-label={showMobileNav ? "Menü schließen" : "Menü öffnen"}>{showMobileNav ? <X size={20} /> : <Menu size={20} />}</button><div className="breadcrumb">Mein Bereich <span>/</span> <strong>Übersicht</strong></div><div className="top-actions"><span className="demo-dot" />Demo-Daten <button className="icon-button theme-top" onClick={() => setDarkMode((current) => !current)} aria-label={darkMode ? "Helles Design aktivieren" : "Dunkles Design aktivieren"}>{darkMode ? <Sun size={17} /> : <Moon size={17} />}</button><button className="icon-button" aria-label="Benachrichtigungen"><Bell size={18} /><i /></button></div></header>
        <div className="content">
          <div className="welcome-row"><div><div className="eyebrow"><Sparkles size={13} /> MIT GUTEM GEFÜHL SPAREN</div><h1>Guten Morgen, Paul<span className="wave">✳</span></h1><p className="subheading">Demoansicht · Preise und Angebote sind Beispieldaten.</p></div><button className="primary-button" onClick={() => { setNotice(""); setShowAdd(true); }}><Plus size={17} />Produkt hinzufügen</button></div>
          {notice && <div className="notice"><Check size={17} />{notice}<button onClick={() => setNotice("")} aria-label="Meldung schließen"><X size={16} /></button></div>}
          <div className="summary-grid"><article className="summary-card"><div className="summary-top"><span>Produkte im Blick</span><span className="summary-icon blue"><Package size={17} /></span></div><div className="summary-value">{String(trackedProducts.length + 4).padStart(2, "0")} <small>Produkte</small></div><div className="summary-foot"><span className="mini-dots"><i /><i /><i /><i /></span> Davon 2 mit Preisalarm</div></article><article className="summary-card"><div className="summary-top"><span>Gesamtersparnis</span><span className="summary-icon green"><ArrowDownRight size={18} /></span></div><div className="summary-value">128,50 <small>€</small></div><div className="summary-foot positive"><TrendingDown size={14} /> Im Vergleich zum Startpreis</div></article><article className="summary-card"><div className="summary-top"><span>Beste Gelegenheit</span><span className="summary-icon amber"><Sparkles size={17} /></span></div><div className="summary-value opportunity">iPhone 16 Pro</div><div className="summary-foot"><span className="deal-dot" /> 70 € unter dem 30-Tage-Schnitt</div></article></div>

          <div className="section-heading" id="produkte"><div><h2>Deine Preisbeobachtungen</h2><p>Deine Produkte und ihre Entwicklung auf einen Blick.</p></div><button className="text-button">Alle Produkte <ArrowRight size={15} /></button></div>

          {trackedProducts.length > 0 && <section className="tracked-links" aria-label="Vorgemerkte Produktlinks"><div className="tracked-heading"><div><strong>Vorgemerkte Produktlinks</strong><span>Auf diesem PreisPilot-Server gespeichert.</span></div><span className="local-badge"><Check size={12} /> SQLite</span></div>{trackedProducts.map((product) => {
            const observation = latestPrices[product.id];
            const totalPriceCents = observation ? observation.amountCents + observation.shippingCents : null;
            const targetReached = product.targetPriceCents !== null && totalPriceCents !== null && totalPriceCents <= product.targetPriceCents;
            return <div className="tracked-product" key={product.id}><div className="tracked-link"><div className="tracked-icon"><Package size={16} /></div><div className="tracked-info"><strong>{product.shop}</strong><span title={product.url}>{product.url}</span>{observation && <small>Zuletzt {(totalPriceCents! / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" })} · {observation.source} · {new Date(observation.observedAt).toLocaleString("de-DE")}</small>}{product.targetPriceCents !== null && <small className={targetReached ? "target-hit" : "target-pending"}>{targetReached ? "Preisalarm: Wunschpreis erreicht!" : `Wunschpreis: ${(product.targetPriceCents / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" })}`}</small>}</div><a href={product.url} target="_blank" rel="noreferrer" aria-label={`${product.shop} öffnen`}><ExternalLink size={15} /></a><button onClick={() => removeProduct(product.id)} aria-label={`${product.shop} entfernen`}><X size={15} /></button><div className="tracked-buttons"><button className="record-price-button" onClick={() => { setPriceEntryId(priceEntryId === product.id ? null : product.id); setNotice(""); }} aria-label={`Preis für ${product.shop} notieren`}>Preis notieren</button><button className="record-price-button" onClick={() => void togglePriceHistory(product.id)} aria-expanded={visibleHistoryId === product.id}>Verlauf</button><button className="record-price-button" onClick={() => { setProductTargetInput(product.targetPriceCents === null ? "" : (product.targetPriceCents / 100).toString()); setTargetProductId(targetProductId === product.id ? null : product.id); setNotice(""); }} aria-expanded={targetProductId === product.id}>Wunschpreis</button></div></div>{priceEntryId === product.id && <form className="price-entry-form" onSubmit={(event) => savePriceObservation(event, product.id)}><label>Artikelpreis (€)<input required type="number" min="0.01" step="0.01" value={priceInputs.amount} onChange={(event) => setPriceInputs({ ...priceInputs, amount: event.target.value })} /></label><label>Versand (€)<input required type="number" min="0" step="0.01" value={priceInputs.shipping} onChange={(event) => setPriceInputs({ ...priceInputs, shipping: event.target.value })} /></label><label>Quelle<input required maxLength={100} value={priceInputs.source} onChange={(event) => setPriceInputs({ ...priceInputs, source: event.target.value })} /></label><button className="primary-button" type="submit">Preis speichern</button></form>}{targetProductId === product.id && <form className="price-entry-form" onSubmit={(event) => saveProductTarget(event, product.id)}><label>Wunschpreis inklusive Versand (€)<input required type="number" min="0.01" step="0.01" value={productTargetInput} onChange={(event) => setProductTargetInput(event.target.value)} /></label><button className="primary-button" type="submit">Wunschpreis speichern</button></form>}{visibleHistoryId === product.id && <div className="tracked-history"><div className="tracked-history-heading"><strong>Erfasster Preisverlauf</strong><span>{priceHistories[product.id]?.length ?? 0} Beobachtungen · inklusive Versand</span></div>{priceHistories[product.id]?.length ? <div className="tracked-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={[...priceHistories[product.id]].reverse().map((item) => ({ tag: new Date(item.observedAt).toLocaleDateString("de-DE", { day: "2-digit", month: "short" }), preis: (item.amountCents + item.shippingCents) / 100, quelle: item.source }))} margin={{ top: 8, right: 10, left: 4, bottom: 0 }}><defs><linearGradient id={`trackedFill-${product.id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#20a879" stopOpacity={0.18} /><stop offset="95%" stopColor="#20a879" stopOpacity={0.01} /></linearGradient></defs><CartesianGrid vertical={false} stroke="var(--chart-grid)" strokeDasharray="3 5" /><XAxis dataKey="tag" axisLine={false} tickLine={false} tick={{ fill: "var(--chart-label)", fontSize: 9 }} /><YAxis width={68} domain={["dataMin - 25", "dataMax + 25"]} axisLine={false} tickLine={false} tick={{ fill: "var(--chart-label)", fontSize: 9 }} tickFormatter={(value) => `${Number(value).toLocaleString("de-DE")} €`} /><Tooltip formatter={(value, _name, item) => [`${Number(value).toLocaleString("de-DE", { minimumFractionDigits: 2 })} €`, item.payload.quelle]} contentStyle={{ borderRadius: 8, border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)", fontSize: 11 }} /><Area type="monotone" dataKey="preis" stroke="#1ca477" strokeWidth={2} fill={`url(#trackedFill-${product.id})`} dot={{ r: 3 }} activeDot={{ r: 4, fill: "#1ca477", stroke: "white", strokeWidth: 2 }} /></AreaChart></ResponsiveContainer></div> : <p className="tracked-history-empty">Noch keine Preisnotizen vorhanden. Erfasse einen Preis, dann erscheint der Verlauf hier.</p>}</div>}</div>;
          })}</section>}

          <div className="product-layout"><article className="product-card"><div className="product-head"><div className="product-title-wrap"><div className="product-image"><div className="phone"><span /></div></div><div><div className="product-kicker">SMARTPHONE · APPLE</div><h3>iPhone 16 Pro</h3><div className="product-variant">128 GB · Titan Natur</div></div></div><button className="dots-button" aria-label="Weitere Optionen"><MoreHorizontal size={19} /></button></div>
            <div className="price-row"><div><span className="muted-label">Bester Preis gerade</span><div className="big-price">929,00 <small>€</small></div></div><div className="savings-pill"><ArrowDownRight size={14} /> −70,00 €</div></div>
            <div className="chart-title"><span>Beispiel-Preisentwicklung</span><button>30 Tage <ChevronDown size={14} /></button></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={history} margin={{ top: 8, right: 6, left: -25, bottom: 0 }}><defs><linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#20a879" stopOpacity={0.18} /><stop offset="95%" stopColor="#20a879" stopOpacity={0.01} /></linearGradient></defs><CartesianGrid vertical={false} stroke="var(--chart-grid)" strokeDasharray="3 5" /><XAxis dataKey="tag" axisLine={false} tickLine={false} tick={{ fill: "var(--chart-label)", fontSize: 10 }} dy={9} /><YAxis domain={[900, 1020]} ticks={[920, 960, 1000]} axisLine={false} tickLine={false} tick={{ fill: "var(--chart-label)", fontSize: 10 }} tickFormatter={(v) => `${v} €`} /><Tooltip formatter={(v) => [`${Number(v).toLocaleString("de-DE")} €`, "Beispielpreis"]} contentStyle={{ borderRadius: 10, border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)", fontSize: 12 }} /><Area type="monotone" dataKey="wert" stroke="#1ca477" strokeWidth={2.5} fill="url(#priceFill)" activeDot={{ r: 5, fill: "#1ca477", stroke: "white", strokeWidth: 2 }} /></AreaChart></ResponsiveContainer></div><div className="chart-legend"><span><i /> Beispiel-Angebotspreis</span><span>Keine Live-Abfrage</span></div>
            <div className="target-box" id="preisalarm"><div className="target-icon"><Bell size={16} /></div>{editingTarget ? <form className="target-edit-form" onSubmit={saveTargetPrice}><label htmlFor="target-price-input">Wunschpreis in Euro</label><input id="target-price-input" type="number" min="1" step="0.01" value={targetInput} onChange={(event) => setTargetInput(event.target.value)} autoFocus required /><button type="submit" className="edit-target">Speichern</button><button type="button" className="cancel-target" onClick={() => { setTargetInput(targetPrice); setEditingTarget(false); }}>Abbrechen</button></form> : <><div className="target-copy"><strong>Dein Wunschpreis</strong><span>Wird lokal gespeichert · Alarm folgt später.</span></div><div className="target-price">{Number(targetPrice).toLocaleString("de-DE")} €</div><button className="edit-target" onClick={() => { setTargetInput(targetPrice); setEditingTarget(true); }}>Ändern</button></>}</div>
          </article>

          <article className="offers-card"><div className="offers-heading"><div><h3>Preisvergleich · Demo</h3><p>Beispielangebote, noch keine Händlerabfrage.</p></div><button className="help-button" aria-label="Information"><CircleHelp size={17} /></button></div><div className="best-banner"><div className="best-banner-icon"><Sparkles size={16} /></div><div><strong>Beispiel für den günstigsten Vergleichspreis</strong><span>Live-Preise werden nach Anbindung zulässiger Quellen angezeigt.</span></div></div><div className="offer-list">{offers.map((offer) => <div className={`offer-row ${offer.best ? "best-offer" : ""}`} key={offer.name}><div className={`merchant-logo ${offer.tone}`}>{offer.initials}</div><div className="merchant-detail"><strong>{offer.name}{offer.best && <span className="best-label">BEISPIEL</span>}</strong><span>{offer.shipping}</span></div><div className="offer-price"><strong>{offer.price}</strong><span>{offer.delivery}</span></div><a className="offer-link" href="#angebote" aria-label={`${offer.name} öffnen`}><ExternalLink size={15} /></a></div>)}</div><div className="offers-footer"><span><ShieldCheck size={14} /> Beispieldaten ohne Live-Status</span><button>Alle Angebote <ArrowRight size={14} /></button></div></article></div>

          <div className="bottom-note"><span><ShieldCheck size={15} /></span><p><strong>Transparenz ist uns wichtig.</strong> Diese Ansicht zeigt Beispieldaten. Echte Quellen und Abrufzeitpunkte erscheinen, sobald die Preisabfragen angebunden sind.</p><button aria-label="Mehr erfahren"><CircleHelp size={16} /></button></div>
          <footer>© 2026 PreisPilot <span>·</span> Preise clever im Blick <a href="#">Datenschutz</a><a href="#">Impressum</a></footer>
        </div>
      </section>

      {showAdd && <div className="modal-backdrop" onClick={(event) => { if (event.target === event.currentTarget) setShowAdd(false); }}><section className="add-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="modal-close" onClick={() => setShowAdd(false)} aria-label="Schließen"><X size={19} /></button><div className="modal-icon"><Link2 size={21} /></div><div className="eyebrow">NEUES PRODUKT</div><h2 id="modal-title">Was möchtest du beobachten?</h2><p>Füge einen Produktlink ein. PreisPilot merkt sich das Produkt für deinen Preisvergleich.</p><form onSubmit={addProduct}><label htmlFor="product-url">Produktlink</label><div className="input-wrap"><Link2 size={17} /><input id="product-url" type="url" required placeholder="https://www.amazon.de/dp/…" value={url} onChange={(event) => setUrl(event.target.value)} autoFocus /></div><div className="supported-sites"><span>Beliebte Shops</span><b>amazon</b><b>MediaMarkt</b><b>OTTO</b></div><button className="primary-button submit-button" type="submit"><Search size={16} />Produkt vormerken <ArrowRight size={15} /></button></form><div className="modal-foot"><ShieldCheck size={15} /> Link wird in der lokalen SQLite-Datenbank gespeichert.</div></section></div>}
    </main>
  );
}
