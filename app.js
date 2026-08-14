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

// Elementos del CAPTCHA
const captchaImg = document.getElementById('captcha-img');
const captchaHint = document.getElementById('captcha-hint');
const captchaButtons = document.getElementById('captcha-buttons');
const captchaSection = document.getElementById('captcha-section');
const passwordSection = document.getElementById('password-section');

// Elemento de la Tabla
const tableWrapper = document.getElementById('table-wrapper');

let captchaPassed = false;

// ==========================================
// 5. LÓGICA DE INICIO DE SESIÓN Y MEMORIA (1 DÍA)
// ==========================================
function checkDailyLogin() {
    const today = new Date().toLocaleDateString();
    const savedDate = localStorage.getItem('pokeLoginDate');

    if (savedDate === today) {
        // Ya inició sesión hoy, salta directo a la PC
        loginScreen.classList.remove('active');
        loginScreen.classList.add('hidden');
        mainScreen.classList.remove('hidden');
        mainScreen.classList.add('active');
        
        // Llamar a los clientes de Firebase
        loadClients();
    } else {
        // Es un nuevo día, cargar el minijuego
        loadCaptcha();
    }
}

// Botón Entrar (Valida contraseña y guarda el día)
btnLogin.addEventListener('click', () => {
    if (!captchaPassed) {
        alert("⚠️ Primero debes adivinar el Pokémon.");
        return;
    }
    const pass = inputPass.value.trim();
    if (pass === "2099") {
        // Guardar la fecha de hoy en la memoria del navegador
        const today = new Date().toLocaleDateString();
        localStorage.setItem('pokeLoginDate', today);

        // Ocultar Pokédex y Mostrar Sistema
        loginScreen.classList.remove('active');
        loginScreen.classList.add('hidden');
        mainScreen.classList.remove('hidden');
        mainScreen.classList.add('active');
        
        // Llamar a los clientes de Firebase
        loadClients();
    } else {
        alert("❌ Código incorrecto.");
    }
});

// Cerrar sesión manualmente (Borra la memoria)
btnLogout.addEventListener('click', () => {
    localStorage.removeItem('pokeLoginDate');
    location.reload(); // Recarga la página
});

// Permitir entrar usando la tecla ENTER
inputPass.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        btnLogin.click();
    }
});

// ==========================================
// 5.1 MINIJUEGO: ¿QUIÉN ES ESE POKÉMON?
// ==========================================
async function loadCaptcha() {
    captchaPassed = false;
    captchaImg.classList.add('silhouette');
    captchaImg.classList.remove('revealed');
    passwordSection.classList.add('hidden');
    captchaButtons.innerHTML = "Cargando...";

    // --- NUEVO: REPRODUCIR AUDIO ---
    const audio = new Audio("https://www.myinstants.com/media/sounds/whos-that-pokemon_.mp3");
    audio.volume = 0.5; // Volumen al 50% para no asustar
    audio.play().catch(e => console.log("El navegador bloqueó el auto-play del audio."));
    // -------------------------------

    try {
        // Elegir 3 números al azar de la 1ra Generación (1 al 151)
// ... (el resto del código de la función se queda igual)
        const randomIds = [];
        while(randomIds.length < 3) {
            let r = Math.floor(Math.random() * 151) + 1;
            if(randomIds.indexOf(r) === -1) randomIds.push(r);
        }

        // Descargar los nombres de la API
        const promises = randomIds.map(id => fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json()));
        const pokemons = await Promise.all(promises);

        // Elegir la respuesta correcta al azar de esos 3
        const correctIndex = Math.floor(Math.random() * 3);
        const correctPokemon = pokemons[correctIndex];

        // Mostrar la imagen y la PISTA
        captchaImg.src = correctPokemon.sprites.front_default;
        captchaHint.textContent = `Pista: Es ${correctPokemon.name.toUpperCase()}`;

        // Crear los 3 botones
        captchaButtons.innerHTML = "";
        pokemons.forEach((poke, index) => {
            const btn = document.createElement('button');
            btn.className = 'btn-captcha';
            btn.textContent = poke.name;
            
            btn.onclick = () => {
                if(index === correctIndex) {
                    // Acertó
                    captchaPassed = true;
                    captchaImg.classList.add('revealed');
                    captchaHint.textContent = "¡CORRECTO!";
                    captchaHint.style.color = "green";
                    captchaButtons.innerHTML = ""; // Quitar botones
                    passwordSection.classList.remove('hidden'); // Mostrar campo de contraseña
                } else {
                    // Falló
                    captchaImg.style.transform = "translateX(5px)";
                    setTimeout(() => captchaImg.style.transform = "translateX(0)", 200);
                    alert("¡Ese no es! Intenta de nuevo.");
                }
            };
            captchaButtons.appendChild(btn);
        });
    } catch (error) {
        console.error("Error cargando CAPTCHA:", error);
        captchaHint.textContent = "Error de red. Intenta recargar la página.";
    }
}

// ==========================================
// 6. LÓGICA DE CARGA DE EXCEL (Próximamente)
// ==========================================
// Aquí conectaremos SheetJS más adelante...

// ==========================================
// 7. LÓGICA DE TABLA DE CLIENTES (Directorio)
// ==========================================
async function loadClients() {
    try {
        tableWrapper.innerHTML = "<p style='color: #6bf;'>Buscando registros en la base de datos...</p>";
        
        // Llamada a Firebase
        const querySnapshot = await getDocs(collection(db, "clientes_primer_servicio"));
        
        if (querySnapshot.empty) {
            tableWrapper.innerHTML = "<p style='color: white;'>No hay clientes registrados. Por favor carga el Excel mensual.</p>";
            return;
        }

        // Armamos el esqueleto de la tabla
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

        // Rellenamos las filas con los datos de Firebase
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
        tableWrapper.innerHTML = html; // Inyectamos la tabla armada en la pantalla

    } catch (error) {
        console.error("Error cargando clientes:", error);
        tableWrapper.innerHTML = "<p style='color: red;'>Error de conexión. Revisa la consola para más detalles.</p>";
    }
}

// ==========================================
// EJECUCIÓN INICIAL AL CARGAR LA PÁGINA
// ==========================================
checkDailyLogin();
