# PreisPilot

**PreisPilot** ist ein deutschsprachiger, transparenter Preisvergleichs- und Preisverlauf-Tracker für Produkte im deutschen Markt.

> Status: frühes Frontend-Grundgerüst mit interaktivem Dashboard und lokal gespeicherten Produktlinks. Preise und Händlerangebote sind ausdrücklich als Demo gekennzeichnet; Backend und produktive Preisabfragen folgen.

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

Die Anwendung startet als responsive Web-App mit Next.js und TypeScript. Das Dashboard enthält einen lokal gespeicherten Hell-/Dunkelmodus, eine Preisverlaufsvisualisierung und lokale Produktlink-Vormerkungen mit Entfernen-Funktion. Beispielpreise und Angebote sind sichtbar als Demo gekennzeichnet. Links bleiben derzeit im Browser des verwendeten Geräts; es findet noch keine automatische Preissuche statt. Durch das mobile Layout ist die App auch auf dem Smartphone nutzbar; eine spätere PWA- oder App-Store-Version kann darauf aufbauen. Die Architekturdetails stehen in [docs/ARCHITEKTUR.md](docs/ARCHITEKTUR.md).

## Lokal starten

Voraussetzung: Node.js 20 oder neuer. In PowerShell kann bei gesperrten Skripten `npm.cmd` verwendet werden.

```bash
npm.cmd install
npm.cmd run dev
```

Danach ist die Oberfläche unter http://localhost:3000 erreichbar. Alternativ funktionieren `npm install` und `npm run dev` in Terminals, die npm direkt ausführen dürfen. Für einen Produktionsbuild: `npm.cmd run build`.

Entwicklungsserver und Produktionsbuild verwenden getrennte Ausgabeverzeichnisse, damit ein Build während der Entwicklung keine laufenden Browser-Assets überschreibt.

## Projektstand und Mitarbeit

- Änderungen und noch offene Aufgaben: [CHANGELOG.md](CHANGELOG.md)
- Roadmap: [docs/ROADMAP.md](docs/ROADMAP.md)
- Beiträge und Entwicklungsablauf: [CONTRIBUTING.md](CONTRIBUTING.md)
- Änderungen an der Oberfläche werden vor Abschluss auch im Browser geprüft; Details stehen in [CONTRIBUTING.md](CONTRIBUTING.md#vor-dem-abschluss-prüfen).
- Architektur: [docs/ARCHITEKTUR.md](docs/ARCHITEKTUR.md)
- Datenquellen: [docs/DATENQUELLEN.md](docs/DATENQUELLEN.md)

## Datenquellen – ehrlich eingeordnet

PreisPilot verwendet nur Quellen, deren Nutzung technisch und rechtlich zulässig ist. Eine Übersicht der vorgesehenen Integrationswege, Freikontingente und Grenzen steht in [docs/DATENQUELLEN.md](docs/DATENQUELLEN.md).

Insbesondere gilt: Idealo und Geizhals werden als Vergleichsquellen eingeplant, aber erst über eine freigegebene Partner- oder Feed-Schnittstelle aktiviert. Kein unautorisierter Abruf und kein Scraping.

## Nächste Etappe

Die ersten umsetzbaren Arbeitspakete stehen in [docs/ROADMAP.md](docs/ROADMAP.md). Vor dem Programmieren wird der Technologie-Stack gemeinsam festgelegt.
