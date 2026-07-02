import React from "react";
import TarjetaProyecto from "./TarjetaProyecto";
import FechasProximas from "./FechasProximas";

const Dashboard = () => {
  return (
    <div className="div-contenedor">
      <div className="div-tarjetas">
        <TarjetaProyecto />
      </div>

      <div className="div-fechas">
        <FechasProximas />
      </div>
    </div>
  );
};

export default Dashboard;
