# DARC Mail Spam Analyzer

Privates Dokumentationsprojekt für eingehende Spam-Mails aus einem DARC-Postfach. Die statische Website zeigt ausgewählte Fälle mit Suche, Kategoriefilter und aufklappbaren Details.

## GitHub Pages

Im Repository unter **Settings → Pages → Build and deployment** die Quelle **Deploy from a branch** mit Branch **main** und Ordner **/docs** auswählen.

Für eine lokale Vorschau im Projektordner `python3 -m http.server 8000 --directory docs` starten und `http://localhost:8000/` aufrufen.

## Neuen Fall erfassen

In [docs/cases.json](docs/cases.json) einen neuen Eintrag nach dem Muster des ersten Falls ergänzen.

- `id` ist die eindeutige Fallnummer im Format Jahr plus laufende Nummer.
- `sent` ist die sichtbare Versandzeit mit UTC-Offset, zum Beispiel `2026-11-25T10:04:54+01:00`. Die Seite zeigt sie in der Zeitzone Europa/Berlin.
- `mailbox` beschreibt das tatsächliche Postfach in anonymisierter Form. Mit `visibleTo` lässt sich ein abweichendes An-Feld festhalten.
- `sender` und `domain` stammen aus dem sichtbaren Von-Feld. Domains mit `[.]` entschärfen.
- `summary`, `excerpt` und `findings` enthalten die Zusammenfassung, einen Klartextauszug und die Einordnung. Unbekannte technische Details als offen kennzeichnen.

Das Repository und die Seite sind öffentlich. Vor jedem Commit persönliche Daten, Mailadressen, Original-Header, Anhänge, Tracking-IDs und aktive Ziele aus dem Eintrag entfernen. Originalmails bleiben im eigenen Postfach.
