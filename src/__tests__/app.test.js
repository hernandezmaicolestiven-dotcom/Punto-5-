const request = require('supertest');
const { app, resetContacts } = require('../app');

describe('API de Contactos Avanzada - Ejercicio 6', () => {

  beforeEach(() => {
    resetContacts();
  });

  // ═══════════════════════════════════════════════════════════════════════
  // A. VALIDACIÓN DE EMAIL CON REGEX
  // ═══════════════════════════════════════════════════════════════════════
  describe('A. Validación de email', () => {

    it('devuelve 400 cuando el email es "@" (sin usuario ni dominio)', async () => {
      const res = await request(app)
        .post('/api/contacts')
        .send({ name: 'Test', email: '@' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/email/i);
    });

    it('devuelve 400 cuando el email es "usuario@" (sin dominio)', async () => {
      const res = await request(app)
        .post('/api/contacts')
        .send({ name: 'Test', email: 'usuario@' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/email/i);
    });

    it('devuelve 400 cuando el email es "@dominio.com" (sin usuario)', async () => {
      const res = await request(app)
        .post('/api/contacts')
        .send({ name: 'Test', email: '@dominio.com' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/email/i);
    });

    it('devuelve 400 cuando el email es "sin-arroba"', async () => {
      const res = await request(app)
        .post('/api/contacts')
        .send({ name: 'Test', email: 'sin-arroba' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/email/i);
    });

    it('devuelve 201 cuando el email tiene formato válido "usuario@dominio.com"', async () => {
      const res = await request(app)
        .post('/api/contacts')
        .send({ name: 'Test', email: 'usuario@dominio.com' });

      expect(res.status).toBe(201);
      expect(res.body.email).toBe('usuario@dominio.com');
    });

    it('el mensaje de error contiene la palabra "email"', async () => {
      const res = await request(app)
        .post('/api/contacts')
        .send({ name: 'Test', email: 'invalido' });

      expect(res.body.error).toMatch(/email/i);
    });

  });

  // ═══════════════════════════════════════════════════════════════════════
  // B. DEDUPLICACIÓN DE EMAILS (409 CONFLICT)
  // ═══════════════════════════════════════════════════════════════════════
  describe('B. Deduplicación de emails', () => {

    it('crear un contacto con un email ya existente devuelve 409', async () => {
      const res = await request(app)
        .post('/api/contacts')
        .send({ name: 'Duplicado', email: 'ana@example.com' });

      expect(res.status).toBe(409);
    });

    it('el body del 409 tiene el campo error con un mensaje descriptivo', async () => {
      const res = await request(app)
        .post('/api/contacts')
        .send({ name: 'Duplicado', email: 'ana@example.com' });

      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toMatch(/ya existe/i);
    });

    it('crear con email en mayúsculas cuando ya existe en minúsculas devuelve 409 (case-insensitive)', async () => {
      const res = await request(app)
        .post('/api/contacts')
        .send({ name: 'Duplicado', email: 'ANA@EXAMPLE.COM' });

      expect(res.status).toBe(409);
    });

    it('después de recibir un 409, el número total de contactos no aumentó', async () => {
      // Intentar crear duplicado
      await request(app)
        .post('/api/contacts')
        .send({ name: 'Duplicado', email: 'ana@example.com' });

      // Verificar que sigue habiendo solo 3 contactos
      const listRes = await request(app).get('/api/contacts');
      expect(listRes.body).toHaveLength(3);
    });

  });

  // ═══════════════════════════════════════════════════════════════════════
  // C. BÚSQUEDA Y FILTROS (QUERY PARAMS)
  // ═══════════════════════════════════════════════════════════════════════
  describe('C. Búsqueda y filtros', () => {

    it('?search=ana devuelve solo contactos cuyo nombre o email contiene "ana"', async () => {
      const res = await request(app)
        .get('/api/contacts')
        .query({ search: 'ana' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].name).toBe('Ana García');
    });

    it('?search=ANA (mayúsculas) devuelve los mismos resultados (case-insensitive)', async () => {
      const res = await request(app)
        .get('/api/contacts')
        .query({ search: 'ANA' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].name).toBe('Ana García');
    });

    it('?search=example filtra por email y devuelve todos los que tienen "@example.com"', async () => {
      const res = await request(app)
        .get('/api/contacts')
        .query({ search: 'example' });

      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(3);
      expect(res.body.every(c => c.email.includes('example'))).toBe(true);
    });

    it('?search=xyznoexiste devuelve un array vacío (no un 404)', async () => {
      const res = await request(app)
        .get('/api/contacts')
        .query({ search: 'xyznoexiste' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('?favorite=true devuelve solo contactos con favorite: true', async () => {
      const res = await request(app)
        .get('/api/contacts')
        .query({ favorite: 'true' });

      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body.every(c => c.favorite === true)).toBe(true);
    });

    it('?favorite=true con datos iniciales devuelve solo a Luis', async () => {
      const res = await request(app)
        .get('/api/contacts')
        .query({ favorite: 'true' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].name).toBe('Luis Pérez');
    });

    it('sin query params devuelve todos los contactos (comportamiento original)', async () => {
      const res = await request(app).get('/api/contacts');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(3);
    });

  });

  // ═══════════════════════════════════════════════════════════════════════
  // D. TOGGLE DE FAVORITO (PATCH)
  // ═══════════════════════════════════════════════════════════════════════
  describe('D. Toggle de favorito', () => {

    it('llamar PATCH en Ana (favorite: false) devuelve el contacto con favorite: true', async () => {
      const res = await request(app).patch('/api/contacts/1/favorite');

      expect(res.status).toBe(200);
      expect(res.body.favorite).toBe(true);
    });

    it('llamarlo dos veces sobre el mismo contacto regresa a favorite: false (toggle completo)', async () => {
      // Primera llamada: false → true
      await request(app).patch('/api/contacts/1/favorite');

      // Segunda llamada: true → false
      const res = await request(app).patch('/api/contacts/1/favorite');

      expect(res.status).toBe(200);
      expect(res.body.favorite).toBe(false);
    });

    it('llamarlo en Luis (que inicia con favorite: true) devuelve favorite: false', async () => {
      const res = await request(app).patch('/api/contacts/2/favorite');

      expect(res.status).toBe(200);
      expect(res.body.favorite).toBe(false);
    });

    it('devuelve 404 para un ID inexistente', async () => {
      const res = await request(app).patch('/api/contacts/9999/favorite');

      expect(res.status).toBe(404);
    });

    it('después del toggle, un GET refleja el cambio persistido', async () => {
      // Hacer el toggle
      await request(app).patch('/api/contacts/1/favorite');

      // Verificar con GET independiente
      const res = await request(app).get('/api/contacts/1');

      expect(res.status).toBe(200);
      expect(res.body.favorite).toBe(true);
    });

  });

  // ═══════════════════════════════════════════════════════════════════════
  // E. PUT MEJORADO (VALIDACIÓN Y DUPLICADOS EN ACTUALIZACIÓN)
  // ═══════════════════════════════════════════════════════════════════════
  describe('E. PUT mejorado', () => {

    it('actualizar solo el name devuelve 200 y el contacto con el nombre cambiado', async () => {
      const res = await request(app)
        .put('/api/contacts/1')
        .send({ name: 'Ana Modificada' });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Ana Modificada');
    });

    it('intentar actualizar con un email de formato inválido devuelve 400', async () => {
      const res = await request(app)
        .put('/api/contacts/1')
        .send({ email: 'email-invalido' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/email/i);
    });

    it('intentar actualizar con el email de otro contacto existente devuelve 409', async () => {
      const res = await request(app)
        .put('/api/contacts/1')
        .send({ email: 'luis@example.com' });

      expect(res.status).toBe(409);
    });

    it('actualizar el email con el mismo email del contacto actual devuelve 200 (no es duplicado)', async () => {
      const res = await request(app)
        .put('/api/contacts/1')
        .send({ email: 'ana@example.com' });

      expect(res.status).toBe(200);
      expect(res.body.email).toBe('ana@example.com');
    });

    it('actualizar un ID inexistente devuelve 404', async () => {
      const res = await request(app)
        .put('/api/contacts/9999')
        .send({ name: 'No existe' });

      expect(res.status).toBe(404);
    });

  });

  // ═══════════════════════════════════════════════════════════════════════
  // F. MIDDLEWARE DE ERROR (404 GENÉRICO Y FORMATO JSON)
  // ═══════════════════════════════════════════════════════════════════════
  describe('F. Middleware de error', () => {

    it('hacer GET a ruta inexistente devuelve 404 con Content-Type: application/json', async () => {
      const res = await request(app).get('/api/ruta-que-no-existe');

      expect(res.status).toBe(404);
      expect(res.headers['content-type']).toMatch(/json/);
    });

    it('la respuesta del 404 genérico tiene el campo error en el body (no HTML)', async () => {
      const res = await request(app).get('/no-existe');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
      expect(typeof res.body.error).toBe('string');
    });

    it('todos los errores de negocio tienen un campo status con el código HTTP', async () => {
      // Test 400
      const res400 = await request(app)
        .post('/api/contacts')
        .send({ name: 'Test', email: 'invalido' });
      expect(res400.body).toHaveProperty('status', 400);

      // Test 404
      const res404 = await request(app).get('/api/contacts/9999');
      expect(res404.body).toHaveProperty('status', 404);

      // Test 409
      const res409 = await request(app)
        .post('/api/contacts')
        .send({ name: 'Duplicado', email: 'ana@example.com' });
      expect(res409.body).toHaveProperty('status', 409);
    });

  });

  // ═══════════════════════════════════════════════════════════════════════
  // TESTS ADICIONALES - FUNCIONALIDAD BÁSICA (DEL EJERCICIO 5)
  // ═══════════════════════════════════════════════════════════════════════
  describe('Funcionalidad básica (Ejercicio 5)', () => {

    it('GET /api/contacts/:id devuelve un contacto específico', async () => {
      const res = await request(app).get('/api/contacts/1');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', 1);
      expect(res.body).toHaveProperty('name');
    });

    it('DELETE /api/contacts/:id elimina un contacto', async () => {
      const res = await request(app).delete('/api/contacts/1');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message');

      // Verificar que fue eliminado
      const getRes = await request(app).get('/api/contacts/1');
      expect(getRes.status).toBe(404);
    });

    it('DELETE con ID inexistente devuelve 404', async () => {
      const res = await request(app).delete('/api/contacts/9999');

      expect(res.status).toBe(404);
    });

  });

});
