import axios from 'axios';
import React, { useState } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'   

export const Tabla = () => {

    let state = false;
    const [estado, setEstado] = useState(state)
    const [data, setData] = useState([]);


    const handleButton = async()=>{
        setEstado(true);
       try{
            const resp = await axios.get('http://localhost:8000/api/clientes/');
            const data = await resp.data;
            setData(data);
       }catch(e){
           console.error(e);
           throw new Error(e);
       }
        
    }

    return (
        <div>
            <Header />
            <div className="container mt-2 mb-4">
                <h1 className="text-center text-primary">Consumiendo la api Rest</h1>
                <button className="btn btn-primary mt-4" onClick={handleButton} >Mostrar clientes</button>
            </div>
        
            {
                estado && (
                    <div className="container mt-2">
                        <table className="table table-hover table-bordered">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Nombres</th>
                                    <th>Apellidos</th>
                                    <th>Direccion</th>
                                    <th>Telefono</th>
                                    <th>Correo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                 data.map( item => {
                                    return <tr key={item.id} >
                                        <td>{item.id}</td>
                                        <td>{item.nombres}</td>
                                        <td>{item.apellidos}</td>
                                        <td>{item.direccion}</td>
                                        <td>{item.telefono}</td>
                                        <td>{item.correo}</td>
            
                                    </tr>
                                 })   
                                }
                            </tbody>
                        </table>
                    </div>
                )
            }
            <Footer/>
        </div>
    )
}
