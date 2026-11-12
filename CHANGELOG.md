# Changelog

Alle relevanten Änderungen an PreisPilot werden hier nachvollziehbar festgehalten.

Das Format orientiert sich an [Keep a Changelog](https://keepachangelog.com/de/1.1.0/) und verwendet semantische Versionierung, sobald veröffentlichte Versionen existieren.

## [Unveröffentlicht]

### Hinzugefügt

- Responsives deutschsprachiges Dashboard mit Produktübersicht, Preisvergleich und Preisverlaufsdiagramm.
- Umschaltbarer Hell-/Dunkelmodus; die Auswahl wird im Browser gespeichert und berücksichtigt beim ersten Aufruf die Systemeinstellung.
- Dialog zum Vormerken eines Produktlinks.
- Produktlinks lokal im Browser speichern, wieder anzeigen und entfernen; doppelte Links werden erkannt.
- Next.js- und TypeScript-Projektkonfiguration sowie lokale Startanleitung.
- Deutsche CONTRIBUTING-Anleitung und fortlaufende Roadmap.
- ESLint-Konfiguration grenzt generierte Build-Dateien aus.
- Contributor-Anleitung enthält einen Datenschutzcheck für private lokale Pfade.

### Noch nicht enthalten

- Das Dashboard nutzt Beispieldaten.
- Produktlinks werden nur lokal im Browser gespeichert und noch nicht an ein Backend gesendet; Preise werden noch nicht live abgerufen.
- Anmeldung, Datenbank, echte Preisalarme und Händler-Integrationen stehen aus.
