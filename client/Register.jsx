import { useState } from 'react';

export default function Register({ onSwitch }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault(); // Obsługa zdarzenia - blokada przeładowania strony
        setError('');
        setSuccess('');

        // Walidacja formularza po stronie klienta (Lab 2-5)
        if (username.trim().length < 3) {
            setError("Nazwa użytkownika musi mieć minimum 3 znaki!");
            return;
        }
        if (password.length < 6) {
            setError("Hasło musi mieć minimum 6 znaków!");
            return;
        }

        // Jeśli walidacja przeszła pomyślnie:
        setSuccess("Walidacja klienta pomyślna! Dane są gotowe do wysłania.");
        
        // Tutaj w kolejnych krokach dodamy fetch do serwera
    };

    return (
        <div className="auth-box">
            <h2>Zarejestruj się do IT-Tinder</h2>
            <form onSubmit={handleRegister}>
                <input type="text" placeholder="Nazwa użytkownika" onChange={e => setUsername(e.target.value)} required />
                <input type="email" placeholder="Adres Email" onChange={e => setEmail(e.target.value)} required />
                <input type="password" placeholder="Hasło" onChange={e => setPassword(e.target.value)} required />
                <button type="submit">Załóż konto</button>
            </form>
            {error && <p className="error-msg">{error}</p>}
            {success && <p className="success-msg">{success}</p>}
            <button onClick={onSwitch} className="switch-btn">Masz już konto? Zaloguj się</button>
        </div>
    );
}