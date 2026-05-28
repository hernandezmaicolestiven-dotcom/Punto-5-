# Ejercicios 5 y 6 - Unit Testing Avanzado

Implementación de los ejercicios 5 y 6 de la guía de Unit Testing.

## Ejercicio 5 - OrderService con Mocks

OrderService con dependencias mockeadas usando Jest.

## Ejercicio 6 - API de Contactos Avanzada

API REST completa con Express, validaciones mejoradas, búsqueda, filtros y manejo de errores.

## Estructura del proyecto

```
src/
├── IInventoryRepository.js      # Interfaz del repositorio de inventario
├── INotificationService.js      # Interfaz del servicio de notificaciones
├── InsufficientStockError.js    # Error personalizado
├── OrderService.js              # Servicio principal (Ejercicio 5)
├── app.js                       # API de Contactos (Ejercicio 6)
└── __tests__/
    ├── OrderService.test.js     # Tests del Ejercicio 5
    └── app.test.js              # Tests del Ejercicio 6
```

## Instalación

```bash
npm install
```

## Ejecutar tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar con cobertura
npm run test:coverage
```

## Tests implementados

### Ejercicio 5 - OrderService (5 tests)

1. ✅ Orden válida procesa correctamente
2. ✅ Lanza excepción cuando no hay stock suficiente
3. ✅ Lanza excepción con cantidad inválida (≤0)
4. ✅ Verifica que la notificación se envía una sola vez
5. ✅ Caso borde: cantidad exacta al stock disponible

### Ejercicio 6 - API de Contactos (33 tests)

**A. Validación de email (6 tests)**
- Rechaza emails malformados: "@", "usuario@", "@dominio.com", "sin-arroba"
- Acepta emails válidos
- Mensajes de error descriptivos

**B. Deduplicación de emails (4 tests)**
- Detecta duplicados con código 409
- Deduplicación case-insensitive
- No crea contactos duplicados

**C. Búsqueda y filtros (7 tests)**
- Búsqueda por nombre y email
- Búsqueda case-insensitive
- Filtro de favoritos
- Combinación de filtros

**D. Toggle de favorito (5 tests)**
- Alterna el estado de favorito
- Persistencia del cambio
- Manejo de IDs inexistentes

**E. PUT mejorado (5 tests)**
- Actualización parcial de campos
- Validación de email en actualización
- Detección de duplicados en actualización

**F. Middleware de error (3 tests)**
- Rutas inexistentes devuelven JSON
- Formato consistente de errores
- Códigos HTTP correctos

**Funcionalidad básica (3 tests)**
- GET, DELETE y manejo de errores

## Conceptos aplicados

- **Mocks**: Objetos falsos que reemplazan dependencias reales
- **Patrón AAA**: Arrange → Act → Assert en cada test
- **Aislamiento**: Los tests no dependen de implementaciones reales
- **Verificación de interacciones**: Comprobamos que los métodos se llaman correctamente
- **API REST**: Endpoints con Express y Supertest
- **Validación robusta**: Regex de email y detección de duplicados
- **Códigos HTTP semánticos**: 400, 404, 409 según el tipo de error
- **Middleware de error**: Manejo centralizado de errores
