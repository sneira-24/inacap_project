import React from "react";

const FechasProximas = ({ fechas = [] }) => {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Fechas Próximas
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500 uppercase text-xs tracking-wide">
              <th className="py-2 pr-2 font-medium">Proyecto</th>
              <th className="py-2 pr-2 font-medium">Descripción</th>
              <th className="py-2 pr-2 font-medium">Fecha Entrega</th>
            </tr>
          </thead>
          <tbody>
            {fechas.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-4 text-center text-gray-400">
                  No hay fechas próximas
                </td>
              </tr>
            ) : (
              fechas.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-2 pr-2 text-gray-700">{item.proyecto}</td>
                  <td className="py-2 pr-2 text-gray-500">
                    {item.descripcion}
                  </td>
                  <td className="py-2 pr-2 text-gray-700 whitespace-nowrap">
                    {item.fecha}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FechasProximas;
