// ========================================================
// MANEJADORES ASÍNCRONOS - ES6+ CON 3 FORMAS DE ASINCRONÍA
// ========================================================

import { mostrarMensaje, mostrarLoading, ocultarLoading } from './dom-utils.js';

// 1️⃣ CALLBACKS
// ----------------------------------------------------
// Verifica disponibilidad de username con callback
export const verificarUsernameDisponible = (username, callback) => {
  mostrarMensaje('Verificando disponibilidad...', 'info');

  setTimeout(() => {
    const esAdmin = username.toLowerCase().startsWith('admin');
    const resultado = {
      disponible: !esAdmin,
      mensaje: esAdmin 
        ? 'Este nombre de usuario no está disponible.' 
        : 'Nombre de usuario disponible.'
    };
    
    callback(null, resultado);
  }, 1500);
};

// 2️⃣ PROMISES
// ----------------------------------------------------
// Valida código postal con Promise
export const validarCodigoPostal = (codigoPostal) => {
  return new Promise((resolve, reject) => {
    mostrarMensaje('Validando código postal...', 'info');
    
    setTimeout(() => {
      if (codigoPostal.startsWith('00')) {
        reject(new Error('Código postal no válido.'));
      } else {
        resolve({ 
          valido: true, 
          ciudad: 'Manta',
          region: 'Manabí'
        });
      }
    }, 2000);
  });
};

// 3️⃣ ASYNC / AWAIT
// ----------------------------------------------------
// Envía formulario con async/await
export const enviarFormularioAsync = async (datosFormulario) => {
  const btnSubmit = document.querySelector('#btn-submit');
  let loadingElement = null;

  try {
    // Deshabilitar botón y mostrar loading
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Enviando...';
    
    // Mostrar loading en el formulario
    const formContainer = btnSubmit.closest('form')?.parentElement;
    if (formContainer) {
      loadingElement = mostrarLoading(formContainer, 'Procesando registro...');
    }

    // Simular envío al servidor
    const resultado = await simularEnvioServidor(datosFormulario);
    
    mostrarMensaje(`✓ ${resultado.message}`, 'success');
    return resultado;
    
  } catch (error) {
    mostrarMensaje(`✗ Error: ${error.message}`, 'error');
    throw error;
  } finally {
    // Restaurar botón
    btnSubmit.disabled = false;
    btnSubmit.textContent = 'Registrarse';
    
    // Ocultar loading
    ocultarLoading(loadingElement);
  }
};

// 4️⃣ Simulación interna del servidor
// ----------------------------------------------------
const simularEnvioServidor = (datos) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simular diferentes tipos de errores
      if (datos.email?.includes('error')) {
        reject(new Error('El servidor rechazó la solicitud.'));
      } else if (datos.email?.includes('timeout')) {
        reject(new Error('Timeout: El servidor no respondió.'));
      } else if (datos.email?.includes('duplicate')) {
        reject(new Error('El email ya está registrado.'));
      } else {
        resolve({ 
          status: 200, 
          message: 'Formulario recibido con éxito.',
          timestamp: new Date().toISOString()
        });
      }
    }, 2000);
  });
};

// 5️⃣ FUNCIÓN HÍBRIDA: CALLBACK + PROMISE
// ----------------------------------------------------
// Combina callback y Promise para máxima flexibilidad
export const procesarDatosUsuario = (datosUsuario, callback) => {
  return new Promise((resolve, reject) => {
    // Usar callback para validación inmediata
    if (typeof callback === 'function') {
      callback(null, { validando: true });
    }

    // Simular procesamiento asíncrono
    setTimeout(() => {
      const { email, nombre } = datosUsuario;
      
      if (!email || !nombre) {
        const error = new Error('Datos incompletos');
        if (typeof callback === 'function') {
          callback(error, null);
        }
        reject(error);
        return;
      }

      const resultado = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        nombre,
        fechaRegistro: new Date().toISOString()
      };

      if (typeof callback === 'function') {
        callback(null, resultado);
      }
      resolve(resultado);
    }, 1500);
  });
};

// ========================================================
// MANEJADORES ASÍNCRONOS ESPECÍFICOS DEL MENÚ
// ========================================================

// Simular procesamiento de pago
export const procesarPagoAsync = async (itemId, paymentData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simular diferentes tipos de errores
      if (paymentData.paymentMethod === 'tarjeta' && paymentData.cardNumber?.includes('0000')) {
        reject(new Error('Tarjeta rechazada'));
      } else if (paymentData.paymentMethod === 'transferencia' && paymentData.transferCode?.includes('error')) {
        reject(new Error('Código de transferencia inválido'));
      } else {
        resolve({
          status: 'success',
          transactionId: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString()
        });
      }
    }, 2000);
  });
};

// Simular verificación de inventario
export const verificarInventarioAsync = async (itemId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simular verificación de inventario
      const disponible = Math.random() > 0.1; // 90% de probabilidad de estar disponible
      resolve({
        disponible,
        mensaje: disponible ? 'Producto disponible' : 'Producto agotado'
      });
    }, 1000);
  });
};

// Simular creación de nuevo item
export const crearItemAsync = async (itemData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (itemData.name?.toLowerCase().includes('error')) {
        reject(new Error('Error al crear el producto'));
      } else {
        resolve({
          id: `item-${Date.now()}`,
          ...itemData,
          fechaCreacion: new Date().toISOString()
        });
      }
    }, 1500);
  });
};

// Simular envío de comprobante por correo
export const enviarComprobanteAsync = async (checkoutData, purchaseData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const comprobante = {
          numero: `COMP-${Date.now()}`,
          fecha: new Date().toISOString(),
          cliente: {
            nombre: checkoutData.nombre,
            email: checkoutData.email,
            telefono: checkoutData.telefono,
            direccion: checkoutData.direccion
          },
          items: purchaseData.items,
          total: purchaseData.total,
          metodoPago: checkoutData.paymentMethod,
          transactionId: purchaseData.transactionId || Math.random().toString(36).substr(2, 9)
        };

        // Simular envío exitoso
        resolve({
          status: 'success',
          message: `Comprobante enviado exitosamente a ${checkoutData.email}`,
          comprobante: comprobante
        });
      } catch (error) {
        reject(new Error('Error al enviar el comprobante'));
      }
    }, 2000);
  });
};