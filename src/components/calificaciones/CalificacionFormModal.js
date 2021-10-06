import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalFooter, FormGroup, Input, Label, ModalHeader } from 'reactstrap';
import swal from 'sweetalert';

export const CalificacionFormModal = () => {
    let estado = true;
    let arreglo_calificacion;
    const { id } = useParams();
    const [data_calificacion, setData_calificacion] = useState({});
    const [modal_edit, setModal_edit] = useState(estado);

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

    const cerrarModal = ()=>{
        setModal_edit(false);
        window.location="/calificaciones";
    }

    const actualizarCalificacion = async()=>{
        try{
            let codinst = document.getElementById("codinst").value;
            let nombreinstitucion = document.getElementById("nombreinstitucion").value;
            let codigomunicipio = document.getElementById("codigomunicipio").value;
            let nombremunicipio = document.getElementById("nombremunicipio").value;
            let departamento = document.getElementById("departamento").value;
            let calendario = document.getElementById("calendario").value;
            let naturaleza = document.getElementById("naturaleza").value;
            let jornada = document.getElementById("jornada").value;
            let promediomatematica = document.getElementById("promediomatematica").value;
            let promedioquimica = document.getElementById("promedioquimica").value;
            let promediofisica = document.getElementById("promediofisica").value;
            let promediobiologia = document.getElementById("promediobiologia").value;
            let promediofilosofia = document.getElementById("promediofilosofia").value;
            let promedioingles = document.getElementById("promedioingles").value;
            let promediolenguaje = document.getElementById("promediolenguaje").value;
            let promediosociales = document.getElementById("promediosociales").value;
            let evaluados = document.getElementById("evaluados").value;
            let periodo = document.getElementById("periodo").value;

            const body = {
                codinst,
                nombreinstitucion,
                codigomunicipio,
                nombremunicipio,
                departamento,
                calendario,
                naturaleza,
                jornada,
                promediomatematica,
                promedioquimica,
                promediofisica,
                promediobiologia,
                promediofilosofia,
                promedioingles,
                promediolenguaje,
                promediosociales,
                evaluados,
                periodo
            }

            const resp = await fetch(`http://localhost:8000/api/calificaciones/${id}/`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
            if(resp.ok){
                const data = await resp.json();
                setData_calificacion(data);
                console.log(data);
                swal({
                    title:'¡Mensaje',
                    text: 'Calificacion actualizada correctamente en la base de datos',
                    icon: 'success',
                    buttons: 'Aceptar'

                });
                console.log("hola mundo")
                setTimeout(()=>{
                    cargarLocalStorage('calificaciones', JSON.stringify(data));
                },1500)
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
        });
    }

    const cargarLocalStorage = (nombre, json_cambiado_string)=>{
        arreglo_calificacion = JSON.parse(localStorage.getItem(nombre));
        let json_string;
        for(let x in arreglo_calificacion){
             if(arreglo_calificacion[x].id ===  Number(id)){
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
        <>
            <div className="container mb-4 mt-4">
                <Modal isOpen={modal_edit}>
                    <ModalHeader>
                        ¡Actualizar calificacion!
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="codinst">Codigo Institucion</Label>
                            <Input type="text" id="codinst" name="codinst"  onChange={handleInputChange} value={data_calificacion.codinst}></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="nombreinstitucion">Institucion</Label>
                            <Input type="text" id="nombreinstitucion" name="nombreinstitucion"  onChange={handleInputChange} value={data_calificacion.nombreinstitucion}></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="codigomunicipio">Codigo Municipio</Label>
                            <Input type="text" id="codigomunicipio" name="codigomunicipio"  onChange={handleInputChange} value={data_calificacion.codigomunicipio}></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="nombremunicipio">Municipio</Label>
                            <Input type="text" id="nombremunicipio" name="nombremunicipio"  onChange={handleInputChange} value={data_calificacion.nombremunicipio}></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="departamento">Departamento</Label>
                            <Input type="text" id="departamento" name="departamento"  onChange={handleInputChange} value={data_calificacion.departamento}></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="calendario">Calendario</Label>
                            <Input type="text" id="calendario" name="calendario"  onChange={handleInputChange} value={data_calificacion.calendario}></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="naturaleza">Naturaleza</Label>
                            <Input type="text" id="naturaleza" name="naturaleza"  onChange={handleInputChange} value={data_calificacion.naturaleza}></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="jornada">Jornada</Label>
                            <Input type="text" id="jornada" name="jornada"  onChange={handleInputChange} value={data_calificacion.jornada}></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="promediomatematica">Matematica</Label>
                            <Input type="text" id="promediomatematica" name="promediomatematica"  onChange={handleInputChange} value={data_calificacion.promediomatematica}></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="promedioquimica">Quimica</Label>
                            <Input type="text" id="promedioquimica" name="promedioquimica"  onChange={handleInputChange} value={data_calificacion.promedioquimica}></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="promediofisica">Fisica</Label>
                            <Input type="text" id="promediofisica" name="promediofisica"  onChange={handleInputChange} value={data_calificacion.promediofisica}></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="promediobiologia">Biologia</Label>
                            <Input type="text" id="promediobiologia" name="promediobiologia"  onChange={handleInputChange} value={data_calificacion.promediobiologia}></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="promediofilosofia">Filosofia</Label>
                            <Input type="text" id="promediofilosofia" name="promediofilosofia"  onChange={handleInputChange} value={data_calificacion.promediofilosofia}></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="promedioingles">Ingles</Label>
                            <Input type="text" id="promedioingles" name="promedioingles"  onChange={handleInputChange} value={data_calificacion.promedioingles}></Input>
                        </FormGroup>

                        <FormGroup>
                            <Label for="promediolenguaje">Lenguaje</Label>
                            <Input type="text" id="promediolenguaje" name="promediolenguaje"  onChange={handleInputChange} value={data_calificacion.promediolenguaje}></Input>
                        </FormGroup>

                        <FormGroup>
                            <Label for="promediosociales">Sociales</Label>
                            <Input type="text" id="promediosociales" name="promediosociales"  onChange={handleInputChange} value={data_calificacion.promediosociales}></Input>
                        </FormGroup>

                        <FormGroup>
                            <Label for="evaluados">Evaluados</Label>
                            <Input type="text" id="evaluados" name="evaluados"  onChange={handleInputChange} value={data_calificacion.evaluados}></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="periodo">Periodo</Label>
                            <Input type="text" id="periodo" name="periodo"  onChange={handleInputChange} value={data_calificacion.periodo}></Input>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={actualizarCalificacion}>Actualizar Datos</Button>
                        <Button color="secondary" onClick={cerrarModal}>Cerrar</Button>
                    </ModalFooter>
                </Modal>
            </div>
        </>
    )
}
