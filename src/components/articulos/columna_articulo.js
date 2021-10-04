import { Link } from 'react-router-dom';
import swal from 'sweetalert';

let arregloLocalStorage;

const columnas = [
    {
      name: 'Nombre',
      selector: row => row.nombres,
      sortable: true
    },
    {
      name: 'Precio',
      selector: row => row.precio,
      sortable: true
    },
    {
      name: 'Iva',
      selector: row => row.iva,
      sortable: true
    },
    {
      name: 'Descripcion',
      selector: row => row.descripcion,
      sortable: true
    },
    {
      name: 'Stock',
      selector: row => row.stock,
    },
    {
      name: 'Cantidad',
      selector: row => row.cantidad,
    },
    {
      name: 'Tipo',
      selector: row => row.tipo,
      sortable: true
    },
    {
      name: 'Edit',
      cell: row => <Link to={`/articulos/${row.id}`}><button className="btn btn-primary"><i className="fas fa-edit"></i></button></Link>
    },
    {
      name: 'Delete',
      cell: row => <button title={row.id} className="btn btn-danger" onClick={() => obtenerDataLocalStorageAndDelete(row.id, 'articulos')}><i className="fas fa-trash"></i></button>
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
         const resp = await fetch(`http://localhost:8000/api/articulos/${id}`, {method: 'DELETE'})
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
           console.error("Ha ocurrido un error, ese articulo no existe con el id: ", id)
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
   localStorage.setItem('articulos', JSON.stringify(arregloLocalStorage));
   window.location = "/articulos";
 }

export {
  columnas
}