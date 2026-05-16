import { useState } from 'react';

export default function AdminPanel({ onLogout }) {
    // Statyczne dane demonstracyjne dla panelu admina
    const [stats] = useState({
        totalUsers: 142,
        totalJobs: 48,
        totalSwipes: 1205
    });

    return (
        <div className="tinder-layout" style={{ maxWidth: '500px' }}>
            <header>
                <h2>Panel Administratora</h2>
                <button onClick={onLogout} style={{ background: 'white', color: '#ff5a60', padding: '5px 10px', fontSize: '12px' }}>
                    Wyloguj
                </button>
            </header>
            <main style={{ flexDirection: 'column', justifyContent: 'flex-start', paddingTop: '30px' }}>
                <div className="tinder-card" style={{ width: '100%' }}>
                    <h3>Statystyki systemu IT-Tinder</h3>
                    <hr style={{ margin: '15px 0', borderColor: '#eee' }} />
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f9f9f9', padding: '10px', borderRadius: '8px' }}>
                            <span>Zarejestrowani programiści:</span>
                            <strong>{stats.totalUsers}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f9f9f9', padding: '10px', borderRadius: '8px' }}>
                            <span>Pobrane oferty pracy (Scraper):</span>
                            <strong>{stats.totalJobs}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f9f9f9', padding: '10px', borderRadius: '8px' }}>
                            <span>Wykonane swipy (Polubienia):</span>
                            <strong>{stats.totalSwipes}</strong>
                        </div>
                    </div>

                    <div style={{ marginTop: '30px', padding: '15px', background: '#e8f8f5', color: '#27ae60', borderRadius: '8px', fontSize: '14px' }}>
                        <strong>Status systemu:</strong> Wszystkie usługi (API, Scraper, DB) działają poprawnie.
                    </div>
                </div>
            </main>
        </div>
    );
}