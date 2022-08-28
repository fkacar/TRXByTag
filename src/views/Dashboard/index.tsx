import { FC, useState, useEffect, KeyboardEvent, ChangeEvent, MouseEvent } from 'react'
import { Tree, Input, Tag, Select, Spin, Button, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { DataNode, TreeProps } from 'antd/es/tree'
import { Col, Row } from 'reactstrap'
import { fireErrorMessage, fireSuccessMessage } from 'utils/general'
import { collection, query, where, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from 'firebase-config'
import Swal from 'sweetalert2'
import TrxBox from './TrxBox'
import './style.scss'

const { TextArea } = Input
const { Option } = Select

const Home: FC = () => {
  const [data, setData] = useState<DataNode[]>([])
  const [expandedKeys, setExpandedKeys] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [currentSentence, setCurrentSentence] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [tagsRawData, setTagsRawData] = useState<any[]>([])
  const [isAddTagModalVisiblity, setIsAddTagModalVisiblity] = useState<boolean>(false)
  const [isMenuModalVisible, setIsMenuModalVisible] = useState<boolean>(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false)
  const [newTagName, setNewTagName] = useState<string>('')
  const [currentlyEditingTagId, setCurrentlyEditingTagId] = useState<string>('')
  const [currentlyEditingTagName, setCurrentlyEditingTagName] = useState<string>('')
  const [currentlyDraggingItem, setCurrentlyDraggingItem] = useState<any>({})

  const onDragStart = (info: any) => {
    const isTag = info.node.key.split('-').length === 2
    const name = info.node.title

    let tagId
    if (isTag) tagId = tagsRawData.find((item: any) => item.name === info.node.title)?.id
    if (!isTag) tagId = tagsRawData.find((item: any) => item.sentences.includes(info.node.title))?.id

    if (isTag) {
      info.event.preventDefault()
      return
    }

    setCurrentlyDraggingItem({
      tagId,
      name,
      isTag
    })
  }

  const onRemoveTag = (e: any) => {
    if (!e) return
    e.preventDefault()

    const tagToRemove = e.nativeEvent?.path[2]?.innerText || ''

    const selectedTagsStored = [...selectedTags]
    const selectedTagItemIndex = selectedTagsStored.findIndex((item: string) => item === tagToRemove)
    if (selectedTagItemIndex !== -1) {
      selectedTagsStored.splice(selectedTagItemIndex, 1)
    }

    setSelectedTags(selectedTagsStored)
  }

  const onTagSelectChange = (value: string) => {
    if (!value) return
    if (selectedTags.includes(value)) return

    setSelectedTags([...selectedTags, value])
  }

  const formValidation = () => {
    if (!currentSentence) {
      fireErrorMessage('Please enter a sentence')
      return false
    }

    if (currentSentence.length < 10) {
      fireErrorMessage('The sentence has to be at least 10 characters long')
      return false
    }

    if (!selectedTags.length) {
      fireErrorMessage('Please select at least one tag')
      return false
    }

    return true
  }

  const onExpand = (expandedKeys: any, expandedKeysObj: any) => {
    setExpandedKeys(expandedKeys)
  }

  const addNewTag = () => {
    setIsAddTagModalVisiblity(true)
  }

  const handleCancelAddNewTagModal = () => {
    setIsAddTagModalVisiblity(false)
  }

  const getTags = async () => {
    const tagsRef = collection(db, 'tags')
    const orgId = localStorage.getItem('trxOrgId') || 'none'
    const q = query(tagsRef, where('organisationId', '==', orgId))

    setIsLoading(true)

    const querySnapshot = await getDocs(q)

    const tagsMapped: any = []
    const dataMapped: any = []
    const tagsRaw: any = []

    querySnapshot.forEach(doc => {
      const tagId = doc.id
      const tagData = doc.data()

      tagsMapped.push(tagData.name)
      dataMapped.push({
        title: tagData.name,
        key: `${dataMapped.length}-0`,
        children: tagData.sentences.map((item: string, index: number) => ({
          title: item,
          key: `${dataMapped.length}-0-${index}`,
          children: []
        }))
      })

      tagsRaw.push({
        id: tagId,
        ...tagData
      })
    })

    setTags(tagsMapped)
    setData(dataMapped)
    setTagsRawData(tagsRaw)
    setIsLoading(false)
  }

  const addSentenceToDb = async () => {
    setIsLoading(true)

    try {
      for (let i = 0; i < selectedTags.length; i++) {
        const tag = tagsRawData.find((item: any) => item.name === selectedTags[i])
        const tagId = tag.id

        const tagDocRef = doc(db, 'tags', tagId)

        await updateDoc(tagDocRef, {
          sentences: [...tag.sentences, currentSentence]
        })
      }

      return true
    } catch (e: any) {
      fireErrorMessage(e.message)

      setIsLoading(false)
      return false
    }
  }

  const addSentence = async () => {
    if (!formValidation()) return

    const addSentenceToDbResult = await addSentenceToDb()
    if (!addSentenceToDbResult) return

    getTags()
    setCurrentSentence('')
  }

  const onKeyDownSentenceInput = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode === 13) {
      e.preventDefault()
      e.stopPropagation()
      addSentence()
    }
  }

  const isTagExist = async (tagName: string) => {
    const tagsRef = collection(db, 'tags')
    const orgId = localStorage.getItem('trxOrgId') || 'none'
    const q = query(tagsRef, where('organisationId', '==', orgId), where('name', '==', tagName))

    const docs = []
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach(doc => {
      docs.push(doc.id)
    })

    return Boolean(docs.length)
  }

  const handleOkAddNewTagModal = async () => {
    if (!newTagName || newTagName.length < 2) {
      fireErrorMessage('The tag name has to be at least 2 characters long')

      return
    }

    const orgId = localStorage.getItem('trxOrgId')

    if (!orgId) {
      fireErrorMessage('Please cerate or participate in an organization first')

      return
    }

    const tagExist = await isTagExist(newTagName)
    if (tagExist) {
      fireErrorMessage('The tag is already exist! Please choose another name')

      return
    }

    setIsLoading(true)

    try {
      await addDoc(collection(db, 'tags'), {
        name: newTagName,
        organisationId: orgId,
        createdAt: Date.now() / 1000,
        updatedAt: Date.now() / 1000,
        isActive: true,
        isDeleted: false,
        sentences: []
      })

      getTags()
      setIsAddTagModalVisiblity(false)
    } catch (e: any) {
      fireErrorMessage(e.message)

      setIsLoading(false)
    }
  }

  const handleOkUpdateTagModal = async () => {
    if (!newTagName || newTagName.length < 2) {
      fireErrorMessage('The tag name has to be at least 2 characters long')

      return
    }

    const tagExist = await isTagExist(newTagName)
    if (tagExist) {
      fireErrorMessage('The tag is already exist! Please choose another name')

      return
    }

    setIsLoading(true)

    const tagDocRef = doc(db, 'tags', currentlyEditingTagId)

    try {
      await updateDoc(tagDocRef, {
        name: newTagName
      })

      getTags()
      setIsEditModalVisible(false)
    } catch (e: any) {
      fireErrorMessage(e.message)

      setIsLoading(false)
    }
  }

  const handleCancelUpdateTagModal = () => {
    setIsEditModalVisible(false)
  }

  const onClickTagEdit = () => {
    setIsMenuModalVisible(false)
    setIsEditModalVisible(true)
  }

  const deleteTag = async () => {
    setIsLoading(true)
    await deleteDoc(doc(db, 'tags', currentlyEditingTagId))
    getTags()
  }

  const onClickTagDelete = () => {
    Swal.fire({
      title: 'Are you sure you want to delete this tag?',
      showDenyButton: true,
      confirmButtonText: 'Delete',
      denyButtonText: `Cancel`
    })
      .then(result => {
        if (!result.isConfirmed) return

        deleteTag()
      })
      .finally(() => setIsMenuModalVisible(false))
  }

  const onRightClickOnTreeNode = (info: any) => {
    const node = info.node
    const id = tagsRawData.find((item: any) => item.name === node.title)?.id

    setCurrentlyEditingTagId(id)
    setIsMenuModalVisible(true)
    setCurrentlyEditingTagName(node.title)
  }

  useEffect(() => {
    const keys: any[] = selectedTags.map(
      (item: string) => `${data.find((dataItem: DataNode) => dataItem.title === item)?.key}` || []
    )

    setExpandedKeys(keys)
  }, [data])

  useEffect(() => {
    getTags()
  }, [])

  return (
    <>
      <main className="dashboard-wrapper">
        <Row>
          <Col
            xs={12}
            className="pt-3"
          >
            <h3>Create a TRX</h3>
          </Col>
          <Col
            xs={12}
            md={6}
          >
            <aside className="trx-sentences-list-wrapper">
              <Row>
                <Col xs={12}>
                  <div className="tags-area">
                    {selectedTags.map((tag: string) => (
                      <Tag
                        color="geekblue"
                        closable
                        onClose={onRemoveTag}
                      >
                        {tag}
                      </Tag>
                    ))}
                    <Select
                      showSearch
                      placeholder="Select a tag"
                      optionFilterProp="children"
                      onChange={onTagSelectChange}
                      filterOption={(input, option) =>
                        (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())
                      }
                    >
                      {tags.map((tag: string) => (
                        <Option value={tag}>{tag}</Option>
                      ))}
                    </Select>
                    <Button
                      type="default"
                      icon={<PlusOutlined />}
                      onClick={addNewTag}
                    />
                  </div>
                </Col>
                <Col xs={12}>
                  <div className="input-area pb-2">
                    <TextArea
                      placeholder="Input the sentence"
                      className="mt-2"
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCurrentSentence(e.target?.value || '')}
                      onKeyDown={onKeyDownSentenceInput}
                      value={currentSentence}
                      rows={2}
                    />
                  </div>
                </Col>
              </Row>
              {isLoading && (
                <div className="loading-wrapper">
                  <Spin size="large" />
                </div>
              )}
              {!isLoading && (
                <Tree
                  className="draggable-tree"
                  expandedKeys={expandedKeys}
                  onExpand={onExpand}
                  draggable
                  blockNode
                  onDragStart={onDragStart}
                  treeData={data}
                  onRightClick={onRightClickOnTreeNode}
                />
              )}
            </aside>
          </Col>
          <Col
            xs={12}
            md={6}
          >
            <aside
              style={{ height: '100%' }}
              className="new-trx-box-wrapper"
            >
              <TrxBox
                currentlyDraggingItem={currentlyDraggingItem}
                onDrop={(e: any) => ''}
              />
            </aside>
          </Col>
        </Row>
        <Modal
          title="Add a Tag"
          visible={isAddTagModalVisiblity}
          onOk={handleOkAddNewTagModal}
          onCancel={handleCancelAddNewTagModal}
          confirmLoading={isLoading}
          width={300}
        >
          <div className="add-tag-modal-body">
            <Input
              autoFocus
              placeholder="Input a tag name..."
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTagName(e.target?.value || '')}
            />
          </div>
        </Modal>
        <Modal
          title="Update Tag Name"
          visible={isEditModalVisible}
          onOk={handleOkUpdateTagModal}
          onCancel={handleCancelUpdateTagModal}
          confirmLoading={isLoading}
          width={300}
        >
          <div className="add-tag-modal-body">
            <Input
              autoFocus
              placeholder="Input new tag name..."
              defaultValue={currentlyEditingTagName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTagName(e.target?.value || '')}
            />
          </div>
        </Modal>
        <Modal
          title="Choose an action"
          visible={isMenuModalVisible}
          okButtonProps={{ style: { display: 'none' } }}
          onCancel={() => setIsMenuModalVisible(false)}
          width={250}
        >
          <div className="add-tag-modal-body">
            <span>For {currentlyEditingTagName}...</span>
            <Button
              size="large"
              type="primary"
              className="mt-3"
              onClick={onClickTagEdit}
              block
            >
              Edit
            </Button>
            <Button
              size="large"
              type="default"
              className="mt-3"
              danger
              onClick={onClickTagDelete}
              block
            >
              Delete
            </Button>
          </div>
        </Modal>
      </main>
    </>
  )
}

export default Home
