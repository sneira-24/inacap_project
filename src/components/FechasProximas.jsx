import React from "react";
import { DayPicker } from "react-day-picker";
import { useState, useEffect } from "react";
import "react-day-picker/dist/style.css";

const convertirFecha = (stringFecha) => {
  const soloFecha = stringFecha.split("T")[0];
  let fechaSeparada = soloFecha.split("-");
  let año = Number(fechaSeparada[0]);
  let mes = Number(fechaSeparada[1]) - 1;
  let dia = Number(fechaSeparada[2]);
  return new Date(año, mes, dia);
};

const diasHastaFecha = (fecha) => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const diferenciaMs = fecha.getTime() - hoy.getTime();
  return diferenciaMs / (1000 * 60 * 60 * 24);
};

// Compara si dos fechas son "el mismo día", ignorando la hora
const esMismoDia = (fechaA, fechaB) => {
  return fechaA.toDateString() === fechaB.toDateString();
};

const FechasProximas = ({ proyectos = [] }) => {
  // Ahora guardamos fecha + nombre juntos, no solo la fecha suelta
  const finesProyecto = proyectos
    .filter((proyecto) => proyecto.fecha_fin)
    .map((proyecto) => ({
      fecha: convertirFecha(proyecto.fecha_fin),
      nombre: proyecto.nombre,
    }));

  const fechasFinProyecto = finesProyecto.map((item) => item.fecha);

  const fechasUrgentes = finesProyecto
    .filter((item) => {
      const dias = diasHastaFecha(item.fecha);
      return dias >= 0 && dias <= 7;
    })
    .map((item) => item.fecha);

  const [feriadosInfo, setFeriadosInfo] = useState([]); // [{ fecha, nombre }]
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);

  useEffect(() => {
    fetch(import.meta.env.VITE_HOLIDAYS_API_URL)
      .then((res) => res.json())
      .then((json) => {
        const convertidos = json.data.map((feriado) => ({
          fecha: convertirFecha(feriado.date),
          nombre: feriado.title,
        }));
        setFeriadosInfo(convertidos);
      });
  }, []);

  const fechasFeriados = feriadosInfo.map((item) => item.fecha);

  // Arma el texto descriptivo del día seleccionado
  const obtenerDescripcion = () => {
    if (!diaSeleccionado) return null;

    const feriado = feriadosInfo.find((item) =>
      esMismoDia(item.fecha, diaSeleccionado),
    );
    if (feriado) return `Feriado: ${feriado.nombre}`;

    const proyecto = finesProyecto.find((item) =>
      esMismoDia(item.fecha, diaSeleccionado),
    );
    if (proyecto) return `Fecha esperada de termino: ${proyecto.nombre}`;

    return "Sin eventos para este día";
  };

  return (
    <div className="flex flex-wrap gap-4">
      <div className="shrink-0">
        <DayPicker
          mode="single"
          selected={diaSeleccionado}
          onSelect={setDiaSeleccionado}
          modifiers={{
            finProyecto: fechasFinProyecto,
            urgente: fechasUrgentes,
            feriado: fechasFeriados,
          }}
          modifiersClassNames={{
            finProyecto: "!bg-blue-500 !text-white !rounded-full",
            urgente: "!bg-red-500 !text-white !rounded-full",
            feriado: "!bg-orange-400 !text-white !rounded-full",
          }}
          classNames={{
            selected: "",
          }}
        />
      </div>

      <div className="min-w-[180px] flex-1 pt-2">
        {diaSeleccionado ? (
          <div>
            <p className="text-sm text-gray-500 mb-1">
              {diaSeleccionado.toLocaleDateString("es-CL", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="text-base font-semibold text-gray-800">
              {obtenerDescripcion()}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-400">
            Selecciona un día para ver el detalle
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-4 pt-3 mt-2 border-t border-gray-100 text-xs text-gray-600">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          Fin de proyecto
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
          Entrega próxima (≤ 7 días)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-400"></span>
          Feriado
        </div>
      </div>
    </div>
  );
};

export default FechasProximas;
