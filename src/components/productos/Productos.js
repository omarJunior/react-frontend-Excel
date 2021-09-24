import React, { useState } from 'react'
import '../Generales.css';

export const Productos = () => {
    let state = false
    const [subido, setSubido] = useState(state);
    const [file, setFile] = useState([])
    const [data, setData] = useState([])

    const handleSubmit = async(e)=>{
        e.preventDefault()
        let datoForm = e.target;
        try {
            const resp = await fetch("http://localhost:8000/api/productos/leer-csv/", {
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
                <h3>Subir archivos de excel con los productos</h3>
                <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
                    <input 
                        type="file"
                        className="form-control" 
                        name="csvProductos"
                        onChange={handleInputChange}
                    />
                    <div className="div-submit">
                    <input 
                        type="submit"
                        className="btn btn-success"
                        value="Cargar excel de productos"
                    />
                    </div>
                </form>
                <button className="btn btn-success mt-4 mb-2 cl" onClick={handleButtonClick}>Mostrar Productos</button>
                {
                    subido &&(
                        <div className="container mt-2">
                        <table className="table table-hover table-bordered">
                            <thead className="table-dark">
                                <tr>
                                    <th>Codigo</th>
                                    <th>Nombre producto</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Unidad</th>
                                    <th>Descuento</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                 data.map( item => {
                                    return <tr key={item.id} >
                                        <td>{item.codigo}</td>
                                        <td>{item.NombreProducto}</td>
                                        <td>{item.precio}</td>
                                        <td>{item.stock}</td>
                                        <td>{item.unidad}</td>
                                        <td>{item.descuento}</td>
                                        <td>{item.total}</td>
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
