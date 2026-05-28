# ✅ Ejercicio 6 - API de Contactos Avanzada - COMPLETADO

## 📊 Resultados

- **38 tests pasando** (5 del Ejercicio 5 + 33 del Ejercicio 6)
- **Cobertura: 95.19%** en statements
- **0 errores**

## 🎯 Mejoras Implementadas

### A. Validación de Email con Regex (6 tests)
✅ Regex robusta: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Rechaza: "@", "usuario@", "@dominio.com", "sin-arroba"
- Acepta: "usuario@dominio.com"
- Mensajes de error descriptivos

### B. Deduplicación de Emails - 409 Conflict (4 tests)
✅ Detecta emails duplicados (case-insensitive)
- Código HTTP 409 (no 400)
- No crea contactos duplicados
- Compara emails en minúsculas

### C. Búsqueda y Filtros con Query Params (7 tests)
✅ `?search=texto` - Busca en nombre y email
✅ `?favorite=true` - Filtra favoritos
- Búsqueda case-insensitive
- Devuelve array vacío (no 404) cuando no hay resultados
- Combinación de filtros

### D. Toggle de Favorito - PATCH (5 tests)
✅ `PATCH /api/contacts/:id/favorite`
- Alterna el estado: false → true → false
- Persiste el cambio en memoria
- Maneja IDs inexistentes con 404

### E. PUT Mejorado con Validación (5 tests)
✅ Actualización parcial de campos
- Valida formato de email en actualización
- Detecta duplicados (409)
- Permite actualizar con el mismo email (200)

### F. Middleware de Error Centralizado (3 tests)
✅ Rutas inexistentes devuelven JSON (no HTML)
✅ Formato consistente: `{ status: 404, error: "mensaje" }`
- Content-Type: application/json
- Códigos HTTP semánticos

## 📁 Archivos Creados/Modificados

### Nuevos
- ✅ `src/app.js` - API completa con Express
- ✅ `src/__tests__/app.test.js` - 33 tests del Ejercicio 6

### Modificados
- ✅ `package.json` - Agregado express y supertest
- ✅ `README.md` - Documentación actualizada

## 🔗 Repositorio

**URL:** https://github.com/hernandezmaicolestiven-dotcom/Punto-5-.git

**Commits:**
1. `a0bc521` - Ejercicio 5 (OrderService con mocks)
2. `d7a54d4` - Ejercicio 6 (API de Contactos Avanzada)

## 🧪 Ejecutar Tests

```bash
# Todos los tests
npm test

# Con cobertura
npm run test:coverage

# Modo verbose
npm test -- --verbose
```

## 📋 Tabla de Rutas - API Completa

| Método | Ruta | Descripción | Códigos |
|--------|------|-------------|---------|
| GET | `/api/contacts` | Lista con búsqueda y filtros | 200 |
| GET | `/api/contacts/:id` | Contacto por ID | 200, 404 |
| POST | `/api/contacts` | Crear contacto | 201, 400, 409 |
| PUT | `/api/contacts/:id` | Actualizar parcial | 200, 400, 404, 409 |
| PATCH | `/api/contacts/:id/favorite` | Toggle favorito | 200, 404 |
| DELETE | `/api/contacts/:id` | Eliminar contacto | 200, 404 |
| * | `/ruta-inexistente` | Middleware 404 | 404 JSON |

## ✅ Requisitos Cumplidos

- [x] Validación de email con regex
- [x] Deduplicación con código 409
- [x] Búsqueda por nombre y email
- [x] Filtro de favoritos
- [x] Toggle de favorito con PATCH
- [x] PUT con validación mejorada
- [x] Middleware de error centralizado
- [x] Todos los tests pasando
- [x] Cobertura > 95%
- [x] Subido a GitHub

## 🎓 Conceptos Aplicados

- **Patrón AAA** en todos los tests
- **Códigos HTTP semánticos** (400, 404, 409)
- **Middleware de Express** para manejo de errores
- **Query params** para búsqueda y filtros
- **Aislamiento de tests** con `resetContacts()`
- **Supertest** para tests de API REST
- **Validación robusta** con regex
- **Case-insensitive** en búsquedas y duplicados

---

**Estado:** ✅ COMPLETADO Y SUBIDO A GITHUB
