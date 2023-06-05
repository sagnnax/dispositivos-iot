// Crear instancia del cliente MQTT
const client = mqtt.connect('ws://localhost:8083/mqtt');

// Evento cuando el cliente MQTT se conecta
client.on('connect', () => {
  console.log('Conectado al broker MQTT');

  // Suscribirse al topic para recibir el nivel de agua
  client.subscribe('iot/cisterna/nivel', (err) => {
    if (err) {
      console.error('Error al suscribirse al topic', err);
    } else {
      console.log('Suscripción exitosa al topic iot/cisterna/nivel');
    }
  });
});

// Evento cuando se recibe un mensaje en el topic suscrito
client.on('message', (topic, message) => {
  console.log('Mensaje recibido en el topic', topic, ':', message.toString());

  // Actualizar el nivel de agua en la cisterna
  if (topic === 'iot/cisterna/nivel') {
    const nivelAgua = parseInt(message.toString());
    console.log('Nivel de agua en la cisterna:', nivelAgua);
    // Aquí puedes agregar tu lógica para mostrar el nivel de agua en la interfaz gráfica
  }
});

// Función para encender la bomba
function encenderBomba() {
  console.log('Bomba de agua encendida');

  // Publicar un mensaje para encender la bomba
  client.publish('iot/bomba/control', 'encender');
}

// Función para apagar la bomba
function apagarBomba() {
  console.log('Bomba de agua apagada');

  // Publicar un mensaje para apagar la bomba
  client.publish('iot/bomba/control', 'apagar');
}

// Función para realizar el consumo de agua
function realizarConsumo() {
  console.log('Realizando consumo de agua');

  // Aquí puedes agregar tu lógica para realizar el consumo de agua
}

// Función para verificar el nivel de agua en la cisterna
function verificarNivelAgua() {
  console.log('Verificando nivel de agua');

  // Publicar un mensaje para solicitar el nivel de agua en la cisterna
  client.publish('iot/cisterna/nivel', 'solicitar');
}
