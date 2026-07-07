/*
 * Módulo de Consulta Jurídica — LaborIA Perú
 * Chat simulado (reglas locales, sin backend ni API externa) +
 * fichas de base legal con enlace de verificación al SPIJ.
 */

const SPIJ_URL = "https://spij.minjus.gob.pe/";

const BASE_LEGAL = {
    general: {
        icono: "📄",
        nombre: "Régimen General — D.Leg. N.º 728",
        norma: "TUO aprobado por D.S. N.º 003-97-TR",
        resumen: "Regula la contratación laboral en el sector privado.",
        puntosClave: [
            "La contratación a plazo indeterminado es la regla general; los contratos sujetos a modalidad (plazo fijo) están taxativamente enumerados en la ley.",
            "Establece las causas justas de despido relacionadas con la capacidad o la conducta del trabajador, y el procedimiento previo de imputación de cargos.",
            "Si el despido es arbitrario, corresponde una indemnización equivalente a 1.5 remuneraciones mensuales por año completo de servicios, con tope de 12 remuneraciones."
        ]
    },
    jornada: {
        icono: "⏱️",
        nombre: "Jornada de Trabajo y Sobretiempo — Ley N.º 27671",
        norma: "Modifica el D.Leg. N.º 854, TUO aprobado por D.S. N.º 007-2002-TR",
        resumen: "Regula la jornada máxima de trabajo y el pago de horas extra.",
        puntosClave: [
            "La jornada ordinaria máxima es de 8 horas diarias o 48 horas semanales para trabajadores mayores de edad.",
            "El trabajo en sobretiempo es voluntario, tanto en su otorgamiento como en su prestación.",
            "El recargo mínimo es de 25% por hora en las 2 primeras horas extra y de 35% en las horas restantes (art. 10).",
            "El empleador debe registrar el sobretiempo; si no existe registro pero el trabajador acredita el trabajo realizado, igual procede el pago (art. 10-A)."
        ]
    },
    cts: {
        icono: "💰",
        nombre: "Compensación por Tiempo de Servicios (CTS) — D.Leg. N.º 650",
        norma: "TUO aprobado por D.S. N.º 001-97-TR",
        resumen: "Beneficio social de previsión frente al cese laboral.",
        puntosClave: [
            "Equivale aproximadamente a una remuneración por año completo de servicios.",
            "Se deposita semestralmente (primeros 15 días de mayo y noviembre) en la entidad financiera elegida por el trabajador.",
            "La remuneración computable incluye el sueldo y, si corresponde, la sexta parte de la gratificación."
        ]
    },
    gratificaciones: {
        icono: "🎁",
        nombre: "Gratificaciones — Ley N.º 27735 y Ley N.º 29351",
        norma: "Ley N.º 27735 (gratificaciones) y Ley N.º 29351 (bonificación extraordinaria)",
        resumen: "Regula el pago de gratificaciones por Fiestas Patrias y Navidad.",
        puntosClave: [
            "Corresponden 2 gratificaciones al año, cada una equivalente a una remuneración mensual, si se laboró el semestre completo (o de forma proporcional).",
            "La Ley 29351 libera de aportes a EsSalud (9%) y ese monto se entrega al trabajador como bonificación extraordinaria.",
            "Si el trabajador está afiliado a una EPS, la bonificación extraordinaria equivale al 6.75%."
        ]
    },
    vacaciones: {
        icono: "🏖️",
        nombre: "Descanso Vacacional — D.Leg. N.º 713",
        norma: "D.Leg. N.º 713",
        resumen: "Regula el derecho a 30 días de descanso remunerado al año.",
        puntosClave: [
            "El trabajador que cumple el récord vacacional tiene derecho a 30 días calendario de descanso remunerado por año completo de servicios.",
            "Si no goza del descanso vencido, tiene derecho a: la remuneración por el trabajo realizado, la remuneración vacacional adquirida y no gozada, y una indemnización equivalente (art. 23, D.S. N.º 012-92-TR)."
        ]
    },
    mype: {
        icono: "🏪",
        nombre: "Régimen Mype — Ley N.º 30056",
        norma: "Modifica la Ley N.º 28015, Ley MYPE",
        resumen: "Régimen laboral especial para micro y pequeñas empresas.",
        puntosClave: [
            "Microempresa: no genera CTS ni gratificaciones legales, 15 días de vacaciones, no hay reparto de utilidades.",
            "Pequeña empresa: CTS y gratificaciones equivalentes a medio sueldo por semestre, 15 días de vacaciones, sí corresponde reparto de utilidades."
        ]
    },
    cas: {
        icono: "🏛️",
        nombre: "Contrato Administrativo de Servicios (CAS) — D.Leg. N.º 1057",
        norma: "D.Leg. N.º 1057 y su Reglamento, D.S. N.º 075-2008-PCM",
        resumen: "Régimen especial de contratación para el sector público.",
        puntosClave: [
            "No genera CTS ni gratificaciones tradicionales.",
            "Otorga 30 días de descanso vacacional, afiliación a un régimen pensionario y a un seguro de salud.",
            "Se pagan aguinaldos por Fiestas Patrias y Navidad, en montos fijados anualmente por norma presupuestal."
        ]
    },
    agrario: {
        icono: "🌾",
        nombre: "Régimen Agrario — Ley N.º 31110",
        norma: "Ley N.º 31110, Ley de Desarrollo Agrario",
        resumen: "Régimen laboral para el sector agrario y agroexportador.",
        puntosClave: [
            "Desde 2021 equipara los beneficios laborales del sector agrario con el régimen general: CTS, gratificaciones, utilidades y vacaciones.",
            "Incluye afiliación a un seguro de salud agrario."
        ]
    },
    practicante: {
        icono: "🎓",
        nombre: "Modalidades Formativas Laborales — Ley N.º 28518",
        norma: "Ley N.º 28518",
        resumen: "Regula las prácticas preprofesionales y profesionales.",
        puntosClave: [
            "No genera vínculo laboral ni beneficios sociales tradicionales (sin CTS, sin gratificación).",
            "El practicante recibe una subvención económica no menor a una Remuneración Mínima Vital en jornada completa.",
            "Tiene derecho a un descanso de 30 días si el convenio dura un año o más, y debe contar con cobertura de seguro (EsSalud o seguro privado equivalente)."
        ]
    }
};

const RESPUESTAS_IA = [
    { claves: ["cts", "compensacion", "compensación"], ley: "cts" },
    { claves: ["gratificacion", "gratificación", "fiestas patrias", "navidad", "bonificacion extraordinaria"], ley: "gratificaciones" },
    { claves: ["vacacion", "vacaciones", "descanso"], ley: "vacaciones" },
    { claves: ["hora extra", "horas extra", "sobretiempo", "jornada"], ley: "jornada" },
    { claves: ["cas", "administrativo de servicios"], ley: "cas" },
    { claves: ["practicante", "practicas", "prácticas", "convenio de practicas"], ley: "practicante" },
    { claves: ["mype", "microempresa", "pequeña empresa", "pequena empresa"], ley: "mype" },
    { claves: ["agrario", "agricola", "agrícola"], ley: "agrario" },
    { claves: ["728", "despido", "indemnizacion", "indemnización", "plazo indeterminado"], ley: "general" }
];

function responderIA(pregunta) {

    const texto = pregunta.toLowerCase();

    for (const regla of RESPUESTAS_IA) {
        if (regla.claves.some(clave => texto.includes(clave))) {
            const ley = BASE_LEGAL[regla.ley];
            return {
                texto: `Sobre ese tema aplica <strong>${ley.nombre}</strong>. ${ley.resumen} Puedes revisar el detalle en la tarjeta correspondiente más abajo.`,
                leyRelacionada: regla.ley
            };
        }
    }

    return {
        texto: "No identifiqué una norma específica para tu consulta. Prueba con palabras clave como \"CTS\", \"gratificación\", \"vacaciones\", \"horas extra\", \"CAS\", \"practicante\", \"mype\" o \"agrario\", o revisa las tarjetas de base legal más abajo.",
        leyRelacionada: null
    };
}

function mostrarConsultaJuridica() {

    resetContenedor();

    const tarjetas = Object.keys(BASE_LEGAL).map(clave => {
        const ley = BASE_LEGAL[clave];
        return `<button class="btn-ley" onclick="verLey('${clave}')">${ley.icono} ${ley.nombre}</button>`;
    }).join("");

    contenido.innerHTML = `

    <h1>Consulta Jurídica</h1>

    <p>
    Pregúntale al asistente sobre tus beneficios laborales o revisa directamente
    la base legal por tema.
    </p>

    <div class="chat-container">

        <div class="chat-mensajes" id="chatMensajes">
            <div class="burbuja bot">
                👋 Hola, soy el asistente de LaborIA Perú. Puedes preguntarme, por ejemplo:
                <em>"¿Cuándo me pagan la gratificación?"</em> o <em>"¿Cómo se calculan mis horas extra?"</em>
            </div>
        </div>

        <div class="chat-input-row">
            <input type="text" id="preguntaIA" placeholder="Escribe tu consulta laboral..." onkeydown="if(event.key==='Enter'){enviarPreguntaIA();}">
            <button onclick="enviarPreguntaIA()">Enviar</button>
        </div>

    </div>

    <h2>Base legal por tema</h2>

    <div class="grid-leyes">
        ${tarjetas}
    </div>

    <button onclick="iniciarDiagnostico()">
        ⬅ Volver al diagnóstico
    </button>

    `;
}

function mostrarBaseLegal() {

    resetContenedor();

    const tarjetas = Object.keys(BASE_LEGAL).map(clave => {
        const ley = BASE_LEGAL[clave];
        return `<button class="btn-ley" onclick="verLey('${clave}')">${ley.icono} ${ley.nombre}</button>`;
    }).join("");

    contenido.innerHTML = `

    <h1>📚 Base Legal</h1>

    <p>
    Biblioteca de referencia con las normas laborales peruanas más relevantes.
    Haz clic en cualquiera para ver su resumen y verificar el texto vigente en el SPIJ.
    </p>

    <div class="grid-leyes">
        ${tarjetas}
    </div>

    <button onclick="mostrarConsultaJuridica()">
        🤖 Prefiero preguntarle al asistente
    </button>

    <button onclick="iniciarDiagnostico()">
        ⬅ Volver al diagnóstico
    </button>

    `;
}

function enviarPreguntaIA() {

    const input = document.getElementById("preguntaIA");
    const pregunta = input.value.trim();

    if (!pregunta) {
        return;
    }

    const chat = document.getElementById("chatMensajes");

    chat.innerHTML += `<div class="burbuja usuario">${pregunta}</div>`;

    const respuesta = responderIA(pregunta);

    const botonVerNorma = respuesta.leyRelacionada
        ? `<br><button class="btn-mini" onclick="verLey('${respuesta.leyRelacionada}')">Ver norma completa</button>`
        : "";

    chat.innerHTML += `<div class="burbuja bot">${respuesta.texto}${botonVerNorma}</div>`;

    input.value = "";
    chat.scrollTop = chat.scrollHeight;
}

function verLey(clave) {

    resetContenedor();

    const ley = BASE_LEGAL[clave];

    const puntos = ley.puntosClave.map(punto => `<li>${punto}</li>`).join("");

    contenido.innerHTML = `

    <h1>${ley.icono} ${ley.nombre}</h1>

    <p><strong>${ley.norma}</strong></p>

    <p>${ley.resumen}</p>

    <ul class="lista-clave">
        ${puntos}
    </ul>

    <p class="nota-legal">
    Resumen referencial con fines didácticos. Verifica siempre el texto vigente y actualizado
    de la norma antes de tomar decisiones.
    </p>

    <a class="btn-spij" href="${SPIJ_URL}" target="_blank" rel="noopener noreferrer">
        🔗 Ver esta norma actualizada en el SPIJ
    </a>

    <button onclick="mostrarConsultaJuridica()">
        ⬅ Volver a Consulta Jurídica
    </button>

    `;
}
