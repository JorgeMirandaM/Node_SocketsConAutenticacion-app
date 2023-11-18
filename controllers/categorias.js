const { response } = require("express");
const { Categoria } = require('../models');



const obtenerCategorias = async (req, res = response) => {

    try {
        const { limite = 5, desde = 0 } = req.query;

        const query = { estado: true };

        const [total, categorias] = await Promise.all([
            Categoria.countDocuments(query),
            Categoria.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
                .populate('usuario','nombre')
        ]);
        res.json({
            msg: 'get API - controlador',
            total,
            categorias
        })



    } catch (error) {
        console.log(error)
        res.status(400).json({
            msg: 'Ocurrio un error'
        })
    }
}


const obtenerCategoria = async (req, res = response) => {

    const { id } = req.params;

    try {

        const categoria = await Categoria.findById(id).populate('usuario','nombre');

        res.json({
            msg: 'ok',
            categoria
        })

    } catch (error) {

        console.log(error);
        res.status(400).json({
            msg: 'Ocurrio un error'
        })
    }
}


const crearCategoria = async (req, res = response) => {

    try {
        const nombre = req.body.nombre.toUpperCase();

        const categoriaDB = await Categoria.findOne({ nombre });

        if (categoriaDB) {
            return res.status(400).json({
                msg: `La categoria ${categoriaDB.nombre}, ya existe`
            })
        }

        //Generar la dat a guardar
        const data = {
            nombre,
            usuario: req.usuario._id,
            estado: true
        }

        const categoria = new Categoria(data);

        // Guardar DB
        await categoria.save();

        res.status(201).json(categoria);

    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'error'
        })
    }

}

// actualizarCategoria

const actualizarCategoria = async (req, res = response) => {

    const { id } = req.params;
    const {estado,usuario,...data}= req.body;


    try {

         data.nombre = data.nombre.toUpperCase();
         data.usuario= req.usuario._id;

         const nombre=data.nombre;

        const categoriaDB = await Categoria.findOne({ nombre });

        if (categoriaDB) {
            return res.status(400).json({
                msg: `La categoria ${categoriaDB.nombre}, ya existe`
            })
        }


        const categoria = await Categoria.findByIdAndUpdate(id, data, {new:true});

        res.json({
            msg: 'put API - controlador',
            categoria
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({

            msg: 'Ocurrio un mensaje'
        })
    }
}

const borrarCategoria = async (req, res = response) => {

    const { id } = req.params;



    try {
        const categoria = await Categoria.findByIdAndUpdate(id, { estado: false },{new:true});

        res.json({
            msg: 'delete API - controlador',
            categoria,
        })


    } catch (error) {
        console.log(error)
        res.status(400).json({
            msg: 'Ocurrio un error'
        })
    }
}


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,

    actualizarCategoria,
    borrarCategoria
}
