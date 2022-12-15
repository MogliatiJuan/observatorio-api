const controller = {};
const funcionfechas = require('./functionsController.js');


// CARTAS DOCUMENTO RECIBIDAS

controller.Create_CD_RE = (req, res) => {

    console.log(req.file);
    console.log(req.body.numerocuil);
    console.log(funcionfechas.FechaActual() + ' ** Fecha actual BACKEND');
    console.log(req.body.idFechaEmision[0]);
    console.log(req.body.idTipoReclamo[0]);
    console.log(req.body.idEstudioJuridico[0]);
    console.log(req.body.idComentario[0]);
    console.log(req.body.idCartellone[0]);
    console.log(req.file.filename);

    console.log('***********************************');
    console.log(req.body);
    console.log('***********************************');


    var CUIL = req.body.numerocuil;
    var FECHAING = funcionfechas.FechaActual();
    var FECHADOC = req.body.idFechaEmision[0];
    var RECLAMO = req.body.idTipoReclamo[0];
    var ESTUDIO = req.body.idEstudioJuridico[0];
    var COMENTARIO = req.body.idComentario[0];
    var LINK1 = req.body.idCartellone[0];
    var LINK2 = req.file.filename;

    res.send(true);
    req.getConnection((err, conn) => {

        var inserto = `INSERT INTO CARTADOCUMENTO (CUIL, FECHAING, FECHADOC, RECLAMO, ESTUDIO, COMENTARIO, LINK1, LINK2) VALUES  ('${CUIL}' ,'${FECHAING}','${FECHADOC}','${RECLAMO}','${ESTUDIO}','${COMENTARIO}','${LINK1}','${LINK2}')`;
        conn.query(inserto, (err, result) => {
            if (err) {
                console.log(err);
            }
            console.log('Monitor Servidor : CD - RECIBIDA - GRABACION');
        });
    })
};


controller.Update_CD_RE = (req, res) => {
    var ID = req.body['id'];
    var FECHADOC = req.body['id_Update_FechaEmision'];
    var RECLAMO = req.body['id_Update_TipoReclamo'];
    var ESTUDIO = req.body['id_Update_EstudioJuridico'];
    var COMENTARIO = req.body['id_Update_Comentario'];
    var LINK1 = req.body['id_Update_Cartellone'];

    console.log(req.body);

    if (req.file) {
        // Esto Se Ejecuta cuando Se Recibe un nuevo archivo
        console.log('recibi archivo')
        req.getConnection((err, conn) => {

            var LINK2 = req.file.filename;

            var actualizo = `UPDATE CARTADOCUMENTO SET FECHADOC='${FECHADOC}', RECLAMO='${RECLAMO}', ESTUDIO='${ESTUDIO}', COMENTARIO='${COMENTARIO}', LINK1='${LINK1}', LINK2='${LINK2}' WHERE ID='${ID}'`;

            conn.query(actualizo, (err, result) => {
                if (err) {
                    console.log(err);
                }
                console.log('Monitor Servidor : CD - RECIBIDA - ACTUALIZACION con Modificacion de Archivo');
            });
        })
    } else {
        // Esto Se Ejecuta cuando Se Mantiene  el Mismo Archivo
        console.log('NOOOO recibi archivo');

        req.getConnection((err, conn) => {
            var actualizo = `UPDATE CARTADOCUMENTO SET FECHADOC='${FECHADOC}', RECLAMO='${RECLAMO}', ESTUDIO='${ESTUDIO}', COMENTARIO='${COMENTARIO}', LINK1='${LINK1}' WHERE ID='${ID}'`;
            conn.query(actualizo, (err, result) => {
                if (err) {
                    console.log(err);
                }
                console.log('Monitor Servidor : CD - RECIBIDA - ACTUALIZACION Dejando  el Archivo Existente');
            });
        })
    }
    res.send(true);
};



// CARTAS DOCUMENTOS EMITIDAS

controller.Create_CD_EM = (req, res) => {

    console.log(req.file);
    console.log(req.body.numerocuil);
    console.log(funcionfechas.FechaActual() + ' ** Fecha actual BACKEND');
    console.log(req.body.idFechaEmision_EM[0]);
    console.log(req.body.idTipoReclamo_EM[0]);
    console.log(req.body.idEstudioJuridico_EM[0]);
    console.log(req.body.idComentario_EM[0]);
    console.log(req.body.idCartellone_EM[0]);
    console.log(req.file.filename);

    console.log('***********************************');
    console.log(req.body);
    console.log('***********************************');


    var CUIL = req.body.numerocuil;
    var FECHAING = funcionfechas.FechaActual();
    var FECHADOC = req.body.idFechaEmision_EM[0];
    var RECLAMO = req.body.idTipoReclamo_EM[0];
    var ESTUDIO = req.body.idEstudioJuridico_EM[0];
    var COMENTARIO = req.body.idComentario_EM[0];
    var LINK1 = req.body.idCartellone_EM[0];
    var LINK2 = req.file.filename;



    res.send(true);
    req.getConnection((err, conn) => {

        var inserto = `INSERT INTO CONTESTACIONES (CUIL, FECHAING, FECHADOC, RECLAMO, ESTUDIO, COMENTARIO, LINK1, LINK2) VALUES  ('${CUIL}' ,'${FECHAING}','${FECHADOC}','${RECLAMO}','${ESTUDIO}','${COMENTARIO}','${LINK1}','${LINK2}')`;
        conn.query(inserto, (err, result) => {
            if (err) {
                console.log(err);
            }
            console.log('Monitor Servidor : CD - EMITIDA - GRABACION');
        });
    })
};


controller.Update_CD_EM = (req, res) => {
    var ID = req.body['id'];
    var FECHADOC = req.body['id_Update_EM_FechaEmision'];
    var RECLAMO = req.body['id_Update_EM_TipoReclamo'];
    var ESTUDIO = req.body['id_Update_EM_EstudioJuridico'];
    var COMENTARIO = req.body['id_Update_EM_Comentario'];
    var LINK1 = req.body['id_Update_EM_Cartellone'];

    console.log(req.body);

    if (req.file) {
        // Esto Se Ejecuta cuando Se Recibe un nuevo archivo
        console.log('recibi archivo')
        req.getConnection((err, conn) => {

            var LINK2 = req.file.filename;

            var actualizo = `UPDATE CONTESTACIONES SET FECHADOC='${FECHADOC}', RECLAMO='${RECLAMO}', ESTUDIO='${ESTUDIO}', COMENTARIO='${COMENTARIO}', LINK1='${LINK1}', LINK2='${LINK2}' WHERE ID='${ID}'`;

            conn.query(actualizo, (err, result) => {
                if (err) {
                    console.log(err);
                }
                console.log('Monitor Servidor : CD - EMITIDA - ACTUALIZACION con Modificacion de Archivo');
            });
        })
    } else {
        // Esto Se Ejecuta cuando Se Mantiene  el Mismo Archivo
        console.log('NOOOO recibi archivo');

        req.getConnection((err, conn) => {
            var actualizo = `UPDATE CONTESTACIONES SET FECHADOC='${FECHADOC}', RECLAMO='${RECLAMO}', ESTUDIO='${ESTUDIO}', COMENTARIO='${COMENTARIO}', LINK1='${LINK1}' WHERE ID='${ID}'`;
            conn.query(actualizo, (err, result) => {
                if (err) {
                    console.log(err);
                }
                console.log('Monitor Servidor : CD - EMITIDA - ACTUALIZACION Dejando  el Archivo Existente');
            });
        })
    }
    res.send(true);
};



// CARTAS AUDIENCIAS

controller.Create_CD_AU = (req, res) => {

    console.log(req.file);
    console.log(req.body.numerocuil);
    console.log(funcionfechas.FechaActual() + ' ** Fecha actual BACKEND');
    console.log(req.body.idFechaEmision_AU_CRE[0]);
    console.log(req.body.idTipo_AU_CRE);
    console.log(req.body.idFechaAudiencia_AU_CRE[0]);
    console.log(req.body.hora);
    console.log(req.body.idComentario_AU_CRE[0]);
    console.log(req.body.idCartellone_AU_CRE[0]);
    console.log(req.file.filename);

    console.log('***********************************');
    console.log(req.body);
    console.log('***********************************');

    var CUIL = req.body.numerocuil;
    var FECHAING = funcionfechas.FechaActual();
    var FECHADOC = req.body.idFechaEmision_AU_CRE[0];
    var TIPO = req.body.idTipo_AU_CRE;
    var FECHAAUDI = req.body.idFechaAudiencia_AU_CRE[0];
    var HORAAUDI = req.body.hora;
    var COMENTARIO = req.body.idComentario_AU_CRE[0];
    var LINK1 = req.body.idCartellone_AU_CRE[0];
    var LINK2 = req.file.filename;



    res.send(true);
    req.getConnection((err, conn) => {

        var inserto = `INSERT INTO AUDIENCIAS (CUIL, FECHAING, FECHADOC, TIPO, FECHAAUDI, HORAAUDI, COMENTARIO, LINK1, LINK2) VALUES 
         ('${CUIL}' ,'${FECHAING}','${FECHADOC}','${TIPO}','${FECHAAUDI}','${HORAAUDI}','${COMENTARIO}','${LINK1}','${LINK2}')`;
        conn.query(inserto, (err, result) => {
            if (err) {
                console.log(err);
            }
            console.log('Monitor Servidor : AUDIENCIA - GRABACION');
        });
    })
};


controller.Update_CD_AU = (req, res) => {
    console.log(req.file);
    console.log(req.body['Audiencia_Update_ID']);
    console.log(req.body['Audiencia_Update_FECHADOC']);
    console.log(req.body['Audiencia_Update_TIPO']);
    console.log(req.body['Audiencia_Update_FECHAAUDI']);
    console.log(req.body['Audiencia_Update_HORAAUDI'][0]);
    console.log(req.body['Audiencia_Update_COMENTARIO']);
    console.log(req.body['Audiencia_Update_LINK1']);

    var ID = req.body['Audiencia_Update_ID']; //ok
    var FECHADOC = req.body['Audiencia_Update_FECHADOC']; //ok
    var TIPO = req.body['Audiencia_Update_TIPO']; //ok
    var FECHAAUDI = req.body['Audiencia_Update_FECHAAUDI']; //ok
    var HORAAUDI = req.body['Audiencia_Update_HORAAUDI'][0]; //ok
    var COMENTARIO = req.body['Audiencia_Update_COMENTARIO']; //ok
    var LINK1 = req.body['Audiencia_Update_LINK1']; //ok

    console.log(req.body);

    if (req.file) {
        // Esto Se Ejecuta cuando Se Recibe un nuevo archivo
        console.log('recibi archivo')
        req.getConnection((err, conn) => {

            var LINK2 = req.file.filename; //ok

            var actualizo = `UPDATE AUDIENCIAS SET 
            FECHADOC='${FECHADOC}', 
            TIPO='${TIPO}', 
            FECHAAUDI='${FECHAAUDI}',
            HORAAUDI='${HORAAUDI}',
            COMENTARIO='${COMENTARIO}',
            LINK1='${LINK1}', 
            LINK2='${LINK2}' 
            WHERE ID='${ID}'`;

            conn.query(actualizo, (err, result) => {
                if (err) {
                    console.log(err);
                }
                console.log('Monitor Servidor : AUDIENCIA - ACTUALIZACION con Modificacion de Archivo');
            });
        })
    } else {
        // Esto Se Ejecuta cuando Se Mantiene  el Mismo Archivo
        console.log('NOOOO recibi archivo');

        req.getConnection((err, conn) => {
            var actualizo = `UPDATE AUDIENCIAS SET
            FECHADOC='${FECHADOC}', 
            TIPO='${TIPO}', 
            FECHAAUDI='${FECHAAUDI}',
            HORAAUDI='${HORAAUDI}',
            COMENTARIO='${COMENTARIO}',
            LINK1='${LINK1}'
            WHERE ID='${ID}'`;
            conn.query(actualizo, (err, result) => {
                if (err) {
                    console.log(err);
                }
                console.log('Monitor Servidor : AUDIENCIA - ACTUALIZACION Dejando  el Archivo Existente');
            });
        })
    }
    res.send(true);
};



// CARTAS JUICIOS

controller.Create_CD_JU = (req, res) => {

    console.log(req.file);
    console.log(req.body.numerocuil);
    console.log(funcionfechas.FechaActual() + ' ** Fecha actual BACKEND');
    console.log(req.body.idFechaEmision_JU_CRE[0]);
    console.log(req.body.idTipo_JU_CRE);
    console.log(req.body.idFechaAudiencia_JU_CRE[0]);
    console.log(req.body.hora);
    console.log(req.body.idComentario_JU_CRE[0]);
    console.log(req.body.idCartellone_JU_CRE[0]);
    console.log(req.file.filename);

    console.log('***********************************');
    console.log(req.body);
    console.log('***********************************');

    var CUIL = req.body.numerocuil;
    var FECHAING = funcionfechas.FechaActual();
    var FECHADOC = req.body.idFechaEmision_JU_CRE[0];
    var TIPO = req.body.idTipo_JU_CRE;
    var FECHAJUI = req.body.idFechaAudiencia_JU_CRE[0];
    var HORAJUI = req.body.hora;
    var COMENTARIO = req.body.idComentario_JU_CRE[0];
    var LINK1 = req.body.idCartellone_JU_CRE[0];
    var LINK2 = req.file.filename;



    res.send(true);
    req.getConnection((err, conn) => {

        var inserto = `INSERT INTO JUICIOS (CUIL, FECHAING, FECHADOC, TIPO, FECHAJUI, HORAJUI, COMENTARIO, LINK1, LINK2) VALUES 
         ('${CUIL}' ,'${FECHAING}','${FECHADOC}','${TIPO}','${FECHAJUI}','${HORAJUI}','${COMENTARIO}','${LINK1}','${LINK2}')`;
        conn.query(inserto, (err, result) => {
            if (err) {
                console.log(err);
            }
            console.log('Monitor Servidor : JUICIOS - GRABACION');
        });
    })
};

controller.Update_CD_JU = (req, res) => {
    console.log(req.file);
    console.log(req.body['Juicio_Update_ID']);
    console.log(req.body['Juicio_Update_FECHADOC']);
    console.log(req.body['Juicio_Update_TIPO']);
    console.log(req.body['Juicio_Update_FECHAJUI']);
    console.log(req.body['Juicio_Update_HORAJUI'][0]);
    console.log(req.body['Juicio_Update_COMENTARIO']);
    console.log(req.body['Juicio_Update_LINK1']);

    var ID = req.body['Juicio_Update_ID']; //ok
    var FECHADOC = req.body['Juicio_Update_FECHADOC']; //ok
    var TIPO = req.body['Juicio_Update_TIPO']; //ok
    var FECHAJUI = req.body['Juicio_Update_FECHAJUI']; //ok
    var HORAJUI = req.body['Juicio_Update_HORAJUI']; //ok
    var COMENTARIO = req.body['Juicio_Update_COMENTARIO']; //ok
    var LINK1 = req.body['Juicio_Update_LINK1']; //ok

    console.log(req.body);
    console.log(req.body['Juicio_Update_HORAJUI']);

    if (req.file) {
        // Esto Se Ejecuta cuando Se Recibe un nuevo archivo
        console.log('recibi archivo')
        req.getConnection((err, conn) => {

            var LINK2 = req.file.filename; //ok

            var actualizo = `UPDATE JUICIOS SET 
            FECHADOC='${FECHADOC}', 
            TIPO='${TIPO}', 
            FECHAJUI='${FECHAJUI}',
            HORAJUI='${HORAJUI}',
            COMENTARIO='${COMENTARIO}',
            LINK1='${LINK1}', 
            LINK2='${LINK2}' 
            WHERE ID='${ID}'`;

            conn.query(actualizo, (err, result) => {
                if (err) {
                    console.log(err);
                }
                console.log('Monitor Servidor : JUICIO - ACTUALIZACION con Modificacion de Archivo');
            });
        })
    } else {
        // Esto Se Ejecuta cuando Se Mantiene  el Mismo Archivo
        console.log('NOOOO recibi archivo');

        req.getConnection((err, conn) => {
            var actualizo = `UPDATE JUICIOS SET
            FECHADOC='${FECHADOC}', 
            TIPO='${TIPO}', 
            FECHAJUI='${FECHAJUI}',
            HORAJUI='${HORAJUI}',
            COMENTARIO='${COMENTARIO}',
            LINK1='${LINK1}'
            WHERE ID='${ID}'`;
            conn.query(actualizo, (err, result) => {
                if (err) {
                    console.log(err);
                }
                console.log('Monitor Servidor : JUICIO - ACTUALIZACION Dejando  el Archivo Existente');
            });
        })
    }
    res.send(true);
};






module.exports = controller;