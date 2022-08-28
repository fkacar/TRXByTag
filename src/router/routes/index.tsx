import Dashboard from 'views/Dashboard'
import Login from 'views/Login'
import Register from 'views/Register'
import Logout from 'views/Logout'
import List from 'views/List'
import Organisation from 'views/Organisation'

// ** Default Route
export const DefaultRoute = '/'

const routes = [
  {
    path: '/',
    component: <Dashboard />,
    isAuthRequired: true
  },
  {
    path: '/transcripts',
    component: <List />,
    isAuthRequired: true
  },
  {
    path: '/organisation',
    component: <Organisation />,
    isAuthRequired: true
  },
  {
    path: '/login',
    component: <Login />,
    isAuthRequired: false
  },
  {
    path: '/sign-up',
    component: <Register />,
    isAuthRequired: false
  },
  {
    path: '/logout',
    component: <Logout />,
    isAuthRequired: false
  }
]

export default routes
