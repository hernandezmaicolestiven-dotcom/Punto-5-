/**
 * Interfaz para el repositorio de inventario
 * En JavaScript usamos JSDoc para documentar el contrato
 */
class IInventoryRepository {
  /**
   * Obtiene el stock disponible de un producto
   * @param {number} productId - ID del producto
   * @returns {Promise<number>} Stock disponible
   */
  async getStock(productId) {
    throw new Error('Método no implementado');
  }

  /**
   * Reduce el stock de un producto
   * @param {number} productId - ID del producto
   * @param {number} quantity - Cantidad a reducir
   * @returns {Promise<void>}
   */
  async decreaseStock(productId, quantity) {
    throw new Error('Método no implementado');
  }
}

module.exports = IInventoryRepository;
