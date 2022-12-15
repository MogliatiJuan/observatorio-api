const controller = {};




controller.CreateAudiencia = (req, res) => {
    res.render('audiencia_Create');
}



//API









//Formulario de Carga
controller.createpersona = (req, res) => {
    // res.send('Hola Mundo listar');
    res.render('audiencia_Create');
}
//Operaciones CRUD
controller.saveNewPerson = (req, res) => {
    // console.log(req.body);
    // res.send('Datos Recibidos');
    //Grabar los datos a la base de datos
    const data = req.body;
    console.log(data);
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO PERSONAS set ?', [data], (err, datoingresado) => {
            console.log(datoingresado);
            res.send('Se Agrego el Registro');
            console.log('Error Detectado: '.err);
        })
    })
}



//Paginas Generales


//Pagina Principal
controller.Home_Page = (req, res) => {
    res.render('Home_Page');
}

// QUERY TO DB TO FILL DATATABLES
controller.View_ListaPersonas = (req, res) => {
    res.render('Personas_Page');
};
controller.View_ListaLitigantes = (req, res) => {
    res.render('Litigantes_Page');
    console.log(' ');
    console.log('****************************************************************');
    console.log('***   Monitor Servidor : Lista de Litigantes');
    console.log('****************************************************************');
    console.log('***   ' + JSON.stringify(req.query));
    console.log('****************************************************************');
    console.log(' ');
}



controller.View_Litigantes_Docs = (req, res) => {
    res.render('Litigantes_Docs');
    console.log(' ');
    console.log('****************************************************************');
    console.log('***   Monitor Servidor : LLAMARON API Ver Documentos');
    console.log('****************************************************************');
    console.log('***   ' + JSON.stringify(req.query));
    console.log('****************************************************************');
    console.log(' ');
}










module.exports = controller;