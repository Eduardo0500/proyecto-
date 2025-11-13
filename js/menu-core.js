// ========================================================
// FUNCIONES PRINCIPALES DEL MENÚ - ES6+ MODULAR
// ========================================================

import { 
  validarIngrediente, 
  validarNuevoItem, 
  validarMetodoPago 
} from './validations.js';

import { 
  showModal, 
  hideModal, 
  setupModalClose, 
  showMessage, 
  createItemHTML, 
  addIngredientRow 
} from './dom-utils.js';

import { 
  procesarPagoAsync, 
  verificarInventarioAsync, 
  crearItemAsync 
} from './async-handlers.js';

// ========================================================
// ALMACENAMIENTO Y DATOS DEL MENÚ
// ========================================================

// Almacenamiento local para ingredientes de cada item
export const itemIngredients = {};

// Almacenamiento para ingredientes personalizados por producto
export const customIngredients = {};

// Almacenamiento local para items creados
export const createdItems = [];

// Carrito de compras
export const shoppingCart = [];

// Sistema de inventario de ingredientes disponibles
export const inventory = {
  'harina': { quantity: 10, unit: 'kilogramos' },
  'huevos': { quantity: 24, unit: 'unidades' },
  'leche': { quantity: 5, unit: 'litros' },
  'café': { quantity: 2, unit: 'kilogramos' },
  'azúcar': { quantity: 3, unit: 'kilogramos' },
  'mantequilla': { quantity: 1, unit: 'kilogramos' },
  'pan': { quantity: 20, unit: 'unidades' },
  'queso': { quantity: 500, unit: 'gramos' },
  'tomate': { quantity: 10, unit: 'unidades' },
  'lechuga': { quantity: 5, unit: 'unidades' },
  'plátano': { quantity: 8, unit: 'unidades' },
  'pescado': { quantity: 1, unit: 'kilogramos' },
  'naranjas': { quantity: 15, unit: 'unidades' },
  'moras': { quantity: 200, unit: 'gramos' },
  'té': { quantity: 100, unit: 'gramos' },
  'agua': { quantity: 10, unit: 'litros' }
};

// Definir ingredientes necesarios para cada item
export const itemRequirements = {
  'desayuno-1': [
    { name: 'harina', quantity: 200, unit: 'gramos' },
    { name: 'huevos', quantity: 2, unit: 'unidades' },
    { name: 'leche', quantity: 100, unit: 'mililitros' },
    { name: 'mantequilla', quantity: 50, unit: 'gramos' }
  ],
  'desayuno-nutritivo-1': [
    { name: 'avena', quantity: 100, unit: 'gramos' },
    { name: 'leche', quantity: 200, unit: 'mililitros' },
    { name: 'frutas', quantity: 150, unit: 'gramos' },
    { name: 'nueces', quantity: 30, unit: 'gramos' }
  ],
  'desayuno-nutritivo-2': [
    { name: 'pan', quantity: 2, unit: 'unidades' },
    { name: 'huevos', quantity: 1, unit: 'unidades' },
    { name: 'aguacate', quantity: 1, unit: 'unidades' },
    { name: 'espinacas', quantity: 50, unit: 'gramos' }
  ],
  'sandwich-1': [
    { name: 'pan', quantity: 2, unit: 'unidades' },
    { name: 'queso', quantity: 50, unit: 'gramos' },
    { name: 'tomate', quantity: 2, unit: 'unidades' },
    { name: 'lechuga', quantity: 1, unit: 'unidades' }
  ],
  'pan-1': [
    { name: 'harina', quantity: 300, unit: 'gramos' },
    { name: 'agua', quantity: 200, unit: 'mililitros' },
    { name: 'levadura', quantity: 10, unit: 'gramos' }
  ],
  'corviche-1': [
    { name: 'plátano', quantity: 2, unit: 'unidades' },
    { name: 'pescado', quantity: 100, unit: 'gramos' },
    { name: 'cebolla', quantity: 50, unit: 'gramos' }
  ],
  'cafe-espresso-1': [
    { name: 'café', quantity: 20, unit: 'gramos' },
    { name: 'agua', quantity: 30, unit: 'mililitros' }
  ],
  'cafe-1': [
    { name: 'café', quantity: 15, unit: 'gramos' },
    { name: 'agua', quantity: 200, unit: 'mililitros' }
  ],
  'te-rojo-1': [
    { name: 'té', quantity: 5, unit: 'gramos' },
    { name: 'agua', quantity: 250, unit: 'mililitros' }
  ],
  'cafe-con-leche-1': [
    { name: 'café', quantity: 15, unit: 'gramos' },
    { name: 'leche', quantity: 150, unit: 'mililitros' },
    { name: 'agua', quantity: 50, unit: 'mililitros' }
  ],
  'jugo-naranja-1': [
    { name: 'naranjas', quantity: 3, unit: 'unidades' },
    { name: 'azúcar', quantity: 10, unit: 'gramos' }
  ],
  'jugo-mora-1': [
    { name: 'moras', quantity: 100, unit: 'gramos' },
    { name: 'azúcar', quantity: 15, unit: 'gramos' },
    { name: 'agua', quantity: 200, unit: 'mililitros' }
  ]
};

// ========================================================
// FUNCIONES DE INVENTARIO Y COMPRA
// ========================================================

// Verificar si hay suficientes ingredientes para un item
export const checkInventoryForItem = (itemId) => {
  const requirements = itemRequirements[itemId];
  if (!requirements) return { available: true, missing: [] };

  const missing = [];
  
  for (const requirement of requirements) {
    const available = inventory[requirement.name];
    if (!available || available.quantity < requirement.quantity) {
      missing.push({
        name: requirement.name,
        required: requirement.quantity,
        available: available ? available.quantity : 0,
        unit: requirement.unit
      });
    }
  }

  return {
    available: missing.length === 0,
    missing: missing
  };
};

// Consumir ingredientes del inventario
export const consumeIngredients = (itemId) => {
  const requirements = itemRequirements[itemId];
  if (!requirements) return false;

  for (const requirement of requirements) {
    if (inventory[requirement.name]) {
      inventory[requirement.name].quantity -= requirement.quantity;
      if (inventory[requirement.name].quantity < 0) {
        inventory[requirement.name].quantity = 0;
      }
    }
  }
  
  return true;
};

// Actualizar estado de botones de compra
export const updateBuyButtons = () => {
  document.querySelectorAll('.btn-buy').forEach(button => {
    const itemId = button.dataset.item;
    const check = checkInventoryForItem(itemId);
    
    if (check.available) {
      button.disabled = false;
      button.textContent = 'Comprar';
      button.style.opacity = '1';
    } else {
      button.disabled = true;
      button.textContent = 'Comprar';
      button.style.opacity = '0.6';
    }
  });
};

// ========================================================
// FUNCIONES DE INGREDIENTES
// ========================================================

// Agregar ingrediente a un item
export const addIngredientToItem = (itemId, ingredient) => {
  if (!itemIngredients[itemId]) {
    itemIngredients[itemId] = [];
  }
  itemIngredients[itemId].push(ingredient);
  updateIngredientsList(itemId);
};

// Actualizar lista de ingredientes en el modal
export const updateIngredientsList = (itemId) => {
  const ingredientsUl = document.getElementById('ingredientsUl');
  if (!ingredientsUl) return;

  ingredientsUl.innerHTML = '';
  
  if (itemIngredients[itemId] && itemIngredients[itemId].length > 0) {
    itemIngredients[itemId].forEach((ingredient, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="ingredient-info">
          ${ingredient.name} - ${ingredient.quantity} ${ingredient.unit}
        </span>
        <button class="ingredient-remove" onclick="removeIngredient('${itemId}', ${index})">
          Eliminar
        </button>
      `;
      ingredientsUl.appendChild(li);
    });
  } else {
    const li = document.createElement('li');
    li.textContent = 'No hay ingredientes agregados';
    li.style.fontStyle = 'italic';
    li.style.color = 'var(--color-text-light)';
    ingredientsUl.appendChild(li);
  }
};

// Eliminar ingrediente
export const removeIngredient = (itemId, index) => {
  if (itemIngredients[itemId] && itemIngredients[itemId][index]) {
    const removedIngredient = itemIngredients[itemId][index];
    itemIngredients[itemId].splice(index, 1);
    updateIngredientsList(itemId);
    showMessage(`Ingrediente "${removedIngredient.name}" eliminado exitosamente`, 'success');
  }
};

// ========================================================
// FUNCIONES DE CONFIRMACIÓN DE ELIMINACIÓN
// ========================================================

// Mostrar confirmación de eliminación
export const showDeleteConfirmation = (itemId, itemName) => {
  const confirmationHtml = `
    <div id="deleteConfirmationModal" class="modal confirmation-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Confirmar Eliminación</h3>
          <span class="close">&times;</span>
        </div>
        <div class="modal-body">
          <p>¿Estás seguro de que deseas eliminar "<strong>${itemName}</strong>"?</p>
          <p>Esta acción no se puede deshacer.</p>
          <div class="confirmation-actions">
            <button class="btn-confirm" onclick="confirmDelete('${itemId}')">
              Sí, Eliminar
            </button>
            <button class="btn-cancel" onclick="hideModal('deleteConfirmationModal')">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Remover modal existente si existe
  const existingModal = document.getElementById('deleteConfirmationModal');
  if (existingModal) {
    existingModal.remove();
  }

  // Agregar nuevo modal
  document.body.insertAdjacentHTML('beforeend', confirmationHtml);
  showModal('deleteConfirmationModal');
  setupModalClose();
};

// Confirmar eliminación
export const confirmDelete = (itemId) => {
  const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
  if (itemElement) {
    const itemName = itemElement.querySelector('.menu-item-title')?.textContent || 'Producto';
    
    // Animación de eliminación
    itemElement.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
      itemElement.remove();
    }, 300);
    
    // Eliminar ingredientes del item
    if (itemIngredients[itemId]) {
      delete itemIngredients[itemId];
    }
    
    showMessage(`¡${itemName} eliminado exitosamente!`, 'success');
  }
  hideModal('deleteConfirmationModal');
};

// ========================================================
// FUNCIONES DE BÚSQUEDA Y FILTROS
// ========================================================

// Inicializar buscador y filtros
export const initializeSearchAndFilters = () => {
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const sortBy = document.getElementById('sortBy');

  if (searchInput) {
    searchInput.addEventListener('input', filterProducts);
  }

  if (categoryFilter) {
    categoryFilter.addEventListener('change', filterProducts);
  }

  if (sortBy) {
    sortBy.addEventListener('change', sortProducts);
  }
};

// Filtrar productos
export const filterProducts = () => {
  const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
  const selectedCategory = document.getElementById('categoryFilter')?.value || '';
  const products = document.querySelectorAll('.menu-item');
  let visibleCount = 0;

  products.forEach(product => {
    const name = product.querySelector('.menu-item-title')?.textContent.toLowerCase() || '';
    const category = product.dataset.category || '';
    
    const matchesSearch = name.includes(searchTerm);
    const matchesCategory = !selectedCategory || category === selectedCategory;
    
    if (matchesSearch && matchesCategory) {
      product.classList.remove('hidden');
      product.classList.add('filtered');
      visibleCount++;
    } else {
      product.classList.add('hidden');
      product.classList.remove('filtered');
    }
  });

  updateResultsCounter(visibleCount, products.length);
};

// Ordenar productos
export const sortProducts = () => {
  const sortBy = document.getElementById('sortBy')?.value || 'name-asc';
  const container = document.querySelector('.menu-grid');
  const products = Array.from(document.querySelectorAll('.menu-item:not(.hidden)'));

  products.sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.querySelector('.menu-item-title')?.textContent.localeCompare(
          b.querySelector('.menu-item-title')?.textContent
        );
      case 'name-desc':
        return b.querySelector('.menu-item-title')?.textContent.localeCompare(
          a.querySelector('.menu-item-title')?.textContent
        );
      case 'price-asc':
        return getPrice(a) - getPrice(b);
      case 'price-desc':
        return getPrice(b) - getPrice(a);
      default:
        return 0;
    }
  });

  // Reordenar elementos en el DOM
  products.forEach(product => {
    container.appendChild(product);
  });
};

// Obtener precio numérico de un producto
export const getPrice = (product) => {
  const priceText = product.querySelector('.price')?.textContent || '$0';
  return parseFloat(priceText.replace('$', '')) || 0;
};

// Actualizar contador de resultados
export const updateResultsCounter = (visible, total) => {
  let counter = document.querySelector('.results-counter');
  
  if (!counter) {
    counter = document.createElement('div');
    counter.className = 'results-counter';
    const container = document.querySelector('.menu-grid');
    container.parentNode.insertBefore(counter, container);
  }

  if (visible === 0) {
    counter.innerHTML = '<div class="no-results"><h3>No se encontraron productos</h3><p>Intenta con otros términos de búsqueda o cambia la categoría</p></div>';
  } else {
    counter.innerHTML = `Mostrando <strong>${visible}</strong> de <strong>${total}</strong> productos`;
  }
};

// Limpiar filtros
export const clearFilters = () => {
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const sortBy = document.getElementById('sortBy');

  if (searchInput) searchInput.value = '';
  if (categoryFilter) categoryFilter.value = '';
  if (sortBy) sortBy.value = 'name-asc';

  // Mostrar todos los productos
  const products = document.querySelectorAll('.menu-item');
  products.forEach(product => {
    product.classList.remove('hidden', 'filtered');
  });

  updateResultsCounter(products.length, products.length);
};

// ========================================================
// FUNCIONES PARA CREAR NUEVOS ITEMS
// ========================================================

// Crear nuevo item
export const createNewItem = async (itemData) => {
  try {
    const newItem = await crearItemAsync(itemData);
    
    createdItems.push(newItem);
    
    // Agregar ingredientes al almacenamiento
    if (newItem.ingredients.length > 0) {
      itemIngredients[newItem.id] = newItem.ingredients;
    }

    // Crear elemento HTML del nuevo item
    const itemHtml = createItemHTML(newItem);
    
    // Agregar al grid de menú
    const menuGrid = document.querySelector('.menu-grid');
    if (menuGrid) {
      menuGrid.insertAdjacentHTML('beforeend', itemHtml);
    }

    showMessage('Item creado exitosamente', 'success');
    hideModal('newItemModal');
    return true;
  } catch (error) {
    showMessage(`Error al crear item: ${error.message}`, 'error');
    return false;
  }
};

// ========================================================
// FUNCIONES DE FORMULARIOS
// ========================================================

// Manejar formulario de ingredientes
export const handleIngredientsForm = (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const ingredient = {
    name: formData.get('ingredientName'),
    quantity: parseFloat(formData.get('ingredientQuantity')),
    unit: formData.get('ingredientUnit')
  };

  // Validar ingrediente
  const validation = validarIngrediente(ingredient.name, ingredient.quantity, ingredient.unit);
  if (!validation.isValid) {
    showMessage(validation.errorMessage, 'error');
    return;
  }

  const currentItemId = e.target.dataset.currentItem;
  if (currentItemId) {
    addIngredientToItem(currentItemId, ingredient);
    e.target.reset();
    showMessage('Ingrediente agregado exitosamente', 'success');
  }
};

// Manejar formulario de nuevo item
export const handleNewItemForm = async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const ingredients = [];
  
  // Recopilar ingredientes del formulario
  const ingredientRows = document.querySelectorAll('.ingredient-row');
  ingredientRows.forEach(row => {
    const name = row.querySelector('.ingredient-name').value;
    const quantity = row.querySelector('.ingredient-quantity').value;
    const unit = row.querySelector('.ingredient-unit').value;
    
    if (name && quantity && unit) {
      ingredients.push({
        name: name,
        quantity: parseFloat(quantity),
        unit: unit
      });
    }
  });

  const itemData = {
    name: formData.get('itemName'),
    description: formData.get('itemDescription'),
    price: parseFloat(formData.get('itemPrice')),
    image: formData.get('itemImage'),
    ingredients: ingredients
  };

  // Validar datos del item
  const validation = validarNuevoItem(itemData.name, itemData.description, itemData.price, itemData.image);
  if (!validation.isValid) {
    showMessage(validation.errorMessage, 'error');
    return;
  }

  await createNewItem(itemData);
  e.target.reset();
  
  // Limpiar filas de ingredientes
  const ingredientsInput = document.querySelector('.ingredients-input');
  ingredientsInput.innerHTML = `
    <div class="ingredient-row">
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
    </div>
  `;
};
