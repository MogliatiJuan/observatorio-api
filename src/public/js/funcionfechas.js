function AsignarFechaActual_id(idfecha) {
    $(`#${idfecha}`).datepicker({
        firstDay: true,
        format: 'dd-mm-yyyy',
        setDefaultDate: true,
        defaultDate: new Date(GetTodayDate()),
        i18n: {
            cancel: 'Cancelar',
            clear: 'Limpiar',
            done: 'OK',
            close: 'Cerrar',
            default: 'now',
            today: 'Hoy',
            months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto",
                "Septiembre", "Octubre", "Noviembre", "Diciembre"
            ],
            monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Set", "Oct",
                "Nov", "Dic"
            ],
            weekdays: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
            weekdaysShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
            weekdaysAbbrev: ["D", "L", "M", "M", "J", "V", "S"]
        }
    });

}
function GetTodayDate() {
    var tdate = new Date();
    var dd = tdate.getDate(); //yields day
    var MM = tdate.getMonth(); //yields month
    var yyyy = tdate.getFullYear(); //yields year
    var currentDate = yyyy + "-" + (MM + 1) + "-" + dd;
    return currentDate;
};
function GetTodayDateV2() {
    const SistemaFecha = new Date();
    var diaactual="";
    var mesactual="";
    var anioactual= SistemaFecha.getFullYear();
    if (SistemaFecha.getDate().toString().length < 2){
        diaactual =  "0" + (SistemaFecha.getDate());
    }else{diaactual =  SistemaFecha.getDate();}
    if (SistemaFecha.getMonth().toString().length < 2){
        mesactual =  "0" + (SistemaFecha.getMonth()+1);
    }
    fechafinal = diaactual + '-' + mesactual + '-' + anioactual;
    return fechafinal;
};

function FechaConvert(fecha) {
    var SistemaFecha = new Date();
    SistemaFecha=fecha;
    var diaactual="";
    var mesactual="";
    var anioactual= SistemaFecha.getFullYear();
    if (SistemaFecha.getDate().toString().length < 2){
        diaactual =  "0" + (SistemaFecha.getDate());
    }else{diaactual =  SistemaFecha.getDate();}
    if (SistemaFecha.getMonth().toString().length < 2){
        mesactual =  "0" + (SistemaFecha.getMonth()+1);
    }
    fechafinal = diaactual + '-' + mesactual + '-' + anioactual;
    return fechafinal;
};
function FechaConvertString(fecha) {
    var SistemaFecha = new Date();
    SistemaFecha=fecha;
    var diaactual="";
    var mesactual="";
    var anioactual= SistemaFecha.getFullYear();
    if (SistemaFecha.getDate().toString().length < 2){
        diaactual =  "0" + (SistemaFecha.getDate());
    }else{diaactual =  SistemaFecha.getDate();}
    if (SistemaFecha.getMonth().toString().length < 2){
        mesactual =  "0" + (SistemaFecha.getMonth()+1);
    }
    fechafinal = diaactual + '/' + mesactual + '/' + anioactual;
    return fechafinal;
};

function GetTodayDateV3() {
    const SistemaFecha = new Date();
    var diaactual="";
    var mesactual="";
    var anioactual= SistemaFecha.getFullYear();
    if (SistemaFecha.getDate().toString().length < 2){
        diaactual =  "0" + (SistemaFecha.getDate());
    }else{diaactual =  SistemaFecha.getDate();}
    if (SistemaFecha.getMonth().toString().length < 2){
        mesactual =  "0" + (SistemaFecha.getMonth()+1);
    }
    fechafinal2 = anioactual  + '-' + mesactual + '-' + diaactual;
    return fechafinal2;
};

function ConviertoFechaaInput(fecha) {
    var SistemaFecha = new Date();
    SistemaFecha=fecha;
    var diaactual="";
    var mesactual="";
    var anioactual= SistemaFecha.getFullYear();
    if (SistemaFecha.getDate().toString().length < 2){
        diaactual =  "0" + (SistemaFecha.getDate());
    }else{diaactual =  SistemaFecha.getDate();}
    if (SistemaFecha.getMonth().toString().length < 2){
        mesactual =  "0" + (SistemaFecha.getMonth()+1);
    }
    fechafinal2 = anioactual  + '-' + mesactual + '-' + diaactual;
    return fechafinal2;
};
function InicializoFechas_id(idfecha) {
    $(`#${idfecha}`).datepicker({
        firstDay: true,
        format: 'dd-mm-yyyy',
        // setDefaultDate: true,
        // defaultDate: new Date(GetTodayDate()),
        i18n: {
            cancel: 'Cancelar',
            clear: 'Limpiar',
            done: 'OK',
            close: 'Cerrar',
            default: 'now',
            today: 'Hoy',
            months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto",
                "Septiembre", "Octubre", "Noviembre", "Diciembre"
            ],
            monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Set", "Oct",
                "Nov", "Dic"
            ],
            weekdays: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
            weekdaysShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
            weekdaysAbbrev: ["D", "L", "M", "M", "J", "V", "S"]
        }
    });
}

function InicializoHora_id(idhora){
    $(`#${idhora}`).timepicker();
}