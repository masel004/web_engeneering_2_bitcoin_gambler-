# Bitcoin Gambler

## Überblick

Bitcoin Gambler ist eine Wett-Plattform, auf der Nutzer Vorhersagen über die Bitcoin-Kursentwicklung abgeben können. Der aktuelle Bitcoin-Kurs wird live über die CoinGecko-API abgerufen. Nutzer können Guthaben einzahlen, Wetten platzieren und ihre Transaktionshistorie einsehen.

---

## Tech-Stack

| Bereich | Technologie |
|---|---|
| Backend | Java 21, Spring Boot 3.5, Maven |
| Datenbank | PostgreSQL 16 (Docker) |
| Frontend | React 18, Vite, React Router |
| Tests | JUnit 5, Mockito, H2 In-Memory |
| Externe API | CoinGecko (Bitcoin-Kurs) |
| Backend-Port | 8080 |
| Frontend-Port | 5173 |

---

## Voraussetzungen

- Java 21
- Maven
- Docker
- Node.js 18+

---

## Start-Guide

### 1. Datenbank

```bash
docker compose up -d
```

### 2. Backend

```bash
./mvnw spring-boot:run
```

### 3. Frontend

```bash
cd bitcoin-gambler-frontend
npm install
npm run dev
```

### 4. Tests (kein Docker nötig, H2 In-Memory)

```bash
./mvnw test
```

Ergebnis: `BUILD SUCCESS`, 11 Tests grün.

---

## Architektur

```
React Frontend  →  Spring Boot REST API  →  CoinGecko API
                          |
                    PostgreSQL (Docker)
```

- Frontend kommuniziert ausschließlich über die REST-API mit dem Backend
- Backend ruft den aktuellen Bitcoin-Kurs und 7-Tage-Verlauf über die CoinGecko-API ab
- Datenpersistenz über Spring Data JPA mit PostgreSQL
- Eingabevalidierung mit Bean Validation (`@Valid`, `@NotBlank`, `@Positive`)
- Globale Fehlerbehandlung mit sinnvollen HTTP-Statuscodes (400, 404)

---

## Datenmodell

| Entity | Tabelle | Felder |
|---|---|---|
| User | users | id, username, balance |
| Bet | bets | id, amount, prediction, won, placedAt, user → User |
| Transaction | transactions | id, type, amount, timestamp, user → User, bet → Bet |

Beziehungen: User 1:n Bet · User 1:n Transaction · Bet 1:n Transaction

---

## Frontend

| Seite | Beschreibung |
|---|---|
| `Dashboard` | Aktueller Bitcoin-Kurs, letzte Wetten |
| `Users` | User-Liste, neuen User erstellen, User löschen |
| `UserDetail` | Profil mit Kontostand, Wetten-Historie, Transaktionen, Einzahlung |
| `Bets` | Alle Wetten als Liste |
| `BetDetail` | Detailansicht einer einzelnen Wette |
| `PlaceBet` | Formular zum Platzieren einer Wette (User, Betrag, Vorhersage) |

---

## REST-Endpunkte

### Users (vollständiges CRUD)
| Methode | Pfad | Beschreibung |
|---|---|---|
| GET | `/api/users` | Alle User auflisten |
| GET | `/api/users/{id}` | User nach ID abrufen |
| POST | `/api/users` | User erstellen |
| PUT | `/api/users/{id}` | User aktualisieren |
| DELETE | `/api/users/{id}` | User löschen |

### Bets
| Methode | Pfad | Beschreibung |
|---|---|---|
| GET | `/api/bets` | Alle Wetten auflisten |
| GET | `/api/bets/{id}` | Wette nach ID abrufen |
| GET | `/api/bets/user/{id}` | Wetten eines Users |
| POST | `/api/bets` | Wette platzieren |

### Bitcoin
| Methode | Pfad | Beschreibung |
|---|---|---|
| GET | `/api/bitcoin/price` | Aktueller Bitcoin-Kurs |
| GET | `/api/bitcoin/history` | 7-Tage-Kursverlauf |

### Transactions
| Methode | Pfad | Beschreibung |
|---|---|---|
| GET | `/api/transactions` | Alle Transaktionen |
| GET | `/api/transactions/{id}` | Transaktion nach ID |
| GET | `/api/transactions/user/{id}` | Transaktionen eines Users |
| POST | `/api/transactions/deposit` | Guthaben einzahlen |

---

## Externe API

**CoinGecko** – Kostenlose Kryptowährungs-API

- Aktueller Bitcoin-Kurs in USD (`/simple/price`)
- 7-Tage-Kursverlauf (`/coins/bitcoin/market_chart`)
- Kein API-Key erforderlich für die Free-Tier-Nutzung
- Dokumentation: https://docs.coingecko.com/reference/introduction

---

## Tests

| Testklasse | Tests | Beschreibung |
|---|---|---|
| `UserServiceTest` | 5 | CRUD-Operationen, Fehlerszenarien (User nicht gefunden, doppelter Username) |
| `BetServiceTest` | 3 | Wette platzieren, unzureichendes Guthaben, User nicht gefunden |
| `BitcoinServiceTest` | 2 | API-Antwort parsen, Null-Response abfangen |
| `BitcoinGamblerApplicationTests` | 1 | Spring-Kontext lädt korrekt |

Alle Tests nutzen Mockito oder H2 In-Memory – kein Docker nötig.

---

## KI-Nutzung

Bei diesem Projekt wurde KI-Unterstützung (Claude) eingesetzt für:
- Nachfragen und Erklärungen zu Konzepten
- Architekturentscheidungen und Hintergrundinformationen
- Hilfe bei der Lösungsfindung und Abwägen von Alternativen
- Frontend-Design

Alle Entscheidungen bezüglich Implementierung, Projektstruktur und Code wurden eigenständig getroffen. Die Verantwortung für Richtigkeit, Vollständigkeit und Integrität liegt vollumfänglich bei mir.
