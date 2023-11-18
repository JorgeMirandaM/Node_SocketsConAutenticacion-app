const { Router}= require('express');

const {check,query}=require('express-validator');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');
const {  obtenerProducto, obtenerProductos, crearProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');


const router= Router();


router.get('/',[
    query('limite', 'El valor de limite debe ser numérico').isNumeric().optional(),
    query('desde', 'El valor de desde debe ser numérico').isNumeric().optional(),
    validarCampos,
],obtenerProductos);

router.get('/:id',[
    check('id','No es un ID válido').isMongoId(),
    check('id').custom((id)=>existeProductoPorId(id)),
    validarCampos
],obtenerProducto)

router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    query('precio','El valor de precio debe ser númerico').isNumeric().optional(),
    check('categoria','No es un id de Mongo').isMongoId(),
    check('categoria').custom((categoria) => existeCategoriaPorId(categoria)),
    validarCampos
],crearProducto);

router.put('/:id',[
    validarJWT,
    check('id', 'No es un id de Mongo').isMongoId(),
    check('id').custom((id)=>existeProductoPorId(id)),
    validarCampos
],actualizarProducto);



router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo').isMongoId(),
    check('id').custom((id)=>existeProductoPorId(id)),
    validarCampos
],borrarProducto);

module.exports= router;
 
