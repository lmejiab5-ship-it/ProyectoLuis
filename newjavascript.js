
// ========================================
// SISTEMA PARKING VERDE
// PROYECTO FINAL PROGRAMACION II
// ========================================

// DATOS INICIALES

const TOTAL_ESPACIOS = 20;

const USUARIO_ADMIN = "admin";
const CLAVE_ADMIN = "2026";

let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
let espacios = JSON.parse(localStorage.getItem("espacios")) || [];

let clienteActual = null;
let facturaActual = null;

// TARIFAS

const TARIFA_AUTO = 10;
const ADICIONAL_AUTO = 5;

const TARIFA_MOTO = 5;
const ADICIONAL_MOTO = 3;


// ========================================
// INICIALIZAR ESPACIOS
// ========================================

if (espacios.length === 0) {

    for (let i = 1; i <= TOTAL_ESPACIOS; i++) {

        espacios.push({
            numero: i,
            ocupado: false
        });

    }

    guardarDatos();

}


// ========================================
// GUARDAR INFORMACION
// ========================================

function guardarDatos() {

    localStorage.setItem("clientes", JSON.stringify(clientes));

    localStorage.setItem("movimientos", JSON.stringify(movimientos));

    localStorage.setItem("espacios", JSON.stringify(espacios));

}


// ========================================
// REGISTRO DE CLIENTES
// ========================================

document.getElementById("formRegistro").addEventListener("submit", function(event) {

    event.preventDefault();

    let nombre = document.getElementById("nombre").value.trim();
    let dpi = document.getElementById("dpi").value.trim();
    let telefono = document.getElementById("telefono").value.trim();
    let correo = document.getElementById("correo").value.trim();
    let placa = document.getElementById("placa").value.trim().toUpperCase();
    let tipo = document.getElementById("tipo").value;

    if (clientes.some(cliente => cliente.placa === placa)) {

        alert("Esta placa ya se encuentra registrada.");
        return;

    }

    let nuevoCliente = {

        id: Date.now(),

        nombre: nombre,
        dpi: dpi,
        telefono: telefono,
        correo: correo,
        placa: placa,
        tipo: tipo

    };

    clientes.push(nuevoCliente);

    guardarDatos();

    clienteActual = nuevoCliente;

    alert("Cliente registrado correctamente.");

    mostrarPanel();

    this.reset();

});

// ========================================
// MOSTRAR ACCESO DEL ADMINISTRADOR
// ========================================

document.getElementById("btnAdministrador").addEventListener("click", function() {

    let acceso = document.getElementById("accesoAdmin");

    acceso.classList.toggle("oculto");

    if (!acceso.classList.contains("oculto")) {

        acceso.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        document.getElementById("usuarioAdmin").focus();

    }

});


// ========================================
// ACCESO DEL ADMINISTRADOR
// ========================================

document.getElementById("formLogin").addEventListener("submit", function(event) {

    event.preventDefault();

    let usuario = document.getElementById("usuarioAdmin").value;

    let clave = document.getElementById("claveAdmin").value;

    if (usuario === USUARIO_ADMIN && clave === CLAVE_ADMIN) {

        clienteActual = null;

        alert("Bienvenido al sistema administrador.");

        mostrarPanel();

    } else {

        alert("Usuario o contraseña incorrectos.");

    }

});


// ========================================
// MOSTRAR PANEL
// ========================================

function mostrarPanel() {

    document.getElementById("panelSistema").classList.remove("oculto");

    document.getElementById("registro").classList.add("oculto");

    document.querySelector(".administrador").classList.add("oculto");

    document.querySelector(".inicio").classList.add("oculto");

    document.querySelector("#servicios").classList.add("oculto");

    document.querySelector("#tarifas").classList.add("oculto");

    actualizarSistema();

    mostrarDatosCliente();

    document.getElementById("panelSistema").scrollIntoView();

}


// ========================================
// MOSTRAR DATOS DEL CLIENTE
// ========================================

function mostrarDatosCliente() {

    let contenedor = document.getElementById("datosCliente");

    if (clienteActual !== null) {

        contenedor.innerHTML = `

            <p><strong>Nombre:</strong> ${clienteActual.nombre}</p>

            <p><strong>DPI:</strong> ${clienteActual.dpi}</p>

            <p><strong>Teléfono:</strong> ${clienteActual.telefono}</p>

            <p><strong>Correo:</strong> ${clienteActual.correo}</p>

            <p><strong>Placa:</strong> ${clienteActual.placa}</p>

            <p><strong>Vehículo:</strong> ${clienteActual.tipo}</p>

        `;

    } else {

        contenedor.innerHTML = `

            <p>Administrador del estacionamiento.</p>

            <p>Clientes registrados: ${clientes.length}</p>

        `;

    }

}


// ========================================
// ACTUALIZAR SISTEMA
// ========================================

function actualizarSistema() {

    let ocupados = espacios.filter(e => e.ocupado).length;

    let disponibles = TOTAL_ESPACIOS - ocupados;

    document.getElementById("espaciosLibres").textContent = disponibles;

    document.getElementById("espaciosOcupados").textContent = ocupados;

    document.getElementById("totalClientes").textContent = clientes.length;

    actualizarClientes();

    actualizarVehiculos();

    mostrarMovimientos();

}


// ========================================
// ACTUALIZAR LISTA DE CLIENTES
// ========================================

function actualizarClientes() {

    let lista = document.getElementById("clienteEntrada");

    lista.innerHTML = '<option value="">Seleccionar cliente</option>';

    clientes.forEach(cliente => {

        lista.innerHTML += `

            <option value="${cliente.id}">

                ${cliente.nombre} - ${cliente.placa}

            </option>

        `;

    });

}


// ========================================
// ACTUALIZAR VEHICULOS
// ========================================

function actualizarVehiculos() {

    let lista = document.getElementById("vehiculoSalida");

    lista.innerHTML = '<option value="">Seleccionar vehículo</option>';

    movimientos.forEach(movimiento => {

        if (movimiento.salida === null) {

            lista.innerHTML += `

                <option value="${movimiento.id}">

                    ${movimiento.nombre} - ${movimiento.placa}

                </option>

            `;

        }

    });

}


// ========================================
// REGISTRAR ENTRADA
// ========================================

document.getElementById("formEntrada").addEventListener("submit", function(event) {

    event.preventDefault();

    let idCliente = Number(document.getElementById("clienteEntrada").value);

    let placa = document.getElementById("placaEntrada").value.trim().toUpperCase();

    let tipo = document.getElementById("tipoVehiculo").value;

    let cliente = clientes.find(c => c.id === idCliente);

    if (!cliente) {

        alert("Selecciona un cliente válido.");

        return;

    }

    if (cliente.placa !== placa || cliente.tipo !== tipo) {

        alert("La placa o el tipo de vehículo no coinciden con el registro del cliente.");

        return;

    }

    let entradaActiva = movimientos.some(m =>

        m.placa === placa && m.salida === null

    );

    if (entradaActiva) {

        alert("Este vehículo ya se encuentra estacionado.");

        return;

    }

    let espacio = espacios.find(e => e.ocupado === false);

    if (!espacio) {

        alert("No hay espacios disponibles.");

        return;

    }

    let nuevoMovimiento = {

        id: Date.now(),

        clienteId: cliente.id,

        nombre: cliente.nombre,

        placa: cliente.placa,

        tipo: cliente.tipo,

        entrada: new Date().toISOString(),

        salida: null,

        horas: 0,

        pago: 0,

        espacio: espacio.numero

    };

    movimientos.push(nuevoMovimiento);

    espacio.ocupado = true;

    guardarDatos();

    alert("Entrada registrada correctamente.\nEspacio asignado: " + espacio.numero);

    this.reset();

    actualizarSistema();

});


// ========================================
// REGISTRAR SALIDA Y CALCULAR PAGO
// ========================================

document.getElementById("formSalida").addEventListener("submit", function(event) {

    event.preventDefault();

    let idMovimiento = Number(document.getElementById("vehiculoSalida").value);

    let movimiento = movimientos.find(m => m.id === idMovimiento);

    if (!movimiento || movimiento.salida !== null) {

        alert("Selecciona un vehículo que esté estacionado.");

        return;

    }

    let horaEntrada = new Date(movimiento.entrada);

    let horaSalida = new Date();

    let diferencia = horaSalida - horaEntrada;

    let horas = Math.max(1, Math.ceil(diferencia / (1000 * 60 * 60)));

    let primeraHora;
    let horaAdicional;

    if (movimiento.tipo === "Automóvil") {

        primeraHora = TARIFA_AUTO;

        horaAdicional = ADICIONAL_AUTO;

    } else {

        primeraHora = TARIFA_MOTO;

        horaAdicional = ADICIONAL_MOTO;

    }

    let total = primeraHora + ((horas - 1) * horaAdicional);

    movimiento.salida = horaSalida.toISOString();

    movimiento.horas = horas;

    movimiento.pago = total;

    let espacio = espacios.find(e => e.numero === movimiento.espacio);

    if (espacio) {

        espacio.ocupado = false;

    }

    facturaActual = movimiento;

    guardarDatos();

    generarFactura(movimiento);

    actualizarSistema();

    alert(

        "Salida registrada correctamente.\n" +

        "Horas cobradas: " + horas + "\n" +

        "Total a pagar: Q" + total.toFixed(2)

    );

    this.reset();

});


// ========================================
// MOSTRAR ULTIMOS MOVIMIENTOS
// ========================================

function mostrarMovimientos() {

    let tabla = document.getElementById("tablaMovimientos");

    if (movimientos.length === 0) {

        tabla.innerHTML = `

            <tr>

                <td colspan="5">No hay movimientos registrados.</td>

            </tr>

        `;

        return;

    }

    let ultimos = movimientos.slice().reverse().slice(0, 10);

    tabla.innerHTML = "";

    ultimos.forEach(m => {

        let entrada = new Date(m.entrada).toLocaleString("es-GT");

        let salida = m.salida

            ? new Date(m.salida).toLocaleString("es-GT")

            : "Pendiente";

        let pago = m.salida

            ? "Q" + m.pago.toFixed(2)

            : "Pendiente";

        tabla.innerHTML += `

            <tr>

                <td>${m.nombre}</td>

                <td>${m.placa}</td>

                <td>${entrada}</td>

                <td>${salida}</td>

                <td>${pago}</td>

            </tr>

        `;

    });

}


// ========================================
// GENERAR FACTURA
// ========================================

function generarFactura(m) {

    let contenedor = document.getElementById("factura");

    contenedor.innerHTML = `

        <div class="factura">

            <h2 style="text-align:center; color:#153d30;">

                PARKING VERDE

            </h2>

            <h3 style="text-align:center;">

                FACTURA DE ESTACIONAMIENTO

            </h3>

            <hr>

            <p><strong>Factura No:</strong> ${m.id}</p>

            <p><strong>Cliente:</strong> ${m.nombre}</p>

            <p><strong>Placa:</strong> ${m.placa}</p>

            <p><strong>Vehículo:</strong> ${m.tipo}</p>

            <p><strong>Espacio:</strong> ${m.espacio}</p>

            <p><strong>Entrada:</strong> ${new Date(m.entrada).toLocaleString("es-GT")}</p>

            <p><strong>Salida:</strong> ${new Date(m.salida).toLocaleString("es-GT")}</p>

            <p><strong>Horas cobradas:</strong> ${m.horas}</p>

            <hr>

            <h2 style="text-align:right; color:#276747;">

                TOTAL: Q${m.pago.toFixed(2)}

            </h2>

            <p style="text-align:center;">

                ¡Gracias por utilizar nuestros servicios!

            </p>

        </div>

    `;

}


// ========================================
// IMPRIMIR FACTURA
// ========================================

document.getElementById("imprimirFactura").addEventListener("click", function() {

    if (facturaActual === null) {

        alert("Primero debes registrar una salida para generar una factura.");

        return;

    }

    let contenido = document.getElementById("factura").innerHTML;

    let ventana = window.open("", "", "width=700,height=600");

    ventana.document.write(`

        <html>

        <head>

            <title>Factura Parking Verde</title>

            <style>

                body {
                    font-family: Arial;
                    padding: 30px;
                }

                .factura {
                    max-width: 500px;
                    margin: auto;
                }

            </style>

        </head>

        <body>

            ${contenido}

        </body>

        </html>

    `);

    ventana.document.close();

    ventana.print();

});


// ========================================
// CERRAR SESION
// ========================================

document.getElementById("cerrarSesion").addEventListener("click", function() {

    clienteActual = null;

    facturaActual = null;

    document.getElementById("panelSistema").classList.add("oculto");

    document.getElementById("registro").classList.remove("oculto");

    document.querySelector(".administrador").classList.add("oculto");

    document.querySelector(".inicio").classList.remove("oculto");

    document.querySelector("#servicios").classList.remove("oculto");

    document.querySelector("#tarifas").classList.remove("oculto");

    document.getElementById("formLogin").reset();

    document.getElementById("formRegistro").reset();

    window.scrollTo(0, 0);

});


// ========================================
// INICIAR SISTEMA
// ========================================

actualizarSistema();
