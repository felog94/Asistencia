const defaultMaterias = [
    { id: 1, nombre: 'AyM', presentes: 0, faltas: 0, feriados: 0 },
    { id: 2, nombre: 'BBDD2', presentes: 0, faltas: 0, feriados: 0 },
    { id: 3, nombre: 'PNT2', presentes: 0, faltas: 0, feriados: 0 },
    { id: 4, nombre: 'TP2', presentes: 0, faltas: 0, feriados: 0 },
    { id: 5, nombre: 'P2', presentes: 0, faltas: 0, feriados: 0 }
];

let materias = JSON.parse(localStorage.getItem('asistenciaFacu')) || defaultMaterias;

const container = document.getElementById('app-container');

function guardarDatos() {
    localStorage.setItem('asistenciaFacu', JSON.stringify(materias));
    renderizar();
}

function registrar(id, tipo) {
    const materia = materias.find(m => m.id === id);
    if (materia) {
        materia[tipo]++;
        guardarDatos();
    }
}

function renderizar() {
    container.innerHTML = '';
    
    materias.forEach(materia => {
        const clasesReales = materia.presentes + materia.faltas;
        let porcentaje = 100;
        
        if (clasesReales > 0) {
            porcentaje = (materia.presentes / clasesReales) * 100;
        }

        const isSafe = porcentaje >= 75;
        const statusClass = isSafe ? 'status-safe' : 'status-danger';
        const statusText = isSafe ? 'Ok ✅' : 'Ojo ⚠️';

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-header">
                <h2 class="materia-title">${materia.nombre}</h2>
                <span class="status-badge ${statusClass}">${porcentaje.toFixed(1)}% | ${statusText}</span>
            </div>
            <div class="stats">
                <span>Presentes: ${materia.presentes}</span>
                <span>Faltas: ${materia.faltas}</span>
                <span>Feriados: ${materia.feriados}</span>
            </div>
            <div class="buttons">
                <button class="btn-presente" onclick="registrar(${materia.id}, 'presentes')">✔️</button>
                <button class="btn-falta" onclick="registrar(${materia.id}, 'faltas')">❌</button>
                <button class="btn-feriado" onclick="registrar(${materia.id}, 'feriados')">⚪</button>
            </div>
        `;
        container.appendChild(card);
    });
}

renderizar();
