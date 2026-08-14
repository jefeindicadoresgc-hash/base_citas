// 1. Importar Firebase desde la web (Versión 10.13.0)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// 2. Tu Configuración Oficial de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC1DVA61DPFlbGSWr45GYqeAGg89-k5a4g",
  authDomain: "citas-hyundai-coatza.firebaseapp.com",
  projectId: "citas-hyundai-coatza",
  storageBucket: "citas-hyundai-coatza.firebasestorage.app",
  messagingSenderId: "333064695297",
  appId: "1:333064695297:web:da997c42555b2cb7bc1a00"
};

// 3. Inicializar Firebase y la Base de Datos
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 4. Conectar los elementos del HTML con JavaScript
const loginScreen = document.getElementById('login-screen');
const mainScreen = document.getElementById('main-screen');
const btnLogin = document.getElementById('btn-login');
const inputUser = document.getElementById('username');
const inputPass = document.getElementById('password');

// 5. Lógica del Botón "ENTRAR"
btnLogin.addEventListener('click', async () => {
    const user = inputUser.value.trim();
    const pass = inputPass.value.trim();

    // Validar que no estén vacíos
    if (user === "" || pass === "") {
        alert("⚠️ ¡El Team Rocket intentó robar tus datos! Por favor, llena tu usuario y contraseña.");
        return;
    }

    // Lógica temporal: Comprobar si es el Administrador Maestro (2099)
    if (pass === "2099") {
        alert("✅ ¡Acceso de Administrador Concedido!");
        
        // Efecto de transición: Ocultar Pokédex, Mostrar Pantalla Principal
        loginScreen.classList.remove('active');
        loginScreen.classList.add('hidden');
        
        mainScreen.classList.remove('hidden');
        mainScreen.classList.add('active');
        
        // Aquí después llamaremos a la función que descarga la base de datos
        console.log("Cargando el Centro Pokémon (Base de Datos)...");
        
    } else {
        // Aquí programaremos la validación de usuarios normales desde Firestore (como en Control de Órdenes)
        alert("Buscando entrenador en la base de datos... (Esta función la armaremos en el siguiente paso).");
    }
});

// Permitir que la tecla "Enter" en el teclado también presione el botón de entrar
inputPass.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        btnLogin.click();
    }
});
