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
        sortable: true
    },
    {
        name: 'Descripcion',
        selector: row => row.descripcion,
        sortable: true,
        right: true
    }
]

export default columnas;