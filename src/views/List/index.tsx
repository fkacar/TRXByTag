import { FC, useEffect, useState, ChangeEvent } from 'react'
import { Row, Col } from 'reactstrap'
import { Table, Button, Modal, Input } from 'antd'
import { db } from 'firebase-config'
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { fireErrorMessage, fireSuccessMessage } from 'utils/general'
import Swal from 'sweetalert2'
import moment from 'moment'

const { TextArea } = Input

export interface ITrx {
  id: string
  content: string
  name: string
  createdAt: number
  updatedAt: number
  isActive: boolean
  isDeleted: boolean
  organizationId: string
  tags: string[]
}

const List: FC = () => {
  const [data, setData] = useState<ITrx[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isModalLoading, setIsModalLoading] = useState<boolean>(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false)
  const [currentlyEditingName, setCurrentlyEditingName] = useState<string>('')
  const [currentlyEditingContent, setCurrentlyEditingContent] = useState<string>('')
  const [currentlyEditingId, setCurrentlyEditingId] = useState<string>('')

  const getTrx = async () => {
    const trxRef = collection(db, 'transcripts')
    const orgId = localStorage.getItem('trxOrgId') || 'none'
    const q = query(
      trxRef,
      where('organisationId', '==', orgId),
      where('isDeleted', '==', false),
      where('isActive', '==', true)
    )

    setIsLoading(true)

    const querySnapshot = await getDocs(q)

    const trxRaw: any = []
    querySnapshot.forEach(doc => {
      const trxId = doc.id
      const trxData = doc.data()

      trxRaw.push({
        id: trxId,
        ...trxData
      })
    })

    setData(trxRaw)
    setIsLoading(false)
    setIsModalLoading(false)
  }

  const onClickEdit = (row: ITrx) => {
    setCurrentlyEditingName(row.name)
    setCurrentlyEditingContent(row.content)
    setCurrentlyEditingId(row.id)
    setIsEditModalVisible(true)
  }

  const deleteTrx = async (id: string) => {
    setIsLoading(true)
    await deleteDoc(doc(db, 'transcripts', id))
    getTrx()
  }

  const onClickDelete = (row: ITrx) => {
    setCurrentlyEditingId(row.id)

    Swal.fire({
      title: 'Are you sure you want to delete this trx?',
      showDenyButton: true,
      confirmButtonText: 'Delete',
      denyButtonText: `Cancel`
    }).then(result => {
      if (!result.isConfirmed) return

      deleteTrx(row.id)
    })
  }

  const handleOkUpdateModal = async () => {
    setIsModalLoading(true)

    const trxDocRef = doc(db, 'transcripts', currentlyEditingId)

    try {
      await updateDoc(trxDocRef, {
        name: currentlyEditingName,
        content: currentlyEditingContent
      })

      setIsEditModalVisible(false)
      getTrx()
    } catch (e: any) {
      console.error(e)

      fireErrorMessage(`Error updating transcript: ${e.message}`)
      setIsModalLoading(false)
    }
  }

  const handleCancelUpdateModal = () => {
    setIsEditModalVisible(false)
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content'
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: any) => moment.unix(createdAt).format('DD/MM/YYYY')
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (updatedAt: any) => moment.unix(updatedAt).format('DD/MM/YYYY')
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, row: ITrx) => (
        <>
          <div className="d-flex justify-content-center">
            <Button
              type="primary"
              size="small"
              style={{ marginRight: '10px' }}
              onClick={() => onClickEdit(row)}
            >
              Edit
            </Button>
            <Button
              type="default"
              size="small"
              onClick={() => onClickDelete(row)}
              danger
            >
              Delete
            </Button>
          </div>
        </>
      )
    }
  ]

  useEffect(() => {
    getTrx()
  }, [])

  return (
    <main className="list-wrapper">
      <Row>
        <Col
          xs={12}
          className="pt-3"
        >
          <h3>TRX List</h3>
        </Col>
        <Col xs={12}>
          <div className="table-wrapper">
            <Table
              loading={isLoading}
              dataSource={data}
              columns={columns}
            />
          </div>
        </Col>
      </Row>
      <Modal
        title="Update TRX"
        visible={isEditModalVisible}
        onOk={handleOkUpdateModal}
        onCancel={handleCancelUpdateModal}
        confirmLoading={isModalLoading}
        width={500}
      >
        <div className="add-tag-modal-body">
          <Input
            autoFocus
            placeholder="Input new trx name..."
            value={currentlyEditingName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentlyEditingName(e.target?.value || '')}
          />

          <TextArea
            rows={5}
            placeholder="Input new trx content..."
            className="mt-3"
            value={currentlyEditingContent}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCurrentlyEditingContent(e.target?.value || '')}
          />
        </div>
      </Modal>
    </main>
  )
}

export default List
