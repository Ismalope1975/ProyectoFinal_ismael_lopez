document.addEventListener('DOMContentLoaded', function() {
    // Mostrar el nombre del usuario logueado
    const user = localStorage.getItem('currentUser');
    if (user) {
        const userObj = JSON.parse(user);
        document.getElementById('userName').textContent = userObj.nombre_usuario;
    }

    // Obtener el valor de peliculaselecc
    const peliculaEncontra = JSON.parse(localStorage.getItem('peliculaselecc'));
    const peliculas = JSON.parse(localStorage.getItem('peliculas'));
    const peliculaEncontrada = peliculas.find(pelicula => pelicula.nombre === peliculaEncontra[0]);

    // Mostrar la imagen y detalles de la película
    const detallesContainer = document.getElementById('pelicula-detalles');
    if (peliculaEncontra) {
        let imagenPelicula = peliculaEncontrada.img || '../images/pngegg (2).png';
        if (imagenPelicula && !imagenPelicula.startsWith('../')) {
            imagenPelicula = '../' + imagenPelicula;
        }
        document.getElementById('pelicula-imagen').src = imagenPelicula;

        detallesContainer.innerHTML = `
        <div class="row">
            <div class="col-md-5 fs-5 d-flex flex-column justify-content-start text-left ms-4 ">
                <div>Título: ${peliculaEncontrada.nombre}</div>
                <div>Actores: ${peliculaEncontrada.actor1}, ${peliculaEncontrada.actor2}, ${peliculaEncontrada.actor3}</div>
                <div>Año: ${peliculaEncontrada.año}</div>
            </div>
            <div class="col-md-4 fs-5 d-flex flex-column justify-content-center text-center">
                <div>Tipo: ${peliculaEncontrada.tipo}</div>
                <div>Cine: ${peliculaEncontrada.cine}</div>
            </div>
            <div class="col-md-2 fs-5 d-flex flex-column justify-content-start text-left">
                <div>Días: ${peliculaEncontrada.dia1}, ${peliculaEncontrada.dia2}, ${peliculaEncontrada.dia3}</div>
                <div>Precio: $${peliculaEncontrada.precio}</div>
            </div>
        </div>
        `;
    } else {
        detallesContainer.innerHTML = `<p>No se encontró información de la película seleccionada.</p>`;
    }
});

// Formar grid con los "asientos"
const rows = 10;
const cols = 20;
const seatingChart = document.getElementById('seating-chart');
const reservationInfo = document.getElementById('reservation-info');
const reservationList = document.getElementById('reservation-list');
let seats = [];
let currentReservation = null;

// Cargar datos del usuario desde localStorage
const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { nombre_usuario: "Nombre del Cliente", cedula: "123456789" };

window.onload = loadReservations;

// Inicializar la cuadrícula de asientos
for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        const seat = document.createElement('div');
        seat.classList.add('seat');
        seat.dataset.row = i;
        seat.dataset.col = j;
        seat.innerHTML = `<span>${String.fromCharCode(65 + i)}${j + 1}</span>`;
        seat.onclick = () => selectSeat(seat);
        seatingChart.appendChild(seat);
        seats.push({ row: i, col: j, reserved: false, label: `${String.fromCharCode(65 + i)}${j + 1}` });
    }
}

function selectSeat(seat) {
    if (!seat.classList.contains('reserved')) {
        seat.classList.toggle('selected');
        updateSelectedSeatsDisplay();
    }
}

// Reservar asientos
function reserveSeats() {
    const numTickets = parseInt(document.getElementById('num-tickets').value);
    const reservationDate = document.getElementById('reservation-date').value;

    if (!isValidDate(reservationDate)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, selecciona una fecha y hora válida.'
        });
        return;
    }

    if (isNaN(numTickets) || numTickets < 1 || numTickets > 10) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, ingresa un número válido de entradas (1-10).'
        });
        return;
    }

    const selectedSeats = document.querySelectorAll('.seat.selected');
    if (selectedSeats.length < numTickets) {
        Swal.fire("Selecciona más asientos.");
        return;
    }

    // Mostrar modal de pago antes de guardar la reserva
    const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
    paymentModal.show();

    // Manejar el envío del formulario de pago
        document.getElementById('paymentForm').onsubmit = function(event) {
        event.preventDefault(); // Prevenir el envío normal del formulario

        const cardNumber = document.getElementById('cardNumber').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;

        const reservedSeats = [];
        selectedSeats.forEach(seat => {
            seat.classList.remove('selected');
            seat.classList.add('reserved');
            reservedSeats.push({ row: seat.dataset.row, col: seat.dataset.col, label: seat.innerText });
        });

        const peliculaEncontra = JSON.parse(localStorage.getItem('peliculaselecc'));
        const peliculaNombre = peliculaEncontra ? peliculaEncontra[0] : 'Desconocida';

        const reservation = {
            id: Date.now(),
            seats: reservedSeats,
            totalAmount: numTickets * 10,
            reservedBy: currentUser.nombre_usuario,
            cedula: currentUser.cedula,
            date: formatDate(reservationDate),
            pelicula: peliculaNombre 
        };

        saveReservation(reservation);
        const labels = reservedSeats.map(seat => seat.label).join(', ');
        reservationInfo.innerHTML = `Asientos reservados: ${labels}`;
        currentReservation = reservation;
        loadReservations();

        // Cerrar el modal
        paymentModal.hide();
        document.getElementById('paymentForm').reset();
    };
}

// Reserva de asientos aleatoria
function reserveRandomSeats() {
    const numTickets = parseInt(document.getElementById('num-tickets').value);
    const reservationDate = document.getElementById('reservation-date').value;

    if (!isValidDate(reservationDate)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, selecciona una fecha y hora válida.'
        });
        return;
    }

    if (isNaN(numTickets) || numTickets < 1 || numTickets > 10) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, ingresa un número válido de entradas (1-10).'
        });
        return;
    }

    const availableSeats = seats.filter(seat => !seat.reserved);
    if (availableSeats.length < numTickets) {
        Swal.fire("No hay suficientes asientos disponibles.");
        return;
    }

    const reservedSeats = [];
    for (let i = 0; i < numTickets; i++) {
        const randomIndex = Math.floor(Math.random() * availableSeats.length);
        const seat = availableSeats[randomIndex];
        seat.reserved = true;
        reservedSeats.push({ row: seat.row, col: seat.col, label: seat.label });
        document.querySelector(`.seat[data-row="${seat.row}"][data-col="${seat.col}"]`).classList.add('reserved');
        availableSeats.splice(randomIndex, 1);
    }

    // Mostrar modal de pago
    const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
    paymentModal.show();

    // Manejar el envío del formulario de pago
    document.getElementById('paymentForm').onsubmit = function(event) {
        event.preventDefault();

        const cardNumber = document.getElementById('cardNumber').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;

        const peliculaEncontra = JSON.parse(localStorage.getItem('peliculaselecc'));
        const peliculaNombre = peliculaEncontra ? peliculaEncontra[0] : 'Desconocida';

        const reservation = {
            id: Date.now(),
            seats: reservedSeats,
            totalAmount: numTickets * 10,
            reservedBy: currentUser.nombre_usuario,
            cedula: currentUser.cedula,
            date: formatDate(reservationDate),
            pelicula: peliculaNombre 
        };

        saveReservation(reservation);
        const labels = reservedSeats.map(seat => seat.label).join(', ');
        reservationInfo.innerHTML = `Asientos reservados: ${labels}`;
        currentReservation = reservation;
        loadReservations();

        // Cerrar el modal
        paymentModal.hide();
        document.getElementById('paymentForm').reset();
    };
}

// Validar la fecha
function isValidDate(date) {
    const today = new Date();
    const selectedDate = new Date(date);
    return selectedDate > today;
}

// Formatear la fecha
function formatDate(date) {
    const newDate = new Date(date);
    return `${String(newDate.getDate()).padStart(2, '0')}/${String(newDate.getMonth() + 1).padStart(2, '0')}/${newDate.getFullYear()}, ${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}:${String(newDate.getSeconds()).padStart(2, '0')}`;
}

function saveReservation(reservation) {
    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    reservations.push(reservation);
    localStorage.setItem('reservations', JSON.stringify(reservations));
}

// Cancelar reserva existente
function cancelReservation() {
    if (!currentReservation) {
        Swal.fire({
            icon: 'info',
            title: 'Información',
            text: 'No hay reservas para cancelar.'
        });
        return;
    }

    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cancelar reserva',
        cancelButtonText: 'No, volver'
    }).then((result) => {
        if (result.isConfirmed) {
            currentReservation.seats.forEach(seat => {
                const seatElement = document.querySelector(`.seat[data-row="${seat.row}"][data-col="${seat.col}"]`);
                seatElement.classList.remove('reserved');
            });
            deleteReservation(currentReservation.id);
            currentReservation = null;
            reservationInfo.innerHTML = '';
            Swal.fire('Cancelada!', 'La reserva ha sido cancelada.', 'success');
            loadReservations();
        }
    });
}

function changeReservation() {
    if (!currentReservation) {
        Swal.fire({
            icon: 'info',
            title: 'Información',
            text: 'No hay reservas para cambiar.'
        });
        return;
    }

    const reservedCount = currentReservation.seats.length;

    Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas cambiar la reserva?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cambiar reserva',
        cancelButtonText: 'No, volver'
    }).then((result) => {
        if (result.isConfirmed) {
            // Limpiar selecciones anteriores
            document.querySelectorAll('.seat.selected').forEach(seat => {
                seat.classList.remove('selected');
            });

            Swal.fire({
                icon: 'info',
                title: 'Información',
                text: `Selecciona ${reservedCount} nuevos asientos y presiona Aceptar Cambios.`
            }).then(() => {
                const acceptButton = document.getElementById('accept-changes');
                acceptButton.disabled = true;

                // Validar selección de asientos
                document.querySelectorAll('.seat').forEach(seat => {
                    seat.onclick = () => {
                        if (seat.classList.contains('selected')) {
                            seat.classList.remove('selected');
                        } else if (document.querySelectorAll('.seat.selected').length < reservedCount) {
                            seat.classList.add('selected');
                        }

                        // Habilitar o deshabilitar el botón según la cantidad de asientos seleccionados
                        acceptButton.disabled = document.querySelectorAll('.seat.selected').length !== reservedCount;
                    };
                });

                acceptButton.onclick = () => {
                    const selectedSeats = document.querySelectorAll('.seat.selected');
                    const newReservedSeats = [];
                    selectedSeats.forEach(seat => {
                        seat.classList.add('reserved');
                        newReservedSeats.push({ row: seat.dataset.row, col: seat.dataset.col, label: seat.innerText });
                    });

                    // Actualizar la reserva
                    currentReservation.seats = newReservedSeats;
                    saveUpdatedReservation(currentReservation);
                    loadReservations();
                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: 'Reserva actualizada con nuevos asientos.'
                    });

                    // Limpiar la reserva actual y la información
                    currentReservation = null;
                    reservationInfo.innerHTML = '';
                };
            });
        }
    });
}

function deleteReservation(id) {
    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    reservations = reservations.filter(reservation => reservation.id !== id);
    localStorage.setItem('reservations', JSON.stringify(reservations));
}

function saveUpdatedReservation(updatedReservation) {
    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const index = reservations.findIndex(reservation => reservation.id === updatedReservation.id);
    if (index !== -1) {
        reservations[index] = updatedReservation;
        localStorage.setItem('reservations', JSON.stringify(reservations));
    }
}

// Cargar reservas existentes y generar listado al HTML
function loadReservations() {
    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    reservationList.innerHTML = '';
    reservations.forEach(reservation => {
        reservation.seats.forEach(seat => {
            const seatElement = document.querySelector(`.seat[data-row="${seat.row}"][data-col="${seat.col}"]`);
            if (seatElement) {
                seatElement.classList.add('reserved');
            }
        });

        const reservationRow = document.createElement('div');
        reservationRow.className = 'row';
        reservationRow.onclick = () => selectReservation(reservation.id);

        const idCol = document.createElement('div');
        idCol.className = 'col';
        idCol.textContent = `${reservation.id}`;

        const peliculaCol = document.createElement('div'); 
        peliculaCol.className = 'col';
        peliculaCol.textContent = `${reservation.pelicula}`; 

        const nameCol = document.createElement('div');
        nameCol.className = 'col';
        nameCol.textContent = `${reservation.reservedBy}`;

        const cedulaCol = document.createElement('div'); 
        cedulaCol.className = 'col';
        cedulaCol.textContent = `${reservation.cedula}`; 

        const seatsCol = document.createElement('div');
        seatsCol.className = 'col';
        seatsCol.textContent = `${reservation.seats.map(seat => seat.label).join(', ')}`;

        const dateCol = document.createElement('div');
        dateCol.className = 'col';
        dateCol.textContent = `${reservation.date}`;
     
        reservationRow.appendChild(idCol);
        reservationRow.appendChild(peliculaCol);
        reservationRow.appendChild(nameCol);
        reservationRow.appendChild(cedulaCol);
        reservationRow.appendChild(seatsCol);
        reservationRow.appendChild(dateCol);
      
        reservationList.appendChild(reservationRow);
    });
}

// Seleccionar reserva para editar o eliminar
function selectReservation(id) {
    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    currentReservation = reservations.find(reservation => reservation.id === id);
    if (currentReservation) {
        reservationInfo.innerHTML = `Reserva seleccionada: ID ${currentReservation.id}, Cliente: ${currentReservation.reservedBy}, Cédula: ${currentReservation.cedula}, Asientos: ${currentReservation.seats.map(seat => seat.label).join(', ')}, Fecha: ${currentReservation.date}`;
        document.getElementById('cancel-btn').disabled = false;
        document.getElementById('change-btn').disabled = false;
    }
}

// Actualizar cambios
function updateSelectedSeatsDisplay() {
    const selectedSeats = document.querySelectorAll('.seat.selected');
    const labels = Array.from(selectedSeats).map(seat => seat.innerText).join(', ');
    reservationInfo.innerHTML = selectedSeats.length > 0 ? `Asientos seleccionados: ${labels}` : '';
}
