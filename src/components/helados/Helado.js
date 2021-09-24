import React, { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component';
import styled, { keyframes } from 'styled-components';
import swal from 'sweetalert';
import columnas from './columna_helado'; //columna helado
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
  

export const Helado = () => {
    let state = false;
    let state2 = true;
    const arreglo = [];
    const [subido, setSubido] = useState(state);
    const [rows, setRows] = useState(arreglo);
    const [pending, setPendig] = useState(state2);
    const [file, setFile] = useState([]);

    useEffect(() => {
        const timeout = setTimeout(()=>{
            setRows(rows);
            setPendig(false);
        }, 2000)
        return () => clearTimeout(timeout);
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

    const handleSubmit = async(e)=>{
        e.preventDefault()
        let datoForm = e.target;
        try {
            const resp = await fetch("http://localhost:8000/api/helados/leer-csv/", {
                method: 'POST',
                body: new FormData(datoForm)
            })
            if(resp.ok){
                const data = await resp.json();
                setRows(data);
                console.log(data);
                if(!Array.isArray(data)){
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
        if(!Array.isArray(rows)){
            setSubido(false);
            swal({
                title: "¡Mensaje!",
                text: "Asegurate de cargar el csv o un formato correcto!",
                icon: "warning",
                buttons: "Aceptar"
            });
        }else{
            setSubido(true)
        }
    }

    const handleInputChange = (e)=>{
        setFile(e.target.files);
    }

    return (
        <div className="container">
            <div className="content-input">
                <h3>Subir archivos de excel con los helados</h3>
                <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
                    <input 
                        type="file"
                        className="form-control" 
                        name="csvHelados"
                        onChange={handleInputChange}
                    />
                  <div className="div-submit">
                    <input 
                            type="submit"
                            className="btn btn-success"
                            value="Cargar excel de helados"
                        />
                    </div> 
                </form>
                <button className="btn btn-success mt-4 mb-2 cl" onClick={handleButtonClick}>Mostrar Helados</button>
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
