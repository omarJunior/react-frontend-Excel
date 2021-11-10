import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalFooter, FormGroup, Input, Label, ModalHeader } from 'reactstrap';
import swal from 'sweetalert';

export const ConcesionarioFormModal = () => {
    let estado = true;
    let arregloConcesionario;
    const { id } = useParams();
    const [ data_concesionario, setData_concesionario ] = useState({});
    const [modal_edit, setModal_edit] = useState(estado);

    useEffect(() => {
        const obtenerConcesionario = async()=>{
            try{
                const resp = await fetch(`http://localhost:8000/api/concesionario/${id}`, {method: 'GET'});
                if(resp.ok){
                    const data = await resp.json();
                    console.log(data)
                    setData_concesionario(data);
                }else{
                    console.error("Ha ocurrido un error en la response");
                }
            }catch(e){
                throw new Error(e);
            }

        }
        obtenerConcesionario();
    }, [id]);

    const cerrarModal_edit = ()=>{
        setModal_edit(false);
        window.location = "/concesionario";
    }

    const actualizarConcesionario = async()=>{
        try{
            let codigo = document.getElementById("codigo").value;
            let nombre = document.getElementById("nombre").value;
            let direccion = document.getElementById("direccion").value;
            let ciudad = document.getElementById("ciudad").value;
            let tipo = document.getElementById("tipo").value;
            let cantidad_vehiculos = document.getElementById("cantidad_vehiculos").value;
            let descripcion = document.getElementById("descripcion").value;
            let renta = document.getElementById("renta").value;
            let cordinador = document.getElementById("cordinador").value;

            const body = {
                codigo,
                nombre,
                direccion,
                ciudad,
                tipo,
                cantidad_vehiculos,
                descripcion,
                renta,
                cordinador,
            };

            const resp = await fetch(`http://localhost:8000/api/concesionario/${id}/`, { method:'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });
            if(resp.ok){
                const data = await resp.json();
                setData_concesionario(data);
                console.log(data);
                swal({
                    title: "¡Mensaje!",
                    text: "Concesionario actualizado en la base de datos!",
                    icon: "success",
                    buttons: "Aceptar"
                });
                setTimeout(()=>{
                    cargarLocalStorage('concesionario', JSON.stringify(data));
                },1500);
            }else{
                console.error("Ha ocurrido un error en la response");
            }

        }catch(e){
            console.error(e);
            throw new Error(e);
        }
    }

    const handleInputChange = (e)=>{
        setData_concesionario({
            ...data_concesionario,
            [e.target.name]: e.target.value
        })
    }
    
    const cargarLocalStorage = (nombre, json_cambiado_string)=>{
        arregloConcesionario = JSON.parse(localStorage.getItem(nombre));
        let json_string;
        for(let x in arregloConcesionario){
            if(arregloConcesionario[x].id === Number(id)){
                json_string = JSON.stringify(arregloConcesionario[x]);
                let reemplazo = json_string.replace(json_string, json_cambiado_string);
                reemplazo = JSON.parse(reemplazo);
                let indice = x;
                arregloConcesionario[indice] = reemplazo;
                guardarDataLocalStorage();
                
            }
        }
    }

    const guardarDataLocalStorage = ()=>{
        localStorage.setItem('concesionario', JSON.stringify(arregloConcesionario));
        window.location = "/concesionario";
    }

            
    return (
        <>
        <div className="container mb-4 mt-4">
            <Modal isOpen={modal_edit} >
                <ModalHeader>
                    ¡Actualiza el concesionario!
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label for="codigo">Codigo:</Label>
                        <Input
                            type="text"
                            id="codigo"
                            name="codigo"
                            value={data_concesionario.codigo}
                            onChange={handleInputChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="nombre"> Nombre:</Label>
                        <Input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={data_concesionario.nombre}
                            onChange={handleInputChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="direccion"> Direccion:</Label>
                        <Input
                            type="text"
                            id="direccion"
                            name="direccion"
                            value={data_concesionario.direccion}
                            onChange={handleInputChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="ciudad"> Ciudad:</Label>
                        <Input
                            type="text"
                            id="ciudad"
                            name="ciudad"
                            value={data_concesionario.ciudad}
                            onChange={handleInputChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="tipo"> Tipo:</Label>
                        <Input
                            type="text"
                            id="tipo"
                            name="tipo"
                            value={data_concesionario.tipo}
                            onChange={handleInputChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="cantidad_vehiculos"> Cantidad vehiculos:</Label>
                        <Input
                            type="text"
                            id="cantidad_vehiculos"
                            name="cantidad_vehiculos"
                            value={data_concesionario.cantidad_vehiculos}
                            onChange={handleInputChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="descripcion">Descripcion:</Label>
                        <Input
                            type="text"
                            id="descripcion"
                            name="descripcion"
                            value={data_concesionario.descripcion}
                            onChange={handleInputChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="renta">Renta:</Label>
                        <Input
                            type="text"
                            id="renta"
                            name="renta"
                            value={data_concesionario.renta}
                            onChange={handleInputChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="cordinador">Coordinador:</Label>
                        <Input
                            type="text"
                            id="cordinador"
                            name="cordinador"
                            value={data_concesionario.cordinador}
                            onChange={handleInputChange}
                        />
                    </FormGroup>
                </ModalBody>

                <ModalFooter>
                    <Button className="btn btn-dark" onClick={actualizarConcesionario}>Actualizar Datos</Button>
                    <Button className="btn btn-dark" onClick={cerrarModal_edit}>Cerrar</Button>
                </ModalFooter>
            </Modal>
        </div>
    </>
    )
}
