/**
 * Interfaz para el servicio de notificaciones
 */
class INotificationService {
  /**
   * Envía una confirmación de orden al usuario
   * @param {number} userId - ID del usuario
   * @param {string} orderId - ID de la orden
   * @returns {Promise<void>}
   */
  async sendConfirmation(userId, orderId) {
    throw new Error('Método no implementado');
  }
}

module.exports = INotificationService;
