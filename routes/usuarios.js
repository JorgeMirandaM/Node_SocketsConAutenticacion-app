const { Router } = require('express');
const { check, query } = require('express-validator');

const { usuariosGet, usuariosPost, usuariosPut, usuariosPatch, usuariosDelete } = require('../controllers/usuarios');

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const { validarCampos, validarJWT, tieneRole } = require('../middlewares')


const router = Router();


router.get('/', [
    query('limite', 'El valor de limite debe ser numérico').isNumeric().optional(),
    query('desde', 'El valor de desde debe ser numérico').isNumeric().optional(),
    validarCampos,
], usuariosGet);
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    // check('rol','No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom((rol) => esRoleValido(rol)),
    check('correo').custom((correo) => emailExiste(correo)),
    validarCampos
], usuariosPost),

    router.put('/:id', [
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom((id) => existeUsuarioPorId(id)),
        check('rol').custom(esRoleValido),
        validarCampos
    ], usuariosPut);
router.patch('/', usuariosPatch);
router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE', 'USER_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom((id) => existeUsuarioPorId(id)),
    validarCampos
], usuariosDelete);

module.exports = router;