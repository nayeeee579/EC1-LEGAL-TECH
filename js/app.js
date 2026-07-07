const contenido = document.getElementById("contenido");

let diagnosticoActual = null;

document.getElementById("btnInicio").addEventListener("click", iniciarDiagnostico);

function resetContenedor() {
    contenido.className = "contenedor contenedor-ancho";
}

function irAInicio() {
    location.reload();
}

function iniciarDiagnostico() {

    resetContenedor();

    contenido.innerHTML = `

    <h1>Diagnóstico Laboral</h1>

    <p>
    Responde las siguientes preguntas para identificar tu régimen laboral.
    </p>

    <div class="fila-doble">

        <div class="pregunta">

            <label>🏢 ¿Trabajas en el sector?</label>

            <select id="sector" onchange="actualizarOpcionesContrato()">
                <option value="">Seleccione...</option>
                <option value="publico">Público</option>
                <option value="privado">Privado</option>
            </select>

        </div>

        <div class="pregunta">

            <label>📄 Tipo de contrato</label>

            <select id="contrato">
                <option value="">Seleccione primero el sector...</option>
            </select>

        </div>

    </div>

    <div class="fila-doble">

        <div class="pregunta">

            <label>⏱️ ¿Cuántas horas trabajas al día?</label>

            <input
                type="number"
                id="horas"
                placeholder="Ejemplo: 10">

        </div>

        <div class="pregunta">

            <label>📅 ¿Cuánto tiempo llevas trabajando? (meses)</label>

            <input
                type="number"
                id="tiempo"
                placeholder="Ejemplo: 18">

        </div>

    </div>

    <button onclick="evaluar()">
        🔎 Identificar régimen laboral
    </button>

    `;
}

function actualizarOpcionesContrato() {

    const sector = document.getElementById("sector").value;
    const contrato = document.getElementById("contrato");

    let opciones = `<option value="">Seleccione...</option>`;

    if (sector === "privado") {

        opciones += `
        <option value="728">Indeterminado</option>
        <option value="plazo">Plazo fijo</option>
        <option value="practicante">Practicante</option>
        `;

    } else if (sector === "publico") {

        opciones += `
        <option value="cas">CAS</option>
        <option value="practicante">Practicante</option>
        `;

    }

    contrato.innerHTML = opciones;
}

function evaluar() {

    resetContenedor();

    let sector = document.getElementById("sector").value;
    let contrato = document.getElementById("contrato").value;
    let horas = document.getElementById("horas").value;
    let tiempo = document.getElementById("tiempo").value;

    let resultado = "";

    if (sector === "privado" && (contrato === "728" || contrato === "plazo")) {

        diagnosticoActual = {
            sector, contrato,
            horas: Number(horas) || 0,
            tiempo: Number(tiempo) || 0,
            regimen: "general",
            regimenNombre: "Régimen Laboral Privado",
            normaNombre: "Ley de Productividad y Competitividad Laboral",
            normaNumero: "Decreto Legislativo N.º 728"
        };

        resultado = `

        <h1>Resultado del diagnóstico</h1>

        <h2 class="badge-regimen">🏷️ Régimen Laboral Privado</h2>

        <p>
        Se identificó que perteneces al régimen regulado por la <strong>Ley de Productividad y Competitividad Laboral</strong> — Decreto Legislativo N.º 728.
        </p>

        <div class="info-destacada">
        Horas trabajadas por día: <strong>${horas}</strong><br>
        Tiempo de servicio: <strong>${tiempo}</strong> meses.
        </div>

        <p>
        Ahora puedes acceder a los módulos de LaborIA Perú.
        </p>

        <button onclick="mostrarConsultaJuridica()">🤖 Consulta Jurídica</button>
        <button onclick="mostrarCalculadoras('general')">🧮 Calculadoras</button>
        <button onclick="mostrarBaseLegal()">📚 Base Legal</button>
        <button onclick="mostrarDashboard()">📊 Dashboard</button>

        `;

    } else if (contrato === "cas") {

        diagnosticoActual = {
            sector, contrato,
            horas: Number(horas) || 0,
            tiempo: Number(tiempo) || 0,
            regimen: "cas",
            regimenNombre: "Régimen CAS",
            normaNombre: "Ley que Regula el Régimen Especial de Contratación Administrativa de Servicios",
            normaNumero: "Decreto Legislativo N.º 1057"
        };

        resultado = `

        <h1>Resultado del diagnóstico</h1>

        <h2 class="badge-regimen">🏷️ Régimen CAS</h2>

        <p>
        Se identificó un Contrato Administrativo de Servicios regulado por la <strong>Ley que Regula el Régimen Especial de Contratación Administrativa de Servicios</strong> — Decreto Legislativo N.º 1057.
        </p>

        <div class="info-destacada">
        Horas trabajadas por día: <strong>${horas}</strong><br>
        Tiempo de servicio: <strong>${tiempo}</strong> meses.
        </div>

        <button onclick="mostrarConsultaJuridica()">🤖 Consulta Jurídica</button>
        <button onclick="mostrarCalculadoras('cas')">🧮 Calculadoras</button>
        <button onclick="mostrarBaseLegal()">📚 Base Legal</button>
        <button onclick="mostrarDashboard()">📊 Dashboard</button>

        `;

    } else if (contrato === "practicante") {

        diagnosticoActual = {
            sector, contrato,
            horas: Number(horas) || 0,
            tiempo: Number(tiempo) || 0,
            regimen: "practicante",
            regimenNombre: "Convenio de Prácticas",
            normaNombre: "Ley sobre Modalidades Formativas Laborales",
            normaNumero: "Ley N.º 28518"
        };

        resultado = `

        <h1>Resultado del diagnóstico</h1>

        <h2 class="badge-regimen">🏷️ Practicante</h2>

        <p>
        Se identificó un convenio de prácticas regulado por la <strong>Ley sobre Modalidades Formativas Laborales</strong> — Ley N.º 28518.
        </p>

        <div class="info-destacada">
        Horas trabajadas por día: <strong>${horas}</strong><br>
        Tiempo de servicio: <strong>${tiempo}</strong> meses.
        </div>

        <button onclick="mostrarConsultaJuridica()">🤖 Consulta Jurídica</button>
        <button onclick="mostrarCalculadoras('practicante')">🧮 Calculadoras</button>
        <button onclick="mostrarBaseLegal()">📚 Base Legal</button>
        <button onclick="mostrarDashboard()">📊 Dashboard</button>

        `;

    } else {

        resultado = `

        <h1>No fue posible identificar el régimen.</h1>

        <p>Verifica la información ingresada.</p>

        `;
    }

    contenido.innerHTML = resultado;
}