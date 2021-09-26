const columnas = [
    {
      name: 'CodigoInst',
      selector: row => row.codinst,
      sortable: true
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
      sortable: true,
      right: true
    },
    {
      name: 'Evaluados',
      selector: row => row.evaluados,
      sortable: true,
      right: true
    },

    {
      name: 'Periodo',
      selector: row => row.periodo
    }
  
];

export default columnas