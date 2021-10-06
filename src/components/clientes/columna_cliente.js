import { Link } from 'react-router-dom';
import swal from 'sweetalert';


let arregloLocalStorage;

const columnas = [
    {
      name: 'Nombres',
      selector: row => row.nombres,
      sortable: true
    },
    {
      name: 'Apellidos',
      selector: row => row.apellidos,
      sortable: true
    },
    {
      name: 'Direccion',
      selector: row => row.direccion,
      sortable: true
    },
    {
      name: 'Telefono',
      selector: row => row.telefono,
      sortable: true
    },
    {
      name: 'Correo',
      selector: row => row.correo,
      sortable: true
    },
    {
      name: 'Ciudad',
      selector: row => row.ciudad,
      sortable: true
    },
    {
      name: 'Empresa',
      selector: row => row.empresa,
      sortable: true
    },
    {
      name: 'Estatus',
      selector: row => row.estatus,
      
    },
    {
      name: 'Edit',
      cell: row => <Link to={`/clientes/${row.id}`}><button className="btn btn-primary"><i className="fas fa-edit"></i></button></Link>
    },
    {
      name: 'Delete',
      cell: row => <button title={row.id} className="btn btn-danger" onClick={() => obtenerDataLocalStorageAndDelete(row.id, 'clientes')}><i className="fas fa-trash"></i></button>
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
        const resp = await fetch(`http://localhost:8000/api/clientes/${id}`, {method: 'DELETE'})
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
          console.error("Ha ocurrido un error, ese cliente no existe con el id: ", id)
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
  localStorage.setItem('clientes', JSON.stringify(arregloLocalStorage));
  window.location = "/clientes";
}

export {
  columnas
}