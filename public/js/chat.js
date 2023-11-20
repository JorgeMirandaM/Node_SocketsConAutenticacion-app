
const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'https://node-restserver-app.onrender.com/api/auth';


let usuario = null;
let socket = null;

const txtUid= document.querySelector('#txtUid');
const txtMensajes= document.querySelector('#txtMensajes');
const ulUsuarios= document.querySelector('#ulUsuarios');
const ulMensajes= document.querySelector('#ulMensajes');
const btnSalir= document.querySelector('#btnSalir');


//Validar el token del localstorage
const validarJWT = async () => {

    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp= await fetch(url, {
        headers:{'x-token':token}
    });

    const {usuario:userDB,token:tokenDB}=await resp.json();

    console.log(userDB,tokenDB)

    localStorage.setItem('token',tokenDB);
    usuario=userDB;
    document.title=usuario.nombre;
    await conectarSocket();


}

const conectarSocket= async ()=>{

    socket=io({
        'extraHeaders':{
            'x-token':localStorage.getItem('token')
        }
    });

    socket.on('connect',()=>{
        console.log('Sockets online');
    });

    socket.on('disconnect',()=>{
        console.log('Sockets offline');
    });

    socket.on('recibir-mensajes',()=>{

    });

    socket.on('usuarios-activos',(payload)=>{
        dibujarUsuarios(payload);
    });

    socket.on('mensaje-privado',()=>{

    });
}

const dibujarUsuarios =(usuarios=[])=>{
    
    let usersHTML='';
    usuarios.forEach(({nombre,uid})=>{
        usersHTML +=`
            <li>
                <p>
                    <h5 class="text-success">${nombre}</h5>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `
    });

    ulUsuarios.innerHTML= usersHTML;
}

const main = async () => {

    // Validar JWT
    await validarJWT();

}


main();