const OrderService = require('../OrderService');
const InsufficientStockError = require('../InsufficientStockError');

// Mocks de las dependencias
const mockInventoryRepository = {
  getStock: jest.fn(),
  decreaseStock: jest.fn(),
};

const mockNotificationService = {
  sendConfirmation: jest.fn(),
};

describe('OrderService', () => {
  let orderService;

  beforeEach(() => {
    // Limpiar todos los mocks antes de cada test
    jest.clearAllMocks();
    
    // Crear una nueva instancia del servicio con los mocks
    orderService = new OrderService(mockInventoryRepository, mockNotificationService);
  });

  describe('placeOrder()', () => {
    
    it('placeOrder_ValidOrder_DecreasesStockAndSendsNotification', async () => {
      // Arrange
      const userId = 1;
      const productId = 100;
      const quantity = 5;
      const availableStock = 10;

      mockInventoryRepository.getStock.mockResolvedValue(availableStock);
      mockInventoryRepository.decreaseStock.mockResolvedValue();
      mockNotificationService.sendConfirmation.mockResolvedValue();

      // Act
      const order = await orderService.placeOrder(userId, productId, quantity);

      // Assert
      expect(order).toBeDefined();
      expect(order.userId).toBe(userId);
      expect(order.productId).toBe(productId);
      expect(order.quantity).toBe(quantity);
      expect(order.status).toBe('confirmed');
      expect(order.orderId).toBeDefined();

      // Verificar que se consultó el stock
      expect(mockInventoryRepository.getStock).toHaveBeenCalledWith(productId);
      expect(mockInventoryRepository.getStock).toHaveBeenCalledTimes(1);

      // Verificar que se redujo el stock
      expect(mockInventoryRepository.decreaseStock).toHaveBeenCalledWith(productId, quantity);
      expect(mockInventoryRepository.decreaseStock).toHaveBeenCalledTimes(1);

      // Verificar que se envió la notificación
      expect(mockNotificationService.sendConfirmation).toHaveBeenCalledWith(userId, order.orderId);
      expect(mockNotificationService.sendConfirmation).toHaveBeenCalledTimes(1);
    });

    it('placeOrder_InsufficientStock_ThrowsException', async () => {
      // Arrange
      const userId = 1;
      const productId = 100;
      const quantity = 15;
      const availableStock = 5;

      mockInventoryRepository.getStock.mockResolvedValue(availableStock);

      // Act & Assert
      await expect(
        orderService.placeOrder(userId, productId, quantity)
      ).rejects.toThrow(InsufficientStockError);

      await expect(
        orderService.placeOrder(userId, productId, quantity)
      ).rejects.toThrow(`Stock insuficiente para el producto ${productId}`);

      // Verificar que se consultó el stock
      expect(mockInventoryRepository.getStock).toHaveBeenCalledWith(productId);

      // Verificar que NO se redujo el stock
      expect(mockInventoryRepository.decreaseStock).not.toHaveBeenCalled();

      // Verificar que NO se envió notificación
      expect(mockNotificationService.sendConfirmation).not.toHaveBeenCalled();
    });

    it('placeOrder_InvalidQuantity_ThrowsException', async () => {
      // Arrange
      const userId = 1;
      const productId = 100;

      // Act & Assert - Cantidad cero
      await expect(
        orderService.placeOrder(userId, productId, 0)
      ).rejects.toThrow('La cantidad debe ser mayor a 0');

      // Act & Assert - Cantidad negativa
      await expect(
        orderService.placeOrder(userId, productId, -5)
      ).rejects.toThrow('La cantidad debe ser mayor a 0');

      // Verificar que NO se consultó el stock
      expect(mockInventoryRepository.getStock).not.toHaveBeenCalled();

      // Verificar que NO se redujo el stock
      expect(mockInventoryRepository.decreaseStock).not.toHaveBeenCalled();

      // Verificar que NO se envió notificación
      expect(mockNotificationService.sendConfirmation).not.toHaveBeenCalled();
    });

    it('placeOrder_OnSuccess_NotificationServiceCalledOnce', async () => {
      // Arrange
      const userId = 42;
      const productId = 200;
      const quantity = 3;

      mockInventoryRepository.getStock.mockResolvedValue(10);
      mockInventoryRepository.decreaseStock.mockResolvedValue();
      mockNotificationService.sendConfirmation.mockResolvedValue();

      // Act
      const order = await orderService.placeOrder(userId, productId, quantity);

      // Assert - Verificar que la notificación se llamó exactamente una vez
      expect(mockNotificationService.sendConfirmation).toHaveBeenCalledTimes(1);
      
      // Verificar que se llamó con los argumentos correctos
      expect(mockNotificationService.sendConfirmation).toHaveBeenCalledWith(
        userId,
        order.orderId
      );

      // Verificar que el orderId es válido
      expect(order.orderId).toMatch(/^ORD-/);
    });

    it('placeOrder_ExactStock_ProcessesSuccessfully', async () => {
      // Arrange - Caso borde: cantidad exacta al stock disponible
      const userId = 1;
      const productId = 100;
      const quantity = 7;
      const availableStock = 7; // Exactamente la misma cantidad

      mockInventoryRepository.getStock.mockResolvedValue(availableStock);
      mockInventoryRepository.decreaseStock.mockResolvedValue();
      mockNotificationService.sendConfirmation.mockResolvedValue();

      // Act
      const order = await orderService.placeOrder(userId, productId, quantity);

      // Assert
      expect(order.status).toBe('confirmed');
      expect(mockInventoryRepository.decreaseStock).toHaveBeenCalledWith(productId, quantity);
      expect(mockNotificationService.sendConfirmation).toHaveBeenCalledTimes(1);
    });

  });
});
