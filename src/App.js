import { 
  BrowserRouter as Router, 
  Switch,
  Route,
  Redirect } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Contenido } from './components/Contenido';
import { Clientes } from './components/clientes/Clientes';
import { Articulo } from './components/articulos/Articulo';
import { Calificaciones } from './components/calificaciones/Calificaciones';
import { Productos } from './components/productos/Productos';
import { Helado } from './components/helados/Helado';
import { Vehiculos } from './components/vehiculos/Vehiculo';
import { SaberPro } from './components/saberpro/SaberPro';

import { ClienteFormModal } from './components/clientes/ClienteFormModal';
import { HeladoFormModal } from './components/helados/HeladoFormModal';
import { CalificacionFormModal } from './components/calificaciones/CalificacionFormModal';
import { ProductoFormModal } from './components/productos/ProductoFormModal';
import { VehiculoFormModal } from './components/vehiculos/VehiculoFormModal';
import { ArticuloFormModal } from './components/articulos/ArticuloFormModal';
import { SaberProFormModal } from './components/saberpro/SaberProFormModal';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div>
      <Router>
        <Header />
        <Switch>
            <Route exact path="/content" component={Contenido} />

            <Route exact path="/articulos" component={Articulo}/>
            <Route exact path="/articulos/:id" component={ArticuloFormModal} />

            <Route exact path="/calificaciones" component={Calificaciones} />
            <Route exact path="/calificaciones/:id" component={ CalificacionFormModal } />

            <Route exact path="/clientes" component={Clientes} />
            <Route exact path="/clientes/:id" component={ClienteFormModal} />

            <Route exact path="/helados" component={Helado} />
            <Route exact path="/helados/:id" component={HeladoFormModal} />

            <Route exact path="/productos" component={Productos} />
            <Route exact path="/productos/:id" component={ProductoFormModal} />

            <Route exact path="/vehiculos" component={Vehiculos} />
            <Route exact path="/vehiculos/:id" component={VehiculoFormModal} />

            <Route exact path="/saberPro" component={SaberPro}/>
            <Route exact path="/saberPro/:id" component={SaberProFormModal} />

            <Redirect to="/content"/>
          </Switch>

          {/* <Footer /> */}
      </Router>
    </div>
  );
}

export default App;
