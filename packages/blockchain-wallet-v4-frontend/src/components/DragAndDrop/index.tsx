import React, { useEffect, useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import styled, { css } from 'styled-components'

import { Icon, Image, Link, Text } from 'blockchain-info-components'

const UploadItemConitainer = styled.div<{ error?: boolean; isDragging: boolean }>`
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
  ${(props) =>
    props.error &&
    css`
      border-color: ${(props) => props.theme.red400};
      background-color: ${(props) => props.theme.red100};
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
  width: 230px;
`
const ActionButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 65px;
`
const ActionButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  > div {
    margin: 0 8px;
  }
`

const getProperLabel = (isOptional: boolean, isProofOfAddress: boolean, no: string) => {
  return isProofOfAddress ? (
    isOptional ? (
      <FormattedMessage
        id='modals.interest.withdrawal.upload_documents.upload_and_verify.proof_of_address_optional'
        defaultMessage='Proof of Address {no} (Optional)'
        values={{
          no
        }}
      />
    ) : (
      <FormattedMessage
        id='modals.interest.withdrawal.upload_documents.upload_and_verify.proof_of_address'
        defaultMessage='Proof of Address {no}'
        values={{
          no
        }}
      />
    )
  ) : isOptional ? (
    <FormattedMessage
      id='modals.interest.withdrawal.upload_documents.upload_and_verify.source_of_wealth_optional'
      defaultMessage='Source of Wealth {no} (Optional)'
      values={{
        no
      }}
    />
  ) : (
    <FormattedMessage
      id='modals.interest.withdrawal.upload_documents.upload_and_verify.source_of_wealth'
      defaultMessage='Source of Wealth {no}'
      values={{
        no
      }}
    />
  )
}

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

  const getIconName = () => {
    if (props.error) {
      return 'close-circle'
    }
    return props.fileUploaded ? 'checkmark-circle-filled' : 'plus-in-circle-filled'
  }
  const getIconColor = () => {
    if (props.error) {
      return 'red600'
    }
    return props.fileUploaded ? 'green400' : 'blue600'
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
      <UploadItemConitainer isDragging={dragging} error={props.error}>
        <IconWrapper>
          <Icon name={getIconName()} size='22px' color={getIconColor()} />
        </IconWrapper>
        <MainSection>
          <div>
            <Text
              size='14px'
              weight={600}
              lineHeight='20px'
              color={props.error ? 'red400' : 'grey900'}
            >
              {getProperLabel(
                props?.isOptional || false,
                props.isProofOfAddress || false,
                props.docNumber
              )}
            </Text>
          </div>
          <div>
            {props.fileUploaded ? (
              <Text size='12px' weight={500} lineHeight='20px'>
                {props.fileName}
              </Text>
            ) : (
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
            )}
          </div>
        </MainSection>
        {props.fileUploaded && (
          <ActionButtonsContainer>
            <ActionButtons>
              <Link size='14px' weight={500} onClick={props.onFileDelete}>
                <Image name='file-delete' />
              </Link>
              <Link size='14px' weight={500} onClick={props.onFileDownload}>
                <Image name='file-download' />
              </Link>
            </ActionButtons>
          </ActionButtonsContainer>
        )}
      </UploadItemConitainer>
    </div>
  )
}

type Props = {
  docNumber: string
  error?: boolean
  fileName?: string
  fileUploaded: boolean
  handleDrop: (arg0: FileList) => void
  isOptional?: boolean
  isProofOfAddress?: boolean
  onFileDelete: () => void
  onFileDownload: () => void
}

export default DragAndDrop
