import React, { useState, useEffect } from "react";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

function App() {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState(0);
  const [pais, setPais] = useState("");
  const [cargo, setCargo] = useState("");
  const [anios, setAnios] = useState(0);
  const [id, setId] = useState(0);

  const [editar, setEditar] = useState(false);
  const [empleadosList, setEmpleados] = useState([]);

  useEffect(() => {
    getEmpleados();
  }, []);

  const validarCampos = () => {
    const nombrePattern = /^[a-zA-Z\s]+$/;
    const paisPattern = /^[a-zA-Z\s]+$/;
    const cargoPattern = /^[a-zA-Z\s]+$/;

    if (
      !nombre ||
      edad <= 17 ||
      !pais ||
      !cargo ||
      anios <= -1 ||
      !nombre.match(nombrePattern) ||
      !pais.match(paisPattern) ||
      !cargo.match(cargoPattern)
    ) {
      Swal.fire({
        title: "Campos inválidos",
        text: "Por favor verifique los datos y vuelva a intentarlo nuevamente.",
        icon: "error",
        timer: 4000,
      });
      return false;
    }
    if (edad > 80) {
      Swal.fire({
        title: "Edad no válida",
        text: "La edad no puede ser mayor a 80 años.",
        icon: "error",
        timer: 4000,
      });
      return false;
    }
    return true;
  };

  const add = () => {
    if (!validarCampos()) return;

    Axios.post("http://localhost:3001/create", {
      nombre: nombre,
      edad: edad,
      pais: pais,
      cargo: cargo,
      anios: anios,
    })
      .then(() => {
        limpiarCampos();
        getEmpleados();
        Swal.fire({
          title: "<strong>Registro exitoso</strong>",
          html: "<i>El empleado " + nombre + " fue registrado con éxito</i>",
          icon: "success",
          timer: 1900,
        });
      })
      .catch((error) => {
        console.error("Error al registrar empleado:", error);
      });
  };

  const update = () => {
    if (!validarCampos()) return;

    Axios.put("http://localhost:3001/update", {
      id: id,
      nombre: nombre,
      edad: edad,
      pais: pais,
      cargo: cargo,
      anios: anios,
    })
      .then(() => {
        getEmpleados();
        limpiarCampos();
        Swal.fire({
          title: "<strong>Actualizado satisfactoriamente</strong>",
          html: "<i>El empleado " + nombre + " fue registrado con éxito</i>",
          icon: "success",
          timer: 1900,
        });
      })
      .catch((error) => {
        console.error("Error al actualizar empleado:", error);
      });
  };

  const deleteEmple = (val) => {
    Swal.fire({
      title: "¿Confirmar eliminación?",
      html: "<i>¿Está seguro de eliminar a " + val.nombre + "?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/delete/${val.id}`)
          .then(() => {
            getEmpleados();
            limpiarCampos();
          })
          .catch((error) => {
            console.error("Error al eliminar empleado:", error);
          });

        Swal.fire({
          icon: "success",
          title: val.nombre + " fue eliminado",
          showConfirmButton: false,
          timer: 1900,
        });
      }
    });
  };

  const limpiarCampos = () => {
    setNombre("");
    setEdad(0);
    setPais("");
    setCargo("");
    setAnios(0);
    setEditar(false);
  };

  const editarEmpleado = (val) => {
    setEditar(true);
    setId(val.id);
    setNombre(val.nombre);
    setEdad(val.edad);
    setPais(val.pais);
    setCargo(val.cargo);
    setAnios(val.anios);
  };

  const getEmpleados = () => {
    Axios.get("http://localhost:3001/empleados").then((response) => {
      setEmpleados(response.data);
    });
  };

  return (
    <div className="container">
      <div className="card text-center">
        <div className="card-header">Gestión Empleados Delicrem</div>
        <div className="card-body">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Nombre:
            </span>
            <input
              type="text"
              onChange={(event) => {
                setNombre(event.target.value);
              }}
              className="form-control"
              value={nombre}
              placeholder="Ingrese su nombre"
              aria-label="Nombre"
              aria-describedby="basic-addon1"
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon2">
              Edad:
            </span>
            <input
              type="number"
              onChange={(event) => {
                setEdad(Number(event.target.value));
              }}
              className="form-control"
              value={edad}
              placeholder="Ingrese la edad"
              aria-label="Edad"
              aria-describedby="basic-addon2"
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon3">
              País:
            </span>
            <input
              type="text"
              onChange={(event) => {
                setPais(event.target.value);
              }}
              className="form-control"
              value={pais}
              placeholder="Ingrese el país"
              aria-label="País"
              aria-describedby="basic-addon3"
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon4">
              Cargo:
            </span>
            <input
              type="text"
              onChange={(event) => {
                setCargo(event.target.value);
              }}
              className="form-control"
              value={cargo}
              placeholder="Ingrese el cargo"
              aria-label="Cargo"
              aria-describedby="basic-addon4"
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon5">
              Años de experiencia:
            </span>
            <input
              type="number"
              onChange={(event) => {
                setAnios(Number(event.target.value));
              }}
              className="form-control"
              value={anios}
              placeholder="Ingrese los años de experiencia"
              aria-label="Años de experiencia"
              aria-describedby="basic-addon5"
            />
          </div>
        </div>
        <div className="card-footer text-muted">
          {editar ? (
            <div>
              <button className="btn btn-warning m-2" onClick={update}>
                Actualizar
              </button>
              <button className="btn btn-info m-2" onClick={limpiarCampos}>
                Cancelar
              </button>
            </div>
          ) : (
            <div>
              <button className="btn btn-primary" onClick={add}>
                Registrar
              </button>
              <button className="btn btn-secondary" onClick={getEmpleados}>
                Listar
              </button>
            </div>
          )}
        </div>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nombre</th>
            <th scope="col">Edad</th>
            <th scope="col">País</th>
            <th scope="col">Cargo</th>
            <th scope="col">Experiencia</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleadosList.map((val, key) => (
            <tr key={val.id}>
              <th>{val.id}</th>
              <td>{val.nombre}</td>
              <td>{val.edad}</td>
              <td>{val.pais}</td>
              <td>{val.cargo}</td>
              <td>{val.anios}</td>
              <td>
                <div className="btn-group" role="group" aria-label="Basic example">
                  <button
                    type="button"
                    onClick={() => editarEmpleado(val)}
                    className="btn btn-info"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteEmple(val)}
                    className="btn btn-danger"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
