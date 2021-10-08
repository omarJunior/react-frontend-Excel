import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalFooter, FormGroup, Input, Label, ModalHeader } from 'reactstrap';
import swal from 'sweetalert';


export const ArticuloFormModal = () => {
    let estado = true;
    let arregloArticulos;
    const { id } = useParams();
    const [data_articulo, setData_articulo] = useState({});
    const [modal_edit, setModal_edit] = useState(estado);

    useEffect(() => {
        const obtenerArticulo = async()=>{
            try{
                const resp = await fetch(`http://localhost:8000/api/articulos/${id}`, {method: 'GET' });
                if(resp.ok){
                  const dato = await resp.json();
                  console.log(dato);
                  setData_articulo(dato);
                }else{
                  console.error("Ha ocurrido un error en la response");
                }
            }catch(e){
                throw new Error(e);
            }
        }
        obtenerArticulo();
    }, [id]);

    
    const cerrarModal_edit = ()=>{
        setModal_edit(false);
        window.location = "/articulos";
    }

    const actualizarArticulo = async()=>{
        try{
            let nombres = document.getElementById("nombres").value;
            let precio = document.getElementById("precio").value;
            let iva = document.getElementById("iva").value;
            let descripcion = document.getElementById("descripcion").value;
            let stock = document.getElementById("stock").value;
            let cantidad = document.getElementById("cantidad").value;
            let tipo = document.getElementById("tipo").value;

            const body = {
                nombres, precio, iva, descripcion, stock, cantidad, tipo
            };

            const resp = await fetch(`http://localhost:8000/api/articulos/${id}/`, { method:'PUT', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(body) });
            if(resp.ok){
                const data = await resp.json();
                setData_articulo(data);
                console.log(data)
                swal({
                    title: "¡Mensaje!",
                    text: "Articulo actualizado en la base de datos!",
                    icon: "success",
                    buttons: "Aceptar"
                });
                setTimeout(()=>{
                    cargarLocalStorage('articulos', JSON.stringify(data));
                },1500)
            }else{
                console.error("Ha ocurrido un error en la response");        
            }

        }catch(e){
            throw new Error(e);
        }
    }
     
    const handleInputChange = (e)=>{
        setData_articulo({
            ...data_articulo,
            [e.target.name]: e.target.value
        })
    }

    const cargarLocalStorage = (nombre, json_cambiado_string)=>{
        arregloArticulos = JSON.parse(localStorage.getItem(nombre));
        let json_string;
        for(let x in arregloArticulos){
            if(arregloArticulos[x].id === Number(id)){
                json_string = JSON.stringify(arregloArticulos[x]);
                let reemplazo = json_string.replace(json_string, json_cambiado_string);
                reemplazo = JSON.parse(reemplazo);
                let indice = x;
                arregloArticulos[indice] = reemplazo;
                guardarDataLocalStorage();
            }
        }
    }
    
    const guardarDataLocalStorage = ()=>{
        localStorage.setItem('articulos', JSON.stringify(arregloArticulos));
        window.location = "/articulos";
    }

    return (
         <>
            <div className="container mb-4 mt-4">
                <Modal isOpen={modal_edit} >
                    <ModalHeader>
                        ¡Actualiza el articulo!
                    </ModalHeader>
                    <ModalBody>
                    <FormGroup>
                        <Label for="nombres">Nombres</Label>
                        <Input type="text" id="nombres" name="nombres" value={ data_articulo.nombres } onChange={ handleInputChange } ></Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="precio">Precio</Label>
                        <Input type="text" id="precio" name="precio" value={ data_articulo.precio } onChange={ handleInputChange } ></Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="iva">Iva</Label>
                        <Input type="text" id="iva" name="iva" value={ data_articulo.iva } onChange={ handleInputChange } ></Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="descripcion">Descripcion</Label>
                        <Input type="text" id="descripcion" name="descripcion" value={ data_articulo.descripcion } onChange={ handleInputChange } ></Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="stock">Stock</Label>
                        <Input type="text" id="stock" name="stock" value={ data_articulo.stock } onChange={ handleInputChange } ></Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="cantidad">Cantidad</Label>
                        <Input type="text" id="cantidad" name="cantidad" value={ data_articulo.cantidad } onChange={ handleInputChange } ></Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="Tipo">Tipo</Label>
                        <Input type="text" id="tipo" name="tipo" value={ data_articulo.tipo } onChange={ handleInputChange } ></Input>
                    </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={actualizarArticulo}>Actualizar Datos</Button>
                        <Button color="secondary" onClick={cerrarModal_edit}>Cerrar</Button>
                    </ModalFooter>
                </Modal>
            </div>
        </>
    )
}
