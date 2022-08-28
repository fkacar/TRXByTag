import { FC, ReactNode, ReactElement } from 'react'
import { Container } from 'reactstrap'
import HeaderComponent from './Header'
import { collection, getDocs } from 'firebase/firestore'
import { db } from 'firebase-config'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

export interface DefaultLayoutProps {
  children: ReactNode | ReactElement
}

const DefaultLayout: FC<DefaultLayoutProps> = ({ children }) => {
  const auth = getAuth()
  const navigate = useNavigate()

  const getOrgs = async () => {
    const orgs = collection(db, 'organisations')
    const orgsDocs = await getDocs(orgs)

    orgsDocs.forEach(doc => {
      const orgId = doc.id
      const docData = doc.data()
      const users = docData.users

      if (users.find((user: any) => user === localStorage.getItem('trxUID'))) {
        localStorage.setItem('trxOrgId', orgId)
      }
    })
  }

  onAuthStateChanged(auth, user => {
    if (!user) {
      localStorage.removeItem('trxAccessToken')
      localStorage.removeItem('trxRefreshToken')
      localStorage.removeItem('trxUID')
      navigate('/login')
      return
    }

    const uid = user?.uid || ''
    localStorage.setItem('trxUID', uid)

    getOrgs()
  })

  return (
    <>
      <HeaderComponent />
      <Container fluid>{children}</Container>
    </>
  )
}

export default DefaultLayout
