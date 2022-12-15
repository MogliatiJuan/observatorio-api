const controller = {};

controller.Query_Select_ListaPersonas = (req, res) => {
    // Nose puede el send en GET
    // res.send('Servidor Remoto : Consultando Base de datos para cargar AJAX del Datatable');
    req.getConnection((err, conn) => {
        conn.query("SELECT * from VIEWPERSONAS", (err, personas) => {
            // conn.query('SELECT * from PERSONAS', (err, personas) => {
            if (err) {
                res.json(err);
            }
            res.send(personas);
            // console.log(JSON.stringify(personas));
            console.log("Monitor Servidor : LLAMARON API PERSONAS para ver listado");
        });
    });
};

controller.Query_Select_ListaLitigantes = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query("SELECT * from VIEWLITIGANTES", (err, personas) => {
            if (err) {
                res.json(err);
            }
            res.send(personas);
            console.log("");
            console.log(
                "****************************************************************"
            );
            console.log("***   Monitor Servidor : Select DB Litigantes");
            console.log(
                "****************************************************************"
            );
            console.log("***   " + JSON.stringify(req.query));
            console.log(
                "****************************************************************"
            );
            console.log(" ");
        });
    });
};

controller.PersonaByCUIL = (req, res) => {
    const CUIL = req.params.cuit;
    req.getConnection((err, conn) => {
        conn.query(
            "SELECT * from PERSONAS WHERE CUIL= ?", [CUIL],
            (err, DETALLEPERSONA) => {
                if (err) {
                    res.json(err);
                    console.log(err);
                }
                res.send(DETALLEPERSONA);
                console.log(" ");
                console.log(
                    "****************************************************************"
                );
                console.log(
                    "***   Monitor Servidor : LLAMARON API Ver Detalle Persona"
                );
                console.log(
                    "****************************************************************"
                );
                // console.log('***   ' + JSON.stringify(DETALLEPERSONA));
                console.log("***   " + CUIL);
                console.log(
                    "****************************************************************"
                );
                console.log(" ");
                console.log(DETALLEPERSONA);
            }
        );
    });
};

// Consulta a Base de Datos para Ajax fetch o HttpxmlRequest  // Reponse  Rows Data Packet
controller.litigantesCDxCUIT = (req, res) => {
    const CUIL = req.params.cuit;
    req.getConnection((err, conn) => {
        // conn.query('SELECT * from CARTADOCUMENTO WHERE CUIL= ?', [CUIL], (err, CDxCUIT) => {
        conn.query(
            'SELECT ID,CUIL,DATE_FORMAT(FECHAING, "%d/%m/%Y") as FECHAING,DATE_FORMAT(FECHADOC, "%d/%m/%Y")as FECHADOC_order,RECLAMO , ESTUDIO FROM `CARTADOCUMENTO` WHERE CUIL=? ORDER BY `FECHADOC` ASC', [CUIL],
            (err, CDxCUIT) => {
                if (err) {
                    res.json(err);
                }
                res.send(CDxCUIT);
                console.log(
                    "Monitor Servidor : LLAMARON API CARTADOCUMENTO para ver listado"
                );
            }
        );
    });
};

controller.litigantesCOxCUIT = (req, res) => {
    const CUIL = req.params.cuit;
    req.getConnection((err, conn) => {
        // conn.query('SELECT * from CONTESTACIONES WHERE CUIL= ?', [CUIL], (err, COxCUIT) => {
        conn.query(
            'SELECT ID,CUIL,DATE_FORMAT(FECHAING, "%d/%m/%Y") as FECHAING,DATE_FORMAT(FECHADOC, "%d/%m/%Y")as FECHADOC_order,RECLAMO , ESTUDIO FROM `CONTESTACIONES` WHERE CUIL=? ORDER BY `FECHADOC` ASC ', [CUIL],
            (err, COxCUIT) => {
                if (err) {
                    res.json(err);
                    console.log(err);
                }
                res.send(COxCUIT);
                console.log(
                    "Monitor Servidor : LLAMARON API CONTESTACIONES para ver listado"
                );
            }
        );
    });
};

controller.litigantesAUxCUIT = (req, res) => {
    const CUIL = req.params.cuit;
    req.getConnection((err, conn) => {
        // conn.query(
        //     "SELECT * from AUDIENCIAS WHERE CUIL= ?", [CUIL],
        conn.query(
            'SELECT ID,CUIL,DATE_FORMAT(FECHAING, "%d/%m/%Y") as FECHAING,DATE_FORMAT(FECHADOC, "%d/%m/%Y")as FECHADOC,TIPO,DATE_FORMAT(FECHAAUDI, "%d/%m/%Y")as FECHAAUDI_order,TIME_FORMAT(HORAAUDI, "%H %i") as HORAAUDI , COMENTARIO FROM `AUDIENCIAS` WHERE CUIL=? ORDER BY `FECHAAUDI` ASC ', [CUIL],
            (err, AUxCUIT) => {
                if (err) {
                    res.json(err);
                    console.log(err);
                }
                res.send(AUxCUIT);
                console.log(
                    "Monitor Servidor : LLAMARON API AUDIENCIAS para ver listado"
                );
            }
        );
    });
};

controller.litigantesJUxCUIT = (req, res) => {
    const CUIL = req.params.cuit;
    req.getConnection((err, conn) => {
        conn.query(
            // "SELECT * from JUICIOS WHERE CUIL= ?", [CUIL],
            'SELECT ID,CUIL,DATE_FORMAT(FECHAING, "%d/%m/%Y") as FECHAING,DATE_FORMAT(FECHADOC, "%d/%m/%Y")as FECHADOC,TIPO,DATE_FORMAT(FECHAJUI, "%d/%m/%Y")as FECHAJUI_order,TIME_FORMAT(HORAJUI, "%H %i") as HORAJUI , COMENTARIO FROM `JUICIOS` WHERE CUIL=? ORDER BY `FECHAJUI` ASC ', [CUIL],
            (err, JUxCUIT) => {
                if (err) {
                    res.json(err);
                    console.log(err);
                }
                res.send(JUxCUIT);
                console.log("Monitor Servidor : LLAMARON API JUICIOS para ver listado");
            }
        );
    });
};

// CHANGES STATUS VALUE OF JUDICIALES (SI/No)
controller.Update_Judiciales = (req, res) => {
    console.log(req.body);
    const CUIL = req.body.CUIL;
    const VALOR = req.body.VALOR;

    var CASOABIERTO;

    if (VALOR == 'SI') {
        CASOABIERTO = 'SI';
    } else {
        CASOABIERTO = 'NO';
    }

    res.send(
        "Servidor Remoto: He Recibido estos datos -> " +
        req.body.CUIL +
        " - " +
        req.body.VALOR
    );

    req.getConnection((err, conn) => {
        // Nose puede el send en GET
        // res.send('Servidor Remoto : Grabacion... Cambie Estado de Judiciales a SI');
        conn.query(
            "UPDATE PERSONAS SET judiciales = ? , CASOABIERTO = ? WHERE CUIL= ?  ", [VALOR, CASOABIERTO, CUIL],
            (err, personas) => {
                if (err) {
                    res.json(err);
                }
                console.log(
                    "Monitor Servidor : Grabacion... Cambie Estado de Judiciales a SI"
                );
                // res.send('Servidor Remoto : Grabacion... Cambie Estado de Judiciales a SI');
            }
        );
    });
};

//traer CD RE x CUIL
controller.cd_re_cuil = (req, res) => {
    const parametrosrecibidos = JSON.parse(req.params.parametros);
    const id = parametrosrecibidos.id;
    req.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(
            `SELECT * from CARTADOCUMENTO WHERE  ID=?`, [id],
            (err, result, fields) => {
                if (err) throw err;
                console.log(result);
                res.send(result);
            }
        );
    });
};

//traer CD EM x CUIL
controller.cd_em_cuil = (req, res) => {
    const parametrosrecibidos = JSON.parse(req.params.parametros);
    const id = parametrosrecibidos.id;
    req.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(
            `SELECT * from CONTESTACIONES WHERE  ID=?`, [id],
            (err, result, fields) => {
                if (err) throw err;
                console.log(result);
                res.send(result);
            }
        );
    });
};

//traer CD AU x CUIL
controller.cd_au_cuil = (req, res) => {
    const parametrosrecibidos = JSON.parse(req.params.parametros);
    const id = parametrosrecibidos.id;
    req.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(
            `SELECT * from AUDIENCIAS WHERE  ID=?`, [id],
            (err, result, fields) => {
                if (err) throw err;
                console.log(result);
                res.send(result);
            }
        );
    });
};

//traer CD JU x CUIL
controller.cd_ju_cuil = (req, res) => {
    const parametrosrecibidos = JSON.parse(req.params.parametros);
    const id = parametrosrecibidos.id;
    req.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(
            `SELECT * from JUICIOS WHERE  ID=?`, [id],
            (err, result, fields) => {
                if (err) throw err;
                console.log(result);
                res.send(result);
            }
        );
    });
};

// Borrar Registro
controller.CD_DLT = (req, res) => {
    const parametrosrecibidos = JSON.parse(req.params.parametros);
    const id = parametrosrecibidos.id;
    const tabla = parametrosrecibidos.tabla;
    console.log(
        "***************************************************************"
    );
    console.log(`Se Borrara el registro : ${id} de la tabla : ${tabla}`);
    console.log(
        "***************************************************************"
    );
    req.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(
            `DELETE FROM ${tabla} WHERE  ID=${id}`,
            (err, result, fields) => {
                if (err) throw err;
                console.log(result);
                res.send(result);
            }
        );
    });
};

//Consultas para graficas Status3
controller.res_docs = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(
            `
        SELECT COUNT(*) as TOTAL FROM CARTADOCUMENTO 
        UNION
        SELECT COUNT(*) FROM CONTESTACIONES 
        UNION
        SELECT COUNT(*) FROM AUDIENCIAS
        UNION
        SELECT COUNT(*) FROM JUICIOS`,

            (err, resultado) => {
                if (err) throw err;
                console.log(resultado);
                res.send(JSON.stringify(resultado));
            }
        );
    });
};

//Consultas para graficas personal litigante
controller.TOTAL_LitVsNoLit = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(
            `
        SELECT COUNT(*) as TOTAL FROM PERSONAS where judiciales='NO' 
        UNION
        SELECT COUNT(*) FROM PERSONAS where judiciales='SI'`,

            (err, resultado) => {
                if (err) throw err;
                console.log(resultado);
                res.send(JSON.stringify(resultado));
            }
        );
    });
};

controller.TOTAL_ActvsNoAct = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(` SELECT * FROM GRAFICO4 `,

            (err, resultado) => {
                if (err) throw err;
                console.log(resultado);
                res.send(JSON.stringify(resultado));
            }
        );
    });
};

controller.ACT_FORANEOLOCAL = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(
            `
			SELECT COUNT(*) AS TOTAL FROM PERSONAS WHERE bajasino='NO' && condicion='LOCAL'
			UNION
			SELECT COUNT(*) AS TOTAL FROM PERSONAS WHERE bajasino='NO' && condicion='FORANEO' `,
            (err, resultado) => {
                if (err) throw err;
                console.log(resultado);
                res.send(JSON.stringify(resultado));
            }
        );
    });
};

controller.BAJA_FORANEOLOCAL = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(
            `
			SELECT COUNT(*) AS TOTAL FROM PERSONAS WHERE bajasino='SI' && condicion='LOCAL'
			UNION
			SELECT COUNT(*) AS TOTAL FROM PERSONAS WHERE bajasino='SI' && condicion='FORANEO' `,
            (err, resultado) => {
                if (err) throw err;
                console.log(resultado);
                res.send(JSON.stringify(resultado));
            }
        );
    });
};

//Consultas para graficas Status3
controller.res_reclamos = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(
            `SELECT RECLAMO,COUNT(*)as TOTAL FROM CARTADOCUMENTO GROUP BY RECLAMO`,
            (err, resultado) => {
                if (err) throw err;
                console.log(resultado);
                res.send(JSON.stringify(resultado));
            }
        );
    });
};

//Audiencias que falta mas de 7 dias
controller.audienciaspersonasMore7days = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(
            `SELECT
            tabla1.ID,
            tabla2.CUIL,
            tabla2.APELLIDO,
            tabla2.NOMBRE,
            tabla1.TIPO,
            DATE_FORMAT(tabla1.FECHAAUDI, "%d/%m/%Y")as FECHAAUDI,             
            tabla1.HORAAUDI
            FROM AUDIENCIAS tabla1
            INNER JOIN PERSONAS tabla2 
            ON tabla1.CUIL = tabla2.CUIL && FECHAAUDI > DATE(NOW()+ interval 7 day) 
            ORDER BY FECHAAUDI ASC `,
            (err, resultado) => {
                if (err) throw err;
                console.log(resultado);
                res.send(JSON.stringify(resultado));
            }
        );
    });
};

//Audiencias en estos 7 dias inclusive fecha actual
controller.audienciaspersonas7daysandToday = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(
            `SELECT
            tabla1.ID,
            tabla2.CUIL,
            tabla2.APELLIDO,
            tabla2.NOMBRE,
            tabla1.TIPO,
            DATE_FORMAT(tabla1.FECHAAUDI, "%d/%m/%Y")as FECHAAUDI,             
            tabla1.HORAAUDI
            FROM AUDIENCIAS tabla1
            INNER JOIN PERSONAS tabla2 
            ON tabla1.CUIL = tabla2.CUIL && 
            FECHAAUDI >= DATE(NOW()) && 
            FECHAAUDI <= DATE(NOW()+ interval 7 day) 
            ORDER BY FECHAAUDI ASC `,
            (err, resultado) => {
                if (err) throw err;
                console.log(resultado);
                res.send(JSON.stringify(resultado));
            }
        );
    });
};

//Audiencias Vencidas
controller.audienciaspersonasTimeOut = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(
            `SELECT
            tabla1.ID,
            tabla2.CUIL,
            tabla2.APELLIDO,
            tabla2.NOMBRE,
            tabla1.TIPO,
            DATE_FORMAT(tabla1.FECHAAUDI, "%d/%m/%Y")as FECHAAUDI,             
            tabla1.HORAAUDI
            FROM AUDIENCIAS tabla1
            INNER JOIN PERSONAS tabla2 
            ON tabla1.CUIL = tabla2.CUIL && 
            FECHAAUDI < DATE(NOW()) 
            ORDER BY FECHAAUDI ASC `,
            (err, resultado) => {
                if (err) throw err;
                console.log(resultado);
                res.send(JSON.stringify(resultado));
            }
        );
    });
};


//Juicios que falta mas de 7 dias
controller.juiciospersonasMore7days = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(
            `SELECT
            tabla1.ID,
            tabla2.CUIL,
            tabla2.APELLIDO,
            tabla2.NOMBRE,
            tabla1.TIPO,
            DATE_FORMAT(tabla1.FECHAJUI, "%d/%m/%Y")as FECHAJUI,             
            tabla1.HORAJUI 
            FROM JUICIOS tabla1
            INNER JOIN PERSONAS tabla2 
            ON tabla1.CUIL = tabla2.CUIL && FECHAJUI > DATE(NOW()+ interval 7 day) 
            ORDER BY FECHAJUI ASC `,
            (err, resultado) => {
                if (err) throw err;
                console.log(resultado);
                res.send(JSON.stringify(resultado));
            }
        );
    });
};

//Juicios en estos 7 dias inclusive fecha actual
controller.juiciospersonas7daysandToday = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(
            `SELECT
            tabla1.ID,
            tabla2.CUIL,
            tabla2.APELLIDO,
            tabla2.NOMBRE,
            tabla1.TIPO,
            DATE_FORMAT(tabla1.FECHAJUI, "%d/%m/%Y")as FECHAJUI,             
            tabla1.HORAJUI
            FROM JUICIOS tabla1
            INNER JOIN PERSONAS tabla2 
            ON tabla1.CUIL = tabla2.CUIL && 
            FECHAJUI >= DATE(NOW()) && 
            FECHAJUI <= DATE(NOW()+ interval 7 day) 
            ORDER BY FECHAJUI ASC `,
            (err, resultado) => {
                if (err) throw err;
                console.log(resultado);
                res.send(JSON.stringify(resultado));
            }
        );
    });
};

//Juicios Vencidas
controller.juiciospersonasTimeOut = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(
            `SELECT
            tabla1.ID,
            tabla2.CUIL,
            tabla2.APELLIDO,
            tabla2.NOMBRE,
            tabla1.TIPO,
            DATE_FORMAT(tabla1.FECHAJUI, "%d/%m/%Y")as FECHAJUI,             
            tabla1.HORAJUI
            FROM JUICIOS tabla1
            INNER JOIN PERSONAS tabla2 
            ON tabla1.CUIL = tabla2.CUIL && 
            FECHAJUI < DATE(NOW()) 
            ORDER BY FECHAJUI ASC `,
            (err, resultado) => {
                if (err) throw err;
                console.log(resultado);
                res.send(JSON.stringify(resultado));
            }
        );
    });
};



//Estadisticas 1
controller.estadisticas1 = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(
            `select (select count(0) AS TOTAL from CARTADOCUMENTO) AS CD,
             (select count(0) AS TOTAL from CONTESTACIONES) AS CO,
             (select count(0) AS TOTAL from AUDIENCIAS) AS AU, 
             (select count(0) AS TOTAL from JUICIOS) AS JU,
             (select count(0) AS TOTAL from PERSONAS where ((PERSONAS.judiciales = 'NO') and (PERSONAS.bajasino = 'NO'))) AS ACT_NOLIT,
             (select count(0) AS TOTAL from PERSONAS where ((PERSONAS.judiciales = 'SI') and (PERSONAS.bajasino = 'NO'))) AS ACT_LIT,
             (select count(0) AS TOTAL from PERSONAS where ((PERSONAS.judiciales = 'NO') and (PERSONAS.bajasino = 'SI'))) AS NOACT_NOLIT,
             (select count(0) AS TOTAL from PERSONAS where ((PERSONAS.judiciales = 'SI') and (PERSONAS.bajasino = 'SI'))) AS NOACT_LIT
              `,
            (err, resultado) => {
                if (err) throw err;
                console.log(resultado);
                res.send(JSON.stringify(resultado));
            }
        );
    });
};

controller.estadisticas2 = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(
            `select
            (SELECT COUNT(*) AS TOTAL FROM PERSONAS ) AS    'TOTALPERSONAL',
            (SELECT COUNT(*) AS TOTAL FROM PERSONAS WHERE judiciales = 'SI') AS 'TOTALLITIGANTES',
            (SELECT COUNT(*) AS TOTAL FROM PERSONAS WHERE CASOABIERTO = 'SI') AS 'TOTALCASOSABIERTOS',
            (SELECT COUNT(*) AS TOTAL FROM PERSONAS WHERE ((bajasino='NO') && (condicion='LOCAL'  ))) AS    'LOCALES_ACTIVOS',
            (SELECT COUNT(*) AS TOTAL FROM PERSONAS WHERE ((bajasino='NO') && (condicion='FORANEO'))) AS    'FORANEOS_ACTIVOS' ,
            (SELECT COUNT(*) AS TOTAL FROM PERSONAS WHERE ((bajasino='SI') && (condicion='LOCAL'  ))) AS    'LOCALES_BAJAS',
            (SELECT COUNT(*) AS TOTAL FROM PERSONAS WHERE ((bajasino='SI') && (condicion='FORANEO'))) AS    'FORANEOS_BAJAS',
            
            (SELECT COUNT(*) AS TOTAL FROM PERSONAS WHERE ((bajasino='NO') && (condicion='LOCAL'  ) && judiciales = 'SI')) AS 'LOCALES_ACTIVOS_LIT',
            (SELECT COUNT(*) AS TOTAL FROM PERSONAS WHERE ((bajasino='NO') && (condicion='FORANEO') && judiciales = 'SI')) AS 'FORANEOS_ACTIVOS_LIT' ,
            (SELECT COUNT(*) AS TOTAL FROM PERSONAS WHERE ((bajasino='SI') && (condicion='LOCAL'  ) && judiciales = 'SI')) AS 'LOCALES_BAJAS_LIT',
            (SELECT COUNT(*) AS TOTAL FROM PERSONAS WHERE ((bajasino='SI') && (condicion='FORANEO') && judiciales = 'SI')) AS 'FORANEOS_BAJAS_LIT',
            
            (SELECT COUNT(*) AS TOTAL FROM PERSONAS WHERE ((bajasino='NO') && (condicion='LOCAL'  ) && judiciales = 'SI' && CASOABIERTO = 'SI')) AS 'LOCALES_ACTIVOS_LIT_ABIERTO',
            (SELECT COUNT(*) AS TOTAL FROM PERSONAS WHERE ((bajasino='NO') && (condicion='FORANEO') && judiciales = 'SI' && CASOABIERTO = 'SI')) AS 'FORANEOS_ACTIVOS_LIT_ABIERTO' ,
            (SELECT COUNT(*) AS TOTAL FROM PERSONAS WHERE ((bajasino='SI') && (condicion='LOCAL'  ) && judiciales = 'SI' && CASOABIERTO = 'SI')) AS 'LOCALES_BAJAS_LIT_ABIERTO',
            (SELECT COUNT(*) AS TOTAL FROM PERSONAS WHERE ((bajasino='SI') && (condicion='FORANEO') && judiciales = 'SI' && CASOABIERTO = 'SI')) AS 'FORANEOS_BAJAS_LIT_ABIERTO'
              `,
            (err, resultado) => {
                if (err) throw err;
                console.log(resultado);
                res.send(JSON.stringify(resultado));
            }
        );
    });
};



























module.exports = controller;