import { Link } from 'react-router-dom';
import swal from 'sweetalert';

let arregloLocalStorage;

const columnas = [
    {
        name: 'Nombre',
        selector: row => row.nombre,
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
        name: 'Edit',
        cell: row => <Link to={`/helados/${row.id}`}><button className="btn btn-primary"><i className="fas fa-edit"></i></button></Link>
    },
    {
        name: 'Delete',
        cell: row => <button title={row.id} className="btn btn-danger" onClick={() => obtenerDataLocalStorageAndDelete(row.id, 'helados')}><i className="fas fa-trash"></i></button>
    }
];

const obtenerDataLocalStorageAndDelete = (id, data) =>{
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
                const resp = await fetch(`http://localhost:8000/api/helados/${id}`, {method: 'DELETE'})
                if(resp.ok){
                    arregloLocalStorage = JSON.parse(localStorage.getItem(data));
                    let indexArray;
                    arregloLocalStorage.forEach((elemento, indice) => {
                        if(elemento.id === id){
                            indexArray = indice;
                        }
                    });
                    arregloLocalStorage.splice(indexArray, 1);
                    guardarDataLocalStorage();
                }else{
                    console.error("Ha ocurrido un error, ese helado no existe con el id: ", id)
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
    localStorage.setItem('helados', JSON.stringify(arregloLocalStorage));
    window.location = "/helados";
  }

export {
    columnas
};