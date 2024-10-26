# Cinema2024

## Descripción
CineFanatic es una página web diseñada para los amantes del cine. Permite a los usuarios ver la cartelera de películas en cartel, buscar información detallada sobre películas y realizar reservas de asientos en el cine. Toda la información se maneja localmente utilizando `localStorage`.

## Funcionalidades

### Cartelera de Cine
- **Visualización de Cartelera**: Muestra la lista de películas en cartel, almacenada en un archivo JSON y cargada en `localStorage`.
- **Detalles de Películas**: Al hacer clic en "Más info", se muestra información detallada de la película.

### Buscador de Películas
- **Búsqueda Avanzada**: Permite a los usuarios buscar películas y obtener datos interesantes desde una API externa.

### Gestión de Usuarios
- **Inicio de Sesión**: Los usuarios deben iniciar sesión con un documento y contraseña para acceder a la cartelera.
- **Registro de Usuarios**: Si no están registrados, deben completar un formulario de registro. Los datos se almacenan en `localStorage`.

### Reservas de Asientos
- **Selección de Asientos**: Los usuarios pueden reservar asientos seleccionando la cantidad y posición, o de forma aleatoria.
- **Simulación de Asientos**: Los asientos se muestran en un grid con posiciones codificadas por letras y números.
- **Gestión de Reservas**: Las reservas se muestran al final de la página y se almacenan en `localStorage`. Los usuarios pueden cancelar o modificar sus reservas.

## Uso

1. **Inicio de Sesión/Registro**:
   - Inicia sesión con tu documento y contraseña.
   - Si no tienes una cuenta, regístrate completando el formulario.

2. **Ver Cartelera**:
   - Accede a la página de cartelera para ver las películas en cartel.
   - Haz clic en "Más info" para ver detalles de una película.

3. **Buscar Películas**:
   - Utiliza el buscador para encontrar información sobre tus películas favoritas.

4. **Reservar Asientos**:
   - Selecciona la película y accede a la página de reservas.
   - Elige la cantidad de asientos y su posición, o selecciona de forma aleatoria.
   - Ingresa la fecha de la reserva y confirma.

5. **Gestionar Reservas**:
   - Revisa tus reservas al final de la página.
   - Haz clic en una reserva para cancelarla o modificar los asientos.

## Tecnologías Utilizadas
- **HTML/CSS/JavaScript**: Para la estructura, estilo y funcionalidad de la página.
- **LocalStorage**: Para almacenar datos de usuarios, cartelera y reservas.
- **API Externa**: Para obtener información detallada de las películas.



