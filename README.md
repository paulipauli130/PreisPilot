# PreisPilot

**PreisPilot** ist ein deutschsprachiger, transparenter Preisvergleichs- und Preisverlauf-Tracker für Produkte im deutschen Markt.

> Status: frühe Web-App mit interaktivem Dashboard, lokaler Produktverwaltung über API und SQLite. Preise und Händlerangebote sind ausdrücklich als Demo gekennzeichnet; produktive Preisabfragen folgen.

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

Die Anwendung startet als responsive Web-App mit Next.js und TypeScript. Das Dashboard enthält einen Hell-/Dunkelmodus und einen lokal gespeicherten Demo-Wunschpreis. Produktlinks werden über die API in SQLite gespeichert und können entfernt werden. Für jeden gespeicherten Link lassen sich Artikelpreis, Versand, Quelle und Zeitpunkt manuell als Preisbeobachtung erfassen; der letzte erfasste Gesamtpreis wird am Link angezeigt und der Verlauf lässt sich als Diagramm öffnen. Zusätzlich kann pro Produkt ein Wunschpreis gespeichert werden. Liegt eine manuell erfasste Preisnotiz inklusive Versand darunter, markiert PreisPilot den erreichten Preisalarm. E-Mail-, Push- und automatische Händlerbenachrichtigungen gibt es noch nicht. Das zentrale Dashboard-Diagramm und Händlerangebote enthalten weiterhin klar gekennzeichnete Beispieldaten. Durch das mobile Layout ist die App auch auf dem Smartphone nutzbar; eine spätere PWA- oder App-Store-Version kann darauf aufbauen. Die Architekturdetails stehen in [docs/ARCHITEKTUR.md](docs/ARCHITEKTUR.md).

## Lokal starten

Voraussetzung: Node.js 20 oder neuer. In PowerShell kann bei gesperrten Skripten `npm.cmd` verwendet werden.

```powershell
npm.cmd install
Copy-Item .env.example .env
npm.cmd run db:generate
npm.cmd run db:migrate
npm.cmd run dev
```

Danach ist die Oberfläche unter http://localhost:3000 erreichbar. Produktlinks werden auf dem lokalen Server gespeichert; das Dashboard zeigt weiter gekennzeichnete Beispieldaten für Preise, Angebote und Verlauf. Für einen Produktionsbuild: `npm.cmd run build`.

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
