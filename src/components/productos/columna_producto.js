const columnas = [
    {
      name: 'Codigo',
      selector: row => row.codigo,
      sortable: true
    },
    {
      name: 'Nombre producto',
      selector: row => row.nombreProducto,
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
      sortable: true
    },
    {
      name: 'Descuento',
      selector: row => row.descuento,
      sortable: true
    },
    {
      name: 'Total',
      selector: row => row.total,
      sortable: true
    }
];

export default columnas