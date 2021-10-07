const { Pool } = require('pg');

const config = {
    user: "postgres",
    host: "localhost",
    password: "",
    database: "bancosolar",
    port: 5432,
};

const pool = new Pool(config);

//Función para AGREGAR canciones a la base de datos
const agregar = async(datos) => {
    let result;

    try {
        const numero = await pool.query('select count(*) from usuarios');
        const id = (parseInt(numero.rows[0].count) + 1);
        const result = await pool.query(`insert into usuarios values (${id}, $1, $2) returning *`, datos);
        //console.log(typeof datos[1]);
    } catch (error) {
        console.log(error);
    }

    return result;
};

//Función para OBTENER USUARIOS de la base de datos
const consultar = async() =>{
    let result;

    try {
        result = await pool.query('select * from usuarios');
    } catch (error) {
        console.log(error);
    }

    return result;
}

//Función para EDITAR USUARIOS de la base de datos
const editar = async(id, datos) =>{
    let result;

    try {
        result = await pool.query(`update usuarios set nombre = $1, balance = $2 where id = ${id} returning *`, datos);
    } catch (error) {
        console.log(error);
    }

    return result;
}

//Función para ELIMINAR USUARIO de la base de datos
const eliminar = async(id) =>{
    let result;
    try {
        result = await pool.query(`delete from usuarios where id = ${id}`);
    } catch (error) {
        console.log(error);
    }
    return result;
}

//Función para AGREGAR canciones a la base de datos
const agregarTransferencia = async(datos) => {
    let result;
    //console.log('datos en bd', typeof datos[1]);
    let emisorID = await pool.query(`select id from usuarios where nombre = '${datos[0]}'`);
    let receptorID = await pool.query(`select id from usuarios where nombre = '${datos[1]}'`);

    try {
        await pool.query('begin');

        //console.log(emisorID.rows[0].id);
        //console.log(receptorID.rows[0].id);

        const descontar = `update usuarios set balance = balance - ${datos[2]} where id = ${emisorID.rows[0].id} RETURNING *`;
        const descuento = await pool.query(descontar);

        const acreditar = `update usuarios set balance = balance + ${datos[2]} where id = ${receptorID.rows[0].id} RETURNING *`;
        const acreditacion = await pool.query(acreditar);

        console.log(`Descuento realizado con éxito: ${descuento}`);
        console.log(`Acreditación realizada con éxito: ${acreditacion}`);

        const numero = await pool.query('select count(*) from transferencias');
        const id = (parseInt(numero.rows[0].count) + 1);
    
        await pool.query('COMMIT');

        result = await pool.query(`insert into transferencias values(${id}, ${emisorID.rows[0].id}, ${receptorID.rows[0].id}, ${datos[2]})`);
        
    } catch (error) {
        await pool.query('ROLLBACK');
        console.log(error);
    }
    
    return result;
};

//Función para OBTENER TRANSFERENCIAS de la base de datos
const getTransferencias = async() => {
    let result;
    try {
        result = await pool.query('select * from transferencias');
        //console.log(result.rows);
    } catch (error) {
        console.log(error);
    }
    return result;
};



module.exports = { agregar, consultar, editar, eliminar, agregarTransferencia, getTransferencias };