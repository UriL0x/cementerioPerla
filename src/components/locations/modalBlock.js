/*
  En este archivo estan lso componnetes necesarios para
  gestionar una manzana
*/

import { faTrash, faPlay, faX, faPlus, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { addRow, deleteRow, updateRow, editRow, addSection, deleteSection } from "../../api/locations"; 
import { NoData } from "../charge";
import { Collapse } from 'bootstrap';
import { Accordion, Button } from 'react-bootstrap';

const BtnAdd = ({ section, onRowAdded }) => {
  const [rowInput, setRowInput] = useState(false);
  const [styles, setStyles] = useState("btn-primary");
  const [icon, setIcon] = useState(faPlus);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const sendData = async () => {
    if (inputValue.trim() !== "") {
      try {
        const response = await addRow({
          num: inputValue,
          section: section.id,
        });
        let newRow = response.data.row;
        setRowInput(false);
        setInputValue("");
        onRowAdded(section.id, newRow); 
      } catch (error) {
        setError(true);
        setErrorMessage(
          error?.response?.data?.error || "No se pudo agregar la fila."
        );
      }
    }
  };

  return (
    <div className="d-flex flex-column">
      <div className="d-flex">
          <input
            className="form-control form-control-2 me-2"
            placeholder="Ingrese el numero de fila aqui para agregar y de click en el boton de la derecha"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        <button type="button" onClick={sendData} className={"btn " + styles}>
          <FontAwesomeIcon icon={icon} />
        </button>
      </div>
      {error && (
        <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
          {errorMessage}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
          ></button>
        </div>
      )}
    </div>
  );
};

export function RowField({ section, row, deleteFunction }) {
  const [editing, setEditing] = useState(false);
  const [num, setNum] = useState(row.num);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setNum(e.target.value);
  };

  const handleEdit = async () => {
    try {
      await editRow(row.id, {
        num: num,
        section: section.id,
      });
      setEditing(false);
    } catch (e) {
      setError("Error al actualizar el número.");
    }
  };

  return (
    <>
      <div className="d-flex align-items-center gap-2 w-100 mb-2">
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder={"Fila " + num}
          value={num}
          onChange={handleChange}
          disabled={!editing}
        />
        {!editing ? (
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => setEditing(true)}
          >
            Editar
          </button>
        ) : (
          <button
            className="btn btn-sm btn-success"
            onClick={handleEdit}
          >
            Guardar
          </button>
        )}
        <button
          className="btn btn-sm btn-outline-danger"
          type="button"
          onClick={() => deleteFunction(section.id, row.id)}
        >
          <FontAwesomeIcon icon={faX} />
        </button>
      </div>
      {error && <small className="text-danger">{error}</small>}
    </>
  );
}

export function BlockModal({ block }) {
  const [sections, setSections] = useState([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setSections(block.sections || []);
  }, [block]);

  const handleDeleteRow = async (sectionId, rowId) => {
    try {
      await deleteRow(rowId);
      const updatedSections = sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            rows: section.rows.filter((row) => row.id !== rowId),
          };
        }
        return section;
      });
      setSections(updatedSections);
    } catch (error) {
      setError("Error");
      setErrorMessage("No se pudo eliminar la fila.");
    }
  };

  const handleAddRow = (sectionId, newRow) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          rows: [...section.rows, newRow]
        };
      }
      return section;
    });
    setSections(updatedSections);
  };

  function AddSection() {
    const [num, setNum] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleClick = async () => {
      try {
        const response = await addSection({
          num: num,
          block: block.id
        });
        let newSection = response.data.section;
        setSections([...sections, newSection]);
      } catch (error) {
        setError(true);
        setErrorMessage(error?.response?.data?.error || 'Algo salió mal, inténtelo de nuevo');
      }
    };

    return (
      <div className="d-flex justify-content-end gap-3">
        <div>
          <input
            className={`form-control mt-1 ${error ? "is-invalid" : ""}`}
            placeholder="Ingrese un número"
            onChange={(e) => setNum(e.target.value)}
          />
          {error && <div className="invalid-feedback">{errorMessage}</div>}
        </div>
        <button type="button" className="btn btn-primary" onClick={handleClick}>
          Agregar cuadro +
        </button>
      </div>
    );
  }

  const handleDeleteSection = async (section) => {
    try {
      await deleteSection(section.id);
      const updated = sections.filter((s) => s.id !== section.id);
      setSections(updated);
    } catch (error) {
      setError(true);
      setErrorMessage("No se pudo eliminar la sección.");
    }
  };

  return (
     <div
      className="modal fade"
      id={"blockModal" + block.id}
      tabIndex="-1"
      aria-labelledby={"blockModalLabel" + block.id}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Manzana {block.num}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            {sections.length > 0 ? (
              <Accordion defaultActiveKey={null} alwaysOpen>
                {sections.map((section) => (
                  <Accordion.Item eventKey={String(section.id)} key={section.id}>
                    <div className="d-flex justify-content-between">
                    <Accordion.Header className="w-100">
                      <div className="d-flex justify-content-between align-items-center w-100">
                        <span className="spook-font fs-3">Cuadro {section.num}</span>
                      </div>
                    </Accordion.Header>
                    <Button
                          variant="danger"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation(); // evita toggle al hacer clic en eliminar
                            handleDeleteSection(section);
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} className="fs-3" />
                        </Button>
                    </div>
                    <Accordion.Body>
                      {section.rows && section.rows.length > 0 ? (
                        <ul className="list-group mb-2">
                          {section.rows.map((row) => (
                            <RowField
                              key={row.id}
                              row={row}
                              section={section}
                              deleteFunction={handleDeleteRow}
                            />
                          ))}
                        </ul>
                      ) : (
                        <p className="text-white spook-font">Sin filas</p>
                      )}
                      <BtnAdd section={section} onRowAdded={handleAddRow} />
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            ) : (
              <NoData message={"No hay cuadros registrados"} />
            )}

            {error && (
              <div className="alert alert-danger mt-3" role="alert">
                {errorMessage}
              </div>
            )}
          </div>

          <div className="container-fluid text-end mb-3">
            <AddSection />
          </div>
          <div className="modal-footer"></div>
        </div>
      </div>
    </div>
  );
}
