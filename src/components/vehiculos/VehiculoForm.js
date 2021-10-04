import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../Form.css'

export const VehiculoForm = ()=>{

	let arreglo_vehiculos;
	const {id} = useParams();
	const [data_vehiculo, setData_vehiculo] = useState({});

    useEffect(() => {
    	const obtenerVehiculo = async()=>{
            try{
                const resp = await fetch(`http://localhost:8000/api/vehiculos/${id}`, {method: 'GET' });
                if(resp.ok){
                  const dato = await resp.json();
                  console.log(dato);
                  setData_vehiculo(dato);
                }else{
                  console.error("Ha ocurrido un error en la response");
                }
            }catch(e){
                throw new Error(e);
            }
        }
        obtenerVehiculo();
    }, [id]);

 	const handleSubmit = async(e)=>{
        e.preventDefault();
        let datoForm = e.target;
        try{
            const resp = await fetch(`http://localhost:8000/api/vehiculos/${id}/`, {method: 'PUT', body: new FormData(datoForm)});
            if(resp.ok){
                const data = await resp.json();
                setData_vehiculo(data);
                console.log(data)
                cargarLocalStorage('vehiculos', JSON.stringify(data));
            }else{
                console.error("Ha ocurrido un error en la response");
            }
        }catch(e){
            throw new Error(e);
        }
     }

    const handleInputChange = (e)=>{
        setData_vehiculo({
            ...data_vehiculo,
            [e.target.name]: e.target.value
        })
    }

    const cargarLocalStorage = (nombre, json_cambiado_string)=>{    
        arreglo_vehiculos = JSON.parse(localStorage.getItem(nombre));
        let json_string;
        for(let x in arreglo_vehiculos){
            if(arreglo_vehiculos[x].id ===  Number(id)){
                json_string = JSON.stringify(arreglo_vehiculos[x]);
                let reemplazo = json_string.replace(json_string, json_cambiado_string);
                reemplazo = JSON.parse(reemplazo);
                let indice = x;
                arreglo_vehiculos[indice] = reemplazo;
                guardarDataLocalStorage();

            }
        }
    }

    const guardarDataLocalStorage = ()=>{
        localStorage.setItem('vehiculos', JSON.stringify(arreglo_vehiculos));
        window.location = "/vehiculos";
    }

	return (
		<div className="container-form">
            <div className="contenedor">
                <form onSubmit={handleSubmit}>
                    <h3>¡Edita el vehiculo!</h3>
                    <div>
                        <label for="placa"  >Placa:</label>
                        <input
                            type="text"
                            name="placa"
                            value={data_vehiculo.placa}
                            onChange={handleInputChange}
                            placeholder="Placa"
                        />
                    </div>
                    <div>
                        <label for="modelo">Modelo:</label>
                        <input
                            type="text"
                            name="modelo"
                            value={data_vehiculo.modelo}
                            onChange={handleInputChange}
                            placeholder="Modelo"
                        />
                    </div>
                    <div>
                    <label for="marca">Marca:</label>
                    <input
                        type="text"
                        name="marca"
                        value={data_vehiculo.marca}
                        onChange={handleInputChange}
                        placeholder="Marca"
                    />
                    </div>
                    
                    <div>
                    <label for="color">Color:</label>
                        <input
                            type="text"
                            name="color"
                            value={data_vehiculo.color}
                            onChange={handleInputChange}
                            placeholder="Color"
                        />
                    </div>
                   
                    <div>
                        <label for="precio">Precio:</label>
                        <input
                            type="text"
                            name="precio"
                            value={data_vehiculo.precio}
                            onChange={handleInputChange}
                            placeholder="Precio"
                        />
                    </div>
                    
                    <div>
                        <label for="descripcion">Descripcion:</label>
                        <textarea name="descripcion" onChange={handleInputChange} placeholder="Descripcion">{data_vehiculo.descripcion}</textarea>
                    </div>
                    <div className="botones-form">
                        <input 
                            type="submit"
                            className="btn btn-dark mt-2"
                            value="Actualizar vehiculo"
                        />
                    </div>
                   <div className="botones-form">
                        <Link className="btn btn-dark w-100" to="/vehiculos">Volver</Link>
                    </div>  
                </form>
            </div>
           
        </div>
	)
}