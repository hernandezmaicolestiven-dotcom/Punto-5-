/**
 * Error personalizado para stock insuficiente
 */
class InsufficientStockError extends Error {
  constructor(productId, requested, available) {
    super(`Stock insuficiente para el producto ${productId}. Solicitado: ${requested}, Disponible: ${available}`);
    this.name = 'InsufficientStockError';
    this.productId = productId;
    this.requested = requested;
    this.available = available;
  }
}

module.exports = InsufficientStockError;
