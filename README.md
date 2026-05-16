# Projekt
##Instrukcja uruchomienia projektu

Nalezy postepowac zgodnie z ponizszymi krokami:

### 1. Wymagania wstepne:
Upewnij sie, ze masz zainstalowane srodowisko **Node.js**

### 2. Klonowanie repozytorium:
Sklonuj projekt z GitHuba i wejdz do jego glownego katalogu:
git clone <LINK_FOLDERU_PROJEKTU>

### 3. Konfiguracja i uruchomienie Backend
Otworz nowy terminal i przejdz do folderu server wpisujac:
cd server
Zainstaluj wymagane biblioteki wpisujac:
npm install
Stworz plik konfiguracyjny srodowiska .env wpisujac:
cp .env.example .env
Uruchom serwer:
npm start

### 4. Konfiguracja i uruchomienie frontend
Otworz drugie okno terminala w glownym folderze projektu i zainstaluj zaleznosci dla interfejsu uztykownika:
npm install
Uruchom serwer deweloperski:
npm run dev
Nastepnie w terminalu wyswietli sei lokalny adres URL, nalezy go skopiowac a nastepnie otworzyc w przegladare internetowej
