import React from "react";
import { DayPicker } from "react-day-picker";
import { useState, useEffect } from "react";
import "react-day-picker/dist/style.css";

const convertirFecha = (stringFecha) => {
  const soloFecha = stringFecha.split("T")[0]; // corta antes de la "T" si existe
  let fechaSeparada = soloFecha.split("-");
  let año = Number(fechaSeparada[0]);
  let mes = Number(fechaSeparada[1]) - 1;
  let dia = Number(fechaSeparada[2]);
  return new Date(año, mes, dia);
};

const FechasProximas = ({ proyectos = [] }) => {
  const fechasFinSprint = proyectos
    .flatMap((proyecto) => proyecto.sprints.map((sprint) => sprint.fecha_fin))
    .map((fechaStr) => convertirFecha(fechaStr));

  const [feriados, setFeriados] = useState([]);

  useEffect(() => {
    fetch(import.meta.env.VITE_HOLIDAYS_API_URL)
      .then((res) => res.json())
      .then((json) => {
        const fechasConvertidas = json.data.map((feriado) =>
          convertirFecha(feriado.date),
        );
        console.log("Feriados convertidos:", fechasConvertidas);
        setFeriados(fechasConvertidas);
      });
  }, []);

  return (
    <DayPicker
      mode="single"
      modifiers={{
        finSprint: fechasFinSprint,
        feriado: feriados,
      }}
      modifiersClassNames={{
        finSprint: "!bg-blue-500 !text-white !rounded-full",
        feriado: "!bg-red-500 !text-white !rounded-full",
      }}
    />
  );
};

export default FechasProximas;
