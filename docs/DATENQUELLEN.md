# Datenquellen und Integrationsregeln

## Grundsatz

„Kostenlos“ bedeutet nicht automatisch „frei nutzbar“. Jede Quelle wird vor dem Einsatz auf Nutzungsbedingungen, Zulässigkeit des Abrufs, Rate Limits, Datenumfang und Aktualität geprüft. PreisPilot führt keine automatisierten Abrufe über Seiten aus, die dies nicht erlauben.

## Vorgesehene Quellen

| Quelle | Geplanter Zweck | Zugang für MVP | Status |
| --- | --- | --- | --- |
| Amazon | Link erkennen, Referenzangebot anzeigen | Amazon Product Advertising API; setzt Teilnahme am Partnerprogramm voraus | zu prüfen |
| eBay | Händlerangebote und Vergleichspreise | eBay Browse API mit kostenlosem Entwicklerzugang | Kandidat |
| Idealo | Preisvergleich im deutschen Markt | offizielle Partner-/Affiliate-Schnittstelle oder freigegebener Datenfeed | zu prüfen |
| Geizhals | Preisvergleich im DACH-Markt | offizielle Partner-/Affiliate-Schnittstelle oder freigegebener Datenfeed | zu prüfen |
| Open Food Facts | Produktdaten für Lebensmittel | öffentliche API | optional |
| Eigene Händlerfeeds | Angebote mit ausdrücklicher Freigabe | CSV, API oder Feed | später |

## Idealo und Geizhals

Idealo und Geizhals sind wichtige Vergleichsziele. Die Anbindung erfolgt ausschließlich über einen schriftlich oder technisch freigegebenen Weg. Bis eine passende Schnittstelle verfügbar ist, zeigt PreisPilot keinen als vollständig behaupteten Marktvergleich an.

## Einheitliches Angebotsformat

Jeder Adapter übergibt:

```json
{
  "source": "ebay",
  "merchant": "Beispielhandel",
  "productReference": "externe-id",
  "itemPrice": 699.00,
  "shippingPrice": 0.00,
  "totalPrice": 699.00,
  "currency": "EUR",
  "availability": "in_stock",
  "url": "https://…",
  "observedAt": "2026-11-12T00:00:00Z"
}
```

## Vor Aktivierung einer Quelle

1. Nutzungsbedingungen, Kosten und Rate Limits dokumentieren.
2. Zugangsdaten sicher hinterlegen – niemals im Repository.
3. Einwilligung, Attribution und Link-Anforderungen umsetzen.
4. Adapter mit Beispieldaten und Fehlerfällen testen.
5. Quelle im Produkt nur aktivieren, wenn Preis, Versand und Aktualität zuverlässig übermittelt werden.
