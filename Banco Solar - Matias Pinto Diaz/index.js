const http = require('http');
const { release } = require('os');
const fs = require('fs');
const url = require('url');

//Archivos externos
const { agregar, consultar, editar, eliminar, agregarTransferencia, getTransferencias } = require('./bdBanco');

http.createServer( async(req, res) => {
    if (req.url == '/' && req.method == 'GET'){
        res.setHeader('content-type', 'text/html');
        const html = fs.readFileSync('index.html', 'utf8');
        res.end(html);
    }

    //Función para AGREGAR USUARIO a la bd
    if (req.url.startsWith('/usuario') && req.method == 'POST') {
        let body = '';

        req.on('data', (payload) => {
            body += payload;
            //body = JSON.parse(payload);
        });

        req.on('end', async() => {
            const datos = Object.values(JSON.parse(body));
            const respuesta = await agregar(datos);
            //console.log(typeof respuesta);
            res.end(JSON.stringify(respuesta));
        });

    }
    
    //Función para OBTENER USUARIOS del repertorio
    if (req.url.startsWith('/usuarios') && req.method == 'GET') {
        const registros = await consultar();
        res.end(JSON.stringify(registros));
    }

    //Función para EDITAR USUARIO de la bd
    if (req.url.startsWith('/usuario') && req.method == 'PUT') {
        let body = '';
        let params = url.parse(req.url, true).query;
        let id = params.id;

        req.on('data', (payload) => {
            body += payload;
            //body = JSON.parse(payload);
        });

        req.on('end', async() => {
            /*cancion = {
                cancion: body.cancion,
                artista: body.artista,
                tono: body.tono,
            };*/

            const datos = Object.values(JSON.parse(body));
            const respuesta = await editar(id, datos);
            //console.log(typeof respuesta);
            res.end(JSON.stringify(respuesta));
        });
    }

    //Función para ELIMINAR USUARIO de la bd
    if (req.url.startsWith('/usuario') && req.method == 'DELETE') {
        let params = url.parse(req.url, true).query;
        //console.log('Delete', params.id);

        const respuesta = await eliminar(params.id);
        //console.log(typeof respuesta);
        res.end(JSON.stringify(respuesta));
    }

    //Función para AGREGAR TRANSFERENCIA a la bd
    if (req.url.startsWith('/transferencia') && req.method == 'POST') {
        let body = '';

        req.on('data', (payload) => {
            body += payload;
            //body = JSON.parse(payload);
        });

        req.on('end', async() => {
            const datos = Object.values(JSON.parse(body));
            //console.log(datos);
            const respuesta = await agregarTransferencia(datos);
            //console.log(respuesta);

            res.end(JSON.stringify(respuesta)); 
        });

    }

    //Función para OBTENER TRANSFERENCIAS de la bd
    if (req.url.startsWith('/transferencias') && req.method == 'GET') {
        const registros = await getTransferencias();
        res.end(JSON.stringify(registros));
    }


}).listen(3000, () => console.log('Puerto 3000'));