// app/static/js/script.js
function registrarPaciente() {
    if (!validarDNI() || !validarHora() || !validarFecha()) {
        return false; // Devolvemos false para evitar el envío del formulario
    }

    const confirmacion = confirm('¿Confirmas el registro de esta cita?');

    return confirmacion; // Devolvemos true si el usuario confirma, de lo contrario, false
}


function eliminarCita(dni) {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta cita?');

    if (confirmacion) {
        fetch(`/eliminar/${dni}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            location.reload();
        })
        .catch(error => console.error('Error:', error));
    }
}

function borrarPaciente(index) {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar este registro?');

    if (confirmacion) {
        let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
        pacientes.splice(index, 1);
        localStorage.setItem('pacientes', JSON.stringify(pacientes));

        alert('Paciente eliminado con éxito.');

        // Recargar la página después de borrar el paciente
        location.reload();
    }
}

function validarDNI() {
    const dniInput = document.getElementById('dni');
    const dni = dniInput.value.trim();

    // Validar que el DNI tenga el formato correcto
    const dniRegex = /^[0-9]{8}$/;
    if (!dniRegex.test(dni)) {
        alert('Por favor ingrese un DNI válido (8 dìgitos numéricos).');
        return false;
    }

    return true;
}

function validarHora() {
    const horaInput = document.getElementById('hora');
    const hora = horaInput.value.trim();
    const [horas, minutos] = hora.split(':');
    // Verificar que la hora esté en el rango de 7:00 a 18:00
    const horasInt = parseInt(horas, 10);

    const horaInicioAtencion = 7;
    const horaFinAtencion = 18;

    if (horasInt < horaInicioAtencion || horasInt > horaFinAtencion) {
        alert('Por favor, ingrese una hora válida entre las 7:00 y las 18:00.');
        return false;
    }
    return true;
}

function validarFecha() {
    const fechaInput = document.getElementById('fecha');
    const fecha = new Date(fechaInput.value.trim());

    // Obtener la fecha actual
    const fechaActual = new Date();

    // Verificar que la fecha sea futura
    if (fecha <= fechaActual) {
        alert('Por favor, ingrese una fecha futura.');
        fechaInput.focus();
        return false;
    }

    return true;
}

function goBack() {
    window.history.back();
}