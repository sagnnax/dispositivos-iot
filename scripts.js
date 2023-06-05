// Crear instancia del cliente MQTT
const client = mqtt.connect('ws://localhost:8083/mqtt');
let consumoInterval;
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

function realizarConsumo() {
    console.log('Iniciando consumo de agua');
    let consumo = 1000;
    // Decremento del número de 5 en 5
    consumoInterval = setInterval(() => {
      consumo -= 50;
      console.log('Consumo:', consumo);
      
      // Verificar si se alcanzó el nivel crítico de agua
      if (consumo <= 500) {
        console.log('Nivel peligro de agua encienda la bomba');
        // Encender la bomba
        client.publish('iot/cisterna/consumo', "encienda la bomba");
      //  encenderBomba();
        
      }
      //vrificar si enciende bomba 
      if (consumo <= 50) {
        console.log('Nivel crítico de agua encienda la bomba');
        // Encender la bomba
        client.publish('iot/cisterna/consumo', "encienda la bomba");
       encenderBomba();
       detenerConsumo();
        
      }
      // Verificar si se llegó al mínimo de consumo
      if (consumo <= 5) {
        console.log('Consumo finalizado');
        // Detener el consumo
        detenerConsumo();
      }
      client.publish('iot/cisterna/consumo', consumo.toString());
    }, 1000);
  }
  // Función para detener el consumo de agua
  function detenerConsumo() {
    console.log('Consumo detenido');
    clearInterval(consumoInterval);
    client.publish('iot/cisterna/consumo', "se detuvo el consumo");

  } 
function verificarNivelAgua() {
  console.log('Verificando nivel de agua');

  // Publicar un mensaje para solicitar el nivel de agua en la cisterna
  client.publish('iot/cisterna/nivel', 'solicitar');
}
