import React, { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component';
import styled, { keyframes } from 'styled-components';
import swal from 'sweetalert';
import { columnas } from "./columna_calificacion";
import { Button, Modal, ModalBody, ModalFooter, FormGroup, Input, Label, ModalHeader } from 'reactstrap';
import '../Generales.css';

const rotate360 = keyframes`
    from{
        transform: rotate(0deg) 
    }
    to{
        transform: rotate(360deg)
    }
`;


const Spinner = styled.div`
margin: 16px;
animation: ${rotate360} 1s linear infinite;
transform: translateZ(0);
border-top: 2px solid grey;
border-right: 2px solid grey;
border-bottom: 2px solid grey;
border-left: 4px solid black;
background: transparent;
width: 80px;
height: 80px;
border-radius: 50%;
`;

const CustomLoader = ()=>{
    return (
    <div style={{padding:'24px'}}>
        <Spinner />
        <div>Cargando calificaciones...</div>
    </div>
)
} 


const convertArrayOfObjectsToCSV = (array)=>{
    let result;
    const columnDelimiter = ';';
    const lineDelimiter = '\n';
    const keys = ['codinst', 'nombreinstitucion', 'codigomunicipio', 'nombremunicipio', 'departamento', 'calendario', 'naturaleza', 'jornada', 'promediomatematica', 'promedioquimica', 'promediofisica', 'promediobiologia', 'promediofilosofia', 'promedioingles', 'promediolenguaje', 'promediosociales', 'evaluados', 'periodo'];

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach(item => {
        let ctr = 0;
        keys.forEach(key => {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            
            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
}

const downloadCSV = (array)=>{
    const link = document.createElement('a');
    let csv = convertArrayOfObjectsToCSV(array);
    if (csv == null) return;

    const filename = 'calificaciones.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', filename);
    link.click();
}    

export const Calificaciones = () => {
    let estadoModal = false;
    let state2 = true;
    let err_slice = false;
    let estadoStorage = false;
    const arreglo = [];
    const [rows, setRows] = useState(arreglo);
    const [pending, setPending] = useState(state2);
    const [data_slice, setData_slice] = useState(err_slice);
    const [data_storage, setData_storage] = useState([]);
    const [estado_storage, setEstado_storage] = useState(estadoStorage);
    const [modal_state, setModal_state] = useState(estadoModal)

    useEffect(() => {
        const timeout = setTimeout(()=>{
            setRows(rows);
            setPending(false);
        }, 1000)
        return () => clearTimeout(timeout)
    }, [rows]);

    useEffect(() => {
        obtenerLocalStorage('calificaciones');
     }, []);
 

    const customSort = (rows, selector, direction) => {
        return rows.sort((a, b) => {
        const aField = selector(a).toLowerCase();
        const bField = selector(b).toLowerCase();
    
        let comparison = 0;
    
        if (aField > bField) {
            comparison = 1;
        } else if (aField < bField) {
            comparison = -1;
        }
    
        return direction === 'desc' ? comparison * -1 : comparison;
        });
    }

    
    const paginationOptions = {
        rowsPerPageText:'Filas por pagina',
        rangeSeparatorText: 'de',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Todos'
      }
      
    const handleSort = (column, sortDirection) => console.log(column.selector, sortDirection);

    const guardarLocalStorage = (dato)=>{
        localStorage.setItem('calificaciones',JSON.stringify(dato));
    }
    const obtenerLocalStorage = (nombre) => {
        const dato = JSON.parse(localStorage.getItem(nombre));
        if(Array.isArray(dato) && dato !== null){
            setData_storage(dato);
        }else{
            console.log("Aun no hay data en el localstorage");
            return dato;
        }
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        let datoForm = e.target;
        if(data_slice &&  rows.length === 0){
            return swal({
                title: "Ha ocurrido un error!",
                text: "Carga primero el archivo antes de mostrar las calificaciones!",
                icon: "warning",
                buttons: "Aceptar",
                dangerMode: true,
              })
              .then((willDelete) => {
                if (willDelete) {
                    window.location = "/calificaciones";
                } 
              });
        }
        try {
            const resp = await fetch("http://localhost:8000/api/calificaciones/leer-csv/", {
                method: 'POST',
                body: new FormData(datoForm)
            })
            if(resp.ok){
                const data = await resp.json();
                setRows(data);
                console.log(data);
                if(!Array.isArray(data) && typeof data === "object"){
                    let mensaje = data.Data;
                    swal({
                        title: "¡Mensaje!",
                        text: mensaje,
                        icon: "error",
                        buttons: "Aceptar",
                        timer: "3000"
                    });
                }else{
                    guardarLocalStorage(data);
                    swal({
                        title: "¡Mensaje!",
                        text: "Csv cargado correctamente en la base de datos",
                        icon: "success",
                        buttons: "Aceptar",
                        timer: "3000"
                    });
                }
            }else{
                console.error("Ha ocurrido un error");
            }
        } catch (error) {
            console.error(error);
            throw new Error(error)
        }
    }

    const handleButtonClick = ()=>{
        if(rows.length === 0){
            setData_slice(true);
        }
        if(!Array.isArray(rows) && typeof rows == "object"){
            swal({
                title: "¡Mensaje!",
                text: "Asegurate de cargar el csv o un formato correcto",
                icon: "warning",
                buttons: "Aceptar"
            })
        }else{
            obtenerLocalStorage('calificaciones');
        }
    }

    const handleClickRemoveTable = ()=>{
        localStorage.removeItem('calificaciones');
        const data = obtenerLocalStorage('calificaciones'); 
        if(data === null){
            setEstado_storage(true);
            console.log("Has borrado el localstorage")
        }
    }

    const handleClickDowload = (arreglo)=>{
        downloadCSV(arreglo)
    }

    const abrirModal = ()=>{
        setModal_state(true);
    }

    const cerrarModal = ()=>{
        setModal_state(false);
    }

    const insertarCalificacion = async()=>{
        try{
            let codinst = document.getElementById("codinst").value;
            let nombreinstitucion = document.getElementById("nombreinstitucion").value;
            let codigomunicipio = document.getElementById("codigomunicipio").value;
            let nombremunicipio = document.getElementById("nombremunicipio").value;
            let departamento = document.getElementById("departamento").value;
            let calendario = document.getElementById("calendario").value;
            let naturaleza = document.getElementById("naturaleza").value;
            let jornada = document.getElementById("jornada").value;
            let promediomatematica = document.getElementById("promediomatematica").value;
            let promedioquimica = document.getElementById("promedioquimica").value;
            let promediofisica = document.getElementById("promediofisica").value;
            let promediobiologia = document.getElementById("promediobiologia").value;
            let promediofilosofia = document.getElementById("promediofilosofia").value;
            let promedioingles = document.getElementById("promedioingles").value;
            let promediolenguaje = document.getElementById("promediolenguaje").value;
            let promediosociales = document.getElementById("promediosociales").value;
            let evaluados = document.getElementById("evaluados").value;
            let periodo = document.getElementById("periodo").value;

            const body = {
                codinst,
                nombreinstitucion,
                codigomunicipio,
                nombremunicipio,
                departamento,
                calendario,
                naturaleza,
                jornada,
                promediomatematica,
                promedioquimica,
                promediofisica,
                promediobiologia,
                promediofilosofia,
                promedioingles,
                promediolenguaje,
                promediosociales,
                evaluados,
                periodo
            }

            const resp = await fetch("http://localhost:8000/api/calificaciones/", { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
            if(resp.ok){
                const data = await resp.json();
                console.log("Dato insertado");
                console.log(data);
                setModal_state(false);
                const datosStorage = JSON.parse(localStorage.getItem("calificaciones"));
                datosStorage.unshift(data);
                guardarLocalStorage(datosStorage);
                return swal({
                    title: "¡Mensaje!",
                    text: "Calificacion insertada correctamente!",
                    icon: "success",
                    buttons: "Aceptar"
                }).then(yes_ =>{
                    if(yes_){
                        window.location = "/calificaciones"
                    }
                });
            }else{
                console.error("Ha ocurrido un error");
            }
        }catch(e){
            throw new Error(e);
        }
    }

    return (
        <div className="container">
            <div className="content-input">
                <h3>Subir archivos de excel con las calificaciones</h3>
                <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
                    <input 
                        type="file"
                        className="form-control" 
                        name="csvCalificaciones"
                    />
                  <div className="div-submit">
                        <input 
                            type="submit"
                            className="btn btn-dark"
                            value="Cargar excel de calificaciones"
                        />  
                  </div>  
            
                </form>
                <button className="btn btn-dark mt-4 mb-2 cl" onClick={handleButtonClick}>Mostrar Calificaciones</button>
                {
                     localStorage.getItem("calificaciones") !== null && !estado_storage &&(

                        <>
                            <div className="container mb-4 mt-4">
                            <Modal isOpen={modal_state}>
                                <ModalHeader>
                                    ¡Insertar calificaciones!
                                </ModalHeader>
                                <ModalBody>
                                    <FormGroup>
                                        <Label for="codinst">Codigo Institucion</Label>
                                        <Input type="text" id="codinst" name="codinst"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="nombreinstitucion">Institucion</Label>
                                        <Input type="text" id="nombreinstitucion" name="nombreinstitucion"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="codigomunicipio">Codigo Municipio</Label>
                                        <Input type="text" id="codigomunicipio" name="codigomunicipio"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="nombremunicipio">Municipio</Label>
                                        <Input type="text" id="nombremunicipio" name="nombremunicipio"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="departamento">Departamento</Label>
                                        <Input type="text" id="departamento" name="departamento"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="calendario">Calendario</Label>
                                        <Input type="text" id="calendario" name="calendario"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="naturaleza">Naturaleza</Label>
                                        <Input type="text" id="naturaleza" name="naturaleza"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="jornada">Jornada</Label>
                                        <Input type="text" id="jornada" name="jornada"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="promediomatematica">Matematica</Label>
                                        <Input type="text" id="promediomatematica" name="promediomatematica"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="promedioquimica">Quimica</Label>
                                        <Input type="text" id="promedioquimica" name="promedioquimica"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="promediofisica">Fisica</Label>
                                        <Input type="text" id="promediofisica" name="promediofisica"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="promediobiologia">Biologia</Label>
                                        <Input type="text" id="promediobiologia" name="promediobiologia"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="promediofilosofia">Filosofia</Label>
                                        <Input type="text" id="promediofilosofia" name="promediofilosofia"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="promedioingles">Ingles</Label>
                                        <Input type="text" id="promedioingles" name="promedioingles"></Input>
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for="promediolenguaje">Lenguaje</Label>
                                        <Input type="text" id="promediolenguaje" name="promediolenguaje"></Input>
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for="promediosociales">Sociales</Label>
                                        <Input type="text" id="promediosociales" name="promediosociales"></Input>
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for="evaluados">Evaluados</Label>
                                        <Input type="text" id="evaluados" name="evaluados"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="periodo">Periodo</Label>
                                        <Input type="text" id="periodo" name="periodo"></Input>
                                    </FormGroup>
                                </ModalBody>
                                <ModalFooter>
                                    <Button className="btn btn-dark" onClick={insertarCalificacion}>Insertar datos</Button>
                                    <Button className="btn btn-dark" onClick={cerrarModal}>Cerrar</Button>
                                </ModalFooter>
                            </Modal>
                        </div>
                        <Button onClick={()=> abrirModal()} className="btn btn-dark cl3">Add+</Button>
                            <div className="table-responsive ms">
                                <DataTable 
                                columns={columnas}
                                data={data_storage}
                                progressPending={pending}
                                progressComponent={<CustomLoader />}
                                onSort={handleSort}
                                sortFunction={customSort}
                                title="Tabla de calificaciones"
                                pagination
                                paginationComponentOptions={paginationOptions}
                                fixedHeader
                                fixedHeaderScrollHeight="1000px"
                                subHeader
                                />
                                <button className="btn btn-dark mt-4 mb-2 cl" onClick={handleClickRemoveTable}>Eliminar tabla</button>
                                <button className="btn btn-dark mt-4 mb-2 cl2" onClick={() => handleClickDowload(data_storage)}>Descargar csv</button>
                            </div>
                        </>
                     
                    )
                }
            </div>
        </div>
    )
}
