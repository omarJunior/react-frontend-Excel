import React, {  useState, useEffect }  from 'react';
import DataTable from 'react-data-table-component';
import styled, { keyframes } from 'styled-components';
import swal from 'sweetalert';
import { columnas } from './columna_concesionario';
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
        <div>Cargando concesionario...</div>
      </div>
    )
} 


const convertArrayOfObjectsToCSV = (array)=>{
    let result;
    const columnDelimiter = ';';
    const lineDelimiter = '\n';
    const keys = ['codigo', 'nombre', 'direccion', 'ciudad', 'tipo', 'cantidad_vehiculos','descripcion', 'renta', 'cordinador'];

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

    const filename = 'concesionario.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', filename);
    link.click();
}    


export const Concesionario = () => {

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
        return () => clearTimeout(timeout);
    }, [rows]);
    
    useEffect(()=>{
        obtenerLocalStorage('concesionario');
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
        localStorage.setItem('concesionario', JSON.stringify(dato));
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
                text: "Carga primero el archivo antes de mostrar el concesionario!",
                icon: "warning",
                buttons: "Aceptar",
                dangerMode: true,
              })
              .then((willDelete) => {
                if (willDelete) {
                    window.location = "/concesionario";
                } 
              });
        }
        try {
            const resp = await fetch("http://localhost:8000/api/concesionario/leer-csv/", {
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
                text: "Asegurate de cargar el csv o un formato correcto!",
                icon: "warning",
                buttons: "Aceptar"
            });
        }else{
            obtenerLocalStorage('concesionario');
        }
    }

    const handleClickRemoveTable = ()=>{
        localStorage.removeItem('concesionario');
        const data = obtenerLocalStorage('concesionario');
        if(data === null){
            setEstado_storage(true);
            console.log('Has borrado el localstorage');
        }
    }

    const handleClickDowload = (arreglo)=>{
        downloadCSV(arreglo);
    }

    const abrirModal = ()=>{
        setModal_state(true);
    }

    const cerrarModal = ()=>{
        setModal_state(false);
    }

    const insertarConcesionario = async()=>{
        try{
            let codigo = document.getElementById("codigo").value;
            let nombre = document.getElementById("nombre").value;
            let direccion = document.getElementById("direccion").value;
            let ciudad = document.getElementById("ciudad").value;
            let tipo = document.getElementById("tipo").value;
            let cantidad_vehiculos = document.getElementById("cantidad_vehiculos").value;
            let descripcion = document.getElementById("descripcion").value;
            let renta = document.getElementById("renta").value;
            let cordinador = document.getElementById("cordinador").value;

            const body = {
                codigo,
                nombre,
                direccion,
                ciudad,
                tipo,
                cantidad_vehiculos,
                descripcion,
                renta,
                cordinador,
            };

            const resp = await fetch(`http://localhost:8000/api/concesionario/`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)} );
            if(resp.ok){
                const data = await resp.json();
                console.log(data);
                setModal_state(false);
                const datoStorage = JSON.parse(localStorage.getItem("concesionario"));
                datoStorage.unshift(data);
                guardarLocalStorage(datoStorage);
                return swal({
                    title: "¡Mensaje!",
                    text: "Concesionario insertado correctamente!",
                    icon: "success",
                    buttons: "Aceptar"
                }).then(yes_ =>{
                    if(yes_){
                        window.location = "/concesionario"
                    }
                });
            }else{
                console.error("Ha ocurrido un error");
            }

        }catch(e){
            console.error(e)
            throw new Error(e);
        }

    }


    return (
        <div className="container">
            <div className="content-input">
                <h3>Subir archivos de excel con el concesionario</h3>
                <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
                    <input 
                        type="file"
                        className="form-control" 
                        name="csvConcesionario"
                    />
                <div className="div-submit">
                    <input 
                            type="submit"
                            className="btn btn-success"
                            value="Cargar excel del concesionario"
                        />
                    </div> 
                </form>
                <button className="btn btn-success mt-4 mb-2 cl" onClick={handleButtonClick}>Mostrar Concesionario</button>
                {
                    localStorage.getItem("concesionario") !== null && !estado_storage &&(
                        <>
                        <div className="container mb-4 mt-4">
                            <Modal isOpen={modal_state}>
                                <ModalHeader>
                                    ¡Insertar concesionario!
                                </ModalHeader>
                                <ModalBody>
                                    <FormGroup>
                                        <Label for="codigo">Codigo</Label>
                                        <Input type="text" id="codigo" name="codigo"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="nombre">Nombre</Label>
                                        <Input type="text" id="nombre" name="nombre"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="direccion">Direccion</Label>
                                        <Input type="text" id="direccion" name="direccion"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="ciudad">Ciudad</Label>
                                        <Input type="text" id="ciudad" name="ciudad"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="tipo">Tipo_concesionario</Label>
                                        <Input type="text" id="tipo" name="tipo"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="cantidad_vehiculos">C.Vehiculos</Label>
                                        <Input type="text" id="cantidad_vehiculos" name="cantidad_vehiculos"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="descripcion">Descripcion</Label>
                                        <Input type="text" id="descripcion" name="descripcion"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="renta">Renta</Label>
                                        <Input type="text" id="renta" name="renta"></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="cordinador">Cordinador</Label>
                                        <Input type="text" id="cordinador" name="cordinador"></Input>
                                    </FormGroup>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={insertarConcesionario}>Insertar datos</Button>
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
                                title="Tabla de concesionario"
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
