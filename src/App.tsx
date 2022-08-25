import './App.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import routes from './router/routes'
import LayoutSwitcher from 'layouts/LayoutSwitcher'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <LayoutSwitcher>
          <Routes>
            {routes.map(route => (
              <Route
                path={route.path}
                element={route.component}
              />
            ))}
          </Routes>
        </LayoutSwitcher>
      </div>
    </BrowserRouter>
  )
}

export default App
