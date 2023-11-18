const { Router } = require('express');
const { check, query } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, tieneRole, esAdminRole } = require('../middlewares');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');


const router = Router();

//Obtener todas las categorías - publico
router.get('/',[
    query('limite','El valor de limite debe ser númerico').isNumeric().optional(),
    query('desde','El valor de desde debe ser numérico').isNumeric().optional(),
    validarCampos,
], obtenerCategorias);

// Obtener una categoría por id - publico
router.get('/:id',[
    check('id','No es un id de Mongo válido').isMongoId(),
    check('id').custom((id)=>existeCategoriaPorId(id)),
    validarCampos
],obtenerCategoria );

// Crear categoría - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

// Actualizar - privado - cualquier con un token válido
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom((id)=>existeCategoriaPorId(id)),
    validarCampos
],actualizarCategoria);

//Borrar una categoría - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom((id) => existeCategoriaPorId(id)),
    validarCampos
], borrarCategoria);

module.exports = router;