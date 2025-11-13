// ========================================================
// UTILIDADES DOM MODERNAS - ES6+
// ========================================================

// Mostrar mensaje de error debajo del input
export const mostrarError = (inputElement, validationResult) => {
  limpiarError(inputElement); // Borra cualquier error previo

  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = validationResult?.errorMessage ?? 'Error desconocido';

  // Agregar clases para el estado de error
  inputElement.classList.add('input-error');
  
  // Para checkboxes, aplicar clases al contenedor padre
  if (inputElement.type === 'checkbox') {
    const formOptions = inputElement.closest('.form-options');
    formOptions?.classList.add('error');
    formOptions?.classList.remove('success');
    formOptions?.appendChild(errorDiv);
  } else {
    // Para inputs normales
    inputElement.parentElement?.classList.add('error');
    inputElement.parentElement?.classList.remove('success');
    inputElement.parentElement?.appendChild(errorDiv);
  }
};

// Marcar input como válido
export const mostrarExito = (inputElement) => {
  limpiarError(inputElement);
  
  // Agregar clases para el estado de éxito
  inputElement.classList.add('input-valid');
  
  // Para checkboxes, aplicar clases al contenedor padre
  if (inputElement.type === 'checkbox') {
    const formOptions = inputElement.closest('.form-options');
    formOptions?.classList.add('success');
    formOptions?.classList.remove('error');
    
    // Crear mensaje de éxito temporal para checkboxes
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = '✓ Términos aceptados';
    formOptions?.appendChild(successDiv);
    
    // Remover mensaje de éxito después de 2 segundos
    setTimeout(() => {
      successDiv?.remove();
    }, 2000);
  } else {
    // Para inputs normales
    inputElement.parentElement?.classList.add('success');
    inputElement.parentElement?.classList.remove('error');
    
    // Crear mensaje de éxito temporal
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = '✓ Campo válido';
    inputElement.parentElement?.appendChild(successDiv);
    
    // Remover mensaje de éxito después de 2 segundos
    setTimeout(() => {
      successDiv?.remove();
    }, 2000);
  }
};

// Eliminar mensajes de error previos
export const limpiarError = (inputElement) => {
  // Para checkboxes, buscar en el contenedor padre
  if (inputElement.type === 'checkbox') {
    const formOptions = inputElement.closest('.form-options');
    const errorDiv = formOptions?.querySelector('.error-message');
    const successDiv = formOptions?.querySelector('.success-message');
    
    errorDiv?.remove();
    successDiv?.remove();
    
    inputElement.classList.remove('input-error', 'input-valid');
    formOptions?.classList.remove('error', 'success');
  } else {
    // Para inputs normales
    const errorDiv = inputElement.parentElement?.querySelector('.error-message');
    const successDiv = inputElement.parentElement?.querySelector('.success-message');
    
    errorDiv?.remove();
    successDiv?.remove();
    
    inputElement.classList.remove('input-error', 'input-valid');
    inputElement.parentElement?.classList.remove('error', 'success');
  }
};

// Mostrar mensaje general en pantalla (éxito o error)
export const mostrarMensaje = (texto, tipo = 'info') => {
  const contenedor = document.createElement('div');
  contenedor.className = `mensaje-${tipo}`;
  contenedor.textContent = texto;
  
  // Agregar estilos dinámicos
  contenedor.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;

  // Aplicar colores según el tipo
  const colores = {
    success: '#10b981',
    error: '#ef4444',
    info: '#3b82f6',
    warning: '#f59e0b'
  };
  
  contenedor.style.backgroundColor = colores[tipo] ?? colores.info;
  
  document.body.appendChild(contenedor);

  // Animación de entrada
  setTimeout(() => {
    contenedor.style.transform = 'translateX(0)';
  }, 10);

  // Desaparece automáticamente después de 4 segundos
  setTimeout(() => {
    contenedor.style.transform = 'translateX(100%)';
    setTimeout(() => contenedor.remove(), 300);
  }, 4000);
};

// Crear elemento de loading
export const mostrarLoading = (elemento, texto = 'Cargando...') => {
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'loading-message';
  loadingDiv.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <div class="spinner" style="
        width: 20px; 
        height: 20px; 
        border: 2px solid #f3f3f3; 
        border-top: 2px solid #3498db; 
        border-radius: 50%; 
        animation: spin 1s linear infinite;
      "></div>
      <span>${texto}</span>
    </div>
  `;
  
  // Agregar animación CSS si no existe
  if (!document.querySelector('#spinner-styles')) {
    const style = document.createElement('style');
    style.id = 'spinner-styles';
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
  
  elemento.appendChild(loadingDiv);
  return loadingDiv;
};

// Ocultar loading
export const ocultarLoading = (loadingElement) => {
  loadingElement?.remove();
};

// ========================================================
// UTILIDADES DOM ESPECÍFICAS DEL MENÚ
// ========================================================

// Mostrar modal
export const showModal = (modalId) => {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }
};

// Ocultar modal
export const hideModal = (modalId) => {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
};

// Configurar cierre de modales
export const setupModalClose = () => {
  // Cerrar con X
  document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal');
      if (modal) {
        hideModal(modal.id);
      }
    });
  });

  // Cerrar al hacer clic fuera del modal
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        hideModal(modal.id);
      }
    });
  });
};

// Mostrar mensaje específico del menú (compatible con el sistema existente)
export const showMessage = (message, type = 'info') => {
  // Crear elemento de mensaje
  const messageDiv = document.createElement('div');
  messageDiv.className = `message message-${type}`;
  messageDiv.textContent = message;
  messageDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 2rem;
    border-radius: 6px;
    color: white;
    font-weight: 500;
    z-index: 1001;
    animation: slideInRight 0.3s ease-out;
    max-width: 300px;
  `;

  // Colores según tipo
  const colors = {
    success: '#28a745',
    error: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8'
  };
  messageDiv.style.backgroundColor = colors[type] || colors.info;

  document.body.appendChild(messageDiv);

  // Remover después de 3 segundos
  setTimeout(() => {
    messageDiv.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.parentNode.removeChild(messageDiv);
      }
    }, 300);
  }, 3000);
};

// Crear HTML para un item del menú
export const createItemHTML = (item) => {
  return `
    <article class="menu-item" role="listitem" data-item-id="${item.id}">
      <figure class="menu-item-image" style="background-image: url('${item.image}')" aria-label="Imagen de ${item.name}">
      </figure>
      <div class="menu-item-content">
        <header>
          <h3 class="menu-item-title">${item.name}</h3>
        </header>
        <p class="menu-item-description">${item.description}</p>
        <span class="price">$${item.price}</span>
        <div class="item-actions">
          <button class="btn btn-ingredients" data-item="${item.id}">Agregar Ingredientes</button>
          <button class="btn btn-delete" data-item="${item.id}">Eliminar</button>
        </div>
      </div>
    </article>
  `;
};

// Agregar fila de ingrediente
export const addIngredientRow = () => {
  const ingredientsInput = document.querySelector('.ingredients-input');
  const newRow = document.createElement('div');
  newRow.className = 'ingredient-row';
  newRow.innerHTML = `
    <input type="text" placeholder="Nombre del ingrediente" class="ingredient-name">
    <input type="number" placeholder="Cantidad" class="ingredient-quantity" min="0" step="0.1">
    <select class="ingredient-unit">
      <option value="">Unidad</option>
      <option value="gramos">Gramos (g)</option>
      <option value="kilogramos">Kilogramos (kg)</option>
      <option value="litros">Litros (L)</option>
      <option value="mililitros">Mililitros (ml)</option>
      <option value="tazas">Tazas</option>
      <option value="cucharadas">Cucharadas</option>
      <option value="cucharaditas">Cucharaditas</option>
      <option value="unidades">Unidades</option>
      <option value="piezas">Piezas</option>
    </select>
    <button type="button" class="btn btn-remove-ingredient">Eliminar</button>
  `;
  ingredientsInput.appendChild(newRow);
};