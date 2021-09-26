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
      sortable: true
    },
    {
      name: 'Cantidad',
      selector: row => row.cantidad,
      sortable: true
    },
    {
      name: 'Tipo',
      selector: row => row.tipo,
      sortable: true,
      right: true
    }
  
];

export default columnas