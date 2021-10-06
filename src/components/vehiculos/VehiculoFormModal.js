import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalFooter, FormGroup, Input, Label, ModalHeader } from 'reactstrap';
import swal from 'sweetalert';

export const VehiculoFormModal = () => {

    let estado = true;
    let arreglo_vehiculos;
	const {id} = useParams();
	const [data_vehiculo, setData_vehiculo] = useState({});
    const [modal_edit, setModal_edit] = useState(estado);

    useEffect(() => {
    	const obtenerVehiculo = async()=>{
            try{
                const resp = await fetch(`http://localhost:8000/api/vehiculos/${id}`, {method: 'GET' });
                if(resp.ok){
                  const dato = await resp.json();
                  console.log(dato);
                  setData_vehiculo(dato);
                }else{
                  console.error("Ha ocurrido un error en la response");
                }
            }catch(e){
                throw new Error(e);
            }
        }
        obtenerVehiculo();
    }, [id]);

    const cerrarModal_edit = ()=>{
        setModal_edit(false);
        window.location = "/vehiculos";
    }

    const actualizarVehiculos = async()=>{
        try{
            let placa = document.querySelector("#placa").value;
            let modelo = document.querySelector("#modelo").value;
            let marca = document.querySelector("#marca").value;
            let color = document.querySelector("#color").value;
            let precio = document.querySelector("#precio").value;
            let descripcion = document.querySelector("#descripcion").value;

            const body = {
                placa,
                modelo,
                marca,
                color,
                precio,
                descripcion,
            };

            const resp = await fetch(`http://localhost:8000/api/vehiculos/${id}/`, { method:'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) } );
            if(resp.ok){
                const data = await resp.json();
                setData_vehiculo(data);
                console.log(data);
                swal({
                    title: "¡Mensaje!",
                    text: "Vehiculo actualizado en la base de datos!",
                    icon: "success",
                    buttons: "Aceptar"
                });
                setTimeout(()=>{
                    cargarLocalStorage('vehiculos', JSON.stringify(data));
                },1500)
            }else{
                console.error("Ha ocurrido un error en la response");
            }

        }catch(e){
            throw new Error(e);
        }
    }    

    const handleInputChange = (e)=>{
        setData_vehiculo({
            ...data_vehiculo,
            [e.target.name]: e.target.value
        })
    }

    const cargarLocalStorage = (nombre, json_cambiado_string)=>{    
        arreglo_vehiculos = JSON.parse(localStorage.getItem(nombre));
        let json_string;
        for(let x in arreglo_vehiculos){
            if(arreglo_vehiculos[x].id ===  Number(id)){
                json_string = JSON.stringify(arreglo_vehiculos[x]);
                let reemplazo = json_string.replace(json_string, json_cambiado_string);
                reemplazo = JSON.parse(reemplazo);
                let indice = x;
                arreglo_vehiculos[indice] = reemplazo;
                guardarDataLocalStorage();

            }
        }
    }

    const guardarDataLocalStorage = ()=>{
        localStorage.setItem('vehiculos', JSON.stringify(arreglo_vehiculos));
        window.location = "/vehiculos";
    }

    return (
        <>
            <div className="container mb-4 mt-4">
                <Modal isOpen={modal_edit} >
                    <ModalHeader>
                        ¡Actualiza el vehiculo!
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="placa">Placa</Label>
                            <Input type="text" id="placa" name="placa" value={data_vehiculo.placa} onChange={handleInputChange} ></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="modelo">Modelo</Label>
                            <Input type="text" id="modelo" name="modelo" value={data_vehiculo.modelo} onChange={handleInputChange} ></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="marca">Marca</Label>
                            <Input type="text" id="marca" name="marca" value={data_vehiculo.marca} onChange={handleInputChange} ></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="color">Color</Label>
                            <Input type="text" id="color" name="color" value={data_vehiculo.color} onChange={handleInputChange} ></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="precio">Precio</Label>
                            <Input type="email" id="precio" name="precio" value={data_vehiculo.precio} onChange={handleInputChange} ></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="descripcion">Descripcion</Label>
                            <Input type="text" id="descripcion" name="descripcion" value={data_vehiculo.descripcion} onChange={handleInputChange} ></Input>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={actualizarVehiculos}>Actualizar Datos</Button>
                        <Button color="secondary" onClick={cerrarModal_edit}>Cerrar</Button>
                    </ModalFooter>
                </Modal>
            </div>
        </>
    )
}
