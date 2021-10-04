import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../Form.css'

export const ClienteForm = () => {

    let arreglo_clientes;
    const {id} = useParams();
    const [data_cliente, setData_cliente] = useState({});

    useEffect(() => {
        const obtenerCliente = async()=>{
            try{
                const resp = await fetch(`http://localhost:8000/api/clientes/${id}`, {method: 'GET' });
                if(resp.ok){
                  const dato = await resp.json();
                  console.log(dato);
                  setData_cliente(dato);
                }else{
                  console.error("Ha ocurrido un error en la response");
                }
            }catch(e){
                throw new Error(e);
            }
        }
        obtenerCliente();
    }, [id]);

    const handleSubmit = async(e)=>{
        e.preventDefault();
        let datoForm = e.target;
        try{
            const resp = await fetch(`http://localhost:8000/api/clientes/${id}/`, {method: 'PUT', body: new FormData(datoForm)});
            if(resp.ok){
                const data = await resp.json();
                setData_cliente(data);
                console.log(data)
                cargarLocalStorage('clientes', JSON.stringify(data));
            }else{
                console.error("Ha ocurrido un error en la response");
            }
        }catch(e){
            throw new Error(e);
        }
     }

    const handleInputChange = (e)=>{
        setData_cliente({
            ...data_cliente,
            [e.target.name]: e.target.value
        })
    }

    const cargarLocalStorage = (nombre, json_cambiado_string)=>{    
        arreglo_clientes = JSON.parse(localStorage.getItem(nombre));
        let json_string;
        for(let x in arreglo_clientes){
            if(arreglo_clientes[x].id ===  Number(id)){
                json_string = JSON.stringify(arreglo_clientes[x]);
                let reemplazo = json_string.replace(json_string, json_cambiado_string);
                reemplazo = JSON.parse(reemplazo);
                let indice = x;
                arreglo_clientes[indice] = reemplazo;
                guardarDataLocalStorage();

            }
        }
    }

    const guardarDataLocalStorage = ()=>{
        localStorage.setItem('clientes', JSON.stringify(arreglo_clientes));
        window.location = "/clientes";
    }

    return (
        <div className="container-form">
            <div className="contenedor">
                <form onSubmit={handleSubmit}>
                    <h3>¡Edita el cliente!</h3>
                    <div>
                        <label for="nombres">Nombres:</label>
                        <input
                            type="text"
                            name="nombres"
                            value={data_cliente.nombres}
                            onChange={handleInputChange}
                            placeholder="Nombres"
                            autoFocus
                        />
                    </div>
                    <div>
                        <label for="apellidos">Apellidos:</label>
                        <input
                            type="text"
                            name="apellidos"
                            value={data_cliente.apellidos}
                            onChange={handleInputChange}
                            placeholder="Apellidos"
                        />
                    </div>
                    <div>
                    <label for="direccion">Direccion:</label>
                    <input
                        type="text"
                        name="direccion"
                        value={data_cliente.direccion}
                        onChange={handleInputChange}
                        placeholder="Direccion"
                    />
                    </div>
                    
                    <div>
                    <label for="telefono">Telefono:</label>
                        <input
                            type="text"
                            name="telefono"
                            value={data_cliente.telefono}
                            onChange={handleInputChange}
                            placeholder="Telefono"
                        />
                    </div>
                   
                    <div>
                        <label for="correo">Correo:</label>
                        <input
                            type="email"
                            name="correo"
                            value={data_cliente.correo}
                            onChange={handleInputChange}
                            placeholder="Correo"
                        />
                    </div>
                    <div>
                        <label for="ciudad">Ciudad:</label>
                        <input
                            type="text"
                            name="ciudad"
                            value={data_cliente.ciudad}
                            onChange={handleInputChange}
                            placeholder="Ciudad"
                        />
                    </div>
                    <div>
                        <label for="empresa">Empresa:</label>
                        <input
                            type="text"
                            name="empresa"
                            value={data_cliente.empresa}
                            onChange={handleInputChange}
                            placeholder="Empresa"
                        />
                    </div>
                    
                    <div>
                        <label for="estatus">Estatus:</label>
                        <input
                            type="text"
                            name="estatus"
                            value={data_cliente.estatus}
                            onChange={handleInputChange}
                            placeholder="Estatus"
                        />
                    </div>
                    <div className="botones-form">
                        <input 
                            type="submit"
                            className="btn btn-dark mt-2"
                            value="Actualizar cliente"
                        />
                    </div>
                   <div className="botones-form">
                        <Link className="btn btn-dark w-100" to="/clientes">Volver</Link>
                    </div>                     
                </form>
            </div>
           
        </div>
    )
}

