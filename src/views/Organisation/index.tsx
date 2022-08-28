import { FC, useState, ChangeEvent, useEffect } from 'react'
import { Row, Col } from 'reactstrap'
import { Input, Button } from 'antd'
import { collection, query, where, getDocs, getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { fireErrorMessage, fireSuccessMessage } from 'utils/general'
import { db } from 'firebase-config'

const Organisation: FC = () => {
  const [orgId, setOrgId] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const updateOrgId = async () => {
    setIsLoading(true)
    const docRef = doc(db, 'organisations', orgId)
    const docSnap = await getDoc(docRef)
    const data = docSnap.data()

    if (!data) {
      fireErrorMessage('No organisation found')
      setIsLoading(false)

      return
    }

    const userId = localStorage.getItem('trxUID')
    const users = data.users
    if (!users.includes(userId)) users.push(userId)

    try {
      await updateDoc(docRef, {
        users
      })

      fireSuccessMessage('Organisation updated')
    } catch (e: any) {
      console.error(e)

      fireErrorMessage(e.message)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    const orgIdStored = localStorage.getItem('trxOrgId') || ''

    setOrgId(orgIdStored)
  }, [])

  return (
    <main className="organisation-wrapper">
      <Row>
        <Col
          xs={12}
          className="pt-3"
        >
          <h3>Organisation</h3>
        </Col>
        <Col xs={12}>
          <section className="organisation-input">
            <Row>
              <Col className="col-sm-12 col-lg-2 offset-lg-5 pt-5">
                <Input
                  placeholder="Organisation ID"
                  value={orgId}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setOrgId(e.target?.value || '')}
                />
                <Button
                  type="primary"
                  size="large"
                  className="mt-3"
                  onClick={updateOrgId}
                  loading={isLoading}
                  block
                >
                  Save
                </Button>
              </Col>
            </Row>
          </section>
        </Col>
      </Row>
    </main>
  )
}

export default Organisation
