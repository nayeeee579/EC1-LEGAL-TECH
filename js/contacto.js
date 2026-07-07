/*
 * Módulo de Contacto — LaborIA Perú
 * - Formulario de atención personalizada: se envía por correo (mailto).
 * - Botón flotante: acceso rápido y genérico por WhatsApp (click-to-chat).
 * Sin backend ni almacenamiento.
 */

const CORREO_DESTINO = "nayeliqm09@gmail.com";
const WHATSAPP_NUMERO = "51970826815";

function enviarCorreo() {

    const nombre = document.getElementById("contactoNombre").value.trim();
    const correo = document.getElementById("contactoCorreo").value.trim();
    const telefono = document.getElementById("contactoTelefono").value.trim();
    const comentario = document.getElementById("contactoComentario").value.trim();
    const estado = document.getElementById("contactoEstado");

    if (!nombre || !comentario) {
        estado.textContent = "⚠️ Completa al menos tu nombre y el comentario antes de enviar.";
        estado.style.color = "#B00020";
        return;
    }

    const asunto = `LaborIA Perú — Atención personalizada de ${nombre}`;

    let cuerpo = `Nombre: ${nombre}`;

    if (correo) {
        cuerpo += `\nCorreo: ${correo}`;
    }

    if (telefono) {
        cuerpo += `\nTeléfono: ${telefono}`;
    }

    cuerpo += `\n\nComentario/Recomendación:\n${comentario}`;

    estado.textContent = "Abriendo tu cliente de correo...";
    estado.style.color = "#2E9E5B";

    const url = `mailto:${CORREO_DESTINO}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;

    window.location.href = url;
}

function abrirWhatsApp() {

    const mensaje = "Hola, tengo una consulta sobre mis derechos laborales en LaborIA Perú.";
    const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, "_blank", "noopener,noreferrer");
}
