import { useState } from 'react';

export default function Login({ onLogin, onSwitchToRegister }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Prosta walidacja frontendowa
        if (!username || !password) {
            setError('Wszystkie pola są wymagane!');
            return;
        }

        setError('');
        // Symulacja logowania – sprawdzamy czy to admin, czy zwykły użytkownik
        if (username.toLowerCase() === 'admin') {
            onLogin({ id: 1, username: 'admin', role: 'admin' });
        } else {
            onLogin({ id: 2, username: username, role: 'user' });
        }
    };

    return (
        <div className="tinder-layout">
            <header>
                <h2>IT-Tinder</h2>
                <span>Logowanie</span>
            </header>
            <main>
                <div className="tinder-card">
                    <h3>Witaj z powrotem</h3>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                        Zaloguj się, aby przeglądać oferty pracy
                    </p>
                    
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input 
                            type="text" 
                            placeholder="Nazwa użytkownika" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                        />
                        <input 
                            type="password" 
                            placeholder="Hasło" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                        />
                        
                        {error && <p style={{ color: '#e74c3c', fontSize: '14px' }}>{error}</p>}
                        
                        <button type="submit" className="btn-yes" style={{ width: '100%', borderRadius: '8px' }}>
                            Zaloguj się
                        </button>
                    </form>
                    
                    <p style={{ marginTop: '20px', fontSize: '14px' }}>
                        Nie masz konta?{' '}
                        <span 
                            onClick={onSwitchToRegister} 
                            style={{ color: '#ff5a60', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            Zarejestruj się
                        </span>
                    </p>
                </div>
            </main>
        </div>
    );
}