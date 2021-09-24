import React, { useState } from 'react'
import '../Generales.css';

export const Articulo = () => {
    let state = false
    const [subido, setSubido] = useState(state);
    const [file, setFile] = useState([])
    const [data, setData] = useState([])

    const handleSubmit = async(e)=>{
        e.preventDefault()
        let datoForm = e.target;
        try {
            const resp = await fetch("http://localhost:8000/api/articulos/leer-csv/", {
                method: 'POST',
                body: new FormData(datoForm)
            })
            if(resp.ok){
                const data = await resp.json();
                console.log(data);
                setData(data);
            }else{
                console.error("Ha ocurrido un error");
            }
        } catch (error) {
            console.error(error);
            throw new Error(error)
        }
    }

    const handleButtonClick = ()=>{
        setSubido(true)
    }

    const handleInputChange = (e)=>{
        setFile(e.target.files);
    }

    return (
        <div className="container">
            <div className="content-input">
                <h3>Subir archivos de excel con los articulos</h3>
                <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
                    <input 
                        type="file"
                        className="form-control" 
                        name="csvArticulos"
                        onChange={handleInputChange}
                    />
                  <div class="div-submit">
                    <input 
                            type="submit"
                            className="btn btn-success"
                            value="Cargar excel de articulos"
                        />
                    </div> 
                </form>
                <button className="btn btn-success mt-4 mb-2 cl" onClick={handleButtonClick}>Mostrar Articulos</button>
                {
                    subido &&(
                        <div className="container mt-2">
                        <table className="table table-hover table-bordered">
                            <thead className="table-dark">
                                <tr>
                                    <th>Nombres</th>
                                    <th>Precio</th>
                                    <th>Iva</th>
                                    <th>Descripcion</th>
                                    <th>Stock</th>
                                    <th>Cantidad</th>
                                    <th>Tipo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                 data.map( item => {
                                    return <tr key={item.id} >
                                        <td>{item.nombres}</td>
                                        <td>{item.precio}</td>
                                        <td>{item.iva}</td>
                                        <td>{item.descripcion}</td>
                                        <td>{item.stock}</td>
                                        <td>{item.cantidad}</td>
                                        <td>{item.tipo}</td>
                                    </tr>
                                 })   
                                }
                            </tbody>
                        </table>
                    </div>
                    )
                }
            </div>
        </div>
    )
}
