// ==========================================
// 1. IMPORTACIONES DE FIREBASE
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// ==========================================
// 2. CONFIGURACIÓN OFICIAL
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyC1DVA61DPFlbGSWr45GYqeAGg89-k5a4g",
  authDomain: "citas-hyundai-coatza.firebaseapp.com",
  projectId: "citas-hyundai-coatza",
  storageBucket: "citas-hyundai-coatza.firebasestorage.app",
  messagingSenderId: "333064695297",
  appId: "1:333064695297:web:da997c42555b2cb7bc1a00"
};

// ==========================================
// 3. INICIALIZACIÓN
// ==========================================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ==========================================
// 4. CONEXIÓN CON EL HTML (DOM)
// ==========================================
const loginScreen = document.getElementById('login-screen');
const mainScreen = document.getElementById('main-screen');
const btnLogin = document.getElementById('btn-login');
const inputPass = document.getElementById('password');

// ==========================================
// 5. LÓGICA DE INICIO DE SESIÓN
// ==========================================
btnLogin.addEventListener('click', async () => {
    const pass = inputPass.value.trim();

    if (pass === "") {
        alert("⚠️ ¡Ingresa el código secreto!");
        return;
    }

    if (pass === "2099") {
        // Ocultar Pokédex y mostrar PC de Bill
        loginScreen.classList.remove('active');
        loginScreen.classList.add('hidden');
        
        mainScreen.classList.remove('hidden');
        mainScreen.classList.add('active');
        
        console.log("Acceso concedido. Conectando con Firebase...");
    } else {
        alert("❌ Código incorrecto. ¡Acceso denegado!");
    }
});

// Permitir entrar usando la tecla ENTER
inputPass.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        btnLogin.click();
    }
});

// ==========================================
// 6. LÓGICA DE CARGA DE EXCEL (Próximamente)
// ==========================================
// Aquí conectaremos SheetJS más adelante...

// ==========================================
// 7. LÓGICA DE TABLA DE CLIENTES (Próximamente)
// ==========================================
// Aquí descargaremos y mostraremos la base de datos...
