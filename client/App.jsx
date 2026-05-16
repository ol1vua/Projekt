import { useState } from 'react';
import Login from './Login';
import Register from './Register';
import AdminPanel from './AdminPanel';

export default function App() {
    const [screen, setScreen] = useState('login'); // Kontrola ekranów (Dynamiczny DOM)
    const [currentIndex, setCurrentIndex] = useState(0);

    // Atrapa danych ofert pracy do wyświetlenia na kartach
    const [jobs] = useState([
        { id: 1, title: "React Developer", company: "Google", technologies: "React, TypeScript", salary: "12 000 PLN" },
        { id: 2, title: "Junior Node.js Intern", company: "Allegro", technologies: "Node.js, SQL", salary: "6 000 PLN" },
        { id: 3, title: "Python Security Engineer", company: "Nvidia", technologies: "Python, Linux", salary: "16 000 PLN" }
    ]);

    // Obsługa zdarzenia kliknięcia w przycisk tinderowy
    const handleSwipe = (status) => {
        console.log(`Użytkownik wybrał: ${status} dla oferty id: ${jobs[currentIndex].id}`);
        // Dynamiczna zmiana stanu - DOM natychmiast pokaże kolejną kartę
        setCurrentIndex(currentIndex + 1);
    };

    if (screen === 'login') return <Login onLogin={() => setScreen('tinder')} onSwitch={() => setScreen('register')} />;
    if (screen === 'register') return <Register onSwitch={() => setScreen('login')} />;
    if (screen === 'admin') return <AdminPanel onBack={() => setScreen('tinder')} />;

    return (
        <div className="tinder-layout">
            <header>
                <h1>🔥 IT-Tinder</h1>
                <div className="nav-actions">
                    <button onClick={() => setScreen('admin')} className="nav-btn">Panel Admina</button>
                    <button onClick={() => setScreen('login')} className="nav-btn logout">Wyloguj</button>
                </div>
            </header>
            
            <main>
                {currentIndex < jobs.length ? (
                    <section className="tinder-card">
                        <h2>{jobs[currentIndex].title}</h2>
                        <h3>🏢 {jobs[currentIndex].company}</h3>
                        <p><strong>Wymagania:</strong> {jobs[currentIndex].technologies}</p>
                        <p className="salary">💰 {jobs[currentIndex].salary}</p>
                        <div className="actions">
                            <button onClick={() => handleSwipe('dislike')} className="btn-no">❌ Odrzuć</button>
                            <button onClick={() => handleSwipe('like')} className="btn-yes">💚 Polub</button>
                        </div>
                    </section>
                ) : (
                    <section className="no-cards">
                        <h2>🚀 To już wszystko!</h2>
                        <p>Przejrzałeś wszystkie dostępne oferty pracy na dziś.</p>
                    </section>
                )}
            </main>
            
            <footer>
                <p>&copy; 2026 IT-Tinder - Projekt PAI</p>
            </footer>
        </div>
    );
}