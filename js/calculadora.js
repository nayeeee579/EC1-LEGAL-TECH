/*
 * Módulo de Calculadoras — LaborIA Perú
 * Calcula beneficios sociales (CTS, gratificaciones, vacaciones,
 * horas extra y asignación familiar) según el régimen laboral.
 * Los porcentajes y montos legales son referenciales; deben
 * contrastarse con la norma vigente al momento del cálculo.
 */

let detalleActual = {};

const REGIMENES = {
    general: {
        nombre: "Régimen General (Decreto Legislativo N.º 728)",
        cts: true,
        ctsFactor: 1,
        gratificacion: true,
        gratFactor: 1,
        vacacionesDias: 30,
        asignacionFamiliar: true,
        horasExtra: true,
        aguinaldoFijo: 0
    },
    pequena: {
        nombre: "Régimen Mype — Pequeña Empresa (Ley N.º 30056)",
        cts: true,
        ctsFactor: 0.5,
        gratificacion: true,
        gratFactor: 0.5,
        vacacionesDias: 15,
        asignacionFamiliar: true,
        horasExtra: true,
        aguinaldoFijo: 0
    },
    micro: {
        nombre: "Régimen Mype — Microempresa (Ley N.º 30056)",
        cts: false,
        ctsFactor: 0,
        gratificacion: false,
        gratFactor: 0,
        vacacionesDias: 15,
        asignacionFamiliar: false,
        horasExtra: true,
        aguinaldoFijo: 0
    },
    cas: {
        nombre: "Contrato Administrativo de Servicios — CAS (D.L. N.º 1057)",
        cts: false,
        ctsFactor: 0,
        gratificacion: false,
        gratFactor: 0,
        vacacionesDias: 30,
        asignacionFamiliar: false,
        horasExtra: false,
        aguinaldoFijo: 300
    },
    agrario: {
        nombre: "Régimen Agrario (Ley N.º 31110)",
        cts: true,
        ctsFactor: 1,
        gratificacion: true,
        gratFactor: 1,
        vacacionesDias: 30,
        asignacionFamiliar: true,
        horasExtra: true,
        aguinaldoFijo: 0
    },
    practicante: {
        nombre: "Convenio de Prácticas (Ley N.º 28518)",
        cts: false,
        ctsFactor: 0,
        gratificacion: false,
        gratFactor: 0,
        vacacionesDias: 30,
        asignacionFamiliar: false,
        horasExtra: false,
        aguinaldoFijo: 0
    }
};

function formatoMoneda(valor) {
    return valor.toLocaleString("es-PE", { style: "currency", currency: "PEN" });
}

function formatoTiempo(mesesDecimal) {
    const totalMeses = Math.round(mesesDecimal);
    const anios = Math.floor(totalMeses / 12);
    const mesesRestantes = totalMeses % 12;

    if (anios === 0) {
        return `${mesesRestantes} ${mesesRestantes === 1 ? "mes" : "meses"}`;
    }

    if (mesesRestantes === 0) {
        return `${anios} ${anios === 1 ? "año" : "años"}`;
    }

    return `${anios} ${anios === 1 ? "año" : "años"} y ${mesesRestantes} ${mesesRestantes === 1 ? "mes" : "meses"}`;
}

function mesesTrabajados(fechaIngreso, fechaCalculo) {
    const ingreso = new Date(fechaIngreso);
    const calculo = new Date(fechaCalculo);

    if (isNaN(ingreso) || isNaN(calculo) || calculo < ingreso) {
        return 0;
    }

    let meses = (calculo.getFullYear() - ingreso.getFullYear()) * 12
        + (calculo.getMonth() - ingreso.getMonth());
    meses += (calculo.getDate() - ingreso.getDate()) / 30;

    return meses < 0 ? 0 : meses;
}

const RECOMENDACION_SALUD = {
    general: "Como trabajador del Régimen General, tu empleador está obligado a afiliarte a EsSalud aportando el 9% de tu remuneración (Ley N.º 26790, Ley de Modernización de la Seguridad Social en Salud). Si no te ha afiliado, exígelo o repórtalo ante SUNAFIL.",
    pequena: "Como trabajador de una Pequeña Empresa, tu empleador también está obligado a afiliarte a EsSalud (Ley N.º 26790). La falta de afiliación es una infracción laboral fiscalizable por SUNAFIL.",
    micro: "Incluso en la Microempresa, la afiliación a EsSalud es obligatoria para todo trabajador dependiente (Ley N.º 26790). Solicita tu afiliación a tu empleador o repórtalo a SUNAFIL.",
    cas: "Bajo el régimen CAS, la entidad contratante está obligada a afiliarte a EsSalud (D.Leg. N.º 1057 y su Reglamento, D.S. N.º 075-2008-PCM, art. 7). Si no cuentas con cobertura, repórtalo a la oficina de recursos humanos de tu entidad.",
    agrario: "En el Régimen Agrario también es obligatoria la afiliación a un seguro de salud (Seguro de Salud Agrario o EsSalud), conforme a la Ley N.º 31110. Solicita tu afiliación a tu empleador.",
    practicante: "La Ley N.º 28518 (art. 19) exige que todo convenio de prácticas incluya un seguro que cubra riesgos de enfermedad y accidentes (EsSalud u otro equivalente), a cargo de la empresa. Si no cuentas con este seguro, tu convenio podría estar incumpliendo la ley."
};

function recomendacionSalud(clave) {
    return RECOMENDACION_SALUD[clave]
        || "La afiliación a un seguro de salud es un derecho laboral; verifica tu situación con la normativa vigente.";
}

function mostrarCalculadoras(regimenSugerido) {

    resetContenedor();

    const hoy = new Date().toISOString().slice(0, 10);
    const opciones = Object.keys(REGIMENES).map(clave => {
        const seleccionado = clave === regimenSugerido ? "selected" : "";
        return `<option value="${clave}" ${seleccionado}>${REGIMENES[clave].nombre}</option>`;
    }).join("");

    contenido.innerHTML = `

    <h1>Calculadora de Beneficios Sociales</h1>

    <p>
    Completa tus datos laborales para estimar los beneficios que te corresponden.
    </p>

    <div class="pregunta">
        <label>Régimen laboral</label>
        <select id="regimenCalc">${opciones}</select>
    </div>

    <div class="pregunta">
        <label>Remuneración mensual bruta (S/)</label>
        <input type="number" id="sueldo" placeholder="Ejemplo: 1500" min="0" step="0.01">
    </div>

    <div class="pregunta">
        <label>Fecha de ingreso</label>
        <input type="date" id="fechaIngreso" min="1970-01-01" max="${hoy}">
    </div>

    <div class="pregunta">
        <label>Fecha de cálculo</label>
        <input type="date" id="fechaCalculo" value="${hoy}" min="1970-01-01" max="${hoy}">
    </div>

    <div class="pregunta">
        <label>Número de hijos (opcional, para asignación familiar)</label>
        <input type="number" id="hijos" placeholder="0 si no tienes hijos" min="0" step="1">
    </div>

    <div class="pregunta">
        <label>Seguro de salud (afecta bonificación extraordinaria de gratificación)</label>
        <select id="seguro">
            <option value="essalud">EsSalud (9%)</option>
            <option value="eps">EPS (6.75%)</option>
            <option value="ninguno">No tengo seguro de salud</option>
        </select>
    </div>

    <div class="fila-doble">

        <div class="pregunta">
            <label>¿Cuántos días al mes hiciste horas extra?</label>
            <input type="number" id="diasSobretiempo" placeholder="0 si no hiciste horas extra" min="0" max="31" step="1">
        </div>

        <div class="pregunta">
            <label>¿Cuántas horas extra por día, en promedio?</label>
            <input type="number" id="horasPromedioDia" placeholder="Ej. 2" min="0" max="12" step="0.5">
        </div>

    </div>

    <p class="nota-legal" style="margin-top:10px;">
    No te preocupes por calcular el recargo: nosotros aplicamos automáticamente el 25% (primeras 2 horas de cada día) y el 35% (el resto), según la ley.
    </p>

    <div class="pregunta">
        <label>¿Ya gozaste tu descanso vacacional de este periodo?</label>
        <select id="gozoVacaciones">
            <option value="si">Sí</option>
            <option value="no">No</option>
        </select>
    </div>

    <div class="pregunta">
        <label>Remuneración Mínima Vital vigente (S/)</label>
        <input type="number" id="rmv" value="1025" min="0" step="0.01">
    </div>

    <button onclick="calcularBeneficios()">
        Calcular beneficios
    </button>

    <button onclick="iniciarDiagnostico()">
        ⬅ Volver al diagnóstico
    </button>

    `;
}

function calcularBeneficios() {

    const clave = document.getElementById("regimenCalc").value;
    const regimen = REGIMENES[clave];

    const sueldo = parseFloat(document.getElementById("sueldo").value) || 0;
    const fechaIngreso = document.getElementById("fechaIngreso").value;
    const fechaCalculo = document.getElementById("fechaCalculo").value;
    const hijos = parseInt(document.getElementById("hijos").value, 10) || 0;
    const seguro = document.getElementById("seguro").value;
    const diasSobretiempo = parseFloat(document.getElementById("diasSobretiempo").value) || 0;
    const horasPromedioDia = parseFloat(document.getElementById("horasPromedioDia").value) || 0;
    const horas25 = Math.min(horasPromedioDia, 2) * diasSobretiempo;
    const horas35 = Math.max(horasPromedioDia - 2, 0) * diasSobretiempo;
    const totalHorasExtra = horas25 + horas35;
    const gozoVacaciones = document.getElementById("gozoVacaciones").value;
    const rmv = parseFloat(document.getElementById("rmv").value) || 0;

    if (!fechaIngreso || !fechaCalculo || sueldo <= 0) {
        contenido.innerHTML += `
        <p style="color:#B00020; font-weight:bold;">
        Ingresa la remuneración y las fechas de ingreso y cálculo para continuar.
        </p>
        `;
        return;
    }

    if (fechaIngreso < "1970-01-01" || fechaCalculo < "1970-01-01") {
        contenido.innerHTML += `
        <p style="color:#B00020; font-weight:bold;">
        La fecha de ingreso o de cálculo no parece válida. Revísala e inténtalo de nuevo.
        </p>
        `;
        return;
    }

    const meses = mesesTrabajados(fechaIngreso, fechaCalculo);

    const asignacionFamiliar = (regimen.asignacionFamiliar && hijos > 0)
        ? rmv * 0.10
        : 0;

    const remuneracionComputable = sueldo + asignacionFamiliar;

    const cts = regimen.cts
        ? remuneracionComputable * regimen.ctsFactor * (meses / 12)
        : 0;

    const mesesGrat = Math.min(meses, 6);
    const gratificacion = regimen.gratificacion
        ? remuneracionComputable * regimen.gratFactor * (mesesGrat / 6)
        : 0;

    const bonificacionExtraordinaria = (regimen.gratificacion && seguro !== "ninguno")
        ? gratificacion * (seguro === "eps" ? 0.0675 : 0.09)
        : 0;

    const diasVacacionesGanados = Math.min(
        regimen.vacacionesDias * (meses / 12),
        regimen.vacacionesDias
    );
    const montoVacaciones = (sueldo / 30) * diasVacacionesGanados;

    const indemnizacionVacacional = (gozoVacaciones === "no" && meses > 12)
        ? montoVacaciones
        : 0;

    const valorHora = sueldo / 30 / 8;
    const montoHorasExtra = regimen.horasExtra
        ? (horas25 * valorHora * 1.25) + (horas35 * valorHora * 1.35)
        : 0;

    const aguinaldo = regimen.aguinaldoFijo > 0 ? regimen.aguinaldoFijo * 2 : 0;

    const total = cts + gratificacion + bonificacionExtraordinaria
        + montoVacaciones + indemnizacionVacacional + montoHorasExtra + aguinaldo;

    detalleActual = {

        cts: {
            titulo: "💰 CTS — Compensación por Tiempo de Servicios",
            queEs: "Es un beneficio social de previsión frente al cese laboral, regulado por el D.Leg. N.º 650 (TUO D.S. N.º 001-97-TR).",
            contexto: "Funciona como un fondo de respaldo económico que el empleador deposita semestralmente (mayo y noviembre) en la entidad financiera que elijas, para cubrirte ante una eventual pérdida del empleo.",
            porQue: regimen.cts
                ? `Corresponde porque el ${regimen.nombre} sí reconoce este beneficio, con un factor de ${regimen.ctsFactor} remuneración(es) por año completo de servicios.`
                : `No corresponde porque el ${regimen.nombre} no incluye legalmente el pago de CTS.`,
            calculo: regimen.cts
                ? `Remuneración computable (S/ ${sueldo.toFixed(2)} + asignación familiar S/ ${asignacionFamiliar.toFixed(2)} = S/ ${remuneracionComputable.toFixed(2)}) × factor ${regimen.ctsFactor} × (${formatoTiempo(meses)} ÷ 12) = ${formatoMoneda(cts)}.`
                : "No aplica cálculo porque el régimen no otorga este beneficio."
        },

        gratificacion: {
            titulo: "🎁 Gratificación",
            queEs: "Beneficio equivalente a una remuneración adicional que se paga dos veces al año, regulado por la Ley N.º 27735.",
            contexto: "Se paga en julio (Fiestas Patrias) y en diciembre (Navidad), siempre que se haya laborado el semestre respectivo, de forma completa o proporcional.",
            porQue: regimen.gratificacion
                ? `Corresponde porque el ${regimen.nombre} reconoce gratificaciones con un factor de ${regimen.gratFactor} remuneración(es) por semestre.`
                : `No corresponde porque el ${regimen.nombre} no incluye legalmente gratificaciones.`,
            calculo: regimen.gratificacion
                ? `Remuneración computable (S/ ${remuneracionComputable.toFixed(2)}) × factor ${regimen.gratFactor} × (meses del semestre trabajados ${mesesGrat.toFixed(1)} ÷ 6) = ${formatoMoneda(gratificacion)}.`
                : "No aplica cálculo porque el régimen no otorga este beneficio."
        },

        bono: {
            titulo: "⭐ Bonificación extraordinaria",
            queEs: "Monto adicional a la gratificación creado por la Ley N.º 29351, que traslada al trabajador el aporte a EsSalud (9%) o EPS (6.75%) que el empleador deja de pagar sobre la gratificación.",
            contexto: "Busca que el trabajador reciba íntegramente ese porcentaje en vez de que se destine a la seguridad social, como incentivo adicional en julio y diciembre.",
            porQue: !regimen.gratificacion
                ? `No corresponde porque el ${regimen.nombre} no otorga gratificaciones (base de este beneficio).`
                : seguro === "ninguno"
                    ? "No se calculó porque declaraste no contar con seguro de salud; revisa la alerta legal mostrada arriba."
                    : `Corresponde porque tu gratificación sí genera este beneficio y declaraste estar afiliado a ${seguro === "eps" ? "una EPS" : "EsSalud"}.`,
            calculo: (regimen.gratificacion && seguro !== "ninguno")
                ? `Gratificación (${formatoMoneda(gratificacion)}) × ${seguro === "eps" ? "6.75%" : "9%"} = ${formatoMoneda(bonificacionExtraordinaria)}.`
                : "No aplica cálculo."
        },

        vacaciones: {
            titulo: "🏖️ Vacaciones",
            queEs: "Descanso remunerado regulado por el D.Leg. N.º 713, de 30 días calendario por año completo de servicios en el régimen general (o los días que fije tu régimen).",
            contexto: "Busca garantizar un periodo de descanso pagado tras acumular el tiempo de servicios correspondiente (récord vacacional).",
            porQue: `Se calculó de forma proporcional al tiempo trabajado (${formatoTiempo(meses)}), sobre un máximo de ${regimen.vacacionesDias} días anuales que reconoce el ${regimen.nombre}.`,
            calculo: `(Remuneración diaria S/ ${(sueldo / 30).toFixed(2)}) × (${diasVacacionesGanados.toFixed(1)} días ganados de ${regimen.vacacionesDias}) = ${formatoMoneda(montoVacaciones)}.`
        },

        indemnizacion: {
            titulo: "⚖️ Indemnización vacacional",
            queEs: "Compensación adicional cuando el descanso vacacional ya adquirido no se goza dentro del plazo legal, regulada por el art. 23 del D.S. N.º 012-92-TR.",
            contexto: "Busca desincentivar que el empleador impida el descanso físico del trabajador: si no te dejan salir de vacaciones a tiempo, además de pagarte el periodo, te deben una indemnización equivalente.",
            porQue: indemnizacionVacacional > 0
                ? "Corresponde porque indicaste que no gozaste tu descanso vacacional y ya superaste los 12 meses de servicio (récord vencido)."
                : "No aplica porque ya gozaste tus vacaciones o aún no acumulas más de 12 meses de servicio.",
            calculo: indemnizacionVacacional > 0
                ? `Equivale al mismo monto de la remuneración vacacional no gozada: ${formatoMoneda(montoVacaciones)} = ${formatoMoneda(indemnizacionVacacional)}.`
                : "No aplica cálculo."
        },

        horas: {
            titulo: "⏱️ Horas extra",
            queEs: "Pago por el tiempo trabajado en sobretiempo, regulado por la Ley N.º 27671 y su reglamento (D.S. N.º 007-2002-TR y D.S. N.º 008-2002-TR).",
            contexto: "La jornada máxima legal es de 8 horas diarias o 48 semanales. Lo que excede cada día se paga con un recargo mínimo de 25% en las primeras 2 horas y 35% en las horas adicionales de ese mismo día (art. 10, Ley N.º 27671).",
            porQue: regimen.horasExtra
                ? (totalHorasExtra > 0
                    ? `Corresponde porque el ${regimen.nombre} reconoce el pago de sobretiempo. Trabajaste en promedio ${horasPromedioDia} hora(s) extra en ${diasSobretiempo} día(s): de esas, ${horas25.toFixed(1)} hora(s) al mes se pagan al 25% (primeras 2 horas de cada día) y ${horas35.toFixed(1)} hora(s) al 35% (el excedente diario).`
                    : "No registraste horas extra este mes.")
                : `No corresponde porque el ${regimen.nombre} no contempla el pago de horas extra en este cálculo.`,
            calculo: (regimen.horasExtra && totalHorasExtra > 0)
                ? `Valor hora (S/ ${sueldo.toFixed(2)} ÷ 30 ÷ 8 = S/ ${valorHora.toFixed(2)}) → (${horas25.toFixed(1)} h al 25% × 1.25) + (${horas35.toFixed(1)} h al 35% × 1.35) = ${formatoMoneda(montoHorasExtra)}.`
                : "No aplica cálculo."
        },

        asignacion: {
            titulo: "👨‍👩‍👧 Asignación familiar",
            queEs: "Monto mensual equivalente al 10% de la Remuneración Mínima Vital (RMV), regulado por la Ley N.º 25129 y su reglamento.",
            contexto: "Se otorga a trabajadores del régimen privado que tienen uno o más hijos menores de 18 años (o hasta 24 si estudian una carrera universitaria o técnica).",
            porQue: (regimen.asignacionFamiliar && hijos > 0)
                ? `Corresponde porque el ${regimen.nombre} reconoce este beneficio y declaraste tener ${hijos} hijo(s).`
                : !regimen.asignacionFamiliar
                    ? `No corresponde porque el ${regimen.nombre} no reconoce este beneficio.`
                    : "No corresponde porque no declaraste tener hijos.",
            calculo: (regimen.asignacionFamiliar && hijos > 0)
                ? `10% de la RMV (S/ ${rmv.toFixed(2)}) = ${formatoMoneda(asignacionFamiliar)} mensuales.`
                : "No aplica cálculo."
        },

        aguinaldo: {
            titulo: "🎄 Aguinaldo",
            queEs: "Monto fijo que se otorga a trabajadores del régimen CAS por Fiestas Patrias y Navidad, fijado cada año mediante norma presupuestal (Ley de Presupuesto del Sector Público).",
            contexto: "Sustituye a las gratificaciones tradicionales, ya que el régimen CAS no las reconoce.",
            porQue: regimen.aguinaldoFijo > 0
                ? `Corresponde porque el ${regimen.nombre} otorga este beneficio dos veces al año.`
                : `No corresponde porque el ${regimen.nombre} no contempla aguinaldo.`,
            calculo: regimen.aguinaldoFijo > 0
                ? `Monto referencial S/ ${regimen.aguinaldoFijo.toFixed(2)} × 2 (Fiestas Patrias y Navidad) = ${formatoMoneda(aguinaldo)}.`
                : "No aplica cálculo."
        }

    };

    contenido.innerHTML = `

    <h1>Resultado del cálculo</h1>
    <h2>${regimen.nombre}</h2>

    <p>
    Tiempo de servicios considerado: <strong>${formatoTiempo(meses)}</strong>.
    </p>

    ${seguro === "ninguno" ? `
    <div class="alerta-salud">
        <strong>⚠️ No cuentas con seguro de salud declarado.</strong>
        <p>${recomendacionSalud(clave)}</p>
    </div>
    ` : ""}

    <div class="grid-resultados">

        <div class="tarjeta-resultado color-cts" onclick="abrirDetalleBeneficio('cts')">
            <h3>💰 CTS</h3>
            <p class="monto">${formatoMoneda(cts)}</p>
            <p class="nota">${regimen.cts ? "Compensación por Tiempo de Servicios acumulada proporcionalmente." : "No corresponde en este régimen."}</p>
            <p class="ver-detalle">🔍 Ver detalle</p>
        </div>

        <div class="tarjeta-resultado color-gratificacion" onclick="abrirDetalleBeneficio('gratificacion')">
            <h3>🎁 Gratificación</h3>
            <p class="monto">${formatoMoneda(gratificacion)}</p>
            <p class="nota">${regimen.gratificacion ? "Proporcional al semestre en curso." : "No corresponde en este régimen."}</p>
            <p class="ver-detalle">🔍 Ver detalle</p>
        </div>

        <div class="tarjeta-resultado color-bono" onclick="abrirDetalleBeneficio('bono')">
            <h3>⭐ Bonificación extraordinaria</h3>
            <p class="monto">${formatoMoneda(bonificacionExtraordinaria)}</p>
            <p class="nota">${regimen.gratificacion ? (seguro === "eps" ? "6.75% de la gratificación (EPS)." : "9% de la gratificación (EsSalud).") : "No corresponde en este régimen."}</p>
            <p class="ver-detalle">🔍 Ver detalle</p>
        </div>

        <div class="tarjeta-resultado color-vacaciones" onclick="abrirDetalleBeneficio('vacaciones')">
            <h3>🏖️ Vacaciones</h3>
            <p class="monto">${formatoMoneda(montoVacaciones)}</p>
            <p class="nota">${diasVacacionesGanados.toFixed(1)} de ${regimen.vacacionesDias} días ganados proporcionalmente.</p>
            <p class="ver-detalle">🔍 Ver detalle</p>
        </div>

        <div class="tarjeta-resultado color-indemnizacion" onclick="abrirDetalleBeneficio('indemnizacion')">
            <h3>⚖️ Indemnización vacacional</h3>
            <p class="monto">${formatoMoneda(indemnizacionVacacional)}</p>
            <p class="nota">${indemnizacionVacacional > 0 ? "Por no haber gozado el descanso vencido (art. 23, D.S. N.º 012-92-TR)." : "No aplica: sin récord vencido o vacaciones ya gozadas."}</p>
            <p class="ver-detalle">🔍 Ver detalle</p>
        </div>

        <div class="tarjeta-resultado color-horas" onclick="abrirDetalleBeneficio('horas')">
            <h3>⏱️ Horas extra</h3>
            <p class="monto">${formatoMoneda(montoHorasExtra)}</p>
            <p class="nota">${regimen.horasExtra ? `${horas25.toFixed(1)} h al 25% + ${horas35.toFixed(1)} h al 35%.` : "No corresponde en este régimen."}</p>
            <p class="ver-detalle">🔍 Ver detalle</p>
        </div>

        <div class="tarjeta-resultado color-asignacion" onclick="abrirDetalleBeneficio('asignacion')">
            <h3>👨‍👩‍👧 Asignación familiar</h3>
            <p class="monto">${formatoMoneda(asignacionFamiliar)}</p>
            <p class="nota">${regimen.asignacionFamiliar ? "10% de la RMV, monto mensual (no acumulativo en el total)." : "No corresponde en este régimen."}</p>
            <p class="ver-detalle">🔍 Ver detalle</p>
        </div>

        <div class="tarjeta-resultado color-aguinaldo" onclick="abrirDetalleBeneficio('aguinaldo')">
            <h3>🎄 Aguinaldo</h3>
            <p class="monto">${formatoMoneda(aguinaldo)}</p>
            <p class="nota">${regimen.aguinaldoFijo > 0 ? "Fiestas Patrias y Navidad, monto referencial fijado por norma presupuestal." : "No corresponde en este régimen."}</p>
            <p class="ver-detalle">🔍 Ver detalle</p>
        </div>

    </div>

    <div class="total-final">
        <span>Total estimado de beneficios (sin incluir asignación familiar mensual)</span>
        <strong>${formatoMoneda(total)}</strong>
    </div>

    <p class="nota-legal">
    Cálculo referencial basado en la normativa laboral peruana vigente.
    Verifica siempre con la norma actualizada o un especialista antes de tomar decisiones.
    </p>

    <button onclick="mostrarCalculadoras('${clave}')">
        🔁 Nuevo cálculo
    </button>

    <button onclick="iniciarDiagnostico()">
        ⬅ Volver al diagnóstico
    </button>

    `;
}

function abrirDetalleBeneficio(clave) {

    const detalle = detalleActual[clave];

    if (!detalle) {
        return;
    }

    document.getElementById("modalContenido").innerHTML = `

    <h2 class="badge-regimen">${detalle.titulo}</h2>

    <h3>¿Qué es?</h3>
    <p>${detalle.queEs}</p>

    <h3>Contexto</h3>
    <p>${detalle.contexto}</p>

    <h3>¿Por qué te corresponde (o no)?</h3>
    <p>${detalle.porQue}</p>

    <h3>¿Cómo se calculó el monto?</h3>
    <p class="info-destacada">${detalle.calculo}</p>

    `;

    document.getElementById("modalDetalle").classList.remove("oculto");
}

function cerrarDetalle() {
    document.getElementById("modalDetalle").classList.add("oculto");
}
