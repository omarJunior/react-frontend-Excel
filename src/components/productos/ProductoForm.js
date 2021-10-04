import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export const ProductoForm = () => {

    let arreglo_productos;
    const { id } = useParams();
    const [data_productos, setData_productos] = useState({});

    useEffect(()=>{
        const obtenerProducto = async()=>{
            try{
                const resp = await fetch(`http://localhost:8000/api/productos/${id}`, {method: 'GET' });
                if(resp.ok){
                  const dato = await resp.json();
                  console.log(dato);
                  setData_productos(dato);
                }else{
                  console.error("Ha ocurrido un error en la response");
                }
            }catch(e){
                throw new Error(e);
            }
        }
        obtenerProducto();
    }, [id]);

    const handleSubmit = async(e)=>{
        e.preventDefault();
        let datoForm = e.target;
        try{
            const resp = await fetch(`http://localhost:8000/api/productos/${id}/`, {method: 'PUT', body: new FormData(datoForm)});
            if(resp.ok){
                const data = await resp.json();
                setData_productos(data);
                console.log(data)
                cargarLocalStorage('productos', JSON.stringify(data));
            }else{
                console.error("Ha ocurrido un error en la response");
            }
        }catch(e){
            throw new Error(e);
        }
     }

    const handleInputChange = (e)=>{
        setData_productos({
            ...data_productos,
            [e.target.name]: e.target.value
        })
    }

     const cargarLocalStorage = (nombre, json_cambiado_string)=>{
         arreglo_productos = JSON.parse(localStorage.getItem(nombre));
         let json_string;
         for(let x in arreglo_productos){
            if(arreglo_productos[x].id === Number(id)){
                json_string = JSON.stringify(arreglo_productos[x]);
                let reemplazo = json_string.replace(json_string, json_cambiado_string);
                reemplazo = JSON.parse(reemplazo);
                let indice = x;
                arreglo_productos[indice] = reemplazo;
                guardarDataLocalStorage();
            }
         }
     }

     const guardarDataLocalStorage = ()=>{
         localStorage.setItem('productos', JSON.stringify(arreglo_productos));
         window.location = "/productos";
     }

    return (
        <div className="container-form">
            <div className="contenedor">
                <form onSubmit={handleSubmit}>
                <h3>¡Edita el producto!</h3>
                    <div>
                     <label for="codigo">Codigo:</label>
                        <input
                            type="text"
                            name="codigo"
                            value={data_productos.codigo}
                            onChange={handleInputChange}
                        />
                    </div>  
                    <div>
                        <label for="productoName">Nombre producto:</label>
                        <input
                            type="text"
                            name="productoName"
                            value={data_productos.productoName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label for="precio">Precio:</label>
                        <input
                            type="text"
                            name="precio"
                            value={data_productos.precio}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label for="stock">Stock:</label>
                        <input
                            type="text"
                            name="stock"
                            value={data_productos.stock}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label for="unidad">Unidad:</label>
                        <input
                            type="text"
                            name="unidad"
                            value={data_productos.unidad}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label for="descuento">Descuento:</label>
                        <input
                            type="text"
                            name="descuento"
                            value={data_productos.descuento}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div>
                        <label for="total">Total:</label>
                        <input
                            type="text"
                            name="total"
                            value={data_productos.total}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="botones-form">
                        <input 
                            type="submit"
                            className="btn btn-dark mt-2"
                            value="Actualizar producto"
                        />
                    </div>
                   <div className="botones-form">
                        <Link className="btn btn-dark w-100" to="/productos">Volver</Link>
                    </div>  
                </form>

            </div>
        </div>
    )
}
