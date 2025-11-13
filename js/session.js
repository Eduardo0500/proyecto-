// ========================================================
// GESTIÓN DE SESIÓN DE USUARIO - ES6+
// ========================================================

// Guardar sesión de usuario
export const saveUserSession = (userData) => {
  try {
    const sessionData = {
      ...userData,
      loginTime: new Date().toISOString(),
      isActive: true
    };
    sessionStorage.setItem('userSession', JSON.stringify(sessionData));
    localStorage.setItem('userSession', JSON.stringify(sessionData)); // También en localStorage para persistencia
    return true;
  } catch (error) {
    console.error('Error al guardar sesión:', error);
    return false;
  }
};

// Obtener sesión de usuario
export const getUserSession = () => {
  try {
    // Intentar obtener de sessionStorage primero
    let sessionData = sessionStorage.getItem('userSession');
    if (!sessionData) {
      // Si no hay en sessionStorage, intentar localStorage
      sessionData = localStorage.getItem('userSession');
    }
    
    if (sessionData) {
      const user = JSON.parse(sessionData);
      return user.isActive ? user : null;
    }
    return null;
  } catch (error) {
    console.error('Error al obtener sesión:', error);
    return null;
  }
};

// Verificar si hay sesión activa
export const isUserLoggedIn = () => {
  const session = getUserSession();
  return session !== null && session.isActive === true;
};

// Cerrar sesión
export const logout = () => {
  try {
    sessionStorage.removeItem('userSession');
    localStorage.removeItem('userSession');
    return true;
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return false;
  }
};

// Obtener datos del usuario para checkout
export const getUserCheckoutData = () => {
  const session = getUserSession();
  if (session) {
    return {
      nombre: session.nombre || session.email?.split('@')[0] || '',
      email: session.email || '',
      telefono: session.telefono || '',
      direccion: session.direccion || ''
    };
  }
  return null;
};

