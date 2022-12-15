const FechaActual= function(){
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
}
module.exports = {FechaActual}