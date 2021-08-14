const { reponse } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const usuariosGet = async (req, res) => {

    const { limite = 5, desde = 0 } = req.query

    //Permite ocultar los usuarios borrados
    const query = { estado: true };

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(+desde)
            .limit(+limite)

    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async (req, res) => {


    const { nombre, correo, password, rol } = req.body
    const usuario = new Usuario({ nombre, correo, password, rol });



    //Encriptar la contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    //Guardar en DB
    await usuario.save();


    res.json({
        msg: 'post API',
        usuario
    });
}

const usuariosPut = async (req, res) => {
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    //TODO validar contraseña base de datos
    if (password) {
        //Encriptar la contraseña
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
}

const usuariosDelete = async(req, res) => {

    const { id } = req.params;

    //De esta manera cambiamos el estado del registro y lo ocultamos
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false }); 

    res.json( usuario );
}

const usuariosPath = (req, res) => {
    res.json({
        msg: 'patch API'
    });
}



module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPath
}