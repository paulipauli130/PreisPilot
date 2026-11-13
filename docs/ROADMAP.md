# Roadmap

## Phase 0 – Fundament ✓

- Produktvision und Abgrenzung dokumentiert
- modulare Zielarchitektur festgelegt
- Quellenstrategie und Integrationsregeln definiert
- Architekturentscheidung zur Datenquellen-Anbindung festgehalten

## Phase 1 – Technische Basis (in Arbeit)

- [x] Technologie-Stack für das Frontend festlegen: Next.js, React und TypeScript
- [x] Responsive Dashboard-Grundlage mit Diagramm erstellen
- [x] Hell-/Dunkelmodus mit lokal gespeicherter Auswahl ergänzen
- [x] Produktlinks lokal vormerken, wieder anzeigen und entfernen
- [x] Beispielpreise und Demoangebote klar als solche kennzeichnen
- [x] Mobile Navigation bedienbar machen
- [x] Wunschpreis lokal bearbeiten und speichern
- [x] Lokale Startanleitung dokumentieren
- [x] API und SQLite-Datenbank für Produktlinks einrichten
- [x] Datenmodell und Migration für Produkte und Preisbeobachtungen anlegen
- [x] API-Endpunkte für Preisverlauf-Snapshots ergänzen
- [x] Preisbeobachtungen manuell je gespeichertem Produkt erfassen und letzten Gesamtpreis anzeigen
- [x] Erfassten Preisverlauf pro Produkt grafisch darstellen
- [x] Wunschpreis je Produkt speichern und bei manuell erfasstem Preisziel visuell markieren
- [x] eBay-Browse-API Adapter, Angebotsdatenbank, Abrufstatus und Aktualisierung beim Hinzufügen/Öffnen ergänzen
- [ ] eBay-Produktionszugang beantragen und echte Abrufe mit Zugangsdaten prüfen
- [ ] Hintergrundaufgaben und Variantenmodell ergänzen
- [ ] Deployment-Ziel auswählen und einrichten

## Phase 2 – Erstes nutzbares Produkt

- Produkt manuell oder per Link anlegen
- [x] ersten legal verfügbaren Quellen-Adapter implementieren (eBay; Freischaltung erforderlich)
- Angebote vergleichen und Preisverlauf darstellen
- Benachrichtigungsversand ergänzen (E-Mail oder Push)

## Laufende Qualität und Dokumentation

Bei jeder Änderung werden README, Changelog und Roadmap an den erreichten Projektstand angepasst. Beiträge sollen bestehende Quellenregeln und die modulare Architektur berücksichtigen.

## Phase 3 – Datenquellen erweitern

- Amazon über freigegebenen API-Zugang
- Idealo und Geizhals über zulässige Partner-/Feed-Integration
- Quellenqualität, Aktualität und Preisabdeckung sichtbar machen

## Phase 4 – Reifegrad

- Benachrichtigungsversand
- Variantenabgleich und Dubletten-Erkennung
- Datenschutz, Monitoring, Tests und Betriebsdokumentation
