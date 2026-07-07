/*
 * Módulo de Dashboard — LaborIA Perú
 * Resume visualmente el resultado del diagnóstico laboral
 * y da acceso rápido a los demás módulos.
 */

function mostrarDashboard() {

    resetContenedor();

    if (!diagnosticoActual) {

        contenido.innerHTML = `

        <h1>📊 Dashboard</h1>

        <p>
        Aún no has completado el diagnóstico laboral. Complétalo primero
        para ver aquí el resumen de tu situación.
        </p>

        <button onclick="iniciarDiagnostico()">
            ⬅ Ir al diagnóstico
        </button>

        `;

        return;
    }

    const d = diagnosticoActual;

    const excedeJornada = d.horas > 8;
    const porcentajeAntiguedad = Math.min((d.tiempo / 12) * 100, 100);

    contenido.innerHTML = `

    <h1>📊 Dashboard</h1>

    <p>
    Resumen de tu situación laboral según el último diagnóstico realizado.
    </p>

    <div class="grid-resultados">

        <div class="tarjeta-resultado color-cts">
            <h3>📄 Régimen identificado</h3>
            <p class="monto texto-regimen">${d.regimenNombre}</p>
            <p class="nota"><strong>${d.normaNombre}</strong> — ${d.normaNumero}</p>
        </div>

        <div class="tarjeta-resultado ${excedeJornada ? "color-indemnizacion" : "color-vacaciones"}">
            <h3>⏱️ Jornada diaria</h3>
            <p class="monto">${d.horas} h</p>
            <div class="barra-progreso">
                <div class="barra-relleno" style="width:${Math.min((d.horas / 8) * 100, 100)}%;"></div>
            </div>
            <p class="nota">${excedeJornada ? "⚠️ Excede la jornada máxima legal de 8h diarias. Corresponde el pago de horas extra." : "Dentro de la jornada máxima legal (8 horas diarias)."}</p>
        </div>

        <div class="tarjeta-resultado color-horas">
            <h3>📆 Tiempo de servicio</h3>
            <p class="monto">${d.tiempo} meses</p>
            <div class="barra-progreso">
                <div class="barra-relleno" style="width:${porcentajeAntiguedad}%;"></div>
            </div>
            <p class="nota">${porcentajeAntiguedad.toFixed(0)}% de avance hacia el primer año completo de servicios.</p>
        </div>

    </div>

    <h2>Acciones rápidas</h2>

    <button onclick="mostrarCalculadoras('${d.regimen}')">
        🧮 Calcular mis beneficios sociales
    </button>

    <button onclick="mostrarConsultaJuridica()">
        🤖 Consultar base legal
    </button>

    <button onclick="iniciarDiagnostico()">
        🔁 Rehacer diagnóstico
    </button>

    `;
}
