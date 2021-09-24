
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
    }
];

export default columnas;