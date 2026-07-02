import React from "react";
import "/src/images/patriciobebe.jpg";

/*Datos de ejemplo*/
const patricio = "/src/images/patriciobebe.jpg";
const altPatricio = "altPatricio";
const tituloPatricio = "Titulo Patricio";
const fechaPatricio = "12/12/2012";
const porcenPatricio = "%17";

/*meter parametros en el campo de la funcion cuando haya base de datos*/
const TarjetaProyecto = () => {
  return (
    <div className="div-fotoTarjeta">
      <div className="imagen-proyecto">
        <img src={patricio} alt={altPatricio} />
      </div>
      <div className="div-cuerpoTarjeta">
        <h3>{tituloPatricio}</h3>
        <p>Fecha esperada de termino: {fechaPatricio}</p>
        <p>Realización: {porcenPatricio}</p>
      </div>
    </div>
  );
};

export default TarjetaProyecto;
