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
