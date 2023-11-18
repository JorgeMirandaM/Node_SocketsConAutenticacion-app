
const { Producto } = require('../models');

const obtenerProductos = async (req, res) => {

    try {

        const { limite = 5, desde = 0 } = req.query;

        const query = { estado: true };

        const [total, productos] = await Promise.all([
            Producto.countDocuments(query),
            Producto.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
                .populate('usuario', 'nombre')
                .populate('categoria', 'nombre')
        ]);
        res.json({
            msg: 'get API - controlador',
            total,
            productos
        })


    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'Ocurrio un error'
        })
    }
}


const obtenerProducto = async (req, res) => {

    const { id } = req.params;

    try {

        const producto = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria', 'nombre');

        res.json({
            msg: 'ok',
            producto
        })


    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'Ocurrio un error'
        })
    }


}

const crearProducto = async (req, res) => {

    const { estado, usuario, ...body } = req.body;

    try {

        const nombre = req.body.nombre.toUpperCase();

        const productoDB = await Producto.findOne({ nombre });

        if (productoDB) {
            return res.status(400).json({
                msg: `La categoria ${productoDB.nombre}, ya existe`
            })
        }

        //Generar la data a guardar
        const data = {
            ...body,
            nombre,
            usuario: req.usuario._id,
            estado: true
        }

        const producto = new Producto(data);

        // console.log(producto)

        // Guardar DB
        await producto.save();

        res.status(201).json(producto);

    } catch (error) {
        console.log(error);

        res.status(400).json({
            msg: 'Ocurrio un error'
        })

    }
}

const actualizarProducto = async (req, res) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;


    try {

        if (data.nombre) {
            data.nombre = data.nombre.toUpperCase();
            const nombre = data.nombre;
            const productoDB = await Producto.findOne({ nombre });

            if (productoDB) {
                return res.status(400).json({
                    msg: `La categoria ${productoDB.nombre}, ya existe`
                })
            }
        }
        data.usuario = req.usuario._id;

        const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

        res.json({
            msg: 'put API - controlador',
            producto
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({

            msg: 'Ocurrio un error'
        })
    }
}

const borrarProducto = async (req, res) => {

    const { id } = req.params;
    try {
        const productoBorrado = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });

        res.json({
            msg: 'delete API - controlador',
            productoBorrado,
        })


    } catch (error) {
        console.log(error)
        res.status(400).json({
            msg: 'Ocurrio un error'
        })
    }
}



module.exports = {
    obtenerProducto,
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    borrarProducto
}