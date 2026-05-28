# Ejercicio 5 - OrderService con Mocks

Implementación del ejercicio 5 de la guía de Unit Testing: OrderService con dependencias mockeadas.

## Estructura del proyecto

```
src/
├── IInventoryRepository.js      # Interfaz del repositorio de inventario
├── INotificationService.js      # Interfaz del servicio de notificaciones
├── InsufficientStockError.js    # Error personalizado
├── OrderService.js              # Servicio principal (código a probar)
└── __tests__/
    └── OrderService.test.js     # Tests unitarios con mocks
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

1. ✅ `placeOrder_ValidOrder_DecreasesStockAndSendsNotification` - Orden válida procesa correctamente
2. ✅ `placeOrder_InsufficientStock_ThrowsException` - Lanza excepción cuando no hay stock suficiente
3. ✅ `placeOrder_InvalidQuantity_ThrowsException` - Lanza excepción con cantidad inválida (≤0)
4. ✅ `placeOrder_OnSuccess_NotificationServiceCalledOnce` - Verifica que la notificación se envía una sola vez
5. ✅ `placeOrder_ExactStock_ProcessesSuccessfully` - Caso borde: cantidad exacta al stock disponible

## Conceptos aplicados

- **Mocks**: Objetos falsos que reemplazan dependencias reales
- **Patrón AAA**: Arrange → Act → Assert en cada test
- **Aislamiento**: Los tests no dependen de implementaciones reales
- **Verificación de interacciones**: Comprobamos que los métodos se llaman correctamente
