import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { FileUploadItem } from 'blockchain-wallet-v4/src/types'

import { toBase64 } from '../../../utils/helpers'
import DragAndDrop from '../../DragAndDrop'
import Container from '../Container'
import Content from '../Content'
import Footer from '../Footer'
import Header from '../Header'

const Title = styled(Text)`
  color: ${(props) => props.theme.grey900};
  font-size: 16px;
  font-weight: 600;
  line-height: 150%;
`

const Subtitle = styled(Text)`
  color: ${(props) => props.theme.grey900};
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
`

export const ContentDivider = styled.div`
  height: 20px;
  border-bottom: 1px solid ${(props) => props.theme.grey000};
  margin: 40px 0 0 0;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px 40px 0 40px;
`

const DragAndDropContainer = styled.div`
  margin-top: 16px;
`

const DragAndDropContainerSecond = styled(DragAndDropContainer)`
  margin-top: 40px;
`

const UploadAndVerify: React.FC<Props> = (props) => {
  const [uploadAndVerified, setUploadAndVerified] = useState({
    proofOfAddress1: false,
    proofOfAddress2: false,
    sourceOfWelth1: false,
    sourceOfWelth2: false
  })
  const [uploadedFiles, setUploadedFiles] = useState({
    proofOfAddress1: null,
    proofOfAddress2: null,
    sourceOfWelth1: null,
    sourceOfWelth2: null
  })

  const handleDrop = (files, name: string) => {
    let uploadedFile: File
    if (files.length) {
      if (files && files.length > 1) {
        // TODO we have to add errors here
        return
      }
      uploadedFile = files[0] as File
    } else {
      uploadedFile = files
    }
    setUploadAndVerified({ ...uploadAndVerified, [name]: true })
    uploadedFiles[name] = uploadedFile
    setUploadedFiles(uploadedFiles)
  }

  const fileDownload = (name: string) => {
    const fileForDownload = uploadedFiles[name]
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(fileForDownload)
    link.download = fileForDownload.name
    link.click()
  }

  const fileDelete = (name: string) => {
    setUploadAndVerified({ ...uploadAndVerified, [name]: false })
    setUploadedFiles({ ...uploadedFiles, [name]: null })
  }

  const getSizeInMB = (size) => {
    const sizeInMB = size / 1024 / 1024
    return `${Math.round(sizeInMB * 100) / 100}MB`
  }

  const getFileName = (name: string) => {
    if (uploadedFiles[name]) {
      return `${uploadedFiles[name].name}  - ${getSizeInMB(uploadedFiles[name].size)}`
    }
    return undefined
  }

  const submitUplaodedFiles = () => {
    const files: FileUploadItem[] = []
    // we had to do async converting files into base64
    const filesUpdate = async () => {
      return Promise.all(
        Object.entries(uploadedFiles).map(async (fileItem) => {
          const file = fileItem[1]
          if (file !== null) {
            files.push({
              category: fileItem[0],
              file: await toBase64(file)
            })
          }
        })
      )
    }

    filesUpdate().then(() => {
      props.submitData(files)
    })
  }

  const disable = uploadedFiles.proofOfAddress1 === null || uploadedFiles.sourceOfWelth1 === null
  return (
    <Container>
      <Header data-e2e='InterestUploadAndVerifiedNextStep' mode='back' onClick={props.previousStep}>
        <FormattedMessage
          id='modals.interest.withdrawal.upload_documents.get_started.title'
          defaultMessage='Upload & Verify'
        />
      </Header>
      <Content mode='top'>
        <ContentWrapper>
          <Title>
            <FormattedMessage
              id='modals.interest.withdrawal.upload_documents.get_started.proof_of_current_address'
              defaultMessage='Proof of Current Address'
            />
          </Title>
          <Subtitle color='grey900' size='14px' weight={500} lineHeight='20px'>
            <FormattedMessage
              id='modals.interest.withdrawal.upload_documents.get_started.bank_acccount_statement'
              defaultMessage='Bank Account Statement or Utility Bill'
            />
          </Subtitle>

          <Text color='grey600' lineHeight='1.5' size='12px' weight={500}>
            <FormattedMessage
              id='modals.interest.withdrawal.upload_documents.get_started.bank_acccount_statement.description'
              defaultMessage='Must be dated within the last 90 days or a council tax bill for the current tax year.'
            />
          </Text>

          <DragAndDropContainer>
            <DragAndDrop
              handleDrop={(files) => handleDrop(files, 'proofOfAddress1')}
              no='1'
              fileUploaded={uploadAndVerified.proofOfAddress1}
              isProofOfAddress
              fileName={getFileName('proofOfAddress1')}
              onFileDelete={() => fileDelete('proofOfAddress1')}
              onFileDownload={() => fileDownload('proofOfAddress1')}
            />
          </DragAndDropContainer>
          {uploadAndVerified.proofOfAddress1 && (
            <DragAndDropContainerSecond>
              <DragAndDrop
                handleDrop={(files) => handleDrop(files, 'proofOfAddress2')}
                no='2'
                fileUploaded={uploadAndVerified.proofOfAddress2}
                isOptional
                isProofOfAddress
                fileName={getFileName('proofOfAddress2')}
                onFileDelete={() => fileDelete('proofOfAddress2')}
                onFileDownload={() => fileDownload('proofOfAddress2')}
              />
            </DragAndDropContainerSecond>
          )}
        </ContentWrapper>
        <ContentDivider />
        <ContentWrapper>
          <Title>
            <FormattedMessage
              id='modals.interest.withdrawal.upload_documents.get_started.source_of_wealth.source_of_wealth'
              defaultMessage='Source of Wealth'
            />
          </Title>
          <Subtitle color='grey900' size='14px' weight={500} lineHeight='20px'>
            <FormattedMessage
              id='modals.interest.withdrawal.upload_documents.get_started.source_of_wealth.bank_account_stub'
              defaultMessage='Bank Account Statement or Pay Stub/Slip.'
            />
          </Subtitle>

          <DragAndDropContainer>
            <DragAndDrop
              handleDrop={(files) => handleDrop(files, 'sourceOfWelth1')}
              no='1'
              fileUploaded={uploadAndVerified.sourceOfWelth1}
              fileName={getFileName('sourceOfWelth1')}
              onFileDelete={() => fileDelete('sourceOfWelth1')}
              onFileDownload={() => fileDownload('sourceOfWelth1')}
            />
          </DragAndDropContainer>
          {uploadAndVerified.sourceOfWelth1 && (
            <DragAndDropContainerSecond>
              <DragAndDrop
                handleDrop={(files) => handleDrop(files, 'sourceOfWelth2')}
                no='2'
                fileUploaded={uploadAndVerified.sourceOfWelth2}
                isOptional
                fileName={getFileName('sourceOfWelth2')}
                onFileDelete={() => fileDelete('sourceOfWelth2')}
                onFileDownload={() => fileDownload('sourceOfWelth2')}
              />
            </DragAndDropContainerSecond>
          )}
        </ContentWrapper>
      </Content>

      <Footer>
        <Button
          nature='primary'
          data-e2e='additionalInfoUploadDocument'
          type='button'
          fullwidth
          height='48px'
          style={{ marginTop: '16px' }}
          onClick={() => submitUplaodedFiles()}
          disabled={disable}
        >
          <FormattedMessage id='buttons.submit' defaultMessage='Submit' />
        </Button>
      </Footer>
    </Container>
  )
}

export type Props = {
  nextStep: () => void
  previousStep: () => void
  submitData: (files) => void
}

export default UploadAndVerify
