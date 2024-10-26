#Cinema2024

Es una aplicación diseñada para los amantes del cine que buscan las películas en cartelera y desean realizar reservas de asientos de manera fácil y eficiente.

Descripción
Esta aplicación ofrece un buscador de películas en cartelera y un buscador especial para los fanáticos del cine, que se alimenta de una API externa. A continuación, se describen las principales características de la aplicación:

Funcionalidades
Registro y Login:

Los usuarios deben registrarse para acceder a la cartelera de películas.
Se requiere un DNI y una contraseña para iniciar sesión.
Los datos del usuario se almacenan en localStorage, así como todos los usuarios registrados.
Cartelera de Películas:

Al iniciar sesión, el botón de "Cartelera" se habilita, permitiendo a los usuarios acceder a un listado de las películas en cartelera.
La información incluye dónde se proyecta, días y precios.
Los datos de las películas se obtienen de un archivo JSON y se cargan en localStorage.
Detalles de la Película:

Al seleccionar "Más Info" sobre una película, se almacena el identificador de la misma para abrir la página de reservas.
Se carga la información detallada de la película y los datos del usuario logueado.
Reservas de Asientos:

Se presenta una cuadrícula con los asientos del cine, codificados por letra y número.
La información de los asientos reservados y libres se almacena en localStorage.
Se pueden realizar reservas de dos maneras:
Manual: Ingresando la cantidad de asientos, fecha de reserva y seleccionando las posiciones de los asientos.
Aleatoria: Definiendo la cantidad de asientos y la fecha, generando una selección aleatoria.
Pasarela de Pagos:

Antes de finalizar la reserva, se simula una pasarela de pagos para confirmar el pago.
Una vez confirmado, se guarda la reserva en localStorage, incluyendo información de la película, del usuario y de los asientos reservados.
Gestión de Reservas:

Las reservas realizadas se listan en la parte inferior de la página.
Al hacer clic en una reserva, se habilitan opciones para cancelarla o modificar las localidades.
Para editar una reserva, se debe seleccionar la misma cantidad de asientos del pedido original.
Tecnologías Utilizadas
HTML
CSS
JavaScript
localStorage
API externa para datos de películas
Cómo Iniciar
Clona este repositorio:
bash
Copiar código
git clone https://github.com/tu_usuario/movie-finder-app.git
Abre el archivo index.html en tu navegador.
Regístrate o inicia sesión para comenzar a explorar la cartelera y realizar reservas.
Contribuciones
¡Las contribuciones son bienvenidas! Si tienes ideas o mejoras, no dudes en abrir un issue o enviar un pull request.

Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.

¡Disfruta de tu experiencia cinéfila con Movie Finder App! 🍿🎬



