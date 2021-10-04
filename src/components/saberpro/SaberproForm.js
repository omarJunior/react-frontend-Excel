import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../Form.css'


export const SaberproForm = () => {

    let arregloSaberPro;
    const {id} = useParams();
    const [data_saber_pro, setData_saber_pro] = useState({});

    useEffect(() => {
        const obtenerSaberPro = async()=>{
            try{
                const resp = await fetch(`http://localhost:8000/api/saberPro/${id}`, {method: 'GET' });
                if(resp.ok){
                  const dato = await resp.json();
                  console.log(dato);
                  setData_saber_pro(dato);
                }else{
                  console.error("Ha ocurrido un error en la response");
                }
            }catch(e){
                throw new Error(e);
            }
        }
        obtenerSaberPro();
    }, [id]);

    const handleSubmit = async(e)=>{
        e.preventDefault();
        let datoForm = e.target;
        try{
            const resp = await fetch(`http://localhost:8000/api/saberPro/${id}/`, {method: 'PUT', body: new FormData(datoForm)});
            if(resp.ok){
                const data = await resp.json();
                setData_saber_pro(data);
                console.log(data)
                cargarLocalStorage('saberPro', JSON.stringify(data));
            }else{
                console.error("Ha ocurrido un error en la response");
            }
        }catch(e){
            throw new Error(e);
        }
     }

     const handleInputChange = (e)=>{
        setData_saber_pro({
            ...data_saber_pro,
            [e.target.name]: e.target.value
        })
    }

    const cargarLocalStorage = (nombre, json_cambiado_string)=>{    
        arregloSaberPro = JSON.parse(localStorage.getItem(nombre));
        let json_string;
        for(let x in arregloSaberPro){
            if(arregloSaberPro[x].id ===  Number(id)){
                json_string = JSON.stringify(arregloSaberPro[x]);
                let reemplazo = json_string.replace(json_string, json_cambiado_string);
                reemplazo = JSON.parse(reemplazo);
                let indice = x;
                arregloSaberPro[indice] = reemplazo;
                guardarDataLocalStorage();

            }
        }
    }

    const guardarDataLocalStorage = ()=>{
        localStorage.setItem('saberPro', JSON.stringify(arregloSaberPro));
        window.location = "/saberPro";
    }

    return (
        <div className="container-form">
            <div className="contenedor">
                <form onSubmit={handleSubmit}>
                <h3>¡Edita la prueba!</h3>
                    <div>
                        <label for="nombres">Nombres:</label>
                        <input
                            type="text"
                            name="nombres"
                            value={data_saber_pro.nombres}
                            onChange={handleInputChange}

                        />
                    </div>
                    <div>
                        <label for="apellidos">Apellidos:</label>
                        <input
                            type="text"
                            name="apellidos"
                            value={data_saber_pro.apellidos}
                            onChange={handleInputChange}

                        />
                    </div>
                    <div>
                    <label for="genero">Genero:</label>
                    <input
                        type="text"
                        name="genero"
                        value={data_saber_pro.genero}
                        onChange={handleInputChange}
                    />
                    </div>
                    
                    <div>
                    <label for="ciudad">Ciudad:</label>
                        <input
                            type="text"
                            name="ciudad"
                            value={data_saber_pro.ciudad}
                            onChange={handleInputChange}

                        />
                    </div>
                   
                    <div>
                        <label for="matematicas">Matematicas:</label>
                        <input
                            type="text"
                            name="matematicas"
                            value={data_saber_pro.matematicas}
                            onChange={handleInputChange}

                        />
                    </div>
                    <div>
                        <label for="lenguaje">Lenguaje:</label>
                        <input
                            type="text"
                            name="lenguaje"
                            value={data_saber_pro.lenguaje}
                            onChange={handleInputChange}

                        />
                    </div>
                    <div>
                        <label for="ciencias">Ciencias:</label>
                        <input
                            type="text"
                            name="ciencias"
                            value={data_saber_pro.ciencias}
                            onChange={handleInputChange}

                        />
                    </div>
                    
                    <div>
                        <label for="ingles">Ingles:</label>
                        <input
                            type="text"
                            name="ingles"
                            value={data_saber_pro.ingles}
                            onChange={handleInputChange}

                        />
                    </div>
                    <div>
                        <label for="ciudadanas">Ciudadanas:</label>
                        <input
                            type="text"
                            name="ciudadanas"
                            value={data_saber_pro.ciudadanas}
                            onChange={handleInputChange}

                        />
                    </div>

                    <div>
                        <label for="fisica">Fisica:</label>
                        <input
                            type="text"
                            name="fisica"
                            value={data_saber_pro.fisica}
                            onChange={handleInputChange}

                        />
                    </div>

                    <div className="botones-form">
                        <input 
                            type="submit"
                            className="btn btn-dark mt-2"
                            value="Actualizar saberPro"
                        />
                    </div>
                   <div className="botones-form">
                        <Link className="btn btn-dark w-100" to="/saberPro">Volver</Link>
                    </div>                    
                </form>
            </div>
           
        </div>
    )
}
