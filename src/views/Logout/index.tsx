import { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Logout: FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.removeItem('trxAccessToken')
    localStorage.removeItem('trxRefreshToken')

    navigate('/login')
  }, [])

  return <></>
}

export default Logout
