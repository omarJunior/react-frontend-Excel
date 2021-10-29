import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import styled, { keyframes } from 'styled-components';
import swal from 'sweetalert';
import { columnas } from './columna_cliente'; //tabla de columna
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
      <div>Cargando clientes...</div>
    </div>
  )
} 

const convertArrayOfObjectsToCSV = (array)=>{
    let result;
    const columnDelimiter = ';';
    const lineDelimiter = '\n';
    const keys = ['nombres', 'apellidos', 'direccion', 'telefono', 'correo', 'ciudad', 'empresa', 'estatus'];

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

    const filename = 'clientes.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', filename);
    link.click();
}    


export const Clientes = () => {
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
        }, 1000);
        return () => clearTimeout(timeout);
    }, [rows]);

    useEffect(() => {
       obtenerLocalStorage('clientes');
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
        localStorage.setItem('clientes',JSON.stringify(dato));
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
                text: "Guarda primero el archivo antes de mostrar los clientes!",
                icon: "warning",
                buttons: "Aceptar",
                dangerMode: true,
              })
              .then((willDelete) => {
                if (willDelete) {
                    window.location = "/clientes";
                } 
              });
        }

        try {
            const resp = await fetch("http://localhost:8000/api/clientes/leer-csv/", {
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
                        text: "Csv cargado correctamente en la base de datos, cargue la pagina o muestre los clientes",
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
                text: "Asegurate de cargar el csv o un formato correcto!",
                icon: "warning",
                buttons: "Aceptar"
            });
        }else{
            obtenerLocalStorage('clientes');
        }
    }

    const handleClickRemoveTable = ()=>{
        localStorage.removeItem('clientes');
        const data = obtenerLocalStorage('clientes'); 
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
/* 
    const modalStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: 'translate(-50%, -50%)'
    } */

    const insertarCliente = async()=>{
        try {
            let nombres = document.getElementById("nombres").value;
            let apellidos = document.getElementById("apellidos").value;
            let direccion = document.getElementById("direccion").value;
            let telefono = document.getElementById("telefono").value;
            let correo = document.getElementById("correo").value;
            let ciudad = document.getElementById("ciudad").value;
            let empresa = document.getElementById("empresa").value;
            let estatus = document.getElementById("estatus").value;
            
            const body = {
                nombres,
                apellidos,
                direccion,
                telefono,
                correo,
                ciudad,
                empresa,
                estatus
            }
            const resp = await fetch("http://localhost:8000/api/clientes/", { method:'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });
            if(resp.ok){
                const data = await resp.json();
                console.log("Datos insertados");
                console.log(data);
                setModal_state(false);
                const datosStorage = JSON.parse(localStorage.getItem("clientes"));
                datosStorage.unshift(data);
                guardarLocalStorage(datosStorage);
                return swal({
                    title: "¡Mensaje!",
                    text: "Cliente insertado correctamente!",
                    icon: "success",
                    buttons: "Aceptar"
                }).then(yes_ =>{
                    if(yes_){
                        window.location = "/clientes"
                    }
                });
                
            }else{
                console.error("Ha ocurrido un error");
            }
        } catch (error) {
            throw new Error(error);
        }

    }
    return (
        <div className="container">
            <div className="content-input">
                <h3>Subir archivos de excel con los clientes</h3>
                <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
                    <input 
                        type="file"
                        className="form-control" 
                        name="csvClientes"
                    />
                    <div className="div-submit">
                        <input 
                            type="submit"
                            className="btn btn-success"
                            value="Cargar excel de clientes"
                        />
                    </div>
                </form>
                <button className="btn btn-success mt-4 mb-2 cl" onClick={handleButtonClick}>Mostrar Clientes</button>
               {
                   localStorage.getItem("clientes") !== null && !estado_storage && (
                        <>
                        <div className="container mb-4 mt-4">
                            <Modal isOpen={modal_state}>
                                <ModalHeader>
                                    ¡Insertar clientes!
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
                                        <Label for="direccion">Direccion</Label>
                                        <Input type="text" id="direccion" name="direccion"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="telefono">Telefono</Label>
                                        <Input type="text" id="telefono" name="telefono"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="correo">Correo</Label>
                                        <Input type="email" id="correo" name="correo"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="ciudad">Ciudad</Label>
                                        <Input type="text" id="ciudad" name="ciudad"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="empresa">Empresa</Label>
                                        <Input type="text" id="empresa" name="empresa"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="estatus">Estatus</Label>
                                        <Input type="text" id="estatus" name="estatus"></Input>
                                    </FormGroup>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={insertarCliente}>Insertar datos</Button>
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
                                title="Tabla de clientes"
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
