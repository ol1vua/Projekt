const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(express.json()); 

const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

const fs = require('fs');

// Odczytanie pliku schema.sql i uruchomienie go w bazie danych
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

db.exec(schema, (err) => {
    if (err) {
        console.error("Błąd podczas odtwarzania struktury bazy danych z pliku schema.sql:", err);
    } else {
        console.log("Struktura bazy danych (3 tabele, relacje, indeksy) została pomyślnie zainicjalizowana.");
    }
});

// 1. READ (Odczyt): Pobieranie ofert pracy
app.get('/api/jobs', (req, res) => {
    db.all(`SELECT * FROM jobs`, [], (err, rows) => {
        if (err) {
            // Kod 500: Błąd wewnętrzny serwera
            return res.status(500).json({ error: "Błąd bazy danych podczas pobierania ofert." });
        }
        // Kod 200: Poprawne pobranie danych, zwracamy tablicę JSON
        res.status(200).json(rows);
    });
});

// 2. CREATE (Tworzenie): Zapisywanie swipa z pełną walidacją serwerową
app.post('/api/swipe', (req, res) => {
    const { user_id, job_id, status } = req.body;

    // --- Walidacja danych po stronie serwera ---
    if (!user_id || typeof user_id !== 'number') {
        return res.status(400).json({ error: "Nieprawidłowy lub brakujący identyfikator użytkownika (user_id)." });
    }
    if (!job_id || typeof job_id !== 'number') {
        return res.status(400).json({ error: "Nieprawidłowy lub brakujący identyfikator oferty (job_id)." });
    }
    if (!status || !['like', 'dislike'].includes(status)) {
        return res.status(400).json({ error: "Status musi przyjmować wartość 'like' lub 'dislike'." });
    }
    // --- Koniec walidacji ---

    const query = `INSERT INTO swipes (user_id, job_id, status) VALUES (?, ?, ?)`;
    db.run(query, [user_id, job_id, status], function(err) {
        if (err) {
            return res.status(500).json({ error: "Nie udało się zapisać wyboru w bazie danych." });
        }
        // Kod 201: Utworzono zasób pomyślnie
        res.status(201).json({
            id: this.lastID,
            message: "Wybór został pomyślnie zapisany.",
            data: { user_id, job_id, status }
        });
    });
});

// 3. UPDATE (Aktualizacja): Zmiana roli użytkownika (np. na 'admin')
app.put('/api/users/:id/role', (req, res) => {
    const userId = req.params.id;
    const { role } = req.body;

    // Walidacja serwerowa zmiennej wejściowej
    if (!role || !['user', 'admin'].includes(role)) {
        return res.status(400).json({ error: "Niepoprawna rola. Dozwolone wartości to 'user' lub 'admin'." });
    }

    const query = `UPDATE users SET role = ? WHERE id = ?`;
    db.run(query, [role, userId], function(err) {
        if (err) {
            return res.status(500).json({ error: "Błąd serwera podczas aktualizacji roli." });
        }
        if (this.changes === 0) {
            // Kod 404: Zasób nie istnieje
            return res.status(404).json({ error: `Nie znaleziono użytkownika o podanym ID: ${userId}` });
        }
        // Kod 200: Poprawna modyfikacja
        res.status(200).json({ message: `Rola użytkownika o ID ${userId} została zaktualizowana na '${role}'.` });
    });
});

// 4. DELETE (Usuwanie): Cofnięcie dopasowania / swipa
app.delete('/api/swipe/:id', (req, res) => {
    const swipeId = req.params.id;

    const query = `DELETE FROM swipes WHERE id = ?`;
    db.run(query, swipeId, function(err) {
        if (err) {
            return res.status(500).json({ error: "Błąd serwera podczas usuwania zasobu." });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: `Nie odnaleziono dopasowania o ID: ${swipeId}` });
        }
        res.status(200).json({ message: `Dopasowanie o ID ${swipeId} zostało pomyślnie usunięte.` });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serwer IT-Tinder działa na porcie ${PORT}`));

// Pobieranie wszystkich "polubionych" ofert przez danego użytkownika z użyciem INNER JOIN
app.get('/api/users/:userId/matches', (req, res) => {
    const { userId } = req.params;

    // Zapytanie łączące tabelę swipes z tabelą jobs na podstawie klucza obcego job_id
    const query = `
        SELECT jobs.id, jobs.title, jobs.company, jobs.technologies, jobs.salary, swipes.status
        FROM swipes
        INNER JOIN jobs ON swipes.job_id = jobs.id
        WHERE swipes.user_id = ? AND swipes.status = 'like'
    `;

    db.all(query, [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Błąd serwera podczas wykonywania zapytania JOIN." });
        }
        // Zwracamy dopasowane oferty w formacie JSON
        res.status(200).json(rows);
    });
});