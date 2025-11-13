// ========================================================
// APLICACIÓN PRINCIPAL - ES6+ CON INTEGRACIÓN COMPLETA
// ========================================================

import {
  validarEmail,
  ValidarNombre,
  ValidarApellido,
  validarCamposObligatorios,
  validarContrasena,
  validarCoincidenciaContrasenas,
  validarTerminos,
  validarCamposVacios,
  validarCampoEmail,
  validarFormatoEmail
} from './validations.js';

import { 
  mostrarError, 
  mostrarExito, 
  limpiarError, 
  mostrarMensaje,
  mostrarLoading,
  ocultarLoading,
  showModal,
  hideModal,
  setupModalClose,
  showMessage,
  createItemHTML,
  addIngredientRow
} from './dom-utils.js';

import {
  verificarUsernameDisponible,
  validarCodigoPostal,
  enviarFormularioAsync,
  procesarDatosUsuario
} from './async-handlers.js';

import {
  saveUserSession,
  getUserSession,
  isUserLoggedIn,
  logout,
  getUserCheckoutData
} from './session.js';

// Importar funciones del menú
import {
  itemIngredients,
  customIngredients,
  createdItems,
  shoppingCart,
  inventory,
  itemRequirements,
  checkInventoryForItem,
  consumeIngredients,
  updateBuyButtons,
  addIngredientToItem,
  updateIngredientsList,
  removeIngredient,
  showDeleteConfirmation,
  confirmDelete,
  initializeSearchAndFilters,
  filterProducts,
  sortProducts,
  getPrice,
  updateResultsCounter,
  clearFilters,
  createNewItem,
  handleIngredientsForm,
  handleNewItemForm
} from './menu-core.js';

import {
  showProductDetails,
  loadProductIngredients,
  setupProductDetailListeners,
  addCustomIngredient,
  removeCustomIngredient,
  updateProductPrice,
  addToCart,
  updateCartCounter,
  showCartModal,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  checkout,
  showCheckoutModal,
  setupCheckoutModalListeners,
  processCheckout,
  processPurchase,
  showPaymentModal,
  setupPaymentModalListeners,
  processPayment,
  showInventoryModal
} from './menu-ui.js';

// ========================================================
// FUNCIONES PRINCIPALES DE PROCESO - ES6+ CON ASINCRONÍA
// ========================================================

// --- Registro con integración asíncrona ---
const procesarRegistro = async (firstName, lastName, email, password, confirmPassword, terms) => {
  // Validar campos obligatorios
  const validacionCampos = validarCamposObligatorios(firstName, lastName, email, password, confirmPassword);
  if (!validacionCampos.isValid) {
    mostrarMensaje(validacionCampos.errorMessage, 'error');
    return false;
  }

  // Validar nombre
  const validacionNombre = ValidarNombre(firstName);
  if (!validacionNombre.isValid) {
    mostrarError(document.getElementById('firstName'), validacionNombre);
    return false;
  }

  // Validar apellido
  const validacionApellido = ValidarApellido(lastName);
  if (!validacionApellido.isValid) {
    mostrarError(document.getElementById('lastName'), validacionApellido);
    return false;
  }

  // Validar email
  if (!validarEmail(email)) {
    mostrarError(document.getElementById('email'), { errorMessage: 'Correo electrónico no válido' });
    return false;
  }

  // Validar contraseña
  const validacionPassword = validarContrasena(password);
  if (!validacionPassword.isValid) {
    mostrarError(document.getElementById('password'), validacionPassword);
    return false;
  }

  // Validar coincidencia
  const validacionCoincidencia = validarCoincidenciaContrasenas(password, confirmPassword);
  if (!validacionCoincidencia.isValid) {
    mostrarError(document.getElementById('confirmPassword'), validacionCoincidencia);
    return false;
  }

  // Validar términos
  const validacionTerminos = validarTerminos(terms);
  if (!validacionTerminos.isValid) {
    mostrarError(document.querySelector('input[name="terms"]'), validacionTerminos);
    return false;
  }

  // ✅ TODAS LAS VALIDACIONES PASARON - PROCESAR ASÍNCRONAMENTE
  
  try {
    // 1️⃣ CALLBACK: Verificar disponibilidad de username
    const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
    
    await new Promise((resolve, reject) => {
      verificarUsernameDisponible(username, (error, resultado) => {
        if (error) {
          reject(error);
          return;
        }
        
        if (!resultado.disponible) {
          mostrarMensaje(resultado.mensaje, 'warning');
          reject(new Error('Username no disponible'));
          return;
        }
        
        mostrarMensaje(resultado.mensaje, 'success');
        resolve(resultado);
      });
    });

    // 2️⃣ PROMISE: Validar código postal (simulado)
    const codigoPostal = '130101'; // Código postal de Manta
    const validacionPostal = await validarCodigoPostal(codigoPostal);
    mostrarMensaje(`Código postal válido para ${validacionPostal.ciudad}`, 'info');

    // 3️⃣ ASYNC/AWAIT: Enviar formulario
    const datosFormulario = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      terms,
      codigoPostal,
      timestamp: new Date().toISOString()
    };

    const resultado = await enviarFormularioAsync(datosFormulario);

    // Marcar campos como válidos
    mostrarExito(document.getElementById('firstName'));
    mostrarExito(document.getElementById('lastName'));
    mostrarExito(document.getElementById('email'));
    
    // Guardar sesión después del registro
    const fullName = `${firstName} ${lastName}`;
    const userData = {
      email: email,
      nombre: fullName,
      firstName: firstName,
      lastName: lastName,
      id: Math.random().toString(36).substr(2, 9)
    };
    saveUserSession(userData);

    mostrarMensaje(`¡Cuenta creada exitosamente! Bienvenido a Coffee Sync, ${firstName}.`, 'success');
    
    // Redirigir a la página principal después de un breve delay
    setTimeout(() => {
      window.location.href = '../index.html';
    }, 1500);
    
    return true;

  } catch (error) {
    mostrarMensaje(`Error en el registro: ${error.message}`, 'error');
    return false;
  }
};

// --- Login con validación asíncrona ---
const procesarLogin = async (email, password) => {
  // Validar campos vacíos
  const validacionCampos = validarCamposVacios(email, password);
  if (!validacionCampos.isValid) {
    mostrarMensaje(validacionCampos.errorMessage, 'error');
    return false;
  }

  // Validar email
  if (!validarEmail(email)) {
    mostrarMensaje('Correo electrónico no válido', 'error');
    return false;
  }

  // Validar contraseña
  const validacionPassword = validarContrasena(password);
  if (!validacionPassword.isValid) {
    mostrarMensaje(validacionPassword.errorMessage, 'error');
    return false;
  }

  try {
    // Simular autenticación asíncrona
    const datosUsuario = { email, nombre: email.split('@')[0] };
    
    // Usar función híbrida (callback + promise)
    const resultado = await procesarDatosUsuario(datosUsuario, (error, datos) => {
      if (error) {
        mostrarMensaje('Error en la autenticación', 'error');
        return;
      }
      mostrarMensaje('Verificando credenciales...', 'info');
    });

    // Guardar sesión de usuario
    const userData = {
      email: resultado.email,
      nombre: resultado.nombre,
      id: resultado.id
    };
    saveUserSession(userData);

    mostrarMensaje(`¡Inicio de sesión exitoso! Bienvenido ${resultado.nombre}`, 'success');
    
    // Redirigir a la página principal después de un breve delay
    setTimeout(() => {
      window.location.href = '../index.html';
    }, 1500);
    
    return true;

  } catch (error) {
    mostrarMensaje(`Error en el login: ${error.message}`, 'error');
    return false;
  }
};

// --- Recuperar contraseña con validación asíncrona ---
const procesarRecuperacion = async (email) => {
  // Validar campo email
  const validacionCampo = validarCampoEmail(email);
  if (!validacionCampo.isValid) {
    mostrarMensaje(validacionCampo.errorMessage, 'error');
    return false;
  }

  // Validar formato email
  const validacionFormato = validarFormatoEmail(email);
  if (!validacionFormato.isValid) {
    mostrarMensaje(validacionFormato.errorMessage, 'error');
    return false;
  }

  try {
    // Simular envío de email de recuperación
    mostrarMensaje('Enviando instrucciones de recuperación...', 'info');
    
    // Simular delay del servidor
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    mostrarMensaje(`Se han enviado las instrucciones para recuperar tu contraseña a: ${email}`, 'success');
    return true;

  } catch (error) {
    mostrarMensaje(`Error al enviar email: ${error.message}`, 'error');
    return false;
  }
};

// ========================================================
// EVENTOS PRINCIPALES - ES6+ CON DELEGACIÓN Y ASINCRONÍA
// ========================================================
document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');
  const forgotForm = document.getElementById('forgotForm');

  // --- Evento de Registro con async/await ---
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(registerForm);
      const [firstName, lastName, email, password, confirmPassword] = [
        'firstName', 'lastName', 'email', 'password', 'confirmPassword'
      ].map(id => document.getElementById(id)?.value?.trim() ?? '');

      const terms = document.querySelector('input[name="terms"]')?.checked ?? false;

      await procesarRegistro(firstName, lastName, email, password, confirmPassword, terms);
    });
  }

  // --- Evento de Login con async/await ---
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const [email, password] = ['email', 'password']
        .map(id => document.getElementById(id)?.value?.trim() ?? '');
      
      await procesarLogin(email, password);
    });
  }

  // --- Evento de Recuperación con async/await ---
  if (forgotForm) {
    forgotForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email')?.value?.trim() ?? '';
      await procesarRecuperacion(email);
    });
  }

  // ========================================================
  // VALIDACIÓN EN TIEMPO REAL - ES6+ CON DELEGACIÓN
  // ========================================================
  
  // Función para validar en tiempo real mientras el usuario escribe
  const validarEnTiempoReal = (input, value) => {
    const { id } = input;
    
    // Limpiar errores previos
    limpiarError(input);
    
    // Validaciones específicas por campo
    const validaciones = {
      firstName: () => {
        if (value.trim() === '') {
          mostrarError(input, { errorMessage: 'El nombre es obligatorio' });
          return false;
        }
        const validacion = ValidarNombre(value);
        if (!validacion.isValid) {
          mostrarError(input, validacion);
          return false;
        }
        mostrarExito(input);
        return true;
      },
      lastName: () => {
        if (value.trim() === '') {
          mostrarError(input, { errorMessage: 'El apellido es obligatorio' });
          return false;
        }
        const validacion = ValidarApellido(value);
        if (!validacion.isValid) {
          mostrarError(input, validacion);
          return false;
        }
        mostrarExito(input);
        return true;
      },
      email: () => {
        if (value.trim() === '') {
          mostrarError(input, { errorMessage: 'El correo electrónico es obligatorio' });
          return false;
        }
        if (!validarEmail(value)) {
          mostrarError(input, { errorMessage: 'Correo electrónico no válido' });
          return false;
        }
        mostrarExito(input);
        return true;
      },
      password: () => {
        if (value.trim() === '') {
          mostrarError(input, { errorMessage: 'La contraseña es obligatoria' });
          return false;
        }
        const validacion = validarContrasena(value);
        if (!validacion.isValid) {
          mostrarError(input, validacion);
          return false;
        }
        mostrarExito(input);
        return true;
      },
      confirmPassword: () => {
        const password = document.getElementById('password')?.value ?? '';
        if (value.trim() === '') {
          mostrarError(input, { errorMessage: 'Debes confirmar tu contraseña' });
          return false;
        }
        if (password && value !== password) {
          mostrarError(input, { errorMessage: 'Las contraseñas no coinciden' });
          return false;
        }
        if (password && value === password) {
          mostrarExito(input);
        }
        return true;
      }
    };

    // Ejecutar validación específica si existe
    const validacion = validaciones[id];
    if (validacion) {
      return validacion();
    }
    return true;
  };

  // Evento de input para validación en tiempo real
  document.addEventListener('input', (e) => {
    const { id, value } = e.target;
    
    // Solo procesar inputs de formularios
    if (!e.target.matches('input[type="text"], input[type="email"], input[type="password"]')) {
      return;
    }

    // Validar en tiempo real
    validarEnTiempoReal(e.target, value);
  });

  // Evento de blur para validación final
  document.addEventListener('blur', async (e) => {
    const { id, value } = e.target;
    
    // Solo procesar inputs de formularios
    if (!e.target.matches('input[type="text"], input[type="email"], input[type="password"]')) {
      return;
    }

    // Validación final al perder el foco
    validarEnTiempoReal(e.target, value);
  }, true);

  // ========================================================
  // DELEGACIÓN DE EVENTOS AVANZADA - ES6+
  // ========================================================
  document.body.addEventListener('click', async (event) => {
    const { target } = event;
    
    // Botón cancelar
    if (target.matches('.btn-cancelar')) {
      event.preventDefault();
      const form = target.closest('form');
      form?.reset();
      mostrarMensaje('Formulario cancelado.', 'info');
    }
    
    // Botón limpiar
    if (target.matches('.btn-limpiar')) {
      event.preventDefault();
      const form = target.closest('form');
      const inputs = form?.querySelectorAll('input');
      inputs?.forEach(input => {
        limpiarError(input);
        input.value = '';
      });
      mostrarMensaje('Formulario limpiado.', 'info');
    }
    
    // Botón mostrar/ocultar contraseña
    if (target.matches('.toggle-password')) {
      event.preventDefault();
      const input = target.previousElementSibling;
      const type = input.type === 'password' ? 'text' : 'password';
      input.type = type;
      target.textContent = type === 'password' ? '👁️' : '🙈';
    }
  });

  // ========================================================
  // VALIDACIÓN DE CONFIRMACIÓN DE CONTRASEÑA EN TIEMPO REAL
  // ========================================================
  document.addEventListener('input', (e) => {
    if (e.target.id === 'confirmPassword') {
      const password = document.getElementById('password')?.value ?? '';
      const confirmPassword = e.target.value;
      
      if (confirmPassword && password !== confirmPassword) {
        mostrarError(e.target, { errorMessage: 'Las contraseñas no coinciden' });
      } else if (confirmPassword && password === confirmPassword) {
        mostrarExito(e.target);
      }
    }
  });

  // ========================================================
  // VALIDACIÓN DE CHECKBOX DE TÉRMINOS EN TIEMPO REAL
  // ========================================================
  document.addEventListener('change', (e) => {
    if (e.target.name === 'terms') {
      const termsCheckbox = e.target;
      
      if (!termsCheckbox.checked) {
        mostrarError(termsCheckbox, { errorMessage: 'Debes aceptar los términos y condiciones' });
      } else {
        mostrarExito(termsCheckbox);
      }
    }
  });

  // ========================================================
  // EVENT LISTENERS ESPECÍFICOS DEL MENÚ
  // ========================================================
  
  // Configurar cierre de modales
  setupModalClose();

  // Event listeners para botones de compra
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-buy')) {
      const itemId = e.target.dataset.item;
      processPurchase(itemId);
    }
  });

  // Event listeners para botones de detalles
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-details')) {
      const itemId = e.target.dataset.item;
      showProductDetails(itemId);
    }
  });

  // Event listeners para formularios
  const ingredientsForm = document.getElementById('ingredientsForm');
  if (ingredientsForm) {
    ingredientsForm.addEventListener('submit', handleIngredientsForm);
  }

  const newItemForm = document.getElementById('newItemForm');
  if (newItemForm) {
    newItemForm.addEventListener('submit', handleNewItemForm);
  }

  // Event listeners para botones de cancelar
  document.addEventListener('click', function(e) {
    if (e.target.id === 'cancelIngredients') {
      hideModal('ingredientsModal');
    }
  });

  // Event listeners para agregar fila de ingrediente
  document.addEventListener('click', function(e) {
    if (e.target.id === 'addIngredientRow') {
      addIngredientRow();
    }
  });

  // Event listeners para eliminar fila de ingrediente
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-remove-ingredient')) {
      e.target.closest('.ingredient-row').remove();
    }
  });

  // Event listeners para botones de eliminar item
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-delete')) {
      const itemId = e.target.dataset.item;
      const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
      const itemName = itemElement?.querySelector('.menu-item-title')?.textContent || 'Producto';
      showDeleteConfirmation(itemId, itemName);
    }
  });

  // Event listeners para botones de ingredientes
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-ingredients')) {
      const itemId = e.target.dataset.item;
      // Aquí puedes implementar la lógica para mostrar el modal de ingredientes
      showMessage('Funcionalidad de ingredientes en desarrollo', 'info');
    }
  });

  // Event listeners para botón de inventario
  document.addEventListener('click', function(e) {
    if (e.target.id === 'showInventory') {
      showInventoryModal();
    }
  });

  // Inicializar estado de botones de compra
  updateBuyButtons();
  
  // Inicializar buscador y filtros
  initializeSearchAndFilters();

  // ========================================================
  // HACER FUNCIONES GLOBALES PARA COMPATIBILIDAD
  // ========================================================
  
  // Funciones del menú core
  window.itemIngredients = itemIngredients;
  window.customIngredients = customIngredients;
  window.createdItems = createdItems;
  window.shoppingCart = shoppingCart;
  window.inventory = inventory;
  window.itemRequirements = itemRequirements;
  window.checkInventoryForItem = checkInventoryForItem;
  window.consumeIngredients = consumeIngredients;
  window.updateBuyButtons = updateBuyButtons;
  window.addIngredientToItem = addIngredientToItem;
  window.updateIngredientsList = updateIngredientsList;
  window.removeIngredient = removeIngredient;
  window.showDeleteConfirmation = showDeleteConfirmation;
  window.confirmDelete = confirmDelete;
  window.initializeSearchAndFilters = initializeSearchAndFilters;
  window.filterProducts = filterProducts;
  window.sortProducts = sortProducts;
  window.getPrice = getPrice;
  window.updateResultsCounter = updateResultsCounter;
  window.clearFilters = clearFilters;
  window.createNewItem = createNewItem;
  window.handleIngredientsForm = handleIngredientsForm;
  window.handleNewItemForm = handleNewItemForm;

  // Funciones de UI del menú
  window.showProductDetails = showProductDetails;
  window.loadProductIngredients = loadProductIngredients;
  window.setupProductDetailListeners = setupProductDetailListeners;
  window.addCustomIngredient = addCustomIngredient;
  window.removeCustomIngredient = removeCustomIngredient;
  window.updateProductPrice = updateProductPrice;
  window.addToCart = addToCart;
  window.updateCartCounter = updateCartCounter;
  window.showCartModal = showCartModal;
  window.updateCartQuantity = updateCartQuantity;
  window.removeFromCart = removeFromCart;
  window.clearCart = clearCart;
  window.checkout = checkout;
  window.showCheckoutModal = showCheckoutModal;
  window.setupCheckoutModalListeners = setupCheckoutModalListeners;
  window.processCheckout = processCheckout;
  window.processPurchase = processPurchase;
  window.showPaymentModal = showPaymentModal;
  window.setupPaymentModalListeners = setupPaymentModalListeners;
  window.processPayment = processPayment;
  window.showInventoryModal = showInventoryModal;

  // Funciones de DOM utils
  window.showModal = showModal;
  window.hideModal = hideModal;
  window.setupModalClose = setupModalClose;
  window.showMessage = showMessage;
  window.createItemHTML = createItemHTML;
  window.addIngredientRow = addIngredientRow;

  // ========================================================
  // ESTILOS CSS PARA ANIMACIONES DE MENSAJES
  // ========================================================
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
    
    @keyframes fadeOut {
      from {
        opacity: 1;
        transform: scale(1);
      }
      to {
        opacity: 0;
        transform: scale(0.8);
      }
    }
  `;
  document.head.appendChild(style);
});