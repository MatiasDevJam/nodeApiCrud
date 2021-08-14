const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, esAdminRole, tieneRole } = require('../middlewares');

const { esRolValido, emailValido, existeUsuarioPorId } = require('../helpers/db-validators');

const { usuariosGet, usuariosPut,
    usuariosPost, usuariosDelete,
    usuariosPath } = require('../controllers/usuariosController');


const router = Router();

router.get('/', usuariosGet)

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser de más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(emailValido),
    //check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(esRolValido),
    validarCampos
], usuariosPost)

router.put('/:id', [
    check('id', "No es un ID válido").isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRolValido),
    validarCampos
]
    , usuariosPut)

router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    tieneRole( 'ADMIN_ROLE', 'VENTAS_ROLE' ),
    check('id', "No es un ID válido").isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
],
    usuariosDelete)

router.patch('/', usuariosPath)


module.exports = router;