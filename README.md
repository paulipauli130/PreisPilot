# PreisPilot

**PreisPilot** ist ein deutschsprachiger, transparenter Preisvergleichs- und Preisverlauf-Tracker für Produkte im deutschen Markt.

> Status: Grundstruktur und Produktkonzept. Noch keine produktive Datenerhebung.

## Zielbild

Ein Nutzer fügt beispielsweise einen Amazon-Link für ein iPhone ein. PreisPilot erkennt das Produkt, zeigt vergleichbare Angebote mehrerer Händler, ordnet Preise verständlich ein und verfolgt die Entwicklung über Zeit. Preisbenachrichtigungen informieren nur dann, wenn ein selbst gesetztes Ziel erreicht ist.

## Die Kernfunktionen

- **Produkt per Link hinzufügen** – Start mit Amazon, später weitere Händler
- **Angebote vergleichen** – Händler, Gesamtpreis, Versand, Verfügbarkeit und Aktualität auf einen Blick
- **Preisentwicklung verstehen** – klare Tages-, Wochen- und Monatsansicht statt unübersichtlicher Rohdaten
- **Zielpreis verfolgen** – Benachrichtigung bei Preisfall oder Wunschpreis
- **Nachvollziehbare Daten** – Quelle, Zeitpunkt und Preisbestandteile werden immer ausgewiesen

## Projektstruktur

```text
.github/       Vorlagen für die Zusammenarbeit
docs/          Produkt-, Architektur- und Entscheidungsdokumentation
  adr/         Architekturentscheidungen
```

Die Anwendung startet als responsive Web-App mit Next.js und TypeScript. Durch das mobile Layout ist sie auch auf dem Smartphone nutzbar; eine spätere PWA- oder App-Store-Version kann darauf aufbauen. Die Architekturdetails stehen in [docs/ARCHITEKTUR.md](docs/ARCHITEKTUR.md).

## Lokal starten

Voraussetzung: Node.js 20 oder neuer.

```bash
npm install
npm run dev
```

Danach ist die Oberfläche unter http://localhost:3000 erreichbar. Die aktuelle Dashboard-Ansicht verwendet Beispieldaten. Echte Preisabfragen werden ergänzt, sobald passende offizielle API- oder Partnerzugänge feststehen.

## Datenquellen – ehrlich eingeordnet

PreisPilot verwendet nur Quellen, deren Nutzung technisch und rechtlich zulässig ist. Eine Übersicht der vorgesehenen Integrationswege, Freikontingente und Grenzen steht in [docs/DATENQUELLEN.md](docs/DATENQUELLEN.md).

Insbesondere gilt: Idealo und Geizhals werden als Vergleichsquellen eingeplant, aber erst über eine freigegebene Partner- oder Feed-Schnittstelle aktiviert. Kein unautorisierter Abruf und kein Scraping.

## Nächste Etappe

Die ersten umsetzbaren Arbeitspakete stehen in [docs/ROADMAP.md](docs/ROADMAP.md). Vor dem Programmieren wird der Technologie-Stack gemeinsam festgelegt.
