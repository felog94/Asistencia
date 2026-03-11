import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDPMC_DATf2kfQ2HZk5Un_cIiPIUEgTl1s",
  authDomain: "asistencia-d391b.firebaseapp.com",
  projectId: "asistencia-d391b",
  storageBucket: "asistencia-d391b.firebasestorage.app",
  messagingSenderId: "464826516544",
  appId: "1:464826516544:web:9ae63b31e2e12a6748cba5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const defaultMaterias = [
    { id: 1, nombre: 'AyM', presentes: 0, faltas: 0, feriados: 0 },
    { id: 2, nombre: 'BBDD2', presentes: 0, faltas: 0, feriados: 0 },
    { id: 3, nombre: 'PNT2', presentes: 0, faltas: 0, feriados: 0 },
    { id: 4, nombre: 'TP2', presentes: 0, faltas: 0, feriados: 0 },
    { id: 5, nombre: 'P2', presentes: 0, faltas: 0, feriados: 0 }
];

let materias = [];
let userId = null;

const loginContainer = document.getElementById('login-container');
const appContainer = document.getElementById('app-container');
const materiasContainer = document.getElementById('materias-container');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const btnLogin = document.getElementById('btn-login');
const loginError = document.getElementById('login-error');
const btnReset = document.getElementById('btn-reset');
const btnLogout = document.getElementById('btn-logout');

onAuthStateChanged(auth, async (user) => {
    if (user) {
        userId = user.uid;
        loginContainer.style.display = 'none';
        appContainer.style.display = 'block';
        await cargarDatos();
    } else {
        userId = null;
        loginContainer.style.display = 'block';
        appContainer.style.display = 'none';
    }
});

btnLogin.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    btnLogin.innerText = "Cargando...";
    signInWithEmailAndPassword(auth, email, password)
        .then(() => { 
            loginError.style.display = 'none'; 
            btnLogin.innerText = "Entrar a la app";
        })
        .catch((error) => { 
            loginError.style.display = 'block'; 
            btnLogin.innerText = "Entrar a la app";
        });
});

btnLogout.addEventListener('click', () => {
    signOut(auth);
});

async function cargarDatos() {
    const docRef = doc(db, "usuarios", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        materias = docSnap.data().materias;
    } else {
        materias = defaultMaterias;
        await setDoc(docRef, { materias: materias });
    }
    renderizar();
}

async function guardarDatos() {
    const docRef = doc(db, "usuarios", userId);
    await setDoc(docRef, { materias: materias });
    renderizar();
}

window.registrar = function(id, tipo, operacion) {
    const materia = materias.find(m => m.id === id);
    if (materia) {
        if (operacion === 'sumar') {
            materia[tipo]++;
        } else if (operacion === 'restar' && materia[tipo] > 0) {
            materia[tipo]--;
        }
        guardarDatos();
    }
};

btnReset.addEventListener('click', async () => {
    const palabrasLocas = ["parcial", "promocion", "estudio", "cafe", "sistemas"];
    const palabraElegida = palabrasLocas[Math.floor(Math.random() * palabrasLocas.length)];
    
    const respuesta = prompt(`⚠️ ¿Seguro querés borrar todo tu progreso de la base de datos?\nPara confirmar, escribí: ${palabraElegida}`);
    
    if (respuesta && respuesta.toLowerCase() === palabraElegida) {
        materias = defaultMaterias.map(m => ({ ...m, presentes: 0, faltas: 0, feriados: 0 }));
        await guardarDatos();
        alert("Listo. Cuatrimestre en cero en todos tus dispositivos.");
    }
});

function renderizar() {
    materiasContainer.innerHTML = '';
    
    materias.forEach(materia => {
        const clasesReales = materia.presentes + materia.faltas;
        let porcentaje = 100; 
        if (clasesReales > 0) {
            porcentaje = (materia.presentes / clasesReales) * 100;
        }

        const isSafe = porcentaje >= 75;
        const statusClass = isSafe ? 'status-safe' : 'status-danger';
        const statusText = isSafe ? 'Godines' : 'Boludazo';

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-header">
                <h2 class="materia-title">${materia.nombre}</h2>
                <span class="status-badge ${statusClass}">${porcentaje.toFixed(1)}% | ${statusText}</span>
            </div>
            <div class="stats-container">
                <div class="stat-item">
                    <span>Presentes: <strong>${materia.presentes}</strong></span>
                    <div class="mini-controls">
                        <button onclick="registrar(${materia.id}, 'presentes', 'restar')">-</button>
                        <button onclick="registrar(${materia.id}, 'presentes', 'sumar')">+</button>
                    </div>
                </div>
                <div class="stat-item">
                    <span>Faltas: <strong>${materia.faltas}</strong></span>
                    <div class="mini-controls">
                        <button onclick="registrar(${materia.id}, 'faltas', 'restar')">-</button>
                        <button onclick="registrar(${materia.id}, 'faltas', 'sumar')">+</button>
                    </div>
                </div>
                <div class="stat-item">
                    <span>Feriados: <strong>${materia.feriados}</strong></span>
                    <div class="mini-controls">
                        <button onclick="registrar(${materia.id}, 'feriados', 'restar')">-</button>
                        <button onclick="registrar(${materia.id}, 'feriados', 'sumar')">+</button>
                    </div>
                </div>
            </div>
        `;
        materiasContainer.appendChild(card);
    });
}
