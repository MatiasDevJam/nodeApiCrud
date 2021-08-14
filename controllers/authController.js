const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');

const Usuario = require("../models/usuario");


const login = async(req, res) => {

    const { correo, password } = req.body;

    try {

        //Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if ( !usuario ){
            return res.status(400).json({
                msg: 'Usuario / Contraseña incorectos'
            });
        }

        //Si el usuario esta activo
        if ( !usuario.estado ){
            return res.status(400).json({
                msg: 'Usuario / Contraseña incorectos'
            });
        }

        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if( !validPassword ){
            return res.status(400).json({
                msg: 'Usuario / Contraseña incorectos'
            });
        }

        //Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario, 
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Contactese con el administrador'
        })

    }


}

module.exports = {
    login
}