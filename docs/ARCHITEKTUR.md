# Architektur

## Leitidee

Sparwache wird als modularer Monolith entwickelt. Das hält die erste Version einfach betreibbar und lässt sich später bei Bedarf in getrennte Dienste aufteilen.

```text
Web-App
   │
API ── Produkt- & Angebotslogik ── Datenbank
   │                 │
   │                 └── Preisverlauf / Benachrichtigungen
   │
Quellen-Adapter ── Amazon | eBay | Idealo | Geizhals | weitere
```

## Fachliche Bausteine

| Baustein | Verantwortung |
| --- | --- |
| Produktaufnahme | Link validieren, Händler erkennen, Produkt identifizieren |
| Produktkatalog | Normalisierte Produkte, Varianten und Merkmale verwalten |
| Quellen-Adapter | Eine externe Quelle kapseln und in ein einheitliches Angebotsformat überführen |
| Angebotsvergleich | Angebote zusammenführen, Preise inklusive Versand berechnen, sortieren |
| Preisverlauf | Zeitstempel und Preis-Snapshots unveränderlich speichern |
| Zielpreise | Regeln pro Nutzer und Produkt prüfen |
| Benachrichtigungen | E-Mail oder Push bei relevanten Preisereignissen senden |

## Kernobjekte

- **Produkt**: kanonisches Produkt, etwa „Apple iPhone 16, 128 GB, Schwarz“
- **Variante**: technische Ausprägung eines Produkts, etwa Speicher, Farbe oder Modellnummer
- **Angebot**: Preis eines Händlers für eine konkrete Variante zu einem Zeitpunkt
- **Preis-Snapshot**: historischer Messwert eines Angebots
- **Beobachtung**: Nutzer verfolgt ein Produkt mit optionalem Zielpreis
- **Quelle**: Adapter und Nutzungsstatus einer Datenquelle

Die genauen Felder und Beziehungen werden vor dem Datenbankschema in einer separaten ADR festgeschrieben.

## Schnittstellenprinzip

Die erste lokale API stellt Produktlinks unter `/api/products` bereit. `PATCH /api/products/:id` speichert oder entfernt einen Wunschpreis. Preis-Snapshots werden pro Produkt unter `/api/products/:id/prices` gelesen und angelegt. Preis- und Zielbeträge werden als ganze Cent-Beträge gespeichert, damit Rundungsfehler vermieden werden. Das UI markiert den Preisalarm, wenn der zuletzt erfasste Gesamtpreis (Artikel plus Versand) das Ziel erreicht. Diese Auswertung läuft beim Laden der Daten; ein Hintergrunddienst und externe Benachrichtigungen sind noch nicht eingerichtet.

Quellen werden über eine einheitliche Adapter-Schnittstelle angebunden:

```text
Quelle abrufen → Rohantwort prüfen → Angebot normalisieren → Snapshot speichern
```

Ein Adapter liefert mindestens Händlername, Produkt-/Variantenbezug, Gesamtpreis, Währung, Verfügbarkeit, Quell-URL und Abrufzeit. Fehler einer einzelnen Quelle dürfen weder Vergleich noch Preisverlauf anderer Quellen blockieren.

## Nicht-funktionale Anforderungen

- Preise immer mit Quelle und Zeitpunkt anzeigen
- Gesamtpreis (Artikel + Versand) deutlich vom reinen Artikelpreis unterscheiden
- Produktvarianten nicht automatisch vermischen
- Rate Limits, Caching und Wiederholungen je Quelle beachten
- Personenbezogene Daten minimieren; Benachrichtigungen nur mit Einwilligung
- Zugänge und Schlüssel ausschließlich als Umgebungsvariablen verwalten
