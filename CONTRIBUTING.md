# Mitwirken bei PreisPilot

Danke für dein Interesse an PreisPilot. Diese Anleitung beschreibt den aktuellen Entwicklungsablauf.

## Entwicklungsumgebung

- Node.js 20 oder neuer
- Git
- npm (unter PowerShell bei blockiertem `npm.ps1` die Befehle als `npm.cmd` ausführen)

```powershell
cd <Projektordner>
npm.cmd install
Copy-Item .env.example .env
npm.cmd run db:generate
npm.cmd run db:migrate
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
6. Prüfe vor dem Commit, dass keine privaten lokalen Dateipfade, Benutzernamen oder persönlichen Verzeichnisnamen in Dateien oder Beispielen stehen. Verwende relative Pfade wie `app/page.tsx` und neutrale Platzhalter wie `<Projektordner>`.
7. Beschreibe Änderungen mit einer klaren Commit-Nachricht, zum Beispiel `feat: Preisalarm-Einstellungen ergänzen` oder `docs: Integrationsstatus aktualisieren`.

## Vor dem Abschluss prüfen

- `npm.cmd run lint` und `npm.cmd run build` müssen erfolgreich laufen.
- Öffne die laufende Anwendung im Browser und prüfe die betroffenen Bereiche visuell. Bei Änderungen am Layout mindestens Dashboard und Produktlink-Dialog ansehen.
- Prüfe den Hell- und Dunkelmodus sowie eine schmale/mobile Fensterbreite, wenn sich die Oberfläche ändert.
- Kontrolliere die Browserkonsole auf Laufzeitfehler und verifiziere, dass Diagramme und Bedienelemente sichtbar sind.
- Wenn du einen Produktionsbuild ausführst, läuft dessen Ausgabe getrennt vom Dev-Server (`.next` gegenüber `.next-development`).

## Datenquellen

Integriere ausschließlich offiziell freigegebene APIs, Partnerprogramme oder Händlerfeeds. Dokumentiere Nutzungsbedingungen, Limits, Attribution und erforderliche Zugangsdaten in [docs/DATENQUELLEN.md](docs/DATENQUELLEN.md). Unautorisierte Abrufe und Scraping sind kein vorgesehener Integrationsweg.

## Fehler und Funktionsideen

Nutze die Vorlagen unter `.github/ISSUE_TEMPLATE/`, damit Problem, gewünschtes Ergebnis und Akzeptanzkriterien nachvollziehbar sind.
