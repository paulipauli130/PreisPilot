# ADR 0001: Modularer Monolith mit Quellen-Adaptern

- **Status:** angenommen
- **Datum:** 2026-11-12

## Kontext

PreisPilot muss mehrere heterogene Preis- und Produktdatenquellen verarbeiten. Gleichzeitig soll die erste Version übersichtlich zu entwickeln und günstig zu betreiben sein.

## Entscheidung

Wir starten mit einem modularen Monolithen. Jede externe Datenquelle erhält einen eigenen Adapter hinter einer gemeinsamen Schnittstelle. Fachlogik für Produktabgleich, Preisberechnung und Preisverlauf bleibt unabhängig von einzelnen Quellen.

## Folgen

- Neue Quellen können ohne Änderungen an Oberfläche oder Preisverlauf ergänzt werden.
- Eine Quelle kann bei Fehlern oder rechtlichen Änderungen deaktiviert werden.
- Die Anwendung bleibt zunächst einfach deploybar.
- Bei steigender Last lassen sich Hintergrundjobs oder Adapter später separat auslagern.
