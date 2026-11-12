# Changelog

Alle relevanten Änderungen an PreisPilot werden hier nachvollziehbar festgehalten.

Das Format orientiert sich an [Keep a Changelog](https://keepachangelog.com/de/1.1.0/) und verwendet semantische Versionierung, sobald veröffentlichte Versionen existieren.

## [Unveröffentlicht]

### Hinzugefügt

- Manuelle Preisbeobachtungen für gespeicherte Produktlinks mit Artikelpreis, Versandkosten und frei benennbarer Quelle.
- Letzten erfassten Gesamtpreis samt Quelle und Zeitpunkt in der Produktlink-Liste anzeigen.
- Preisbeobachtungen beim Laden der Produktliste abrufen und nach dem Speichern direkt aktualisieren.
- Responsives deutschsprachiges Dashboard mit Produktübersicht, Preisvergleich und Preisverlaufsdiagramm.
- Umschaltbarer Hell-/Dunkelmodus; die Auswahl wird im Browser gespeichert und berücksichtigt beim ersten Aufruf die Systemeinstellung.
- Dialog zum Vormerken eines Produktlinks.
- Produktlinks über die API in SQLite speichern, wieder anzeigen und entfernen; doppelte Links werden erkannt.
- Next.js- und TypeScript-Projektkonfiguration sowie lokale Startanleitung.
- Deutsche CONTRIBUTING-Anleitung und fortlaufende Roadmap.
- ESLint-Konfiguration grenzt generierte Build-Dateien aus.
- Contributor-Anleitung enthält einen Datenschutzcheck für private lokale Pfade.
- Entwicklungsserver und Produktionsbuild verwenden getrennte Next.js-Ausgabeverzeichnisse.
- ESLint ignoriert die getrennten Entwicklungs- und Produktions-Buildordner.
- Contribution-Anleitung dokumentiert Build-, Lint- und Browserprüfungen für UI-Änderungen.
- Beispieldaten im Preisvergleich, Verlauf und Dashboard sind sichtbar von Live-Preisen unterschieden.
- Mobile Navigation lässt sich über das Menü öffnen, bedienen und wieder schließen.
- Wunschpreis lässt sich bearbeiten und lokal im Browser speichern.
- SQLite/Prisma-Grundlage mit Migration und lokaler Umgebungsvariablen-Vorlage.
- API-Endpunkte zum Speichern, Laden und Entfernen von Produktlinks.
- API zum Speichern und Lesen von Preis-Snapshots mit Artikelpreis, Versandkosten und Zeitstempel.
- Setup-Skript erstellt die SQLite-Datei auf einer frischen lokalen Installation.

### Noch nicht enthalten

- Das zentrale Dashboard-Diagramm und die Angebotsliste nutzen weiterhin Beispieldaten.
- Preise, Angebote und Verlauf sind weiterhin Beispieldaten; Live-Abfragen sind noch nicht angebunden.
- Wunschpreise lösen noch keine Benachrichtigung aus.
- Anmeldung, Datenbank, echte Preisalarme und Händler-Integrationen stehen aus.
