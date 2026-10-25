# Prudentis AI

### Verstehe dein Geld. Schaffe Platz für das, was dir wichtig ist.

Prudentis AI ist eine Fullstack-Demo für persönliche Finanzen. Die Anwendung verbindet Konten, Einnahmen, Ausgaben und Budgets mit interaktiven Diagrammen. Im Code sind außerdem KI-gestützte Belegerfassung, wiederkehrende Buchungen und monatliche E-Mail-Berichte angelegt.

[English README](README.md) · [Einrichtung](docs/SETUP.md) · [Demo-Anleitung](docs/DEMO.md) · [Architektur](docs/ARCHITECTURE.md)

![Echte Analyse-Komponenten von Prudentis AI, im Browser mit Beispieldaten aufgenommen](docs/images/analytics-preview.png)

*Echte Komponenten aus der Anwendung in einer separaten Vorschau. Die Daten sind fiktiv; der Rahmen der Vorschauseite gehört nicht zum angemeldeten Dashboard.*

## Was das Projekt zeigt

- **Konten verwalten:** Giro- und Sparkonten mit Kontostand, Standardkonto und Sammelaktionen.
- **Buchungen organisieren:** Einnahmen und Ausgaben erfassen, kategorisieren, bearbeiten und filtern.
- **Muster erkennen:** aktuelle Transaktionen, monatliche Ausgabenkategorien und Zeitverläufe vergleichen.
- **Budgets verfolgen:** ein Monatsbudget pro Nutzer, bezogen auf das Standardkonto.
- **Automatisierung erproben:** Belegscan mit Gemini, wiederkehrende Buchungen mit Inngest sowie Budgetwarnungen und Monatsberichte mit Resend.

Die Konten werden innerhalb der App verwaltet. Eine Bankanbindung, Zahlungsabwicklung oder Buchhaltung in unterschiedlichen Kontowährungen ist nicht implementiert. Das alte Gemini-Modell wurde durch eine gemeinsame, konfigurierbare Modellanbindung ersetzt.

**Die gehostete Demo wird nur auf Anfrage aktiviert.** Die [Demo-Anleitung](docs/DEMO.md#request-a-demo) erklärt den Kontaktweg. Es wird keine ständig aktive öffentliche Demo vorausgesetzt.

## Sofort ausprobieren — ohne Zugangsdaten

Mit Node.js 22 und npm:

```sh
git clone https://github.com/CodeCoderCodingCode/PrudentisAI-Demo.git
cd PrudentisAI-Demo
npm ci --legacy-peer-deps
npm run preview
```

Öffne **[127.0.0.1:3001](http://127.0.0.1:3001)**. Dort lassen sich die originalen Diagramm-Komponenten mit Beispieldaten bedienen: Konto wechseln, Kategorien ansehen und Zeiträume umschalten. Unter **[/reports](http://127.0.0.1:3001/reports)** wird die originale E-Mail-Vorlage mit fiktiven Werten angezeigt.

Die Vorschau ist eine eigenständige lokale App im Ordner `preview/`. Sie benötigt keine Anmeldung, Datenbank oder API-Schlüssel, speichert keine Buchungen und versendet keine E-Mails. Die Beispielhinweise im Bericht sind von Hand formuliert. Die Screenshots sind Browseraufnahmen dieser Komponenten und keine künstlich erzeugten Bilder.

## Vollständige Anwendung einrichten

Für die eigentliche App brauchst du PostgreSQL, eine Clerk-Entwicklungsinstanz und einen Arcjet-Schlüssel:

1. Abhängigkeiten wie oben installieren.
2. `.env.example` nach `.env` kopieren und die eigenen Zugangsdaten eintragen.
3. Mit `npx prisma migrate deploy` die vorhandene Datenbankmigration anwenden.
4. `npm run dev` starten und [localhost:3000](http://localhost:3000) öffnen.
5. Registrieren, ein Konto anlegen und erste Testbuchungen erfassen.

Gemini, Resend, Inngest und Open Exchange Rates werden für die jeweiligen Zusatzfunktionen benötigt. Die ausführliche [Einrichtungsanleitung](docs/SETUP.md) erklärt Variablen, Hintergrundjobs und typische Fehler.

## Technischer Aufbau

Next.js 15 und React 19 bilden die Anwendung. Die Oberfläche nutzt Tailwind CSS, Radix-Komponenten und Recharts. Server Actions greifen über Prisma 6 auf PostgreSQL zu. Clerk übernimmt die Anmeldung, Arcjet ergänzt den Schutz von Anfragen. Gemini ist für Belegauswertung und Berichtshinweise vorgesehen; Inngest führt Hintergrundjobs aus, Resend versendet die mit React Email erstellten Nachrichten.

## Stand und Grenzen

Das Projekt ist eine Demo. Belegscan und Monatsberichte verwenden jetzt gemeinsam `GEMINI_MODEL`, standardmäßig `gemini-3.5-flash-lite`. Der Free-Tarif des Demo-Projekts ohne aktivierte Abrechnung wurde in AI Studio bestätigt. Ein echter API-Test mit erfundenem Belegtext lieferte die erwarteten JSON-Daten. Die tatsächlichen Kontingente sind projektabhängig. Der Belegscan benötigt eine Anmeldung und begrenzt Versuche auf fünf pro Nutzer mit Auffüllung nach 24 Stunden. Der Bildscan über die angemeldete Oberfläche und der Berichtversand müssen separat geprüft werden. Siehe [KI kostenlos einrichten](docs/AI.md).

Der alte Seed-Endpunkt ist deaktiviert und antwortet mit HTTP 410. Das bisherige Skript mit festen IDs wird darüber nicht mehr ausgeführt. Next.js und seine Prüfkonfiguration wurden auf die abgesicherte Version 15.5.28 aktualisiert; geschützte Routen und die Anmeldeweiterleitung sind korrigiert.

Nutzerzahlen und Testimonials auf der Landingpage sind Beispieltexte. Die neue Vorschau zeigt echte Komponenten, prüft jedoch keine Anmeldung, Datenbankverbindung, KI-Antworten oder E-Mail-Zustellung. Details und weitere offene Punkte stehen im [englischen README](README.md#project-status).

Mit `npm run lint` prüfst du den Code, mit `npm run preview:build` den Build der unabhängigen Vorschau. Das Repository enthält derzeit keine Lizenzdatei; kläre Nutzungsrechte mit dem Eigentümer.
