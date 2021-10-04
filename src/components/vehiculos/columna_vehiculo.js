import { Link } from 'react-router-dom';
import swal from 'sweetalert';

let arregloLocalStorage;

const columnas = [
    {
        name: 'Placa',
        selector: row => row.placa,
        sortable: true
    },
    {
        name: 'Modelo',
        selector: row => row.modelo,
        sortable: true
    },
    {
        name: 'Marca',
        selector: row => row.marca,
        sortable: true
    },
    {
        name: 'Color',
        selector: row => row.color,
        sortable: true
    },

    {
        name: 'Precio',
        selector: row => row.precio,
    },
    {
        name: 'Descripcion',
        selector: row => row.descripcion,
        sortable: true,
    },
    {
      name: 'Edit',
      cell: row => <Link to={`/vehiculos/${row.id}`}><button className="btn btn-primary"><i className="fas fa-edit"></i></button></Link>
    },
    {
      name: 'Delete',
      cell: row => <button title={row.id} className="btn btn-danger" onClick={() => obtenerDataLocalStorageAndDelete(row.id, 'vehiculos')}><i className="fas fa-trash"></i></button>
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
        const resp = await fetch(`http://localhost:8000/api/vehiculos/${id}`, {method: 'DELETE'})
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
          console.error("Ha ocurrido un error, ese vehiculo no existe con el id: ", id)
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
  localStorage.setItem('vehiculos', JSON.stringify(arregloLocalStorage));
  window.location = "/vehiculos";
}



export {
columnas
};