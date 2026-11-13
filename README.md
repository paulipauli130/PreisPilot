# PreisPilot

<p align="center">
  <img src="public/preispilot-logo.svg" alt="PreisPilot – Preise im Blick" width="420" />
</p>

<p align="center"><strong>Preise im Blick. Gute Käufe im Gefühl.</strong><br />Ein deutschsprachiger Preisvergleich und Preisverlauf-Tracker für deine Produkte.</p>

<p align="center">
  <a href="docs/ROADMAP.md">Roadmap</a> · <a href="docs/DATENQUELLEN.md">Datenquellen</a> · <a href="CONTRIBUTING.md">Mitmachen</a> · <a href="CHANGELOG.md">Changelog</a>
</p>

---

**PreisPilot** ist ein deutschsprachiger, transparenter Preisvergleichs- und Preisverlauf-Tracker für Produkte im deutschen Markt.

> Status: frühe Web-App mit interaktivem Dashboard, SQLite-Produktverwaltung und vorbereitetem eBay-Liveadapter. Live-Abrufe benötigen gültige eBay-API-Zugangsdaten und Produktionsfreigabe; ohne diese werden keine Livepreise vorgetäuscht.

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

Die Anwendung ist eine responsive Web-App mit Next.js und TypeScript. Produktlinks werden über die API in SQLite gespeichert; Nutzer können optional einen präzisen Produktnamen ergänzen. Mit eBay-Zugangsdaten fragt der Server beim Hinzufügen, beim Öffnen für veraltete Produkte und danach stündlich aktuelle eBay-Angebote ab. Der Server speichert Angebot, Händler, Preis, Versand und Abrufzeitpunkt. Preisbeobachtungen lassen sich außerdem manuell erfassen und als Verlauf ansehen. Das zentrale Dashboard-Diagramm enthält weiterhin Beispieldaten. Wunschpreise werden je Produkt gespeichert; E-Mail- und Push-Alarme sind noch nicht verfügbar. Das mobile Layout und der Hell-/Dunkelmodus sind vorbereitet. Architekturdetails stehen in [docs/ARCHITEKTUR.md](docs/ARCHITEKTUR.md).

## Lokal starten

Voraussetzung: Node.js 20 oder neuer. In PowerShell kann bei gesperrten Skripten `npm.cmd` verwendet werden.

```powershell
npm.cmd install
Copy-Item .env.example .env
npm.cmd run db:generate
npm.cmd run db:migrate
npm.cmd run dev
```

Danach ist die Oberfläche unter http://localhost:3000 erreichbar. Für eBay-Liveangebote trage `EBAY_CLIENT_ID` und `EBAY_CLIENT_SECRET` aus deiner eBay-Developer-App in `.env` ein und starte den Server neu. `EBAY_SANDBOX="false"` wählt die Produktionsumgebung; dafür muss eBay deine Anwendung für die Browse API freigeschaltet haben. Optional setzt `EBAY_POSTAL_CODE` einen Lieferort zur Versandschätzung. Ohne Schlüssel bleibt der Adapter deaktiviert. Für einen Produktionsbuild: `npm.cmd run build`.

Die Datenbankverbindung steht in `.env`; als Vorlage dient [.env.example](.env.example). Prisma speichert die lokale SQLite-Datenbank in `prisma/preispilot.db`. `db:migrate` bereitet die lokale Datei vor und wendet eingecheckte Migrationen an. `db:deploy` wendet Migrationen ohne Entwicklungsmodus an. Der Entwicklungsserver schreibt nach `.next-development`, der Produktionsbuild nach `.next`; so überschreibt ein Build während der Entwicklung keine laufenden Browser-Assets.

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

Die nächsten umsetzbaren Arbeitspakete stehen in [docs/ROADMAP.md](docs/ROADMAP.md).
