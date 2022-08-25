import { FC, useEffect, useState, ReactNode, ReactElement } from 'react'
import DefaultLayout from './DefaultLayout'
import AuthLayout from './AuthLayout'
import routes from 'router/routes'
import { matchRoutes, useLocation, useNavigate } from 'react-router-dom'

export interface ILayoutSwitcherProps {
  children: ReactNode | ReactElement
}

const LayoutSwitcher: FC<ILayoutSwitcherProps> = ({ children }) => {
  const [layout, setLayout] = useState<string>()
  const location = useLocation()
  const [isPathRequiredAuth, setIsPathRequiredAuth] = useState(false)
  const navigate = useNavigate()

  const currentPath = () => {
    const [{ route }]: any = matchRoutes(routes, location)

    return route.path
  }

  const checkAuth = () => {
    if (!localStorage.trxAccessToken) {
      setLayout('auth')

      if (currentPath() !== '/login') navigate('/login')

      return
    }

    setLayout('default')
  }

  useEffect(() => {
    console.log('layout', layout)
  }, [layout])

  useEffect(() => {
    checkAuth()
  }, [isPathRequiredAuth])

  useEffect(() => {
    checkAuth()
  }, [currentPath()])

  useEffect(() => {
    if (routes && routes?.find(item => item.path === currentPath())?.isAuthRequired) setIsPathRequiredAuth(true)
  }, [])

  return (
    <>
      {layout === 'auth' && <AuthLayout>{children}</AuthLayout>}
      {layout === 'default' && <DefaultLayout>{children}</DefaultLayout>}
    </>
  )
}

export default LayoutSwitcher
