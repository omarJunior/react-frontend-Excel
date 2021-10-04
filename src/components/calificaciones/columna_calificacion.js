import { Link } from 'react-router-dom';
import swal from 'sweetalert';

let arregloLocalStorage;

const columnas = [
    {
      name: 'CodigoInst',
      selector: row => row.codinst
    },
    {
      name: 'Institucion',
      selector: row => row.nombreinstitucion,
      sortable: true
    },
    {
      name: 'CodigoM',
      selector: row => row.codigomunicipio,
      sortable: true
    },
    {
      name: 'Municipio',
      selector: row => row.nombremunicipio,
      sortable: true
    },
    {
      name: 'Departamento',
      selector: row => row.departamento,
      sortable: true
    },
    {
      name: 'Calendario',
      selector: row => row.calendario,
      sortable: true
    },
    {
      name: 'Naturaleza',
      selector: row => row.naturaleza,
      sortable: true
    },
    {
      name: ' Jornada',
      selector: row => row.jornada,
      sortable: true
    },
    {
      name: 'Matematica',
      selector: row => row.promediomatematica,
      sortable: true
    },
    {
      name: 'Quimica',
      selector: row => row.promedioquimica,
      sortable: true
    },
    {
      name: 'Fisica',
      selector: row => row.promediofisica,
      sortable: true
    },
    {
      name: 'Biologia',
      selector: row => row.promediobiologia,
      sortable: true
    },

    {
      name: 'Filosofia',
      selector: row => row.promediofilosofia,
      sortable: true
    },

    {
      name: 'Ingles',
      selector: row => row.promedioingles,
      sortable: true
    },
    {
      name: 'Lenguaje',
      selector: row => row.promediolenguaje,
      sortable: true
    },
    {
      name: 'Sociales',
      selector: row => row.promediosociales,
      sortable: true
    },
    {
      name: 'Evaluados',
      selector: row => row.evaluados,
      sortable: true,
    },

    {
      name: 'Periodo',
      selector: row => row.periodo,
      sortable : true,
    },
    {
      name: 'Edit',
      cell: row => <Link to={`/calificaciones/${row.id}`}><button className="btn btn-primary"><i className="fas fa-edit"></i></button></Link>
    },
    {
      name: 'Delete',
      cell: row => <button title={row.id} className="btn btn-danger" onClick={() => obtenerDataLocalStorageAndDelete(row.id, 'calificaciones')}><i className="fas fa-trash"></i></button>
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
         const resp = await fetch(`http://localhost:8000/api/calificaciones/${id}`, {method: 'DELETE'})
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
           console.error("Ha ocurrido un error, esa calificaciones no existe con el id: ", id)
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
  localStorage.setItem('calificaciones', JSON.stringify(arregloLocalStorage));
  window.location = "/calificaciones";
}

export {
  columnas
}