import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../Form.css'

export const CalificacionForm = () => {
    
    let arreglo_calificacion;
    const { id } = useParams();
    const [data_calificacion, setData_calificacion] = useState({});

    useEffect(() => {
        const obtenerCalificacion = async()=>{
            try{
                const resp = await fetch(`http://localhost:8000/api/calificaciones/${id}`, {method: 'GET' });
                if(resp.ok){
                  const dato = await resp.json();
                  console.log(dato);
                  setData_calificacion(dato);
                }else{
                  console.error("Ha ocurrido un error en la response");
                }
            }catch(e){
                throw new Error(e);
            }
        }

        obtenerCalificacion();

    }, [id]);

    const handleSubmit = async(e)=>{
        e.preventDefault();
        let datoForm = e.target;
        try{
            const resp = await fetch(`http://localhost:8000/api/calificaciones/${id}/`, {method: 'PUT', body: new FormData(datoForm)});
            if(resp.ok){
                const data = await resp.json();
                setData_calificacion(data);
                console.log(data)
                cargarLocalStorage('calificaciones', JSON.stringify(data));
            }else{
                console.error("Ha ocurrido un error en la response");
            }
        }catch(e){
            throw new Error(e);
        }
     }

    const handleInputChange = (e)=>{
        setData_calificacion({
            ...data_calificacion,
            [e.target.name]: e.target.value
        })
    }

    const cargarLocalStorage = (nombre, json_cambiado_string)=>{
        arreglo_calificacion = JSON.parse(localStorage.getItem(nombre));
        let json_string;
        for(let x in arreglo_calificacion){
            if(arreglo_calificacion[x].id === Number(id)){
                json_string = JSON.stringify(arreglo_calificacion[x]);
                let reemplazo = json_string.replace(json_string, json_cambiado_string);
                reemplazo = JSON.parse(reemplazo);
                let indice = x;
                arreglo_calificacion[indice] = reemplazo;
                guardarDataLocalStorage();
            }
        }
    }

    const guardarDataLocalStorage = ()=>{
        localStorage.setItem('calificaciones', JSON.stringify(arreglo_calificacion));
        window.location = "/calificaciones";
    }

    return (
        
           <div className="container-form">
                <div className="contenedor">
                <form onSubmit={handleSubmit}>
                    <h3>¡Edita la calificación</h3>
                    <div>
                        <label for="codinst">Codigo Inst:</label>
                        <input
                            type="text"
                            name="codinst"
                            value={data_calificacion.codinst}
                            onChange={handleInputChange}

                        />
                    </div>
                    <div>
                        <label for="nombreinstitucion">Institucion:</label>
                        <input
                            type="text"
                            name="nombreinstitucion"
                            value={data_calificacion.nombreinstitucion}
                            onChange={handleInputChange}

                        />
                    </div>
                    <div>
                    <label for="codigomunicipio">Codigo:</label>
                    <input
                        type="text"
                        name="codigomunicipio"
                        value={data_calificacion.codigomunicipio}
                        onChange={handleInputChange}
                    />
                    </div>
                    
                    <div>
                    <label for="nombremunicipio">Municipio:</label>
                        <input
                            type="text"
                            name="nombremunicipio"
                            value={data_calificacion.nombremunicipio}
                            onChange={handleInputChange}

                        />
                    </div>

                    <div>
                    <label for="departamento">Departamento:</label>
                        <input
                            type="text"
                            name="departamento"
                            value={data_calificacion.departamento}
                            onChange={handleInputChange}

                        />
                    </div>

                    <div>
                    <label for="calendario">Calendario:</label>
                        <input
                            type="text"
                            name="calendario"
                            value={data_calificacion.calendario}
                            onChange={handleInputChange}

                        />
                    </div>

                    <div>
                    <label for="naturaleza">Naturaleza:</label>
                        <input
                            type="text"
                            name="naturaleza"
                            value={data_calificacion.naturaleza}
                            onChange={handleInputChange}

                        />
                    </div>
                   
                    <div>
                        <label for="jornada">Jornada:</label>
                        <input
                            type="text"
                            name="jornada"
                            value={data_calificacion.jornada}
                            onChange={handleInputChange}

                        />
                    </div>
                    <div>
                        <label for="promediomatematica">Matematica:</label>
                        <input
                            type="text"
                            name="promediomatematica"
                            value={data_calificacion.promediomatematica}
                            onChange={handleInputChange}

                        />
                    </div>
                    <div>
                    <label for="promedioquimica">Quimica:</label>
                        <input
                            type="text"
                            name="promedioquimica"
                            value={data_calificacion.promedioquimica}
                            onChange={handleInputChange}

                        />
                    </div>

                    <div>
                    <label for="promediofisica">Fisica:</label>
                        <input
                            type="text"
                            name="promediofisica"
                            value={data_calificacion.promediofisica}
                            onChange={handleInputChange}

                        />
                    </div>
                    <div>
                        <label for="promediobiologia">Biologia:</label>
                        <input
                            type="text"
                            name="promediobiologia"
                            value={data_calificacion.promediobiologia}
                            onChange={handleInputChange}

                        />
                    </div>
                    
                    <div>
                        <label for="promediofilosofia">Filosofia:</label>
                        <input
                            type="text"
                            name="promediofilosofia"
                            value={data_calificacion.promediofilosofia}
                            onChange={handleInputChange}

                        />
                    </div>

                    <div>
                        <label for="promedioingles">Ingles:</label>
                        <input
                            type="text"
                            name="promedioingles"
                            value={data_calificacion.promedioingles}
                            onChange={handleInputChange}

                        />
                    </div>

                    <div>
                        <label for="promediolenguaje">Lenguaje:</label>
                        <input
                            type="text"
                            name="promediolenguaje"
                            value={data_calificacion.promediolenguaje}
                            onChange={handleInputChange}

                        />
                    </div>
                    <div>
                        <label for="promediofilosofia">Sociales:</label>
                        <input
                            type="text"
                            name="promediosociales"
                            value={data_calificacion.promediosociales}
                            onChange={handleInputChange}

                        />
                    </div>

                    <div>
                        <label for="evaluados">Evaluados:</label>
                        <input
                            type="text"
                            name="evaluados"
                            value={data_calificacion.evaluados}
                            onChange={handleInputChange}

                        />
                    </div>

                    <div>
                        <label for="periodo">Periodo:</label>
                        <input
                            type="text"
                            name="periodo"
                            value={data_calificacion.periodo}
                            onChange={handleInputChange}

                        />
                    </div>

                    <div className="botones-form">
                        <input 
                            type="submit"
                            className="btn btn-dark mt-2"
                            value="Actualizar calificacion"
                        />
                    </div>
                   <div className="botones-form">
                        <Link className="btn btn-dark w-100" to="/calificaciones">Volver</Link>
                    </div> 
                </form>
                </div> 
            </div>
    )
}
