const columnas = [
    {
      name: 'Nombres',
      selector: row => row.nombre,
      sortable: true
    },
    {
      name: 'Apellidos',
      selector: row => row.apellido,
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
      sortable: true,
      right: true
    }
  
];

export default columnas