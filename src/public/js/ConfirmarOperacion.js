

class Validacion {
  constructor(apellido, nombre, CUIL) {
    this.apellido = apellido;
    this.nombre = nombre;
    this.CUIL = CUIL;
  };
  QuitarLitigante() {
    Swal.fire({
      title: "Confirma a esta persona como NO Litigante?",
      text: this.apellido + " " + this.nombre + " - C.U.I.L.: " + this.CUIL,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Quiero quitarlo, no es Litigante!",
      cancelButtonText: "   No, Cancelar!   ",
    }).then((result) => {
      if (result.isConfirmed) {
        // alert(typeof(TotDocCUIL(this.CUIL)));
        var cntdoc = parseInt(TotDocCUIL(this.CUIL));
        // alert(cntdoc);
        // alert(typeof(cntdoc));

        switch (true) {
          case cntdoc > 0:
            // alert('mayor a cero');
            // No se puede Cambiar porque tiene documentos asociados
            Swal.fire(
              'No Puede Realizar la Operacion!',
              'Este Individuo Posee :  ' + TotDocCUIL(this.CUIL) + 'Doc. Asociados  !   Elimine dichos Documentos previo a quitarlo como no litigante',
              'error'
            )
            break;
          case cntdoc === 0:
            // Esto permite realizar el cambio ya que se determino que no tiene documentos asociados
            // alert('IGUAL A CERO');
            Litigante(this.CUIL, "NO");
            CntDocNAVBAR();
            ReloadDatatables();
            ReloadHighCharts();
            Swal.fire(
              this.apellido + " " + this.nombre + " - C.U.I.L.: " + this.CUIL,
              "Ha sido retirado del Listado de Litigantes.",
              "success"
            );
            break;

          default:
            Swal.fire(
              'ERROR',
              'Verifique su Conexion a Internet',
              'error'
            )
            break;
        }

      }
    });
  };
  AgregarLitigante() {
    Swal.fire({
      title: "Confirma a esta persona como Litigante?",
      text: this.apellido  + " " + this.nombre + " - C.U.I.L.: " + cuil,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, es Litigante!",
      cancelButtonText: "No, Cancelar!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          this.apellido  + " " + this.nombre + " - C.U.I.L.: " + this.CUIL,
          "Ha sido agregado al Listado de Litigantes.",
          "success"
        );
        Litigante(this.CUIL, "SI");
        // CntDocNAVBAR(); ver si funciona el reload
        tablaPersonal.ajax.reload(null, false);
        // ReloadHighCharts();
      }
    });

  };

}


function TotDocCUIL(CUIL) {
  let respuesta = "nada";
  $.ajax({
    url: "ChangeStatusJudiciales/db_R1.php",
    type: "POST",
    datatype: "json",
    data: { CUIL: CUIL },
    async: false,
    success: function (response) {
      respuesta = response;
    }
  });
  return respuesta;
}



function Litigante(CUIL, SIoNO) {
  $.ajax({
    url: "ChangeStatusJudiciales/db_U1.php",
    type: "POST",
    datatype: "json",
    async:true,
    data: { CUIL: CUIL, SIoNO: SIoNO },
    success : function(response){
      // alert(response);
    }
  });
}






