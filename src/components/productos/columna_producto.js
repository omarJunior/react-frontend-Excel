import { Link } from 'react-router-dom';
import swal from 'sweetalert';

let arregloLocalStorage;

const columnas = [
    {
      name: 'Codigo',
      selector: row => row.codigo,
      sortable: true
    },
    {
      name: 'Nombre producto',
      selector: row => row.productoName,
      sortable: true
    },
    {
      name: 'Precio',
      selector: row => row.precio,
      sortable: true
    },
    {
      name: 'Stock',
      selector: row => row.stock,
      sortable: true
    },
    {
      name: 'Unidad',
      selector: row => row.unidad,
    },
    {
      name: 'Descuento',
      selector: row => row.descuento,
      sortable: true
    },
    {
      name: 'Total',
      selector: row => row.total,
      sortable: true,
    },
    {
      name: 'Edit',
      cell: row => <Link to={`/productos/${row.id}`}><button className="btn btn-primary"><i className="fas fa-edit"></i></button></Link>
    },
    {
      name: 'Delete',
      cell: row => <button title={row.id} className="btn btn-danger" onClick={() => obtenerDataLocalStorageAndDelete(row.id, 'productos')}><i className="fas fa-trash"></i></button>
    }
];

const obtenerDataLocalStorageAndDelete = (id, data)=>{
  return swal({
     title: "Estas seguro?",
     text: "Una vez eliminado, No podrá recuperar este dato almacenado!",
     icon: "warning",
     buttons: true,
     dangerMode: true,
  })
  .then(async(willDelete)=>{
    if(willDelete){
      try{
         const resp = await fetch(`http://localhost:8000/api/productos/${id}`, {method: 'DELETE'})
         if(resp.ok){
           arregloLocalStorage = JSON.parse(localStorage.getItem(data));
           let indexArray;
           arregloLocalStorage.forEach((elemento,indice) => {
               if(elemento.id === id){
                   indexArray = indice;
               }
           });
           arregloLocalStorage.splice(indexArray, 1);
           guardarDataLocalStorage();
         }else{
           console.error("Ha ocurrido un error, ese producto no existe con el id: ", id)
         }
      }catch(e){
        throw new Error(e);
      }
    }else{
       swal("Me imagino que tu registro esta a salvo!");
    }
  })
 }


const guardarDataLocalStorage = ()=>{
  localStorage.setItem('productos', JSON.stringify(arregloLocalStorage));
  window.location = "/productos";
}

export {
  columnas
}