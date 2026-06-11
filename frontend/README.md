** TIC-TAC-TOE 
Instruksi Instalasi dan Menjalankan Program
# Clone atau buat struktur folder
mkdir tic-tac-toe && cd tic-tac-toe

# Setup Backend
cd backend
npm install
npm run dev        # Server berjalan di http://localhost:4000

# Setup Frontend (terminal baru)
cd frontend
npm install
npm run dev        # Aplikasi berjalan di http://localhost:3000

Cara Pengujian
1.	Buka http://localhost:3000 di dua tab browser berbeda.
2.	Tab 1: Masukkan nama "Pemain 1" dan Room ID "test123", klik Masuk.
3.	Tab 2: Masukkan nama "Pemain 2" dan Room ID "test123", klik Masuk.
4.	Game akan dimulai secara otomatis.
