import { useState } from 'react';

export default function Register({ onRegisterSuccess, onSwitchToLogin }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!username || !email || !password) {
            setError('Uzupełnij wszystkie pola!');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Błąd podczas rejestracji');
            }

            setSuccess('Konto utworzone pomyślnie! Możesz się zalogować.');
            setTimeout(() => onRegisterSuccess(), 2000);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="card card--sm">
            <h2 className="title">Dołącz do nas</h2>
            <p className="subtitle">Znajdź swoją technologiczną drugą połówkę</p>
            
            {error && <div className="alert alert--error">{error}</div>}
            {success && <div className="alert alert--success">{success}</div>}

            <form onSubmit={handleSubmit} className="form-stack">
                <input 
                    type="text" 
                    placeholder="Nazwa użytkownika" 
                    className="input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input 
                    type="email" 
                    placeholder="Adres e-mail" 
                    className="input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                    type="password" 
                    placeholder="Hasło" 
                    className="input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="btn-primary">Zarejestruj się</button>
            </form>

            <p className="hint-bottom">
                Masz już konto?{' '}
                <button onClick={onSwitchToLogin} className="link-switch">Zaloguj się</button>
            </p>
        </div>
    );
}