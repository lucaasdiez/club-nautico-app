import { useEffect, useState } from "react";
import { getSocios } from "../services/sociosService";
import "./Socios.scss";

function Socios() {
  const [socios, setSocios] = useState([]);

  useEffect(() => {
    getSocios()
      .then((res) => setSocios(res.data))
      .catch((err) => console.error("Error cargando socios:", err));
  }, []);

  return (
    <div className="socios-page">
      <h1>Gestión de Socios</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>DNI</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {socios.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.nombre}</td>
              <td>{s.dni}</td>
              <td>{s.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Socios;
