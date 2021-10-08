import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import styled, { keyframes } from 'styled-components';
import swal from 'sweetalert';
import { columnas } from './columna_vehiculo';
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
        <div>Cargando vehiculos...</div>
      </div>
    )
  } 


const convertArrayOfObjectsToCSV = (array)=>{
    let result;
    const columnDelimiter = ';';
    const lineDelimiter = '\n';
    const keys = ['placa', 'modelo', 'marca', 'color', 'precio', 'descripcion'];

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

    const filename = 'vehiculos.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', filename);
    link.click();
}   


export const Vehiculos = () => {
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

    useEffect(()=>{
        const timeout = setTimeout(()=>{
            setRows(rows);
            setPending(false);
        }, 1000);
        return () => clearTimeout(timeout);
    },[rows]);

    useEffect(() => {
       obtenerLocalStorage('vehiculos');
    }, []);

    const customSort = (rows, selector, direction)=>{
        return rows.sort((a,b)=>{
            const aField = selector(a).toLowerCase();
            const bField = selector(b).toLowerCase();
            let comparison = 0;

            if(aField > bField){
                comparison = 1;
            }else if(aField < bField){
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
        localStorage.setItem('vehiculos',JSON.stringify(dato));
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
                text: "Carga primero el archivo antes de mostrar los vehiculos!",
                icon: "warning",
                buttons: "Aceptar",
                dangerMode: true,
              })
              .then((willDelete) => {
                if (willDelete) {
                    window.location = "/vehiculos";
                } 
              });
        }
        try {
            const resp = await fetch("http://localhost:8000/api/vehiculos/leer-csv/", {
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
        if(!Array.isArray(rows) && typeof rows === "object"){
            swal({
                title: "¡Mensaje!",
                text: "Asegurate de cargar el csv o un formato correcto!",
                icon: "warning",
                buttons: "Aceptar"
            });
        }else{
            obtenerLocalStorage('vehiculos');
        }
    }

    const handleClickRemoveTable = ()=>{
        localStorage.removeItem('vehiculos');
        const data = obtenerLocalStorage('vehiculos'); 
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

    const insertarVehiculo = async()=>{
        try{
            let placa = document.querySelector("#placa").value;
            let modelo = document.querySelector("#modelo").value;
            let marca = document.querySelector("#marca").value;
            let color = document.querySelector("#color").value;
            let precio = document.querySelector("#precio").value;
            let descripcion = document.querySelector("#descripcion").value;

            const body = {
                placa, 
                modelo, 
                marca, 
                color, 
                precio, 
                descripcion
            };

            const resp = await fetch("http://localhost:8000/api/vehiculos/", { method: 'POST', headers:{ 'Content-Type':'application/json'}, body: JSON.stringify(body) });
            if(resp.ok){
                const data = await resp.json();
                console.log("Datos insertados");
                console.log(data);
                setModal_state(false);
                const datoStorage = JSON.parse(localStorage.getItem("vehiculos"));
                datoStorage.unshift(data);
                guardarLocalStorage(datoStorage);
                return swal({
                    title: "¡Mensaje!",
                    text: "Vehiculo insertado correctamente!",
                    icon: "success",
                    buttons: "Aceptar"
                }).then(yes_ =>{
                    if(yes_){
                        window.location = "/vehiculos"
                    }
                });
            }else{
                console.error("Hubo un error en la response");
            }

        }catch(error){
            throw new Error(error);
        }
    }

    return (
        <div className="container">
            <div className="content-input">
                <h3>Subir archivos de excel con los vehiculos</h3>
                <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
                    <input 
                        type="file"
                        className="form-control" 
                        name="csvVehiculos"
                    />
                   <div className="div-submit">
                   <input 
                        type="submit"
                        className="btn btn-success"
                        value="Cargar excel de vehiculos"
                    />
                   </div>
                </form>
                <button className="btn btn-success mt-4 mb-2 cl" onClick={handleButtonClick}>Mostrar Vehiculos</button>
                {
                    localStorage.getItem("vehiculos") !== null && !estado_storage &&(
                        <>
                        <div className="container mb-4 mt-4">
                            <Modal isOpen={modal_state} >
                                <ModalHeader>
                                    inserta el vehiculo!
                                </ModalHeader>
                                <ModalBody>
                                    <FormGroup>
                                        <Label for="placa">Placa</Label>
                                        <Input type="text" id="placa" name="placa"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="modelo">Modelo</Label>
                                        <Input type="text" id="modelo" name="modelo"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="marca">Marca</Label>
                                        <Input type="text" id="marca" name="marca"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="color">Color</Label>
                                        <Input type="text" id="color" name="color"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="precio">Precio</Label>
                                        <Input type="email" id="precio" name="precio"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="descripcion">Descripcion</Label>
                                        <Input type="text" id="descripcion" name="descripcion"></Input>
                                    </FormGroup>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={insertarVehiculo}>Actualizar Datos</Button>
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
                                title="Tabla de vehiculos"
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
