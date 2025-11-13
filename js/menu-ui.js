// ========================================================
// FUNCIONES DE INTERFAZ DE USUARIO DEL MENÚ - ES6+ MODULAR
// ========================================================

import { 
  showModal, 
  hideModal, 
  setupModalClose, 
  showMessage 
} from './dom-utils.js';

import { 
  validarMetodoPago,
  validarCheckoutData,
  validarEmail
} from './validations.js';

import { 
  procesarPagoAsync,
  enviarComprobanteAsync
} from './async-handlers.js';

import {
  isUserLoggedIn,
  getUserCheckoutData
} from './session.js';

import { 
  shoppingCart, 
  customIngredients, 
  itemIngredients, 
  consumeIngredients, 
  updateBuyButtons 
} from './menu-core.js';

// ========================================================
// FUNCIONES DE DETALLES DEL PRODUCTO Y CARRITO
// ========================================================

// Mostrar modal de detalles del producto
export const showProductDetails = (itemId) => {
  const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
  if (!itemElement) return;

  const name = itemElement.querySelector('.menu-item-title')?.textContent || '';
  const description = itemElement.querySelector('.menu-item-description')?.textContent || '';
  const price = itemElement.querySelector('.price')?.textContent || '$0.00';
  const image = itemElement.querySelector('.menu-item-image')?.style.backgroundImage || '';
  
  // Extraer URL de la imagen
  const imageUrl = image.replace(/url\(['"]?(.*?)['"]?\)/, '$1');

  // Obtener categoría del producto
  const category = itemElement.dataset.category || 'Producto';
  const categoryNames = {
    'desayuno': 'Desayuno',
    'sandwich': 'Sandwich',
    'pan': 'Pan',
    'corviche': 'Corviche',
    'cafe': 'Café',
    'te': 'Té',
    'jugo': 'Jugo'
  };
  const categoryDisplay = categoryNames[category] || 'Producto';

  // Llenar modal con datos del producto
  document.getElementById('detailProductName').textContent = name;
  document.getElementById('detailProductTitle').textContent = name;
  document.getElementById('detailProductCategory').textContent = categoryDisplay;
  document.getElementById('detailProductDescription').textContent = description;
  document.getElementById('detailProductPrice').textContent = price;
  document.getElementById('detailProductImage').style.backgroundImage = image;

  // Cargar ingredientes
  loadProductIngredients(itemId);

  // Resetear cantidad
  document.getElementById('productQuantity').value = 1;

  // Mostrar modal
  showModal('productDetailModal');
  
  // Configurar event listeners
  setupProductDetailListeners(itemId);
};

// Cargar ingredientes del producto
export const loadProductIngredients = (itemId) => {
  const ingredientsList = document.getElementById('detailProductIngredients');
  ingredientsList.innerHTML = '';

  // Cargar ingredientes base
  if (itemIngredients[itemId] && itemIngredients[itemId].length > 0) {
    itemIngredients[itemId].forEach(ingredient => {
      const li = document.createElement('li');
      li.textContent = `${ingredient.name} - ${ingredient.quantity} ${ingredient.unit}`;
      ingredientsList.appendChild(li);
    });
  }

  // Cargar ingredientes personalizados
  if (customIngredients[itemId] && customIngredients[itemId].length > 0) {
    customIngredients[itemId].forEach((ingredient, index) => {
      const li = document.createElement('li');
      li.className = 'ingredient-custom';
      li.innerHTML = `
        <span class="ingredient-info">${ingredient.name} - ${ingredient.quantity} ${ingredient.unit}</span>
        <button class="ingredient-remove" onclick="removeCustomIngredient('${itemId}', ${index})">Eliminar</button>
      `;
      ingredientsList.appendChild(li);
    });
  }

  // Si no hay ingredientes
  if ((!itemIngredients[itemId] || itemIngredients[itemId].length === 0) && 
      (!customIngredients[itemId] || customIngredients[itemId].length === 0)) {
    const li = document.createElement('li');
    li.textContent = 'No hay ingredientes especificados';
    li.style.fontStyle = 'italic';
    li.style.color = 'var(--color-text-light)';
    ingredientsList.appendChild(li);
  }

  // Actualizar precio
  updateProductPrice(itemId);
};

// Configurar event listeners del modal de detalles
export const setupProductDetailListeners = (itemId) => {
  // Controles de cantidad
  const decreaseBtn = document.getElementById('decreaseQuantity');
  const increaseBtn = document.getElementById('increaseQuantity');
  const quantityInput = document.getElementById('productQuantity');

  if (decreaseBtn) {
    decreaseBtn.onclick = () => {
      const currentValue = parseInt(quantityInput.value) || 1;
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
    };
  }

  if (increaseBtn) {
    increaseBtn.onclick = () => {
      const currentValue = parseInt(quantityInput.value) || 1;
      if (currentValue < 10) {
        quantityInput.value = currentValue + 1;
      }
    };
  }

  // Botón agregar al carrito
  const addToCartBtn = document.getElementById('addToCartBtn');
  if (addToCartBtn) {
    addToCartBtn.onclick = () => {
      addToCart(itemId);
    };
  }

  // Botón agregar ingrediente personalizado
  const addIngredientBtn = document.getElementById('addIngredientBtn');
  if (addIngredientBtn) {
    addIngredientBtn.onclick = () => {
      addCustomIngredient(itemId);
    };
  }
};

// Agregar ingrediente personalizado
export const addCustomIngredient = (itemId) => {
  const name = document.getElementById('ingredientName').value.trim();
  const quantity = parseInt(document.getElementById('ingredientQuantity').value);
  const unit = document.getElementById('ingredientUnit').value;

  // Validar campos
  if (!name || !quantity || quantity <= 0) {
    showMessage('Por favor complete todos los campos obligatorios', 'error');
    return;
  }

  // Inicializar array si no existe
  if (!customIngredients[itemId]) {
    customIngredients[itemId] = [];
  }

  // Agregar ingrediente
  const ingredient = {
    name: name,
    quantity: quantity,
    unit: unit
  };

  customIngredients[itemId].push(ingredient);

  // Limpiar campos
  document.getElementById('ingredientName').value = '';
  document.getElementById('ingredientQuantity').value = '';

  // Recargar lista de ingredientes
  loadProductIngredients(itemId);

  showMessage(`¡${name} agregado como ingrediente personalizado!`, 'success');
};

// Remover ingrediente personalizado
export const removeCustomIngredient = (itemId, index) => {
  if (customIngredients[itemId] && customIngredients[itemId][index]) {
    const ingredient = customIngredients[itemId][index];
    customIngredients[itemId].splice(index, 1);
    
    // Recargar lista de ingredientes
    loadProductIngredients(itemId);
    
    showMessage(`¡${ingredient.name} removido de los ingredientes!`, 'info');
  }
};

// Actualizar precio del producto
export const updateProductPrice = (itemId) => {
  const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
  if (!itemElement) return;

  const basePrice = parseFloat(itemElement.querySelector('.price')?.textContent?.replace('$', '') || 0);

  // Actualizar precio en el modal (sin cambios por ingredientes)
  const priceElement = document.getElementById('detailProductPrice');
  if (priceElement) {
    priceElement.textContent = `$${basePrice.toFixed(2)}`;
  }
};

// Agregar producto al carrito
export const addToCart = (itemId) => {
  const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
  if (!itemElement) return;

  const name = itemElement.querySelector('.menu-item-title')?.textContent || '';
  const basePrice = parseFloat(itemElement.querySelector('.price')?.textContent?.replace('$', '') || 0);
  const quantity = parseInt(document.getElementById('productQuantity').value) || 1;

  // Verificar si el producto ya está en el carrito
  const existingItem = shoppingCart.find(item => item.id === itemId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.total = existingItem.quantity * basePrice;
  } else {
    const cartItem = {
      id: itemId,
      name: name,
      price: basePrice,
      quantity: quantity,
      total: basePrice * quantity,
      customIngredients: customIngredients[itemId] ? [...customIngredients[itemId]] : []
    };
    shoppingCart.push(cartItem);
  }

  // Mostrar confirmación
  showMessage(`¡${name} agregado al carrito! (${quantity} ${quantity === 1 ? 'unidad' : 'unidades'})`, 'success');
  
  // Cerrar modal
  hideModal('productDetailModal');
  
  // Actualizar contador del carrito si existe
  updateCartCounter();
};

// Actualizar contador del carrito
export const updateCartCounter = () => {
  const totalItems = shoppingCart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = shoppingCart.reduce((sum, item) => sum + item.total, 0);
  
  // Crear o actualizar indicador del carrito
  let cartIndicator = document.querySelector('.cart-indicator');
  if (!cartIndicator) {
    cartIndicator = document.createElement('div');
    cartIndicator.className = 'cart-indicator';
    cartIndicator.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--color-primary);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 25px;
      box-shadow: var(--shadow-card);
      z-index: 1000;
      cursor: pointer;
      transition: all 0.3s ease;
    `;
    document.body.appendChild(cartIndicator);
  }

  if (totalItems > 0) {
    cartIndicator.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span>🛒</span>
        <span>${totalItems} items</span>
        <span>$${totalPrice.toFixed(2)}</span>
      </div>
    `;
    cartIndicator.style.display = 'block';
    
    // Event listener para mostrar carrito
    cartIndicator.onclick = () => showCartModal();
  } else {
    cartIndicator.style.display = 'none';
  }
};

// Mostrar modal del carrito
export const showCartModal = () => {
  const cartHtml = `
    <div id="cartModal" class="modal">
      <div class="modal-content large">
        <div class="modal-header">
          <h3>Carrito de Compras</h3>
          <span class="close">&times;</span>
        </div>
        <div class="modal-body">
          <div id="cartItems">
            ${shoppingCart.length === 0 ? 
              '<p style="text-align: center; color: var(--color-text-light); font-style: italic;">Tu carrito está vacío</p>' :
              shoppingCart.map(item => `
                <div class="cart-item">
                  <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} c/u</p>
                    ${item.customIngredients && item.customIngredients.length > 0 ? 
                      `<div class="custom-ingredients">
                        <small>Ingredientes extra: ${item.customIngredients.map(ing => ing.name).join(', ')}</small>
                      </div>` : ''
                    }
                  </div>
                  <div class="cart-item-controls">
                    <button class="btn-quantity" onclick="updateCartQuantity('${item.id}', -1)">-</button>
                    <span class="cart-quantity">${item.quantity}</span>
                    <button class="btn-quantity" onclick="updateCartQuantity('${item.id}', 1)">+</button>
                    <button class="btn-remove" onclick="removeFromCart('${item.id}')">🗑️</button>
                  </div>
                  <div class="cart-item-total">
                    $${item.total.toFixed(2)}
                  </div>
                </div>
              `).join('')
            }
          </div>
          ${shoppingCart.length > 0 ? `
            <div class="cart-summary">
              <div class="cart-total">
                <h3>Total: $${shoppingCart.reduce((sum, item) => sum + item.total, 0).toFixed(2)}</h3>
              </div>
              <div class="cart-actions">
                <button class="btn btn-secondary" onclick="clearCart()">Limpiar Carrito</button>
                <button class="btn btn-primary" onclick="checkout()">Finalizar Pedido</button>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;

  // Remover modal existente si existe
  const existingModal = document.getElementById('cartModal');
  if (existingModal) {
    existingModal.remove();
  }

  // Agregar nuevo modal
  document.body.insertAdjacentHTML('beforeend', cartHtml);
  showModal('cartModal');
  setupModalClose();
};

// Actualizar cantidad en el carrito
export const updateCartQuantity = (itemId, change) => {
  const item = shoppingCart.find(item => item.id === itemId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(itemId);
    } else {
      item.total = item.quantity * item.price;
      updateCartCounter();
      showCartModal(); // Refrescar modal
    }
  }
};

// Remover del carrito
export const removeFromCart = (itemId) => {
  const index = shoppingCart.findIndex(item => item.id === itemId);
  if (index > -1) {
    const item = shoppingCart[index];
    shoppingCart.splice(index, 1);
    showMessage(`¡${item.name} removido del carrito!`, 'info');
    updateCartCounter();
    showCartModal(); // Refrescar modal
  }
};

// Limpiar carrito
export const clearCart = () => {
  shoppingCart.length = 0;
  showMessage('Carrito limpiado', 'info');
  updateCartCounter();
  hideModal('cartModal');
};

// Finalizar pedido - Mostrar modal de checkout
export const checkout = () => {
  if (shoppingCart.length === 0) {
    showMessage('Tu carrito está vacío', 'warning');
    return;
  }

  // Mostrar modal de checkout con formulario
  showCheckoutModal();
};

// Mostrar modal de checkout con formulario completo
export const showCheckoutModal = () => {
  const total = shoppingCart.reduce((sum, item) => sum + item.total, 0);
  const totalItems = shoppingCart.reduce((sum, item) => sum + item.quantity, 0);
  const isLoggedIn = isUserLoggedIn();
  const userData = getUserCheckoutData();

  // Obtener datos del usuario si está logueado
  const nombreValue = userData?.nombre || '';
  const emailValue = userData?.email || '';
  const telefonoValue = userData?.telefono || '';
  const direccionValue = userData?.direccion || '';

  const checkoutHtml = `
    <div id="checkoutModal" class="modal">
      <div class="modal-content large">
        <div class="modal-header">
          <h3>Finalizar Pedido</h3>
          <span class="close">&times;</span>
        </div>
        <div class="modal-body">
          ${isLoggedIn ? `
            <div class="alert-info" style="padding: 1rem; background: #e3f2fd; border-radius: 8px; margin-bottom: 1rem;">
              <strong>✓ Sesión iniciada:</strong> Los datos se enviarán a ${emailValue}
            </div>
          ` : `
            <div class="alert-warning" style="padding: 1rem; background: #fff3cd; border-radius: 8px; margin-bottom: 1rem;">
              <strong>⚠ No has iniciado sesión:</strong> Por favor completa tus datos o <a href="pag/login.html" style="color: #856404; text-decoration: underline;">inicia sesión</a>
            </div>
          `}

          <form id="checkoutForm">
            <div class="checkout-section">
              <h4>Datos de Envío</h4>
              
              <div class="form-group">
                <label for="checkoutNombre">Nombre Completo *</label>
                <input 
                  type="text" 
                  id="checkoutNombre" 
                  name="nombre" 
                  class="form-input" 
                  placeholder="Ej: Juan Pérez"
                  value="${nombreValue}"
                  required
                >
              </div>

              <div class="form-group">
                <label for="checkoutEmail">Correo Electrónico *</label>
                <input 
                  type="email" 
                  id="checkoutEmail" 
                  name="email" 
                  class="form-input" 
                  placeholder="tu@email.com"
                  value="${emailValue}"
                  required
                >
              </div>

              <div class="form-group">
                <label for="checkoutTelefono">Teléfono *</label>
                <input 
                  type="tel" 
                  id="checkoutTelefono" 
                  name="telefono" 
                  class="form-input" 
                  placeholder="Ej: 0991234567"
                  value="${telefonoValue}"
                  required
                >
              </div>

              <div class="form-group">
                <label for="checkoutDireccion">Dirección de Envío *</label>
                <textarea 
                  id="checkoutDireccion" 
                  name="direccion" 
                  class="form-input" 
                  placeholder="Calle, número, sector, ciudad"
                  rows="3"
                  required
                >${direccionValue}</textarea>
              </div>
            </div>

            <div class="checkout-section">
              <h4>Resumen del Pedido</h4>
              <div class="order-summary">
                ${shoppingCart.map(item => `
                  <div class="order-item" style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #eee;">
                    <span>${item.name} x${item.quantity}</span>
                    <span>$${item.total.toFixed(2)}</span>
                  </div>
                `).join('')}
                <div class="order-total" style="display: flex; justify-content: space-between; padding: 1rem 0; font-weight: bold; font-size: 1.2em; border-top: 2px solid #333;">
                  <span>Total:</span>
                  <span>$${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div class="checkout-section">
              <h4>Método de Pago</h4>
              
              <div class="form-group">
                <label>Método de Pago:</label>
                <div class="payment-methods">
                  <label class="payment-option">
                    <input type="radio" name="paymentMethod" value="efectivo" checked>
                    <span class="payment-label">
                      <i class="payment-icon">💵</i>
                      Efectivo
                    </span>
                  </label>
                  <label class="payment-option">
                    <input type="radio" name="paymentMethod" value="tarjeta">
                    <span class="payment-label">
                      <i class="payment-icon">💳</i>
                      Tarjeta
                    </span>
                  </label>
                  <label class="payment-option">
                    <input type="radio" name="paymentMethod" value="transferencia">
                    <span class="payment-label">
                      <i class="payment-icon">📱</i>
                      Transferencia
                    </span>
                  </label>
                </div>
              </div>
              
              <div class="form-group" id="checkoutCashGroup">
                <label for="checkoutCashAmount">Monto en Efectivo:</label>
                <input 
                  type="number" 
                  id="checkoutCashAmount" 
                  name="cashAmount" 
                  min="0" 
                  step="0.01" 
                  placeholder="0.00"
                  value="${total.toFixed(2)}"
                >
              </div>
              
              <div class="form-group" id="checkoutCardGroup" style="display: none;">
                <label for="checkoutCardNumber">Número de Tarjeta:</label>
                <input 
                  type="text" 
                  id="checkoutCardNumber" 
                  name="cardNumber" 
                  placeholder="1234 5678 9012 3456" 
                  maxlength="19"
                >
              </div>
              
              <div class="form-group" id="checkoutTransferGroup" style="display: none;">
                <label for="checkoutTransferCode">Código de Transferencia:</label>
                <input 
                  type="text" 
                  id="checkoutTransferCode" 
                  name="transferCode" 
                  placeholder="Ingrese código de transferencia"
                >
              </div>
            </div>

            <div class="form-actions" style="margin-top: 2rem;">
              <button type="submit" class="btn btn-primary">Confirmar y Enviar Comprobante</button>
              <button type="button" class="btn btn-secondary" onclick="hideModal('checkoutModal')">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  // Remover modal existente si existe
  const existingModal = document.getElementById('checkoutModal');
  if (existingModal) {
    existingModal.remove();
  }

  // Agregar nuevo modal
  document.body.insertAdjacentHTML('beforeend', checkoutHtml);
  showModal('checkoutModal');
  setupModalClose();
  
  // Configurar event listeners
  setupCheckoutModalListeners(total);
};

// Configurar event listeners del modal de checkout
export const setupCheckoutModalListeners = (total) => {
  // Cambiar campos según método de pago
  document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
    radio.addEventListener('change', function() {
      const method = this.value;
      const cashGroup = document.getElementById('checkoutCashGroup');
      const cardGroup = document.getElementById('checkoutCardGroup');
      const transferGroup = document.getElementById('checkoutTransferGroup');
      
      // Ocultar todos los grupos
      cashGroup.style.display = 'none';
      cardGroup.style.display = 'none';
      transferGroup.style.display = 'none';
      
      // Mostrar el grupo correspondiente
      if (method === 'efectivo') {
        cashGroup.style.display = 'block';
      } else if (method === 'tarjeta') {
        cardGroup.style.display = 'block';
      } else if (method === 'transferencia') {
        transferGroup.style.display = 'block';
      }
    });
  });
  
  // Manejar formulario de checkout
  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
      e.preventDefault();
      processCheckout();
    });
  }
  
  // Formatear número de tarjeta
  const cardNumber = document.getElementById('checkoutCardNumber');
  if (cardNumber) {
    cardNumber.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
      let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
      e.target.value = formattedValue;
    });
  }
};

// Procesar checkout completo
export const processCheckout = async () => {
  const formData = new FormData(document.getElementById('checkoutForm'));
  
  const nombre = formData.get('nombre')?.trim() || '';
  const email = formData.get('email')?.trim() || '';
  const telefono = formData.get('telefono')?.trim() || '';
  const direccion = formData.get('direccion')?.trim() || '';
  const paymentMethod = formData.get('paymentMethod');
  
  // Validar datos
  const validation = validarCheckoutData(nombre, email, telefono, direccion, paymentMethod, formData);
  if (!validation.isValid) {
    showMessage(validation.errorMessage, 'error');
    return;
  }

  // Calcular totales
  const total = shoppingCart.reduce((sum, item) => sum + item.total, 0);
  const totalItems = shoppingCart.reduce((sum, item) => sum + item.quantity, 0);

  // Crear copia del carrito
  const cartItemsCopy = shoppingCart.map(item => ({ ...item }));

  try {
    showMessage('Procesando pedido...', 'info');

    // Procesar pago
    const paymentData = {
      paymentMethod,
      cashAmount: formData.get('cashAmount'),
      cardNumber: formData.get('cardNumber'),
      transferCode: formData.get('transferCode')
    };

    const paymentResult = await procesarPagoAsync('cart', paymentData);

    // Crear datos de compra
    const purchaseData = {
      items: cartItemsCopy,
      total: total,
      totalItems: totalItems,
      transactionId: paymentResult.transactionId
    };

    // Crear datos de checkout
    const checkoutData = {
      nombre,
      email,
      telefono,
      direccion,
      paymentMethod
    };

    // Enviar comprobante por correo
    const comprobanteResult = await enviarComprobanteAsync(checkoutData, purchaseData);

    // Consumir ingredientes
    cartItemsCopy.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        consumeIngredients(item.id);
      }
    });

    // Actualizar botones
    updateBuyButtons();

    // Mostrar mensaje de éxito
    showMessage(
      `¡Pedido realizado exitosamente! Comprobante enviado a ${email}`, 
      'success'
    );

    // Limpiar carrito
    shoppingCart.length = 0;
    updateCartCounter();
    
    // Cerrar modales
    hideModal('checkoutModal');
    hideModal('cartModal');

  } catch (error) {
    showMessage(`Error al procesar el pedido: ${error.message}`, 'error');
  }
};

// ========================================================
// FUNCIONES DE PAGO
// ========================================================

// Procesar compra de un item
export const processPurchase = (itemId) => {
  const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
  const itemName = itemElement?.querySelector('.menu-item-title')?.textContent || 'Item';
  const itemPrice = itemElement?.querySelector('.price')?.textContent || '$0.00';
  
  // Mostrar modal de pago
  showPaymentModal(itemId, itemName, itemPrice);
  return true;
};

// Mostrar modal de método de pago
export const showPaymentModal = (itemId, itemName, itemPrice) => {
  const paymentHtml = `
    <div id="paymentModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Método de Pago</h3>
          <span class="close">&times;</span>
        </div>
        <div class="modal-body">
          <div class="order-summary">
            <h4>Resumen del Pedido</h4>
            <p><strong>Producto:</strong> ${itemName}</p>
            <p><strong>Precio:</strong> ${itemPrice}</p>
          </div>
          
          <form id="paymentForm">
            <div class="form-group">
              <label>Método de Pago:</label>
              <div class="payment-methods">
                <label class="payment-option">
                  <input type="radio" name="paymentMethod" value="efectivo" checked>
                  <span class="payment-label">
                    <i class="payment-icon">💵</i>
                    Efectivo
                  </span>
                </label>
                <label class="payment-option">
                  <input type="radio" name="paymentMethod" value="tarjeta">
                  <span class="payment-label">
                    <i class="payment-icon">💳</i>
                    Tarjeta
                  </span>
                </label>
                <label class="payment-option">
                  <input type="radio" name="paymentMethod" value="transferencia">
                  <span class="payment-label">
                    <i class="payment-icon">📱</i>
                    Transferencia
                  </span>
                </label>
              </div>
            </div>
            
            <div class="form-group" id="cashGroup">
              <label for="cashAmount">Monto en Efectivo:</label>
              <input type="number" id="cashAmount" name="cashAmount" min="0" step="0.01" placeholder="0.00">
            </div>
            
            <div class="form-group" id="cardGroup" style="display: none;">
              <label for="cardNumber">Número de Tarjeta:</label>
              <input type="text" id="cardNumber" name="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19">
            </div>
            
            <div class="form-group" id="transferGroup" style="display: none;">
              <label for="transferCode">Código de Transferencia:</label>
              <input type="text" id="transferCode" name="transferCode" placeholder="Ingrese código de transferencia">
            </div>
            
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Confirmar Pago</button>
              <button type="button" class="btn btn-secondary" onclick="hideModal('paymentModal')">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  // Remover modal existente si existe
  const existingModal = document.getElementById('paymentModal');
  if (existingModal) {
    existingModal.remove();
  }

  // Agregar nuevo modal
  document.body.insertAdjacentHTML('beforeend', paymentHtml);
  showModal('paymentModal');
  setupModalClose();
  
  // Configurar event listeners para el modal de pago
  setupPaymentModalListeners(itemId);
};

// Configurar event listeners del modal de pago
export const setupPaymentModalListeners = (itemId) => {
  // Cambiar campos según método de pago
  document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
    radio.addEventListener('change', function() {
      const method = this.value;
      const cashGroup = document.getElementById('cashGroup');
      const cardGroup = document.getElementById('cardGroup');
      const transferGroup = document.getElementById('transferGroup');
      
      // Ocultar todos los grupos
      cashGroup.style.display = 'none';
      cardGroup.style.display = 'none';
      transferGroup.style.display = 'none';
      
      // Mostrar el grupo correspondiente
      if (method === 'efectivo') {
        cashGroup.style.display = 'block';
      } else if (method === 'tarjeta') {
        cardGroup.style.display = 'block';
      } else if (method === 'transferencia') {
        transferGroup.style.display = 'block';
      }
    });
  });
  
  // Manejar formulario de pago
  const paymentForm = document.getElementById('paymentForm');
  if (paymentForm) {
    paymentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      processPayment(itemId);
    });
  }
  
  // Formatear número de tarjeta
  const cardNumber = document.getElementById('cardNumber');
  if (cardNumber) {
    cardNumber.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
      let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
      e.target.value = formattedValue;
    });
  }
};

// Procesar pago
export const processPayment = async (itemId) => {
  const formData = new FormData(document.getElementById('paymentForm'));
  const paymentMethod = formData.get('paymentMethod');
  
  // Validar según método de pago
  const validation = validarMetodoPago(paymentMethod, formData);
  if (!validation.isValid) {
    showMessage(validation.errorMessage, 'error');
    return;
  }
  
  // Simular procesamiento de pago
  showMessage('Procesando pago...', 'info');
  
  try {
    const paymentData = {
      paymentMethod,
      cashAmount: formData.get('cashAmount'),
      cardNumber: formData.get('cardNumber'),
      transferCode: formData.get('transferCode')
    };
    
    const result = await procesarPagoAsync(itemId, paymentData);
    
    // Consumir ingredientes
    consumeIngredients(itemId);
    
    // Actualizar botones
    updateBuyButtons();
    
    // Mostrar mensaje de éxito
    const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
    const itemName = itemElement?.querySelector('.menu-item-title')?.textContent || 'Item';
    showMessage(`¡${itemName} comprado exitosamente! Pago procesado.`, 'success');
    
    // Cerrar modal
    hideModal('paymentModal');
  } catch (error) {
    showMessage(`Error en el pago: ${error.message}`, 'error');
  }
};

// Mostrar modal de inventario
export const showInventoryModal = () => {
  const inventoryHtml = `
    <div id="inventoryModal" class="modal">
      <div class="modal-content large">
        <div class="modal-header">
          <h3>Inventario de Ingredientes</h3>
          <span class="close">&times;</span>
        </div>
        <div class="modal-body">
          <div class="inventory-grid">
            ${Object.entries(inventory).map(([name, data]) => `
              <div class="inventory-item">
                <h4>${name.charAt(0).toUpperCase() + name.slice(1)}</h4>
                <p>${data.quantity} ${data.unit}</p>
              </div>
            `).join('')}
          </div>
          <div class="form-actions">
            <button class="btn btn-secondary" onclick="hideModal('inventoryModal')">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Remover modal existente si existe
  const existingModal = document.getElementById('inventoryModal');
  if (existingModal) {
    existingModal.remove();
  }

  // Agregar nuevo modal
  document.body.insertAdjacentHTML('beforeend', inventoryHtml);
  showModal('inventoryModal');
  setupModalClose();
};
