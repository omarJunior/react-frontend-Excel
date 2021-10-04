import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../Form.css';

export const ArticuloForm = () => {

    let arregloArticulos;
    const { id } = useParams();
    const [data_articulo, setData_articulo] = useState({});

    useEffect(() => {
        const obtenerArticulo = async()=>{
            try{
                const resp = await fetch(`http://localhost:8000/api/articulos/${id}`, {method: 'GET' });
                if(resp.ok){
                  const dato = await resp.json();
                  console.log(dato);
                  setData_articulo(dato);
                }else{
                  console.error("Ha ocurrido un error en la response");
                }
            }catch(e){
                throw new Error(e);
            }
        }
        obtenerArticulo();
    }, [id]);

    
    const handleSubmit = async(e)=>{
        e.preventDefault();
        let datoForm = e.target;
        try{
            const resp = await fetch(`http://localhost:8000/api/articulos/${id}/`, {method: 'PUT', body: new FormData(datoForm)});
            if(resp.ok){
                const data = await resp.json();
                setData_articulo(data);
                console.log(data)
                cargarLocalStorage('articulos', JSON.stringify(data));
            }else{
                console.error("Ha ocurrido un error en la response");
            }
        }catch(e){
            throw new Error(e);
        }
     }
     
    const handleInputChange = (e)=>{
        setData_articulo({
            ...data_articulo,
            [e.target.name]: e.target.value
        })
    }

    const cargarLocalStorage = (nombre, json_cambiado_string)=>{
        arregloArticulos = JSON.parse(localStorage.getItem(nombre));
        let json_string;
        for(let x in arregloArticulos){
            if(arregloArticulos[x].id === Number(id)){
                json_string = JSON.stringify(arregloArticulos[x]);
                let reemplazo = json_string.replace(json_string, json_cambiado_string);
                reemplazo = JSON.parse(reemplazo);
                let indice = x;
                arregloArticulos[indice] = reemplazo;
                guardarDataLocalStorage();
            }
        }
    }
    
    const guardarDataLocalStorage = ()=>{
        localStorage.setItem('articulos', JSON.stringify(arregloArticulos));
        window.location = "/articulos";
    }

    return (
        <div className="container-form">
            <div className="contenedor">
                <form onSubmit={handleSubmit}>
                <h3>¡Edita el vehiculo!</h3>
                    <div>
                        <label for="nombres">Nombres:</label>
                        <input
                            type="text"
                            name="nombres"
                            value={data_articulo.nombres}
                            onChange={handleInputChange}
                            placeholder="Nombres"
                        />
                    </div>
                    <div>
                        <label for="precio">Precio:</label>
                        <input
                            type="text"
                            name="precio"
                            value={data_articulo.precio}
                            onChange={handleInputChange}
                            placeholder="Precio"
                        />
                    </div>
                    <div>
                    <label for="descripcion">Descripcion:</label>
                    <input
                        type="text"
                        name="descripcion"
                        value={data_articulo.descripcion}
                        onChange={handleInputChange}
                        placeholder="Descripcion"
                    />
                    </div>
                    
                    <div>
                    <label for="stock">Stock:</label>
                        <input
                            type="text"
                            name="stock"
                            value={data_articulo.stock}
                            onChange={handleInputChange}
                            placeholder="Stock"
                        />
                    </div>
                   
                    <div>
                        <label for="cantidad">Cantidad:</label>
                        <input
                            type="email"
                            name="cantidad"
                            value={data_articulo.cantidad}
                            onChange={handleInputChange}
                            placeholder="Cantidad"
                        />
                    </div>
                    
                    <div>
                        <label for="tipo">Ti´p:</label>
                        <input
                            type="text"
                            name="tipo"
                            value={data_articulo.tipo}
                            onChange={handleInputChange}
                            placeholder="Tipo Articulo"
                        />
                    </div>
                    <div className="botones-form">
                        <input 
                            type="submit"
                            className="btn btn-dark mt-2"
                            value="Actualizar articulo"
                        />
                    </div>
                   <div className="botones-form">
                        <Link className="btn btn-dark w-100" to="/articulos">Volver</Link>
                    </div>                   
                </form>
            </div>
           
        </div>
    )
}
