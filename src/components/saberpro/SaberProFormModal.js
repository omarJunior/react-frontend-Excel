import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalFooter, FormGroup, Input, Label, ModalHeader } from 'reactstrap';
import swal from 'sweetalert';

export const SaberProFormModal = () => {
    let estado = true;
    let arregloSaberPro;
    const {id} = useParams();
    const [data_saber_pro, setData_saber_pro] = useState({});
    const [modal_edit, setModal_edit] = useState(estado);

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

    
    const cerrarModal_edit = ()=>{
        setModal_edit(false);
        window.location = "/saberPro";
    }

    const actualizarSaberPro = async()=>{
        try{
            let nombres = document.getElementById("nombres").value;
            let apellidos  = document.getElementById("apellidos").value;
            let genero = document.getElementById("genero").value;
            let ciudad = document.getElementById("ciudad").value;
            let matematicas  = document.getElementById("matematicas").value;
            let lenguaje  = document.getElementById("lenguaje").value;
            let ciencias  = document.getElementById("ciencias").value;
            let ingles = document.getElementById("ingles").value;
            let ciudadanas  = document.getElementById("ciudadanas").value;
            let fisica  = document.getElementById("fisica").value;

            const body = {
                nombres,
                apellidos,
                genero,
                ciudad,
                matematicas,
                lenguaje,
                ciencias,
                ingles,
                ciudadanas,
                fisica
            };

            const resp = await fetch(`http://localhost:8000/api/saberPro/${id}/`, {method:'PUT', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(body)} );
            if(resp.ok){
                const data = await resp.json();
                setData_saber_pro(data);
                console.log(data);
                swal({
                    title: "¡Mensaje!",
                    text: "Prueba actualizada en la base de datos!",
                    icon: "success",
                    buttons: "Aceptar"
                });
                setTimeout(()=>{
                    cargarLocalStorage('saberPro', JSON.stringify(data));
                },1500)
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
        <div className="container mb-4 mt-4">
        <Modal isOpen={modal_edit}>
            <ModalHeader>
                ¡Actualiza la prueba!
            </ModalHeader>
            <ModalBody>
                <FormGroup>
                    <Label for="nombres">Nombres</Label>
                    <Input type="text" id="nombres" name="nombres" value={data_saber_pro.nombres}  onChange={handleInputChange} ></Input>
                </FormGroup>
                <FormGroup>
                    <Label for="apellidos">Apellidos</Label>
                    <Input type="text" id="apellidos" name="apellidos" value={data_saber_pro.apellidos}  onChange={handleInputChange} ></Input>
                </FormGroup>
                <FormGroup>
                    <Label for="genero">Genero</Label>
                    <Input type="text" id="genero" name="genero" value={data_saber_pro.genero} onChange={handleInputChange}  ></Input>
                </FormGroup>
                <FormGroup>
                    <Label for="ciudad">Ciudad</Label>
                    <Input type="text" id="ciudad" name="ciudad" value={data_saber_pro.ciudad} onChange={handleInputChange}  ></Input>
                </FormGroup>
                <FormGroup>
                    <Label for="matematicas">Matematicas</Label>
                    <Input type="email" id="matematicas" name="matematicas" value={data_saber_pro.matematicas} onChange={handleInputChange}  ></Input>
                </FormGroup>
                <FormGroup>
                    <Label for="lenguaje">Lenguaje</Label>
                    <Input type="text" id="lenguaje" name="lenguaje" value={data_saber_pro.lenguaje} onChange={handleInputChange}  ></Input>
                </FormGroup>
                <FormGroup>
                    <Label for="ciencias">Ciencias</Label>
                    <Input type="text" id="ciencias" name="ciencias" value={data_saber_pro.ciencias} onChange={handleInputChange}  ></Input>
                </FormGroup>
                <FormGroup>
                    <Label for="ingles">Ingles</Label>
                    <Input type="text" id="ingles" name="ingles" value={data_saber_pro.ingles}  onChange={handleInputChange} ></Input>
                </FormGroup>
                <FormGroup>
                    <Label for="ciudadanas">Ciudadanas</Label>
                    <Input type="text" id="ciudadanas" name="ciudadanas" value={data_saber_pro.ciudadanas} onChange={handleInputChange}  ></Input>
                </FormGroup>
                <FormGroup>
                    <Label for="fisica">Fisica</Label>
                    <Input type="text" id="fisica" name="fisica" value={data_saber_pro.fisica}  onChange={handleInputChange} ></Input>
                </FormGroup>

            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={actualizarSaberPro}>Insertar Datos</Button>
                <Button color="secondary" onClick={cerrarModal_edit}>Cerrar</Button>
            </ModalFooter>
        </Modal>
    </div>
    )
}
