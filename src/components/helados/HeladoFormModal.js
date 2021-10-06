import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalFooter, FormGroup, Input, Label, ModalHeader } from 'reactstrap';
import swal from 'sweetalert';

export const HeladoFormModal = () => {
    let estado = true;
    let arreglo_helados;
    const { id } = useParams();
    const [ data_helado, setData_helado ] = useState({});
    const [modal_edit, setModal_edit] = useState(estado);

    useEffect(() => {
        const obtenerHelados = async()=>{
            try{
                const resp = await fetch(`http://localhost:8000/api/helados/${id}`, {method: 'GET'});
                if(resp.ok){
                    const data = await resp.json();
                    console.log(data)
                    setData_helado(data);
                }else{
                    console.error("Ha ocurrido un error en la response");
                }
            }catch(e){
                throw new Error(e);
            }

        }
        obtenerHelados();
    }, [id]);

    const cerrarModal_edit = ()=>{
        setModal_edit(false);
        window.location = "/helados";
    }

    const actualizarHelado = async()=>{
        try{
            let nombre = document.getElementById("nombre").value;
            let precio = document.getElementById("precio").value;
            let stock = document.getElementById("stock").value;
            console.log(nombre);

            const body = {
                nombre, precio, stock
            }

            const resp = await fetch(`http://localhost:8000/api/helados/${id}/`, { method:'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });
            if(resp.ok){
                const data = await resp.json();
                setData_helado(data);
                console.log(data);
                swal({
                    title: "¡Mensaje!",
                    text: "Helado actualizado en la base de datos!",
                    icon: "success",
                    buttons: "Aceptar"
                });
                setTimeout(()=>{
                    cargarLocalStorage('helados', JSON.stringify(data));
                },1500);
            }else{
                console.error("Ha ocurrido un error en la response");
            }

        }catch(e){
            console.error(e);
        }
    }
    
    const handleInputChange = (e)=>{
        setData_helado({
            ...data_helado,
            [e.target.name]: e.target.value
        })
    }

    const cargarLocalStorage = (nombre, json_cambiado_string)=>{
        arreglo_helados = JSON.parse(localStorage.getItem(nombre));
        let json_string;
        for(let x in arreglo_helados){
            if(arreglo_helados[x].id === Number(id)){
                json_string = JSON.stringify(arreglo_helados[x]);
                let reemplazo = json_string.replace(json_string, json_cambiado_string);
                reemplazo = JSON.parse(reemplazo);
                let indice = x;
                arreglo_helados[indice] = reemplazo;
                guardarDataLocalStorage();
            }
        }
    }
    
    const guardarDataLocalStorage = ()=>{
        localStorage.setItem('helados', JSON.stringify(arreglo_helados));
        window.location = "/helados";
    }

    return (
        <>
        <div className="container mb-4 mt-4">
            <Modal isOpen={modal_edit} >
                <ModalHeader>
                    ¡Actualiza el helado!
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label for="nombre"> Nombre:</Label>
                        <Input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={data_helado.nombre}
                            onChange={handleInputChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="precio"> Precio:</Label>
                        <Input
                            type="text"
                            id="precio"
                            name="precio"
                            value={data_helado.precio}
                            onChange={handleInputChange}
                            />
                    </FormGroup>

                    <FormGroup>
                        <Label for="stock"> Stock:</Label>
                        <Input
                            type="text"
                            id="stock"
                            name="stock"
                            value={data_helado.stock}
                            onChange={handleInputChange}
                        />
                    </FormGroup>
                </ModalBody>

                <ModalFooter>
                    <Button color="primary" onClick={actualizarHelado}>Actualizar Datos</Button>
                    <Button color="secondary" onClick={cerrarModal_edit}>Cerrar</Button>
                </ModalFooter>
            </Modal>
        </div>
    </>
    )
}
