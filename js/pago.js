document.addEventListener('DOMContentLoaded', function() {
    loadPaymentInfo();
});

// Función para cargar datos del localStorage y mostrar la información de pago
function loadPaymentInfo() {
    const user = localStorage.getItem('currentUser');
    const selectedMovie = JSON.parse(localStorage.getItem('peliculaselecc'));
    const paymentInfoDiv = document.getElementById('payment-info');

    if (user && selectedMovie) {
        const userObj = JSON.parse(user);
        const movieList = JSON.parse(localStorage.getItem('peliculas'));
        const selectedMovieData = movieList.find(movie => movie.nombre === selectedMovie[0]);

        // Recuperar reservas
        const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        const lastReservation = reservations[reservations.length - 1];
        const seatsCount = lastReservation ? lastReservation.seats.length : 0; // Contar asientos

        if (selectedMovieData) {
            const totalCompra = selectedMovieData.precio * seatsCount; // Calcular total de la compra

            paymentInfoDiv.innerHTML = `
                <h5>Nombre del Cliente: ${userObj.nombre_usuario}</h5>
                <h5>Película Seleccionada: ${selectedMovieData.nombre}</h5>
                <h5>Precio: $${selectedMovieData.precio}</h5>
                <h5>Total de Asientos: ${seatsCount}</h5>
                <h5>Total de su Compra: $${totalCompra.toFixed(2)}</h5> <!-- Mostrar total de compra -->
            `;
            // Mostrar resumen de pedido
            document.getElementById('order-summary').innerHTML = `
                <p>Cliente: ${userObj.nombre_usuario}</p>
                <p>Película: ${selectedMovieData.nombre}</p>
                <p>Precio Total: $${selectedMovieData.precio}</p>
                <p>Total de Asientos: ${seatsCount}</p>
                <p>Total de su Compra: $${totalCompra.toFixed(2)}</p> <!-- Resumen de total de compra -->
            `;
        } else {
            paymentInfoDiv.innerHTML = '<p>Película no encontrada.</p>';
        }
    } else {
        paymentInfoDiv.innerHTML = '<p>No hay información disponible.</p>';
    }
}

// Función para validar los datos de pago
function validatePaymentInput() {
    const cardName = document.getElementById('card-name').value;
    const cardNumber = document.getElementById('card-number').value;
    const expiryDate = document.getElementById('expiry-date').value;
    const cvv = document.getElementById('cvv').value;

    if (!cardName || !cardNumber || !expiryDate || !cvv) {
        alert('Por favor, complete todos los campos.');
        return false;
    }
    return true;
}

// Función para simular el procesamiento del pago
function processPayment() {
    if (!validatePaymentInput()) {
        return;
    }

    const cardName = document.getElementById('card-name').value;

    // Simular el procesamiento del pago
    alert(`Pago procesado con éxito!\nNombre en la tarjeta: ${cardName}`);

    // Actualizar la UI para mostrar el éxito del pago
    document.getElementById('payment-status').innerHTML = `<p>Pago procesado exitosamente para ${cardName}.</p>`;
}

function cancelPayment() {
    window.location.href = 'reservas.html';
}
