// (Mantén tus importaciones y configuración de Firebase en las Secciones 1, 2 y 3)

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
        console.log("Sesión activa recuperada del navegador.");
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

        loginScreen.classList.remove('active');
        loginScreen.classList.add('hidden');
        mainScreen.classList.remove('hidden');
        mainScreen.classList.add('active');
    } else {
        alert("❌ Código incorrecto.");
    }
});

// Cerrar sesión manualmente (Borra la memoria)
btnLogout.addEventListener('click', () => {
    localStorage.removeItem('pokeLoginDate');
    location.reload(); // Recarga la página
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

    try {
        // Elegir 3 números al azar de la 1ra Generación (1 al 151)
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

// Ejecutar revisión inicial al cargar la página
checkDailyLogin();

// (Mantén tus Secciones 6 y 7 de lógica de tabla intactas al final)
