import './App.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import routes from './router/routes'
import LayoutSwitcher from 'layouts/LayoutSwitcher'
import { initFirebaseApp } from 'firebase-config'

function App() {
  const firebaseApp = initFirebaseApp()

  return (
    <BrowserRouter>
      <div className="App">
        <LayoutSwitcher>
          <Routes>
            {routes.map(route => (
              <Route
                path={route.path}
                element={route.component}
                key={route.path}
              />
            ))}
          </Routes>
        </LayoutSwitcher>
      </div>
    </BrowserRouter>
  )
}

export default App
