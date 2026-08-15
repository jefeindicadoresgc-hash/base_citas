// ==========================================
// 1. IMPORTACIONES DE FIREBASE
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

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
const btnLogout = document.getElementById('btn-logout');

const captchaImg = document.getElementById('captcha-img');
const captchaHint = document.getElementById('captcha-hint');
const captchaButtons = document.getElementById('captcha-buttons');
const passwordSection = document.getElementById('password-section');
const tableWrapper = document.getElementById('table-wrapper');

const btnPowerOn = document.getElementById('btn-power-on');
const powerOnScreen = document.getElementById('power-on-screen');
const gameScreen = document.getElementById('game-screen');

let captchaPassed = false;

// ==========================================
// 5. LÓGICA DE INICIO DE SESIÓN Y MEMORIA
// ==========================================

// Llamamos a los elementos del Equipo Rocket y Decoraciones
const rocketModal = document.getElementById('rocket-modal');
const closeModal = document.getElementById('close-modal');
const decorations = document.getElementById('decorations'); // Snorlax y Squirtle

function checkDailyLogin() {
    const today = new Date().toLocaleDateString();
    const savedDate = localStorage.getItem('pokeLoginDate');

    if (savedDate === today) {
        // Ya inició sesión hoy, salta directo a la PC y oculta las decoraciones
        loginScreen.classList.remove('active');
        loginScreen.classList.add('hidden');
        decorations.classList.add('hidden'); 
        
        mainScreen.classList.remove('hidden');
        mainScreen.classList.add('active');
        loadClients();
    }
}

// Cerrar la ventana del Equipo Rocket
closeModal.addEventListener('click', () => {
    rocketModal.classList.add('hidden');
    inputPass.value = ""; // Limpiar la contraseña para intentar de nuevo
});

// Botón Entrar
btnLogin.addEventListener('click', () => {
    if (!captchaPassed) {
        alert("⚠️ Primero debes adivinar el Pokémon.");
        return;
    }
    const pass = inputPass.value.trim();
    if (pass === "2099") {
        // Guardar día en memoria
        const today = new Date().toLocaleDateString();
        localStorage.setItem('pokeLoginDate', today);
        
        // ¡SERPENTINAS!
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 }
        });

        // Ocultar Pokédex y DECORACIONES (Snorlax y Squirtle)
        loginScreen.classList.remove('active');
        loginScreen.classList.add('hidden');
        decorations.classList.add('hidden'); // Aquí desaparecen

        // Mostrar Sistema Limpio
        mainScreen.classList.remove('hidden');
        mainScreen.classList.add('active');
        
        loadClients();
    } else {
        // Mostrar Modal del Equipo Rocket
        rocketModal.classList.remove('hidden');
    }
});

// Permitir entrar usando la tecla ENTER
inputPass.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        btnLogin.click();
    }
});

// Cerrar sesión manualmente (Borra la memoria)
btnLogout.addEventListener('click', () => {
    localStorage.removeItem('pokeLoginDate');
    location.reload(); 
});

// ==========================================
// 5.1 MINIJUEGO Y AUDIO
// ==========================================
btnPowerOn.addEventListener('click', () => {
    powerOnScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    // Reproducir Audio
    const audio = new Audio("https://www.myinstants.com/media/sounds/whos-that-pokemon_.mp3");
    audio.volume = 0.6;
    audio.play().catch(e => console.log("Audio bloqueado por el navegador:", e));

    loadCaptcha();
});

async function loadCaptcha() {
    captchaPassed = false;
    captchaImg.classList.add('silhouette');
    captchaImg.classList.remove('revealed');
    passwordSection.classList.add('hidden');
    captchaButtons.innerHTML = "Cargando...";

    try {
        const randomIds = [];
        while(randomIds.length < 3) {
            let r = Math.floor(Math.random() * 151) + 1;
            if(randomIds.indexOf(r) === -1) randomIds.push(r);
        }

        const promises = randomIds.map(id => fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json()));
        const pokemons = await Promise.all(promises);

        const correctIndex = Math.floor(Math.random() * 3);
        const correctPokemon = pokemons[correctIndex];

        captchaImg.src = correctPokemon.sprites.front_default;
        captchaHint.textContent = `Pista: Es ${correctPokemon.name.toUpperCase()}`;

        captchaButtons.innerHTML = "";
        pokemons.forEach((poke, index) => {
            const btn = document.createElement('button');
            btn.className = 'btn-captcha';
            btn.textContent = poke.name;
            
            btn.onclick = () => {
                if(index === correctIndex) {
                    captchaPassed = true;
                    captchaImg.classList.add('revealed');
                    captchaHint.textContent = "¡CORRECTO!";
                    captchaHint.style.color = "green";
                    captchaButtons.innerHTML = "";
                    passwordSection.classList.remove('hidden');
                } else {
                    captchaImg.style.transform = "translateX(5px)";
                    setTimeout(() => captchaImg.style.transform = "translateX(0)", 200);
                    alert("¡Ese no es! Intenta de nuevo.");
                }
            };
            captchaButtons.appendChild(btn);
        });
    } catch (error) {
        console.error("Error:", error);
        captchaHint.textContent = "Error de red. Intenta recargar.";
    }
}

// ==========================================
// 6. DESCARGA DE FIREBASE (TABLA)
// ==========================================
async function loadClients() {
    try {
        tableWrapper.innerHTML = "<p style='color: #6bf;'>Buscando registros en la base de datos...</p>";
        
        const querySnapshot = await getDocs(collection(db, "clientes_primer_servicio"));
        
        if (querySnapshot.empty) {
            tableWrapper.innerHTML = "<p style='color: white;'>No hay clientes registrados.</p>";
            return;
        }

        let html = `
            <table class="poke-table">
                <thead>
                    <tr>
                        <th>CLIENTE</th>
                        <th>TELÉFONO</th>
                        <th>FECHA SERVICIO</th>
                        <th>TIPO</th>
                        <th>CITADO</th>
                        <th>T-45</th>
                        <th>MEDIO T-45</th>
                    </tr>
                </thead>
                <tbody>
        `;

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            html += `
                <tr>
                    <td>${data.nombre_cliente || ''}</td>
                    <td>${data.telefono || ''}</td>
                    <td>${data.fecha_servicio || ''}</td>
                    <td>${data.tipo_cliente || ''}</td>
                    <td>${data.citado || ''}</td>
                    <td>${data.t_45 || ''}</td>
                    <td>${data.medio_t45 || ''}</td>
                </tr>
            `;
        });

        html += `</tbody></table>`;
        tableWrapper.innerHTML = html;

    } catch (error) {
        console.error("Error:", error);
        tableWrapper.innerHTML = "<p style='color: red;'>Error de conexión.</p>";
    }
}

checkDailyLogin();
