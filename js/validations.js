// ========================================================
// ARCHIVO CENTRALIZADO DE VALIDACIONES - ES6+
// ========================================================

// Validación de email con regex moderno
export const validarEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validación de nombre (debe tener exactamente 2 palabras)
export const ValidarNombre = (valor) => {
  const partes = valor.trim().split(" ");
  if (partes.length !== 2) {
    return { 
      isValid: false, 
      errorMessage: "Debe escribir dos nombres." 
    };
  }
  return { isValid: true };
};

// Validación de apellido (debe tener exactamente 2 palabras)
export const ValidarApellido = (valor) => {
  const partes = valor.trim().split(" ");
  if (partes.length !== 2) {
    return { 
      isValid: false, 
      errorMessage: "Debe escribir dos apellidos." 
    };
  }
  return { isValid: true };
};

// Validación de campos obligatorios
export const validarCamposObligatorios = (firstName, lastName, email, password, confirmPassword) => {
  const campos = [firstName, lastName, email, password, confirmPassword];
  const camposVacios = campos.some(campo => campo === '');
  
  if (camposVacios) {
    return {
      isValid: false,
      errorMessage: 'Por favor, completa todos los campos obligatorios.'
    };
  }
  return { isValid: true };
};

// Validación de contraseña
export const validarContrasena = (password) => {
  if (password.length < 6) {
    return {
      isValid: false,
      errorMessage: 'La contraseña debe tener al menos 6 caracteres'
    };
  }
  return { isValid: true };
};

// Validación de coincidencia de contraseñas
export const validarCoincidenciaContrasenas = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      errorMessage: 'Las contraseñas no coinciden'
    };
  }
  return { isValid: true };
};

// Validación de términos y condiciones
export const validarTerminos = (terms) => {
  if (!terms) {
    return {
      isValid: false,
      errorMessage: 'Debes aceptar los términos y condiciones'
    };
  }
  return { isValid: true };
};

// Validación de campos vacíos para login
export const validarCamposVacios = (email, password) => {
  if (email === '' || password === '') {
    return {
      isValid: false,
      errorMessage: 'Por favor, completa todos los campos.'
    };
  }
  return { isValid: true };
};

// Validación de campo email para recuperación
export const validarCampoEmail = (email) => {
  if (email === '') {
    return {
      isValid: false,
      errorMessage: 'Por favor, ingresa tu correo electrónico.'
    };
  }
  return { isValid: true };
};

// Validación de formato de email
export const validarFormatoEmail = (email) => {
  if (!validarEmail(email)) {
    return {
      isValid: false,
      errorMessage: 'Correo electrónico no válido'
    };
  }
  return { isValid: true };
};

// ========================================================
// VALIDACIONES ESPECÍFICAS DEL MENÚ
// ========================================================

// Validar datos de ingrediente
export const validarIngrediente = (name, quantity, unit) => {
  if (!name || name.trim() === '') {
    return {
      isValid: false,
      errorMessage: 'El nombre del ingrediente es obligatorio'
    };
  }
  
  if (!quantity || quantity <= 0) {
    return {
      isValid: false,
      errorMessage: 'La cantidad debe ser mayor a 0'
    };
  }
  
  if (!unit || unit === '') {
    return {
      isValid: false,
      errorMessage: 'Debe seleccionar una unidad'
    };
  }
  
  return { isValid: true };
};

// Validar datos de nuevo item
export const validarNuevoItem = (name, description, price, image) => {
  if (!name || name.trim() === '') {
    return {
      isValid: false,
      errorMessage: 'El nombre del producto es obligatorio'
    };
  }
  
  if (!description || description.trim() === '') {
    return {
      isValid: false,
      errorMessage: 'La descripción es obligatoria'
    };
  }
  
  if (!price || price <= 0) {
    return {
      isValid: false,
      errorMessage: 'El precio debe ser mayor a 0'
    };
  }
  
  return { isValid: true };
};

// Validar método de pago
export const validarMetodoPago = (paymentMethod, formData) => {
  if (paymentMethod === 'efectivo') {
    const cashAmount = parseFloat(formData.get('cashAmount'));
    if (!cashAmount || cashAmount <= 0) {
      return {
        isValid: false,
        errorMessage: 'Ingrese un monto válido en efectivo'
      };
    }
  } else if (paymentMethod === 'tarjeta') {
    const cardNumber = formData.get('cardNumber');
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
      return {
        isValid: false,
        errorMessage: 'Ingrese un número de tarjeta válido'
      };
    }
  } else if (paymentMethod === 'transferencia') {
    const transferCode = formData.get('transferCode');
    if (!transferCode || transferCode.length < 6) {
      return {
        isValid: false,
        errorMessage: 'Ingrese un código de transferencia válido'
      };
    }
  }
  
  return { isValid: true };
};

// Validar teléfono
export const validarTelefono = (telefono) => {
  if (!telefono || telefono.trim() === '') {
    return {
      isValid: false,
      errorMessage: 'El teléfono es obligatorio'
    };
  }
  
  // Validar formato básico (al menos 7 dígitos)
  const telefonoRegex = /^[0-9\s\-\+\(\)]{7,15}$/;
  if (!telefonoRegex.test(telefono)) {
    return {
      isValid: false,
      errorMessage: 'Ingrese un teléfono válido (mínimo 7 dígitos)'
    };
  }
  
  return { isValid: true };
};

// Validar dirección
export const validarDireccion = (direccion) => {
  if (!direccion || direccion.trim() === '') {
    return {
      isValid: false,
      errorMessage: 'La dirección es obligatoria'
    };
  }
  
  if (direccion.trim().length < 10) {
    return {
      isValid: false,
      errorMessage: 'La dirección debe tener al menos 10 caracteres'
    };
  }
  
  return { isValid: true };
};

// Validar datos de checkout
export const validarCheckoutData = (nombre, email, telefono, direccion, paymentMethod, formData) => {
  // Validar nombre
  if (!nombre || nombre.trim() === '') {
    return {
      isValid: false,
      errorMessage: 'El nombre es obligatorio'
    };
  }

  // Validar email
  if (!validarEmail(email)) {
    return {
      isValid: false,
      errorMessage: 'El correo electrónico no es válido'
    };
  }

  // Validar teléfono
  const validacionTelefono = validarTelefono(telefono);
  if (!validacionTelefono.isValid) {
    return validacionTelefono;
  }

  // Validar dirección
  const validacionDireccion = validarDireccion(direccion);
  if (!validacionDireccion.isValid) {
    return validacionDireccion;
  }

  // Validar método de pago
  const validacionPago = validarMetodoPago(paymentMethod, formData);
  if (!validacionPago.isValid) {
    return validacionPago;
  }

  return { isValid: true };
};