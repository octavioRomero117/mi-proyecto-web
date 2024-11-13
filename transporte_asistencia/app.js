// Variables para el video y la ubicación
const video = document.getElementById('video');
const qrResult = document.getElementById('qrResult');
const locationElement = document.getElementById('location');

// Iniciar la cámara
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
  .then((stream) => {
    video.srcObject = stream;
    scanQRCode();
  })
  .catch((error) => {
    console.error("Error al acceder a la cámara: ", error);
  });

// Función para escanear QR
function scanQRCode() {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  video.addEventListener('play', () => {
    setInterval(() => {
      if (video.paused || video.ended) return;

      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, canvas.width, canvas.height);

      if (code) {
        qrResult.textContent = code.data; // Mostrar el QR escaneado
      }
    }, 100);
  });
}

// Función para obtener la ubicación
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    locationElement.textContent = "Geolocalización no soportada en este navegador.";
  }
}

// Mostrar la ubicación
function showPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  locationElement.textContent = `Latitud: ${lat}, Longitud: ${lon}`;
}

// Manejar errores de ubicación
function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      locationElement.textContent = "Permiso denegado para obtener ubicación.";
      break;
    case error.POSITION_UNAVAILABLE:
      locationElement.textContent = "Ubicación no disponible.";
      break;
    case error.TIMEOUT:
      locationElement.textContent = "Tiempo de espera excedido.";
      break;
    default:
      locationElement.textContent = "Error desconocido.";
      break;
  }
}
