import React, { useState } from 'react'
import '../Generales.css';

export const Calificaciones = () => {
    let state = false
    const [subido, setSubido] = useState(state);
    const [file, setFile] = useState([])
    const [data, setData] = useState([])

    const handleSubmit = async(e)=>{
        e.preventDefault()
        let datoForm = e.target;
        try {
            const resp = await fetch("http://localhost:8000/api/calificaciones/leer-csv/", {
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
                <h3>Subir archivos de excel con las calificaciones</h3>
                <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
                    <input 
                        type="file"
                        className="form-control" 
                        name="csvCalificaciones"
                        onChange={handleInputChange}
                    />
                  <div className="div-submit">
                    <input 
                            type="submit"
                            className="btn btn-success"
                            value="Cargar excel de calificaciones"
                        />  
                  </div>  
            
                </form>
                <button className="btn btn-success mt-4 mb-2 cl" onClick={handleButtonClick}>Mostrar Calificaciones</button>
                {
                    subido &&(
                        <div className="container mt-2">
                        <table className="table table-hover table-bordered">
                            <thead className="table-dark">
                                <tr>
                                    <th>CodigoI</th>
                                    <th>Institucion</th>
                                    <th>CodigoM</th>
                                    <th>Municipio</th>
                                    <th>Departamento</th>
                                    <th>Calendario</th>
                                    <th>Naturaleza</th>
                                    <th>Jornada</th>
                                    <th>Matematica</th>
                                    <th>Quimica</th>
                                    <th>Fisica</th>
                                    <th>Biologia</th>
                                    <th>Filosofia</th>
                                    <th>Ingles</th>
                                    <th>Lenguaje</th>
                                    <th>Sociales</th>
                                    <th>Evaluados</th>
                                    <th>Periodo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                 data.map( item => {
                                    return <tr key={item.id} >
                                        <td>{item.codinst}</td>
                                        <td>{item.nombreinstitucion}</td>
                                        <td>{item.codigomunicipio}</td>
                                        <td>{item.nombremunicipio}</td>
                                        <td>{item.departamento}</td>
                                        <td>{item.calendario}</td>
                                        <td>{item.naturaleza}</td>
                                        <td>{item.jornada}</td>
                                        <td>{item.promediomatematica}</td>
                                        <td>{item.promedioquimica}</td>
                                        <td>{item.promediofisica}</td>
                                        <td>{item.promediobiologia}</td>
                                        <td>{item.promediofilosofia}</td>
                                        <td>{item.promedioingles}</td>
                                        <td>{item.promediolenguaje}</td>
                                        <td>{item.promediosociales}</td>
                                        <td>{item.evaluados}</td>
                                        <td>{item.periodo}</td>
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
