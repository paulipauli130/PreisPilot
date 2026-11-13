# Datenquellen und Integrationsregeln

## Grundsatz

„Kostenlos“ bedeutet nicht automatisch „frei nutzbar“. Jede Quelle wird vor dem Einsatz auf Nutzungsbedingungen, Zulässigkeit des Abrufs, Rate Limits, Datenumfang und Aktualität geprüft. Sparwache führt keine automatisierten Abrufe über Seiten aus, die dies nicht erlauben.

## Vorgesehene Quellen

| Quelle | Geplanter Zweck | Zugang für MVP | Status |
| --- | --- | --- | --- |
| Amazon | Link erkennen, Referenzangebot anzeigen | Amazon Creators API; Teilnahme- und Aktivitätskriterien | nicht angebunden |
| eBay | Händlerangebote und Vergleichspreise | Browse API, OAuth Client Credentials | Adapter vorhanden; Livezugang fehlt |
| Idealo | Preisvergleich im deutschen Markt | freigegebene Partner-/Händlerschnittstelle | nicht angebunden; vorhandene Händlerfeeds dienen dem Einstellen von Angeboten |
| Geizhals | Preisvergleich im DACH-Markt | offizielle Freigabe oder Partnerfeed | nicht angebunden |
| Open Food Facts | Produktdaten für Lebensmittel | öffentliche API | optional |
| Eigene Händlerfeeds | Angebote mit ausdrücklicher Freigabe | CSV, API oder Feed | später |

## Idealo und Geizhals

Idealo und Geizhals sind wichtige Vergleichsziele. Die Anbindung erfolgt ausschließlich über einen schriftlich oder technisch freigegebenen Weg. Bis eine passende Schnittstelle verfügbar ist, zeigt Sparwache keinen als vollständig behaupteten Marktvergleich an.

## eBay Browse API

Der Adapter unter `lib/pricing/ebay.ts` nutzt die offizielle Browse API zur Suche nach neuen Angeboten auf dem deutschen Marktplatz. Zugangsdaten kommen ausschließlich in `.env` (`EBAY_CLIENT_ID`, `EBAY_CLIENT_SECRET`); `.env.example` enthält nur leere Platzhalter. eBay beschränkt die produktive Nutzung der Buy APIs auf zugelassene Partner: Developer-App und OAuth-Schlüssel allein garantieren daher keinen Produktionszugriff. Ohne Schlüssel fragt die Anwendung keine Livepreise ab. Ist der Zugang aktiviert, aktualisiert sie beim Hinzufügen, beim Öffnen veralteter Beobachtungen und stündlich während die App geöffnet ist. Für echte Hintergrundläufe bei geschlossener App ist später ein gehosteter Scheduler nötig.

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

Bis automatische Quellen verfügbar sind, können Nutzer Preise manuell eintragen. Diese Beobachtungen enthalten Artikelpreis, Versandkosten, frei benannte Quelle und Erfassungszeitpunkt. Sie werden nicht als automatisch verifiziert dargestellt.

## Vor Aktivierung einer Quelle

1. Nutzungsbedingungen, Kosten und Rate Limits dokumentieren.
2. Zugangsdaten sicher hinterlegen – niemals im Repository.
3. Einwilligung, Attribution und Link-Anforderungen umsetzen.
4. Adapter mit Beispieldaten und Fehlerfällen testen.
5. Quelle im Produkt nur aktivieren, wenn Preis, Versand und Aktualität zuverlässig übermittelt werden.
