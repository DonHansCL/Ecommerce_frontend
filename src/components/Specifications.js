import React from 'react';

function Specifications({ specs }) {
  if (!specs || Object.keys(specs).length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Especificaciones del Producto</h3>
      <table className="w-full table-auto border-collapse">
        <tbody>
          {Object.keys(specs).map((key) => (
            <tr key={key} className="border-b">
              <td className="py-2 px-4 font-medium text-gray-700 capitalize" style={{ width: '30%' }}>
                {key.replace(/([A-Z])/g, ' $1')}
              </td>
              <td className="py-2 px-4 text-gray-600">{specs[key]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Specifications;