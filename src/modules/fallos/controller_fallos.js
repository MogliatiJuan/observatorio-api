const controller = {};

function monitor(mensaje, resultado) {
  console.log(
    `\n\x1B[1;31m||||| ENDPOINT |||||\n||\x1b[0m \x1B[1;36m${mensaje.toUpperCase()}\x1b[0m\n`
  );
  console.log(resultado);
  console.log(`\n\x1B[1;32mTotal de registros: ${resultado.length}\x1b[0m`);
  console.log(`\n\x1B[1;31m||||| END |||||\x1b[0m`);
}

function monitor2(mensaje, resultado) {
  console.log(
    `\n\x1B[1;31m||||| ENDPOINT |||||\n||\x1b[0m \x1B[1;36m${mensaje.toUpperCase()}\x1b[0m\n`
  );
  console.log(resultado);
  console.log(`\n\x1B[1;31m||||| END |||||\x1b[0m`);
}

controller.all = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) throw err;
    conn.query(
      ` SELECT * FROM fallo `,

      (err, respuesta) => {
        if (err) throw err;
        let resultado = Object.values(JSON.parse(JSON.stringify(respuesta)));
        res.send(resultado);
        monitor("fallos, listado completo", resultado);
      }
    );
  });
};

controller.read = (req, res) => {
  const id = req.params.id;
  req.getConnection((err, conn) => {
    conn.query(
      "SELECT * FROM `fallo` WHERE fallo_id=? ",
      [id],
      (err, respuesta) => {
        if (err) {
          res.json(err);
        }
        let resultado = Object.values(JSON.parse(JSON.stringify(respuesta)));
        res.send(resultado);
        monitor("Muestro Fallo by ID", resultado);
      }
    );
  });
};

controller.readByFilter = (req, res) => {
  const { actor, demandado, rubro } = req.query;
  const conditions = [];
  const values = [];

  if (actor) {
    conditions.push("agent = ?");
    values.push(actor);
  }

  if (demandado) {
    conditions.push("tipojuicio = ?");
    values.push(demandado);
  }

  if (rubro) {
    conditions.push("rubro = ?");
    values.push(rubro);
  }

  // Construye la consulta SQL basada en las condiciones
  let sqlQuery = "SELECT * FROM fallo";

  if (conditions.length > 0) {
    sqlQuery += " WHERE " + conditions.join(" AND ");
  }
  req.getConnection((err, conn) => {
    conn.query(sqlQuery, values, (err, resultados) => {
      if (err) {
        // Manejar errores aquí
        console.error(err);
        return;
      }

      // Manejar resultados aquí
      console.log(resultados);
      res.send(resultados);
    });
  });
};

controller.create = (req, res) => {
  fallo_actor = req.body.fallo_actor;
  fallo_demandado = req.body.fallo_demandado;
  fallo_descripcion = req.body.fallo_descripcion;
  fallo_tipo_juicio = req.body.fallo_tipo_juicio;
  fallo_causas = req.body.fallo_causas;
  fallo_rubro = req.body.fallo_rubro;
  fallo_empresa_cuit = parseInt(req.body.fallo_empresa_cuit);
  fallo_empresa = req.body.fallo_empresa;
  fallo_fecha = req.body.fallo_fecha;
  fallo_tribunal_id = req.body.fallo_tribunal_id;
  fallo_tribunal = req.body.fallo_tribunal;
  fallo_dano_punitivo = req.body.fallo_dano_punitivo;
  fallo_dano_moral = req.body.fallo_dano_moral;
  fallo_dano_patrimonial = req.body.fallo_dano_patrimonial;
  fallo_resumen = req.body.fallo_resumen;

  res.send(true);
  req.getConnection((err, conn) => {
    var inserto = `
        INSERT INTO fallo
        (fallo_actor, fallo_demandado, fallo_descripcion, fallo_tipo_juicio,
         fallo_causas, fallo_rubro, fallo_empresa_cuit, fallo_empresa, 
         fallo_fecha, fallo_tribunal_id, fallo_tribunal, fallo_dano_punitivo,
         fallo_dano_moral, fallo_dano_patrimonial, fallo_resumen)
        VALUES
        ('${fallo_actor}', '${fallo_demandado}', '${fallo_descripcion}',
         '${fallo_tipo_juicio}', '${fallo_causas}', '${fallo_rubro}',
         '${fallo_empresa_cuit}', '${fallo_empresa}', '${fallo_fecha}',
         '${fallo_tribunal_id}', '${fallo_tribunal}', '${fallo_dano_punitivo}',
         '${fallo_dano_moral}', '${fallo_dano_patrimonial}', '${fallo_resumen}')`;
    conn.query(inserto, (err, resultado) => {
      if (err) {
        console.log(err);
      }
      monitor2("fallo, create", resultado);
    });
  });
};

export default controller;
