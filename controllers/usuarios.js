const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;

    const query = { estado: true };


    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        msg: 'get API - controlador',
        total,
        usuarios
    })
}

const usuariosPost = async (req, res = response) => {



    try {
        const { nombre, correo, password, rol } = req.body;

        const usuario = new Usuario({ nombre, correo, password, rol });


        //Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(password, salt);

        await usuario.save();


        res.json({
            msg: 'post API - controlador',
            usuario
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'Hubo un error'
        })
    }
}


const usuariosPut = async (req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    if (password) {
        //Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);


    res.json({
        msg: 'put API - controlador',
        usuario
    })
}


const usuariosPatch = (req, res = response) => {

    res.json({
        msg: 'patch API - controlador'
    })
}


const usuariosDelete = async (req, res = response) => {

    const { id } = req.params;

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.json({
        msg: 'delete API - controlador',
        usuario,
    })
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete

}