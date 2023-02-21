const controller = {};

controller.getAll2 = (req,res) =>{
	res.send('<h1 style="color:red">hello world</h1>');
}

controller.getCiudades = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query("SELECT * from ciudades", (err, registros) => {
            if (err) {
                res.json(err);
            }
            res.send(registros);
            console.log("\nLog : getAll CIUDADES");
        });
    });
};
controller.getProvincias = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query("SELECT * from provincias", (err, registros) => {
            if (err) {
                res.json(err);
            }
            res.send(registros);
            console.log("\nLog : getAll PROVINCIAS");
        });
    });
};
controller.getFueros = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query("SELECT * from fueros", (err, registros) => {
            if (err) {
                res.json(err);
            }
            res.send(registros);
            console.log("\nLog : getAll FUEROS");
        });
    });
};
controller.getFuerosXJuzgados = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query("SELECT * from fueros_x_juzgados", (err, registros) => {
            if (err) {
                res.json(err);
            }
            res.send(registros);
            console.log("\nLog : getAll FUEROS x Juzgados");
        });
    });
};
controller.getDepartamentos = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query("SELECT * from departamentos", (err, registros) => {
            if (err) {
                res.json(err);
            }
            res.send(registros);
            console.log("\nLog : getAll Departamentos");
        });
    });
};
controller.getDependencias = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query("SELECT * from dependencias", (err, registros) => {
            if (err) {
                res.json(err);
            }
            res.send(registros);
            console.log("\nLog : getAll Dependencias");
        });
    });
};
controller.getJuzgados = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query("SELECT * from juzgados", (err, registros) => {
            if (err) {
                res.json(err);
            }
            res.send(registros);
            console.log("\nLog : getAll Juzgados");
        });
    });
};

module.exports = controller;