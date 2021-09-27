import { 
  BrowserRouter as Router, 
  Switch,
  Route,
  Redirect } from 'react-router-dom';
import { Tabla } from './components/Tabla';
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
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div>
      <Router>
        <Header />
        <Switch>
            <Route exact path="/content" component={Contenido} />
            <Route exact path="/articulos" component={Articulo}/>
            <Route exact path="/calificaciones" component={Calificaciones} />
            <Route exact path="/clientes" component={Clientes} />
            <Route exact path="/helados" component={Helado} />
            <Route exact path="/productos" component={Productos} />
            <Route exact path="/vehiculos"  component={Vehiculos} />
            <Route exact path="/saberPro" component={SaberPro}/>
            <Route exact path="/tablaClientes" component={Tabla} />
            <Redirect to="/content"/>
          </Switch>

          {/* <Footer /> */}
      </Router>
    </div>
  );
}

export default App;
