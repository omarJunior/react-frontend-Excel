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

import { ClienteForm } from './components/clientes/ClienteForm';
import { HeladoForm } from './components/helados/HeladoForm';
import { CalificacionForm } from './components/calificaciones/CalificacionForm';
import { ProductoForm } from './components/productos/ProductoForm';
import { VehiculoForm } from './components/vehiculos/VehiculoForm';
import { ArticuloForm } from './components/articulos/ArticuloForm';
import { SaberproForm } from './components/saberpro/SaberproForm';


import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div>
      <Router>
        <Header />
        <Switch>
            <Route exact path="/content" component={Contenido} />

            <Route exact path="/articulos" component={Articulo}/>
            <Route exact path="/articulos/:id" component={ArticuloForm} />

            <Route exact path="/calificaciones" component={Calificaciones} />
            <Route exact path="/calificaciones/:id" component={ CalificacionForm } />

            <Route exact path="/clientes" component={Clientes} />
            <Route exact path="/clientes/:id" component={ClienteForm} />

            <Route exact path="/helados" component={Helado} />
            <Route exact path="/helados/:id" component={HeladoForm} />

            <Route exact path="/productos" component={Productos} />
            <Route exact path="/productos/:id" component={ProductoForm} />

            <Route exact path="/vehiculos" component={Vehiculos} />
            <Route exact path="/vehiculos/:id" component={VehiculoForm} />

            <Route exact path="/saberPro" component={SaberPro}/>
            <Route exact path="/saberPro/:id" component={SaberproForm} />

            <Redirect to="/content"/>
          </Switch>

          {/* <Footer /> */}
      </Router>
    </div>
  );
}

export default App;
