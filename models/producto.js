

const {Schema,model}=require('mongoose');

const ProductoSchema=Schema({
    nombre:{
        type:String,
        required:[true,'El nombre es obligatorio'],
        unique:true
    },
    estado:{
        type:Boolean,
        dafault:true,
        required:true
    },
    usuario:{
        type:Schema.Types.ObjectId,
        ref:'Usuario',
        required:true
    },
    precio:{
        type:Number,
        default:0
    },
    categoria:{
        type:Schema.Types.ObjectId,
        ref:'Categoria',
        required:true
    },
    descripcion:{
        type:String
    },
    disponible:{
        type:Boolean,
        default:true
    },
    img:{
        type:String
    }
});


ProductoSchema.methods.toJSON= function(){
    const {__v,estado,...categoria}= this.toObject();
    return categoria;
}

module.exports=model('Producto',ProductoSchema);