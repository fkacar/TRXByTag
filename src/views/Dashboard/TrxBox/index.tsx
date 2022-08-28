import { FC, useState, ChangeEvent } from 'react'
import { Row, Col } from 'reactstrap'
import { Button, Input } from 'antd'
import { fireErrorMessage, fireSuccessMessage } from 'utils/general'
import { collection, addDoc } from 'firebase/firestore'
import { db } from 'firebase-config'
import './style.scss'

const { TextArea } = Input

export interface ITrxBoxProps {
  onDrop: (e: any) => void
  currentlyDraggingItem: any
}

const TrxBox: FC<ITrxBoxProps> = ({ onDrop, currentlyDraggingItem }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [content, setContent] = useState<string>('')

  const saveTrx = async () => {
    if (!content || content.length < 10) {
      fireErrorMessage('Content is too short! At least 10 characters are required.')

      return
    }

    if (!name || name.length < 3) {
      fireErrorMessage('Name is too short! At least 3 characters are required.')

      return
    }

    const orgId = localStorage.getItem('trxOrgId') || 'none'
    setIsLoading(true)

    try {
      await addDoc(collection(db, 'transcripts'), {
        content,
        createdAt: Date.now() / 1000,
        updatedAt: Date.now() / 1000,
        isActive: true,
        isDeleted: false,
        name,
        organisationId: orgId,
        tags: []
      })

      setContent('')
      setName('')

      fireSuccessMessage('Trx saved successfully!')
    } catch (e: any) {
      console.error(e)

      fireErrorMessage(e.message)
    }

    setIsLoading(false)
  }

  const onDropHandler = (e: any) => {
    console.log('drppedITem', currentlyDraggingItem)
    if (currentlyDraggingItem.isTag) return

    setContent(`${content} ${currentlyDraggingItem.name} `)
  }

  const onDragOverHandler = (e: any) => {
    const event = e as Event
    event.stopPropagation()
    event.preventDefault()
  }

  return (
    <main
      onDrop={onDropHandler}
      onDragOver={onDragOverHandler}
      className="trx-box-wrapper"
    >
      <Row>
        <Col xs={12}>
          <div className="trx-box-name-wrapper">
            <Input
              placeholder="TRX name..."
              onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              value={name}
            />
          </div>
        </Col>
        <Col xs={12}>
          <div className="trx-box-drop-wrapper">
            <TextArea
              placeholder="Drag and drop your TRX sentences here..."
              className="mt-2"
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target?.value || '')}
              value={content}
              rows={19}
            />
          </div>
        </Col>
      </Row>
      <section className="buttons-section">
        <Button
          type="primary"
          size="large"
          onClick={saveTrx}
          loading={isLoading}
        >
          Save
        </Button>
      </section>
    </main>
  )
}

export default TrxBox
