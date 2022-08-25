import { ReactElement } from 'react'
import Dashboard from 'views/Dashboard'
import Login from 'views/Login'

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
    component: <Dashboard />,
    isAuthRequired: true
  },
  {
    path: '/login',
    component: <Login />,
    isAuthRequired: false
  },
  {
    path: '/register',
    component: <Dashboard />,
    isAuthRequired: false
  }
]

export default routes
