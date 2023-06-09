// Crear instancia del cliente MQTT
const client = mqtt.connect('ws://localhost:8083/mqtt');
let consumoInterval;
let llenadoInterval;
let bombaEncendida;
let consumo = 1000;

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
    console.log('Nivel de agua en la cisterna:', nivelActual);
    // Aquí puedes agregar tu lógica para mostrar el nivel de agua en la interfaz gráfica
  }
});
function encenderBomba() {
  if (bombaEncendida) {
    console.log('La bomba de agua ya está encendida.');
    return;
  }

  console.log('Encendiendo la bomba de agua');
  // Publicar un mensaje para encender la bomba
  client.publish('iot/bomba/control', 'encender');
  bombaEncendida = true;

}

// Función para apagar la bomba de agua
function apagarBomba() {
  if (!bombaEncendida) {
    console.log('La bomba de agua ya está apagada.');
    return;
  }

  console.log('Apagando la bomba de agua');
  client.publish('iot/bomba/control', 'apagar');
  bombaEncendida = false;

}


function realizarConsumo() {
  console.log('Iniciando consumo de agua');

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
    //limite maximo donde se deja de consumir agua
    if (consumo <= 50) {
      console.log('Nivel crítico de agua encienda la bomba');
      // Encender la bomba
      client.publish('iot/cisterna/consumo', "encienda la bomba");
      encenderBomba();
      detenerConsumo();
      realizarLlenado();

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
  nivelActual = parseInt((Math.random() * (1000 - 0) + 0));

  // Publicar un mensaje para solicitar el nivel de agua en la cisterna
  console.log('Nivel Actual: ', nivelActual);
  client.publish('iot/cisterna/nivel', 'En la cisterna hay: ' + nivelActual + ' Litros');
}
// Función para realizar el llenado de agua
function realizarLlenado() {
  if (!bombaEncendida) {
    console.log('La bomba de agua está apagada. No se puede realizar el llenado.');
    return;
  }

  detenerConsumo();
  console.log('Iniciando llenado de agua');
  // Incremento del número de 5 en 5
  llenadoInterval = setInterval(() => {
    consumo += 50;
    console.log('Llenado:', consumo);
    // Verificar si se alcanzó el máximo de llenado
    if (consumo >= 1000) {
      console.log('Llenado completo');
      // Detener el llenado
      detenerLlenado();
    }
    client.publish('iot/cisterna/consumo', consumo.toString());
  }, 1000);
}
// Función para detener el llenado de agua
function detenerLlenado() {
  console.log('Llenado detenido');
  clearInterval(llenadoInterval);
  apagarBomba();
}

