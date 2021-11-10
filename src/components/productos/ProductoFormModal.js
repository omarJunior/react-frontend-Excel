import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Button, Modal, ModalBody, ModalFooter, FormGroup, Input, Label, ModalHeader } from 'reactstrap';
import swal from 'sweetalert';

export const ProductoFormModal = () => {
    let estado = true;
    let arreglo_productos;
    const { id } = useParams();
    const [data_productos, setData_productos] = useState({});
    const [modal_edit, setModal_edit] = useState(estado);

    useEffect(()=>{
        const obtenerProducto = async()=>{
            try{
                const resp = await fetch(`http://localhost:8000/api/productos/${id}`, {method: 'GET' });
                if(resp.ok){
                  const dato = await resp.json();
                  console.log(dato);
                  setData_productos(dato);
                }else{
                  console.error("Ha ocurrido un error en la response");
                }
            }catch(e){
                throw new Error(e);
            }
        }
        obtenerProducto();
    }, [id]);

    const cerrarModal_edit = ()=>{
        setModal_edit(false);
        window.location = "/productos";
    }

    const actualizarProductos = async()=>{
        try{
            let codigo = document.querySelector("#codigo").value;
            let productoName = document.querySelector("#productoName").value;
            let precio = document.querySelector("#precio").value;
            let stock = document.querySelector("#stock").value;
            let unidad = document.querySelector("#unidad").value;
            let descuento = document.querySelector("#descuento").value;
            let total = document.querySelector("#total").value;

            const body = {
                codigo,
                productoName,
                precio,
                stock,
                unidad,
                descuento,
                total
            };

            const resp = await fetch(`http://localhost:8000/api/productos/${id}/`, { method:'PUT', headers:{ 'Content-Type':'application/json'}, body: JSON.stringify(body) });
            if(resp.ok){
                const dato = await resp.json();
                setData_productos(dato);
                console.log(dato);
                swal({
                    title: "¡Mensaje!",
                    text: "Producto actualizado en la base de datos!",
                    icon: "success",
                    buttons: "Aceptar"
                });
                setTimeout(()=>{
                    cargarLocalStorage('productos', JSON.stringify(dato));
                }, 1500);
            }else{
                console.error("Ha ocurrido un error en la response");
            }

        }catch(e){
            throw new Error(e);
        }
    }


    const handleInputChange = (e)=>{
        setData_productos({
            ...data_productos,
            [e.target.name]: e.target.value
        })
    }

     const cargarLocalStorage = (nombre, json_cambiado_string)=>{
         arreglo_productos = JSON.parse(localStorage.getItem(nombre));
         let json_string;
         for(let x in arreglo_productos){
            if(arreglo_productos[x].id === Number(id)){
                json_string = JSON.stringify(arreglo_productos[x]);
                let reemplazo = json_string.replace(json_string, json_cambiado_string);
                reemplazo = JSON.parse(reemplazo);
                let indice = x;
                arreglo_productos[indice] = reemplazo;
                guardarDataLocalStorage();
            }
         }
     }

     const guardarDataLocalStorage = ()=>{
         localStorage.setItem('productos', JSON.stringify(arreglo_productos));
         window.location = "/productos";
     }

    return (
        <>
            <div className="container mb-4 mt-4">
                <Modal isOpen={modal_edit} >
                    <ModalHeader>
                        ¡Actualiza el producto!
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="codigo">Codigo</Label>
                            <Input type="text" id="codigo" name="codigo" value={data_productos.codigo} onChange={handleInputChange} ></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="productoName">Nombre del producto</Label>
                            <Input type="text" id="productoName" name="productoName" value={data_productos.productoName} onChange={handleInputChange} ></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="precio">Precio</Label>
                            <Input type="text" id="precio" name="precio" value={data_productos.precio} onChange={handleInputChange} ></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="stock">Stock</Label>
                            <Input type="text" id="stock" name="stock" value={data_productos.stock} onChange={handleInputChange} ></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="unidad">Unidad</Label>
                            <Input type="email" id="unidad" name="unidad" value={data_productos.unidad} onChange={handleInputChange} ></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="descuento">Descuento</Label>
                            <Input type="text" id="descuento" name="descuento" value={data_productos.descuento} onChange={handleInputChange} ></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="total">Total</Label>
                            <Input type="text" id="total" name="total" value={data_productos.total} onChange={handleInputChange} ></Input>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button className="btn btn-dark" onClick={actualizarProductos}>Actualizar Datos</Button>
                        <Button className="btn btn-dark" onClick={cerrarModal_edit}>Cerrar</Button>
                    </ModalFooter>
                </Modal>
            </div>
        
        </>
    )
}
