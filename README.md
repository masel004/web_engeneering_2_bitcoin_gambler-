# Bitcoin Gambler

## Überblick

Bitcoin Gambler ist eine Wett-Plattform, auf der Nutzer Vorhersagen über die Bitcoin-Kursentwicklung abgeben können. Nutzer registrieren sich mit Benutzername und Passwort, wählen einen Zeitraum (1 Min bis 2 Std) und setzen darauf, ob der Bitcoin-Kurs steigt oder fällt. Nach Ablauf des Zeitraums wird der aktuelle Kurs mit dem Kurs bei Platzierung verglichen und die Wette automatisch aufgelöst.

---

## Tech-Stack

| Bereich | Technologie |
|---|---|
| Backend | Java 21, Spring Boot 3.5, Maven |
| Datenbank | PostgreSQL 16 (Docker) |
| Frontend | React 18, Vite, React Router, Recharts |
| Auth | BCrypt Passwort-Hashing (spring-security-crypto) |
| Tests | JUnit 5, Mockito, H2 In-Memory |
| Externe API | CoinGecko (Bitcoin-Kurs) |
| API-Doku | Swagger / OpenAPI |
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

Ergebnis: `BUILD SUCCESS`, 13 Tests grün.

### 5. Swagger-UI

```
http://localhost:8080/swagger-ui/index.html
```

---

## Architektur

```
React Frontend  →  Spring Boot REST API  →  CoinGecko API
                          |
                    PostgreSQL (Docker)
```

- Frontend kommuniziert ausschließlich über die REST-API mit dem Backend
- Backend ruft den aktuellen Bitcoin-Kurs und Kursverlauf über die CoinGecko-API ab (mit 60s Cache)
- Datenpersistenz über Spring Data JPA mit PostgreSQL
- Eingabevalidierung mit Bean Validation (`@Valid`, `@NotBlank`, `@Positive`)
- Globale Fehlerbehandlung mit sinnvollen HTTP-Statuscodes (400, 404, 500)
- Passwörter werden mit BCrypt gehasht gespeichert
- Wetten werden per `@Scheduled`-Task nach Ablauf des Zeitraums automatisch aufgelöst

---

## Datenmodell

| Entity | Tabelle | Felder |
|---|---|---|
| User | users | id, username, passwordHash, balance |
| Bet | bets | id, amount, prediction, timeframe, priceAtBet, resolved, won, placedAt, user → User |
| Transaction | transactions | id, type, amount, timestamp, user → User, bet → Bet |

Beziehungen: User 1:n Bet · User 1:n Transaction · Bet 1:n Transaction

---

## Frontend

| Seite | Beschreibung |
|---|---|
| `LoginPage` | Anmelden / Registrieren mit Passwort |
| `Dashboard` | Live Bitcoin-Kurs mit Chart, Wette platzieren (Steigt/Fällt, Zeitraum, Betrag), Statistiken |
| `UserDetail` | Profil mit Kontostand, Wetten-Historie, Transaktionen, Einzahlung |
| `Bets` | Alle Wetten als Liste mit Status (Ausstehend/Gewonnen/Verloren) |
| `BetDetail` | Detailansicht einer einzelnen Wette |

---

## REST-Endpunkte

### Users
| Methode | Pfad | Beschreibung |
|---|---|---|
| POST | `/api/users/register` | Registrierung mit Passwort |
| POST | `/api/users/login` | Anmeldung mit Passwort |
| GET | `/api/users` | Alle User auflisten |
| GET | `/api/users/{id}` | User nach ID abrufen |
| PUT | `/api/users/{id}` | User aktualisieren |
| DELETE | `/api/users/{id}` | User löschen |

### Bets
| Methode | Pfad | Beschreibung |
|---|---|---|
| GET | `/api/bets` | Alle Wetten auflisten |
| GET | `/api/bets/{id}` | Wette nach ID abrufen |
| GET | `/api/bets/user/{id}` | Wetten eines Users |
| POST | `/api/bets` | Wette platzieren (mit Zeitraum) |

### Bitcoin
| Methode | Pfad | Beschreibung |
|---|---|---|
| GET | `/api/bitcoin/price` | Aktueller Bitcoin-Kurs (gecacht) |
| GET | `/api/bitcoin/history` | Kursverlauf (gecacht) |

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
- Kursverlauf (`/coins/bitcoin/market_chart`)
- Kein API-Key erforderlich für die Free-Tier-Nutzung
- Preis wird alle 60 Sekunden gecacht um Rate-Limiting zu vermeiden
- Dokumentation: https://docs.coingecko.com/reference/introduction

---

## Tests

| Testklasse | Tests | Beschreibung |
|---|---|---|
| `UserServiceTest` | 7 | CRUD, Registrierung mit BCrypt, Login mit falschem Passwort |
| `BetServiceTest` | 3 | Ausstehende Wette, unzureichendes Guthaben, User nicht gefunden |
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
