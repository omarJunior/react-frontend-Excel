import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import styled, { keyframes } from 'styled-components';
import swal from 'sweetalert';
import {columnas} from './columnas_saber_pro';
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
      <div>Cargando pruebas saber Pro...</div>
    </div>
  )
} 

const convertArrayOfObjectsToCSV = (array)=>{
    let result;
    const columnDelimiter = ';';
    const lineDelimiter = '\n';
    const keys = ['nombres', 'apellidos', 'genero', 'ciudad', 'matematicas', 'lenguaje', 'ciencias', 'ingles', 'ciudadanas', 'fisica'];

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

    const filename = 'saberPro.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', filename);
    link.click();
}    


export const SaberPro = () => {
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
    const [modal_state, setModal_state] = useState(estadoModal);

    
    useEffect(() => {
        const timeout = setTimeout(()=>{
            setRows(rows);
            setPending(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }, [rows]);

    useEffect(() => {
        obtenerLocalStorage('saberPro');
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
        localStorage.setItem('saberPro',JSON.stringify(dato));
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
                text: "Carga primero el archivo antes de mostrar las pruebasPro!",
                icon: "warning",
                buttons: "Aceptar",
                dangerMode: true,
              })
              .then((willDelete) => {
                if (willDelete) {
                    window.location = "/saberPro";
                } 
              });
        }

        try {
            const resp = await fetch("http://localhost:8000/api/saberPro/leer-csv/", {
                method: 'POST',
                body: new FormData(datoForm)
            })
            if(resp.ok){
                const data = await resp.json();
                setRows(data);
                console.log(data)
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
        if(!Array.isArray(rows) && typeof rows === "object"){
            swal({
                title: "¡Mensaje!",
                text: "Asegurate de cargar el csv o un formato correcto!",
                icon: "warning",
                buttons: "Aceptar"
            });
        }else{
            obtenerLocalStorage('saberPro');
        }
    }

    const handleClickRemoveTable = ()=>{
        localStorage.removeItem('saberPro');
        const data = obtenerLocalStorage('saberPro'); 
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

    const insertarPruebaSaberPro = async()=>{
        try{
            let nombres = document.getElementById("nombres").value;
            let apellidos = document.getElementById("apellidos").value;
            let genero = document.getElementById("genero").value;
            let ciudad = document.getElementById("ciudad").value;
            let matematicas = document.getElementById("matematicas").value;
            let lenguaje = document.getElementById("lenguaje").value;
            let ciencias = document.getElementById("ciencias").value;
            let ingles = document.getElementById("ingles").value;
            let ciudadanas = document.getElementById("ciudadanas").value;
            let fisica = document.getElementById("fisica").value;

            const body = {
                nombres,
                apellidos,
                genero,
                ciudad,
                matematicas,
                lenguaje,
                ciencias,
                ingles,
                ciudadanas,
                fisica,
            };

            const resp = await fetch("http://localhost:8000/api/saberPro/", { method:'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            if(resp.ok){
                const data = await resp.json();
                console.log("Datos insertados");
                console.log(data);
                setModal_state(false);
                const datosStorage = JSON.parse(localStorage.getItem("saberPro"));
                datosStorage.unshift(data);
                guardarLocalStorage(datosStorage);
                return swal({
                    title: "¡Mensaje!",
                    text: "Prueba insertada correctamente!",
                    icon: "success",
                    buttons: "Aceptar"
                }).then(yes_ =>{
                    if(yes_){
                        window.location = "/saberPro"
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
                <h3>Subir archivos de excel con las pruebas Saber Pro</h3>
                <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
                    <input 
                        type="file"
                        className="form-control" 
                        name="csvSaberPro"
                    />
                    <div className="div-submit">
                        <input 
                            type="submit"
                            className="btn btn-success"
                            value="Cargar excel de saberPro"
                        />
                    </div>
                </form>
                <button className="btn btn-success mt-4 mb-2 cl" onClick={handleButtonClick}>Mostrar Pruebas</button>
                {
                    localStorage.getItem("saberPro") !== null && !estado_storage  &&(
                        <>
                         <div className="container mb-4 mt-4">
                            <Modal isOpen={modal_state}>
                                <ModalHeader>
                                    ¡Insertar pruebasPro!
                                </ModalHeader>
                                <ModalBody>
                                    <FormGroup>
                                        <Label for="nombres">Nombres</Label>
                                        <Input type="text" id="nombres" name="nombres"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="apellidos">Apellidos</Label>
                                        <Input type="text" id="apellidos" name="apellidos"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="genero">Genero</Label>
                                        <Input type="text" id="genero" name="genero"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="ciudad">Ciudad</Label>
                                        <Input type="text" id="ciudad" name="ciudad"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="matematicas">Matematicas</Label>
                                        <Input type="email" id="matematicas" name="matematicas"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="lenguaje">Lenguaje</Label>
                                        <Input type="text" id="lenguaje" name="lenguaje"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="ciencias">Ciencias</Label>
                                        <Input type="text" id="ciencias" name="ciencias"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="ingles">Ingles</Label>
                                        <Input type="text" id="ingles" name="ingles"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="ciudadanas">Ciudadanas</Label>
                                        <Input type="text" id="ciudadanas" name="ciudadanas"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="fisica">Fisica</Label>
                                        <Input type="text" id="fisica" name="fisica"></Input>
                                    </FormGroup>

                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={insertarPruebaSaberPro}>Insertar Datos</Button>
                                    <Button color="secondary" onClick={cerrarModal}>Cerrar</Button>
                                </ModalFooter>
                            </Modal>
                        </div>
                        <Button onClick={()=> abrirModal()} className="btn btn-success cl3">Add+</Button>
                        <div className="table-responsive ms">
                            <DataTable 
                                columns={columnas}
                                data={data_storage}
                                progressPending={pending}
                                progressComponent={<CustomLoader />}
                                onSort={handleSort}
                                sortFunction={customSort}
                                title="Tabla saberPro"
                                pagination
                                paginationComponentOptions={paginationOptions}
                                fixedHeader
                                fixedHeaderScrollHeight="1000px"
                                subHeader
                                />

                            <button className="btn btn-success mt-4 mb-2 cl" onClick={handleClickRemoveTable}>Eliminar tabla</button>
                            <button className="btn btn-success mt-4 mb-2 cl2" onClick={() => handleClickDowload(data_storage)}>Descargar csv</button>
                        </div>
                        </>
                    )
                }
            </div>
        </div>
    )
}
