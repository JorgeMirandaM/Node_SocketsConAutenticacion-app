
const miFormulario = document.querySelector('form');

const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'https://node-restserver-app.onrender.com/api/auth';


miFormulario.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {};

    for (let el of miFormulario.elements) {
        if (el.name.length > 0) {
            formData[el.name] = el.value;
        }
    }

    fetch(url + 'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(resp => resp.json())
    .then(({msg,token})=> {
        if(msg){
            return console.log(msg);
        }

        localStorage.setItem('token',token);
        window.location='chat.html';
    })
    .catch(err =>{
        console.log(err);
    })

});


function onSignIn(response) {


    const data = { id_token: response.credential };

    fetch(url + 'google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(resp => resp.json())
        .then(resp => {
            localStorage.setItem('email', resp.usuario.correo);
            localStorage.setItem('token', resp.token);
            window.location='chat.html';
        })
        .catch(console.warn)


}


function signOut() {

    google.accounts.id.disableAutoSelect();

    google.accounts.id.revoke(localStorage.getItem('email'), done => {
        localStorage.clear();
        location.reload();
    });
}