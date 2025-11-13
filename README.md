# ☕ Coffee Sync - Sistema de Gestión de Cafetería

## 📋 Descripción del Proyecto

**Coffee Sync** es una aplicación web moderna desarrollada con **JavaScript ES6+** que simula un sistema de gestión para una cafetería. El proyecto implementa un sistema completo de autenticación de usuarios con validaciones en tiempo real, programación asíncrona avanzada y manipulación dinámica del DOM.

### 🎯 Objetivos del Proyecto
- Implementar un sistema de registro y login de usuarios
- Desarrollar validaciones robustas con feedback en tiempo real
- Integrar las 3 formas de programación asíncrona (Callbacks, Promises, Async/Await)
- Utilizar características modernas de ECMAScript 6+
- Crear una experiencia de usuario fluida y reactiva

---

## 🚀 Funcionalidades Implementadas en Taller 4

### 1. **Sistema de Autenticación Completo**
- ✅ **Registro de usuarios** con validación asíncrona
- ✅ **Login de usuarios** con autenticación
- ✅ **Recuperación de contraseña** con envío de email simulado
- ✅ **Validación en tiempo real** de todos los campos

### 2. **Gestión de Formularios Avanzada**
- ✅ **Validación instantánea** al perder foco (blur)
- ✅ **Feedback visual inmediato** con colores y mensajes
- ✅ **Prevención de envío** con datos inválidos
- ✅ **Estados de loading** durante procesamiento

### 3. **Sistema de Navegación**
- ✅ **Página principal** con menú de categorías
- ✅ **Sección de bebidas** con catálogo
- ✅ **Sección de alimentos** con opciones
- ✅ **Creación de desayunos** personalizados

### 4. **Experiencia de Usuario (UX)**
- ✅ **Mensajes dinámicos** con animaciones
- ✅ **Estados de carga** visuales
- ✅ **Validación progresiva** de formularios
- ✅ **Interfaz responsiva** y moderna

---

## ✅ Lista de Validaciones Integradas

### **Validaciones de Registro**
```javascript
// Campos obligatorios
validarCamposObligatorios(firstName, lastName, email, password, confirmPassword)

// Validación de nombres (2 palabras)
ValidarNombre(firstName) // "Juan Carlos" ✅
ValidarApellido(lastName) // "Pérez García" ✅

// Validación de email
validarEmail(email) // formato@dominio.com ✅

// Validación de contraseña
validarContrasena(password) // mínimo 6 caracteres ✅

// Coincidencia de contraseñas
validarCoincidenciaContrasenas(password, confirmPassword) ✅

// Términos y condiciones
validarTerminos(terms) // debe estar marcado ✅
```

### **Validaciones de Login**
```javascript
// Campos vacíos
validarCamposVacios(email, password) ✅

// Formato de email
validarEmail(email) ✅

// Longitud de contraseña
validarContrasena(password) ✅
```

### **Validaciones de Recuperación**
```javascript
// Campo email obligatorio
validarCampoEmail(email) ✅

// Formato de email válido
validarFormatoEmail(email) ✅
```

### **Validaciones en Tiempo Real**
- ✅ **Validación al perder foco** (evento blur)
- ✅ **Feedback visual inmediato** (colores, mensajes)
- ✅ **Confirmación de contraseña** en tiempo real
- ✅ **Limpieza automática** de errores previos

---

## ⚡ Operaciones Asíncronas Implementadas

### **1️⃣ CALLBACKS**
```javascript
// Verificación de disponibilidad de username
verificarUsernameDisponible(username, callback) {
  // Simula verificación en servidor
  // Retorna: { disponible: boolean, mensaje: string }
}
```

### **2️⃣ PROMISES**
```javascript
// Validación de código postal
validarCodigoPostal(codigoPostal) {
  return new Promise((resolve, reject) => {
    // Simula validación en servidor remoto
    // Retorna: { valido: boolean, ciudad: string, region: string }
  });
}
```

### **3️⃣ ASYNC/AWAIT**
```javascript
// Envío de formulario completo
async enviarFormularioAsync(datosFormulario) {
  // Maneja estados de UI (loading, success, error)
  // Integra las 3 formas de asincronía
  // Manejo robusto de errores
}
```

### **4️⃣ FUNCIÓN HÍBRIDA (Callback + Promise)**
```javascript
// Procesamiento de datos de usuario
procesarDatosUsuario(datosUsuario, callback) {
  // Combina callback para feedback inmediato
  // Y Promise para resultado final
}
```

### **Integración en Formularios**
- ✅ **Registro**: Usa las 3 formas de asincronía secuencialmente
- ✅ **Login**: Usa función híbrida (callback + promise)
- ✅ **Recuperación**: Simula envío asíncrono de email
- ✅ **Manejo de errores**: Try/catch en todas las operaciones

---

## 🎯 Características ES6+ Utilizadas

### **Arrow Functions**
```javascript
const procesarRegistro = async (firstName, lastName, email) => {
  // Implementación moderna con async/await
};
```

### **Destructuring**
```javascript
const { email, password } = datosFormulario;
const [primero, ...resto] = array;
const { target } = event;
```

### **Template Literals**
```javascript
const mensaje = `¡Bienvenido ${nombre}!`;
const html = `<h2>${titulo}</h2>`;
```

### **Spread Operator**
```javascript
const nuevo = [...array, item];
const merged = { ...obj1, ...obj2 };
```

### **Const/Let (nunca var)**
```javascript
const API_URL = 'https://...';
let contador = 0;


### **Optional Chaining**
```javascript
const ciudad = usuario?.direccion?.ciudad;
const email = document.getElementById('email')?.value;
```

### **Nullish Coalescing**
```javascript
const nombre = usuario.nombre ?? 'Anónimo';
const valor = input.value ?? '';
```

### **Async/Await**
```javascript
const resultado = await enviarFormularioAsync(datos);
```

### **Import/Export Modules**
```javascript
import { validarEmail, ValidarNombre } from './validations.js';
export const procesarRegistro = async () => { ... };
```

---

## 👥 División de Trabajo

### **Estructura del Proyecto**
```
avance/
├── index.html              # Página principal
├── css/                    # Estilos CSS
├── js/                      # JavaScript ES6+
│   ├── validations.js      # Validaciones centralizadas
│   ├── dom-utils.js        # Utilidades DOM
│   ├── async-handlers.js   # Funciones asíncronas
│   └── app.js             # Aplicación principal
├── pag/                    # Páginas HTML
│   ├── login.html         # Formulario de login
│   ├── register.html      # Formulario de registro
│   ├── forgot-password.html # Recuperación
│   ├── bebidas.html       # Catálogo de bebidas
│   ├── alimentos.html     # Catálogo de alimentos
│   └── creacion_alimentos.html # Creación personalizada
└── assets/                 # Recursos multimedia
    ├── logo.svg
    └── imagen/            # Imágenes del menú
```

### **Responsabilidades por Archivo**

#### **`validations.js`** - Validaciones Centralizadas
- ✅ Todas las funciones de validación del Taller 3
- ✅ Sin duplicación de código
- ✅ Reutilización en múltiples formularios

#### **`dom-utils.js`** - Manipulación DOM
- ✅ Creación dinámica de elementos
- ✅ Mensajes con animaciones
- ✅ Estados de loading
- ✅ Feedback visual

#### **`async-handlers.js`** - Programación Asíncrona
- ✅ Callbacks: `verificarUsernameDisponible()`
- ✅ Promises: `validarCodigoPostal()`
- ✅ Async/Await: `enviarFormularioAsync()`
- ✅ Función híbrida: `procesarDatosUsuario()`

#### **`app.js`** - Aplicación Principal
- ✅ Integración de todas las funcionalidades
- ✅ Gestión de eventos
- ✅ Validación en tiempo real
- ✅ Coordinación de operaciones asíncronas

---

## 🚀 Instrucciones de Uso

### **1. Estructura del Proyecto**
```
avance/
├── index.html              # Página principal
├── css/                    # Estilos
├── js/                     # JavaScript
├── pag/                    # Páginas HTML
└── assets/                 # Recursos
```

### **2. Navegación**
1. **Página Principal**: `index.html`
   - Menú de categorías
   - Enlaces a secciones

2. **Autenticación**:
   - **Registro**: `pag/register.html`
   - **Login**: `pag/login.html`
   - **Recuperación**: `pag/forgot-password.html`

3. **Catálogo**:
   - **Bebidas**: `pag/bebidas.html`
   - **Alimentos**: `pag/alimentos.html`
   - **Creación**: `pag/creacion_alimentos.html`

### **3. Funcionalidades de Formularios**

#### **Registro de Usuario**
1. Llenar todos los campos obligatorios
2. **Validación en tiempo real**:
   - Nombres: 2 palabras exactas
   - Email: formato válido
   - Contraseña: mínimo 6 caracteres
   - Confirmación: debe coincidir
3. **Procesamiento asíncrono**:
   - Verificación de username (callback)
   - Validación de código postal (promise)
   - Envío de formulario (async/await)

#### **Login de Usuario**
1. Ingresar email y contraseña
2. **Validación automática** de formato
3. **Autenticación asíncrona** con función híbrida

#### **Recuperación de Contraseña**
1. Ingresar email válido
2. **Envío asíncrono** de instrucciones
3. **Feedback visual** del proceso

### **4. Características Técnicas**

#### **Validación en Tiempo Real**
- ✅ **Al perder foco** (blur): Validación inmediata
- ✅ **Feedback visual**: Colores y mensajes
- ✅ **Confirmación de contraseña**: Comparación en vivo

#### **Estados de UI**
- ✅ **Loading**: Durante procesamiento
- ✅ **Success**: Operación exitosa
- ✅ **Error**: Manejo de errores
- ✅ **Warning**: Advertencias

#### **Mensajes Dinámicos**
- ✅ **Animaciones**: Entrada y salida suaves
- ✅ **Posicionamiento**: Esquina superior derecha
- ✅ **Auto-eliminación**: Después de 4 segundos
- ✅ **Colores contextuales**: Success, error, info, warning

### **5. Desarrollo y Mantenimiento**

#### **Agregar Nueva Validación**
```javascript
// En validations.js
export const nuevaValidacion = (valor) => {
  // Lógica de validación
  return { isValid: boolean, errorMessage: string };
};
```

#### **Agregar Nueva Función Asíncrona**
```javascript
// En async-handlers.js
export const nuevaFuncionAsync = async (datos) => {
  try {
    // Operación asíncrona
    return resultado;
  } catch (error) {
    throw error;
  }
};
```

#### **Integrar en Formulario**
```javascript
// En app.js
const procesarNuevoFormulario = async (datos) => {
  // Validaciones
  // Operaciones asíncronas
  // Manejo de errores
};
```

---

-
## 📞 Soporte y Contacto

Para dudas sobre el proyecto o implementación de nuevas funcionalidades, revisar la documentación en el código fuente o consultar los comentarios en cada archivo JavaScript.


