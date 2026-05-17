const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt'); 

const app = express();
app.use(express.json()); 

// Dodatkowe wsparcie dla CORS
const cors = require('cors');
app.use(cors());

const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

const fs = require('fs');

const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

// Automatyczne odtwarzanie struktury bazy
db.exec(schema, (err) => {
    if (err) {
        console.error("Błąd podczas odtwarzania struktury bazy danych z pliku schema.sql:", err);
    } else {
        console.log("Struktura bazy danych (3 tabele, relacje, indeksy) została pomyślnie zainicjalizowana.");
    }
});

// 1. Rejestracja użytkownika z bezpiecznym hashowaniem haseł
app.post('/api/auth/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Walidacja danych po stronie serwera
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Wszystkie pola (login, email, hasło) są wymagane." });
    }

    try {
        // Hashowanie hasła za pomocą bcrypt
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const query = `INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, 'user')`;
        
        db.run(query, [username, email, passwordHash], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE')) {
                    return res.status(400).json({ error: "Użytkownik o takim loginie lub adresie e-mail już istnieje." });
                }
                return res.status(500).json({ error: "Błąd bazy danych podczas rejestracji." });
            }
            res.status(201).json({ message: "Użytkownik zarejestrowany pomyślnie!", userId: this.lastID });
        });
    } catch (error) {
        res.status(500).json({ error: "Błąd wewnętrzny serwera." });
    }
});

// 2. Logowanie z weryfikacją hasha i obsługą sesji/roli
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Wprowadź login i hasło." });
    }

    const query = `SELECT * FROM users WHERE username = ?`;
    
    db.get(query, [username], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: "Błąd serwera." });
        }
        if (!user) {
            return res.status(401).json({ error: "Nieprawidłowy login lub hasło." });
        }

        // Weryfikacja hasła tekstowego z hashem z bazy danych
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(401).json({ error: "Nieprawidłowy login lub hasło." });
        }

        // Zwrócenie roli w odpowiedzi JSON
        res.status(200).json({
            message: "Zalogowano pomyślnie",
            user: { id: user.id, username: user.username, role: user.role }
        });
    });
});

// 3. Chroniony zasób wyłącznie dla Administratora (Autoryzacja ról)
app.get('/api/admin/dashboard', (req, res) => {
    const userRole = req.headers['x-user-role'];

    if (userRole !== 'admin') {
        return res.status(403).json({ error: "Brak dostępu. Zasób przeznaczony wyłącznie dla administratora." });
    }

    res.status(200).json({ status: "success", message: "Dane panelu administratora zostały autoryzowane." });
});

// 1. READ (Pobieranie wszystkich ofert)
app.get('/api/jobs', (req, res) => {
    db.all(`SELECT * FROM jobs`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Błąd bazy danych podczas pobierania ofert." });
        }
        res.status(200).json(rows);
    });
});

// 2. CREATE (Zapisanie swipa)
app.post('/api/swipe', (req, res) => {
    const { user_id, job_id, status } = req.body;

    if (!user_id || typeof user_id !== 'number') {
        return res.status(400).json({ error: "Nieprawidłowy lub brakujący identyfikator użytkownika (user_id)." });
    }
    if (!job_id || typeof job_id !== 'number') {
        return res.status(400).json({ error: "Nieprawidłowy lub brakujący identyfikator oferty (job_id)." });
    }
    if (!status || !['like', 'dislike'].includes(status)) {
        return res.status(400).json({ error: "Status musi przyjmować wartość 'like' lub 'dislike'." });
    }

    const query = `INSERT INTO swipes (user_id, job_id, status) VALUES (?, ?, ?)`;
    db.run(query, [user_id, job_id, status], function(err) {
        if (err) {
            return res.status(500).json({ error: "Nie udało się zapisać wyboru w bazie danych." });
        }
        res.status(201).json({
            id: this.lastID,
            message: "Wybór został pomyślnie zapisany.",
            data: { user_id, job_id, status }
        });
    });
});

// 3. UPDATE (Aktualizacja roli)
app.put('/api/users/:id/role', (req, res) => {
    const userId = req.params.id;
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
        return res.status(400).json({ error: "Niepoprawna rola. Dozwolone wartości to 'user' lub 'admin'." });
    }

    const query = `UPDATE users SET role = ? WHERE id = ?`;
    db.run(query, [role, userId], function(err) {
        if (err) {
            return res.status(500).json({ error: "Błąd serwera podczas aktualizacji roli." });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: `Nie znaleziono użytkownika o podanym ID: ${userId}` });
        }
        res.status(200).json({ message: `Rola użytkownika o ID ${userId} została zaktualizowana na '${role}'.` });
    });
});

// 4. DELETE (Usunięcie dopasowania)
app.delete('/api/swipe/:id', (req, res) => {
    const swipeId = req.params.id;

    const query = `DELETE FROM swipes WHERE id = ?`;
    db.run(query, swipeId, function(err) {
        if (err) {
            return res.status(500).json({ error: "Błąd serwera podczas auditingu zasobu." });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: `Nie odnaleziono dopasowania o ID: ${swipeId}` });
        }
        res.status(200).json({ message: `Dopasowanie o ID ${swipeId} zostało pomyślnie usunięte.` });
    });
});

app.get('/api/users/:userId/matches', (req, res) => {
    const { userId } = req.params;

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
        res.status(200).json(rows);
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serwer IT-Tinder działa na porcie ${PORT}`));