# Mitwirken bei PreisPilot

Danke für dein Interesse an PreisPilot. Diese Anleitung beschreibt den aktuellen Entwicklungsablauf.

## Entwicklungsumgebung

- Node.js 20 oder neuer
- Git
- npm (unter PowerShell bei blockiertem `npm.ps1` die Befehle als `npm.cmd` ausführen)

```powershell
cd C:\Users\paulb\Documents\GitHub\PreisPilot
npm.cmd install
npm.cmd run dev
```

Die lokale Anwendung läuft unter http://localhost:3000. Weitere verfügbare Befehle:

```powershell
npm.cmd run lint
npm.cmd run build
```

## Änderungen vorbereiten

1. Prüfe [Roadmap](docs/ROADMAP.md), [Architektur](docs/ARCHITEKTUR.md) und [Datenquellen](docs/DATENQUELLEN.md), bevor du neue Funktionen oder Integrationen beginnst.
2. Halte Oberflächentexte auf Deutsch und berücksichtige Desktop, Tablet sowie Smartphone.
3. Achte darauf, dass neue UI-Elemente im Hell- und Dunkelmodus lesbar sind.
4. Speichere keine API-Schlüssel, Zugangsdaten oder personenbezogenen Beispieldaten im Repository.
5. Ergänze bei jeder relevanten Änderung README, CHANGELOG und Roadmap, damit die Dokumentation zum tatsächlichen Stand passt.
6. Beschreibe Änderungen mit einer klaren Commit-Nachricht, zum Beispiel `feat: Preisalarm-Einstellungen ergänzen` oder `docs: Integrationsstatus aktualisieren`.

## Datenquellen

Integriere ausschließlich offiziell freigegebene APIs, Partnerprogramme oder Händlerfeeds. Dokumentiere Nutzungsbedingungen, Limits, Attribution und erforderliche Zugangsdaten in [docs/DATENQUELLEN.md](docs/DATENQUELLEN.md). Unautorisierte Abrufe und Scraping sind kein vorgesehener Integrationsweg.

## Fehler und Funktionsideen

Nutze die Vorlagen unter `.github/ISSUE_TEMPLATE/`, damit Problem, gewünschtes Ergebnis und Akzeptanzkriterien nachvollziehbar sind.
