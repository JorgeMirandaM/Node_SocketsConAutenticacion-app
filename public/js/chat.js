
const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'https://node-restserver-app.onrender.com/api/auth';


let usuario = null;
let socket = null;

let arrayMsgPriv = [];

const txtUid= document.querySelector('#textUid');
const txtMensajes= document.querySelector('#txtMensajes');
const textMensaje=document.querySelector('#textMensaje');
const ulUsuarios= document.querySelector('#ulUsuarios');
const ulMensajes= document.querySelector('#ulMensajes');
const btnSalir= document.querySelector('#btnSalir');
const ulChatsPivados = document.querySelector('#ulChatsPivados');


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

    socket.on('recibir-mensajes',(payload)=>{
        dibujarMensajes(payload);
    });

    socket.on('usuarios-activos',(payload)=>{
        dibujarUsuarios(payload);
    });

    socket.on('mensaje-privado',(payload)=>{
        dibujarMensajesPrivados(payload);
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


const dibujarMensajes =(mensajes=[])=>{
    
    let mensajesHTML='';
    mensajes.forEach(({nombre,mensaje})=>{
        mensajesHTML +=`
            <li>
                <p>
                    <span class="text-primary">${nombre}</span>
                    <span>${mensaje}</span>
                </p>
            </li>
        `
    });

    ulMensajes.innerHTML= mensajesHTML;
}

const dibujarMensajesPrivados=(mensajes)=>{

    let mensajesHtml='';

    arrayMsgPriv.unshift(mensajes);

    arrayMsgPriv.forEach(({ de, mensaje }) => {
        mensajesHtml += `
            <p class="m-3 msgdynamic">
                <span>De <span class="text-primary">${de}</span> para 

                <br/>

                <p class="bg-primary bg-opacity-25 msg">${mensaje}</p>
            </p>
            <hr/>
        `;
    })


    ulChatsPivados.innerHTML = mensajesHtml;


}


textMensaje.addEventListener('keyup',({keyCode})=>{
    const mensaje= textMensaje.value;
    const uid=txtUid?.value;

    if(keyCode !==13){return ;};
    if(mensaje.length ===0){return;}

    socket.emit('enviar-mensaje',{mensaje,uid});

    textMensaje.value='';
    txtUid.value='';
})

btnSalir.addEventListener('click',()=>{
    localStorage.clear();
    location.reload();
})

const main = async () => {

    // Validar JWT
    await validarJWT();

}


main();