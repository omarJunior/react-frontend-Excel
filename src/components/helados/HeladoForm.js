import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import '../Form.css'

export const HeladoForm = () => {

    let arreglo_helados;
    const { id } = useParams();
    const [ data_helado, setData_helado ] = useState({});
    
    useEffect(() => {
        const obtenerHelados = async()=>{
            try{
                const resp = await fetch(`http://localhost:8000/api/helados/${id}`, {method: 'GET'});
                if(resp.ok){
                    const data = await resp.json();
                    console.log(data)
                    setData_helado(data);
                }else{
                    console.error("Ha ocurrido un error en la response");
                }
            }catch(e){
                throw new Error(e);
            }

        }
        obtenerHelados();
    }, [id]);

    const handleSubmit = async(e)=>{
        e.preventDefault();
        let datoForm = e.target;
        try{
            const resp = await fetch(`http://localhost:8000/api/helados/${id}/`, {method: 'PUT', body: new FormData(datoForm)});
            if(resp.ok){
                const data = await resp.json();
                setData_helado(data);
                console.log(data)
                cargarLocalStorage('helados', JSON.stringify(data));
            }else{
                console.error("Ha ocurrido un error en la response");
            }
        }catch(e){
            throw new Error(e);
        }
     }


    const handleInputChange = (e)=>{
        setData_helado({
            ...data_helado,
            [e.target.name]: e.target.value
        })
    }

    const cargarLocalStorage = (nombre, json_cambiado_string)=>{
        arreglo_helados = JSON.parse(localStorage.getItem(nombre));
        let json_string;
        for(let x in arreglo_helados){
            if(arreglo_helados[x].id === Number(id)){
                json_string = JSON.stringify(arreglo_helados[x]);
                let reemplazo = json_string.replace(json_string, json_cambiado_string);
                reemplazo = JSON.parse(reemplazo);
                let indice = x;
                arreglo_helados[indice] = reemplazo;
                guardarDataLocalStorage();
            }
        }
    }
    
    const guardarDataLocalStorage = ()=>{
        localStorage.setItem('helados', JSON.stringify(arreglo_helados));
        window.location = "/helados";
    }

    return (
        <div className="container-form">
            <div className="contenedor">
                <form onSubmit={handleSubmit}>
                <h3>¡Edita el helado!</h3>
                    <div>
                        <label for="nombre"> Nombre:</label>
                        <input
                            type="text"
                            name="nombre"
                            value={data_helado.nombre}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label for="precio"> Precio:</label>
                        <input
                            type="text"
                            name="precio"
                            value={data_helado.precio}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label for="stock"> Stock:</label>
                        <input
                            type="text"
                            name="stock"
                            value={data_helado.stock}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="botones-form">
                        <input 
                            type="submit"
                            className="btn btn-dark mt-2"
                            value="Actualizar helado"
                        />
                    </div>
                   <div className="botones-form">
                        <Link className="btn btn-dark w-100" to="/helados">Volver</Link>
                    </div>   
                </form>

            </div>
            
        </div>
    )
}
