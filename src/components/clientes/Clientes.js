import React, {useState, useEffect} from 'react';
import DataTable from 'react-data-table-component';
import styled, { keyframes } from 'styled-components';
import swal from 'sweetalert';
import columnas from './columna_cliente'; //tabla de columna
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

export const Clientes = () => {
    let state = false;
    let state2 = true;
    let err_slice = false;
    const arreglo = [];
    const [subido, setSubido] = useState(state);
    const [rows, setRows] = useState(arreglo);
    const [pending, setPending] = useState(state2);
    const [data_slice, setData_slice] = useState(err_slice);
    
    useEffect(() => {
        const timeout = setTimeout(()=>{
            setRows(rows);
            setPending(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }, [rows]);

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

    const handleSubmit = async(e)=>{
        e.preventDefault()
        let datoForm = e.target;
        if(data_slice &&  rows.length == 0){
            return swal({
                title: "Ha ocurrido un error!",
                text: "Carga primero el archivo antes de mostrar los clientes!",
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
                console.log(data)
                if(!Array.isArray(data) && typeof data === "object"){
                    swal({
                        title: "¡Mensaje!",
                        text: `${JSON.stringify(data)}`,
                        icon: "error",
                        buttons: "Aceptar",
                        timer: "3000"
                    });
                }else{
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
            setSubido(false);
            swal({
                title: "¡Mensaje!",
                text: "Asegurate de cargar el csv o un formato correcto!",
                icon: "warning",
                buttons: "Aceptar"
            });
        }else{
            setSubido(true);
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
                            className="btn btn-success mt-2"
                            value="Cargar excel de clientes"
                        />
                    </div>
                </form>
                <button className="btn btn-success mt-4 mb-2 cl" onClick={handleButtonClick}>Mostrar Clientes</button>
                {
                    subido &&(
                        <div className="table-responsive ms-4">
                            <DataTable 
                                columns={columnas}
                                data={rows}
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
                                /* subHeaderComponent={subHeaderComponentMemo} */
                                /* persistTableHead */
                                />
                        </div>
                    )
                }
            </div>
        </div>
    )
}
