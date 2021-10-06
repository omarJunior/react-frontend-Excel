import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalFooter, FormGroup, Input, Label, ModalHeader } from 'reactstrap';
import swal from 'sweetalert';

export const ClienteFormModal = () => {
    let estado = true;
    let arreglo_clientes;
    const { id } = useParams();
    const [data_cliente, setData_cliente] = useState({});
    const [modal_edit, setModal_edit] = useState(estado);

    useEffect(() => {
        const obtenerCliente = async()=>{
            try{
                const resp = await fetch(`http://localhost:8000/api/clientes/${id}`, {method: 'GET' });
                if(resp.ok){
                  const dato = await resp.json();
                  console.log(dato);
                  setData_cliente(dato);
                }else{
                  console.error("Ha ocurrido un error en la response");
                }
            }catch(e){
                throw new Error(e);
            }
        }
        obtenerCliente();
    }, [id]);

    const cerrarModal_edit = ()=>{
        setModal_edit(false);
        window.location = "/clientes";
    }

    const actualizarCliente = async()=>{
        try {
            let nombres = document.getElementById("nombres").value;
            let apellidos = document.getElementById("apellidos").value;
            let direccion = document.getElementById("direccion").value;
            let telefono = document.getElementById("telefono").value;
            let correo = document.getElementById("correo").value;
            let ciudad = document.getElementById("ciudad").value;
            let empresa = document.getElementById("empresa").value;
            let estatus = document.getElementById("estatus").value;
            
            const body = {
                nombres,
                apellidos,
                direccion,
                telefono,
                correo,
                ciudad,
                empresa,
                estatus
            }
            const resp = await fetch(`http://localhost:8000/api/clientes/${id}/`, { method:'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });
            if(resp.ok){
                const data = await resp.json();
                setData_cliente(data);
                console.log(data)
                swal({
                    title: "¡Mensaje!",
                    text: "Cliente actualizado en la base de datos!",
                    icon: "success",
                    buttons: "Aceptar"
                });
                setTimeout(()=>{
                    cargarLocalStorage('clientes', JSON.stringify(data));
                },1500)
            }else{
                console.error("Ha ocurrido un error en la response");
            }
        } catch (error) {
            throw new Error(error);
        }

    }

    const handleInputChange = (e)=>{
        setData_cliente({
            ...data_cliente,
            [e.target.name]: e.target.value
        })
    }

    const cargarLocalStorage = (nombre, json_cambiado_string)=>{    
        arreglo_clientes = JSON.parse(localStorage.getItem(nombre));
        let json_string;
        for(let x in arreglo_clientes){
            if(arreglo_clientes[x].id ===  Number(id)){
                json_string = JSON.stringify(arreglo_clientes[x]);
                let reemplazo = json_string.replace(json_string, json_cambiado_string);
                reemplazo = JSON.parse(reemplazo);
                let indice = x;
                arreglo_clientes[indice] = reemplazo;
                guardarDataLocalStorage();

            }
        }
    }

    const guardarDataLocalStorage = ()=>{
        localStorage.setItem('clientes', JSON.stringify(arreglo_clientes));
        window.location = "/clientes";
    }

    return (
        <>
            <div className="container mb-4 mt-4">
                <Modal isOpen={modal_edit} >
                    <ModalHeader>
                        ¡Actualiza el clientes!
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="nombres">Nombres</Label>
                            <Input type="text" id="nombres" name="nombres" value={data_cliente.nombres} onChange={handleInputChange} ></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="apellidos">Apellidos</Label>
                            <Input type="text" id="apellidos" name="apellidos" value={data_cliente.apellidos} onChange={handleInputChange} ></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="direccion">Direccion</Label>
                            <Input type="text" id="direccion" name="direccion" value={data_cliente.direccion} onChange={handleInputChange} ></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="telefono">Telefono</Label>
                            <Input type="text" id="telefono" name="telefono" value={data_cliente.telefono} onChange={handleInputChange} ></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="correo">Correo</Label>
                            <Input type="email" id="correo" name="correo" value={data_cliente.correo} onChange={handleInputChange} ></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="ciudad">Ciudad</Label>
                            <Input type="text" id="ciudad" name="ciudad" value={data_cliente.ciudad} onChange={handleInputChange} ></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="empresa">Empresa</Label>
                            <Input type="text" id="empresa" name="empresa" value={data_cliente.empresa} onChange={handleInputChange} ></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="estatus">Estatus</Label>
                            <Input type="text" id="estatus" name="estatus" value={data_cliente.estatus} onChange={handleInputChange} ></Input>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={actualizarCliente}>Actualizar Datos</Button>
                        <Button color="secondary" onClick={cerrarModal_edit}>Cerrar</Button>
                    </ModalFooter>
                </Modal>
            </div>
        </>
    )
}
