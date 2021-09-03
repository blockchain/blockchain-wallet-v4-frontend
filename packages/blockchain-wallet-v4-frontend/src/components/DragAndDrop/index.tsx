import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import styled, { css } from 'styled-components'

import { Icon, Link, Text } from 'blockchain-info-components'

const UploadItemConitainer = styled.div<{ isDragging: boolean }>`
  display: flex;
  flex-direction: row;
  border: 1px solid ${(props) => props.theme.grey100};
  box-sizing: border-box;
  border-radius: 12px;
  padding: 16px 24px;
  ${(props) =>
    props.isDragging &&
    css`
      border-color: ${(props) => props.theme.blue600};
    `}
`
const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  span {
    flex-direction: column;
    justify-content: center;
  }
`
const MainSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 22px;
  height: 36px;
`

const DragAndDrop = (props: Props) => {
  const dropRef = useRef<HTMLInputElement>(null)
  const inputFile = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [dragCounter, setDragCounter] = useState(0)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragIn = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(dragCounter + 1)
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragging(true)
    }
  }

  const handleDragOut = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(dragCounter - 1)
    if (dragCounter === 0) {
      setDragging(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(true)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      props.handleDrop(e.dataTransfer.files)
      e.dataTransfer.clearData()
      setDragCounter(0)
      setDragging(false)
    }
  }

  const handleFileSelect = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.target.files[0]) {
      props.handleDrop(e.target.files[0])
      setDragCounter(0)
    }
  }

  const openUploader = (e) => {
    if (inputFile && inputFile.current && inputFile.current !== undefined) {
      inputFile.current.click()
    }
  }

  useEffect(() => {
    let observerRefValue: HTMLInputElement
    if (dropRef && dropRef.current && dropRef.current !== undefined) {
      dropRef.current.addEventListener('dragenter', handleDragIn, false)
      dropRef.current.addEventListener('dragleave', handleDragOut, false)
      dropRef.current.addEventListener('dragover', handleDrag, false)
      dropRef.current.addEventListener('drop', handleDrop, false)
      observerRefValue = dropRef.current
      return () => {
        if (observerRefValue) {
          observerRefValue.removeEventListener('dragenter', handleDragIn, false)
          observerRefValue.removeEventListener('dragleave', handleDragOut, false)
          observerRefValue.removeEventListener('dragover', handleDrag, false)
          observerRefValue.removeEventListener('drop', handleDrop, false)
        }
      }
    }
  }, [])

  return (
    <div style={{ position: 'relative' }} ref={dropRef}>
      <input
        type='file'
        size={50}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        ref={inputFile}
      />
      <UploadItemConitainer isDragging={dragging}>
        <IconWrapper>
          <Icon
            name={props.fileUploaded ? 'checkmark-circle-filled' : 'plus-in-circle-filled'}
            size='22px'
            color={props.fileUploaded ? 'green400' : 'blue600'}
          />
        </IconWrapper>
        <MainSection>
          <div>
            <Text size='14px' weight={600} lineHeight='20px'>
              <FormattedMessage
                id='modals.interest.withdrawal.upload_documents.upload_and_verify.proof_of_address'
                defaultMessage='Proof of Address {no}'
                values={{
                  no: props.no
                }}
              />
            </Text>
          </div>
          <div>
            <Text size='12px' weight={500} lineHeight='20px'>
              <FormattedMessage
                id='modals.interest.withdrawal.upload_documents.upload_and_verify.drag_and_drop'
                defaultMessage='Drag and Drop or'
              />{' '}
              <Link size='14px' weight={500} onClick={openUploader}>
                <FormattedMessage
                  id='modals.interest.withdrawal.upload_documents.upload_and_verify.browse'
                  defaultMessage='browse ->'
                />
              </Link>
            </Text>
          </div>
        </MainSection>
        {props.fileUploaded && <div>butttons</div>}
      </UploadItemConitainer>
    </div>
  )
}

type Props = {
  fileUploaded: boolean
  //   children: ReactNode
  handleDrop: (arg0: FileList) => void
  no: string
}

export default DragAndDrop
