const InsufficientStockError = require('./InsufficientStockError');
const { v4: uuidv4 } = require('crypto');

/**
 * Servicio para gestionar órdenes
 */
class OrderService {
  constructor(inventoryRepository, notificationService) {
    this.inventoryRepository = inventoryRepository;
    this.notificationService = notificationService;
  }

  /**
   * Crea una orden de compra
   * @param {number} userId - ID del usuario
   * @param {number} productId - ID del producto
   * @param {number} quantity - Cantidad a ordenar
   * @returns {Promise<Object>} Objeto de orden creada
   */
  async placeOrder(userId, productId, quantity) {
    // Validar cantidad
    if (quantity <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }

    // Consultar stock disponible
    const availableStock = await this.inventoryRepository.getStock(productId);

    // Verificar si hay stock suficiente
    if (availableStock < quantity) {
      throw new InsufficientStockError(productId, quantity, availableStock);
    }

    // Reducir el stock
    await this.inventoryRepository.decreaseStock(productId, quantity);

    // Generar ID de orden
    const orderId = this.generateOrderId();

    // Enviar notificación
    await this.notificationService.sendConfirmation(userId, orderId);

    // Retornar objeto de orden
    return {
      orderId,
      userId,
      productId,
      quantity,
      status: 'confirmed'
    };
  }

  /**
   * Genera un ID único para la orden
   * @returns {string}
   */
  generateOrderId() {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

module.exports = OrderService;
