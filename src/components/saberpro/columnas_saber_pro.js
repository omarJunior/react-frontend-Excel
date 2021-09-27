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
      name: 'Genero',
      selector: row => row.genero,
      sortable: true
    },
    {
      name: 'Ciudad',
      selector: row => row.ciudad,
      sortable: true
    },
    {
      name: 'Matematica',
      selector: row => row.matematicas,
      sortable: true
    },
    {
      name: 'Lenguaje',
      selector: row => row.lenguaje,
      sortable: true
    },
    {
      name: 'Ciencia',
      selector: row => row.ciencias,
      sortable: true
    },
    {
      name: 'Ingles',
      selector: row => row.ingles,
      sortable: true
    },
    {
      name: 'Ciudadanas',
      selector: row => row.ciudadanas,
      sortable: true
    },

    {
      name: 'Fisica',
      selector: row => row.fisica,
      sortable: true,
      right: true
    }
  
];

export default columnas