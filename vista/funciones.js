let clienteChat = null;

function conectar() {
    const socket = new SockJS('http://localhost:5000/ws');
    clienteChat = Stomp.over(socket);

    const id = document.getElementById('numero').value;

    clienteChat.connect(
        { id: id},
        suscripcionAlCallBackt
    );
}

function desconectar() {
    if (clienteChat !== null){
        clienteChat.disconnect(() => {
            setConectado(false);
        });
        clienteChat = null;
    }
}

function suscripcionAlCallBackt(frame) {
    //Suscripción al chat grupal
    const id = document.getElementById('numero').value;
    clienteChat.subscribe(`/notificaciones/modulo_${id}`, recibirNotificacion);
    setConectado(true);
}

function recibirNotificacion(message) {
    console.log("Recibiendo notificación: ", message);
    const data = message.body;
    const referenciaDivMensajes = document.getElementById('notificaciones');
    const nuevoParrafo = document.createElement('p');
    nuevoParrafo.textContent = data;
    referenciaDivMensajes.appendChild(nuevoParrafo);
}

function informarModuloLibre() {
    const id = document.getElementById('numero').value;
    const mensaje = document.getElementById('mensaje');
    if (clienteChat && clienteChat.connected) {
        const mensajeDTO = {
            contenido: mensaje.value,
            idModulo: id
        };
        clienteChat.send("/api/enviarMensaje", {}, JSON.stringify(mensajeDTO));
        mensaje.value = '';
    } else {
        alert("No estás conectado.");
    }
}

function setConectado(conectado) {
    document.getElementById('btnConectar').disabled = conectado;
    document.getElementById('btnDesconectar').disabled = !conectado;
    document.getElementById('numero').disabled = !conectado;
    document.getElementById('mensaje').disabled = !conectado;
    document.getElementById('btnEnviarInformarModulo').disabled = !conectado;
}