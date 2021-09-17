import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { FileUploadItem, InterestEDDDocumentsResponse } from 'blockchain-wallet-v4/src/types'

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
  padding: 0 40px;
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
    sourceOfWealth1: false,
    sourceOfWealth2: false
  })
  const [uploadAndVerifiedError, setUploadAndVerifiedError] = useState({
    proofOfAddress1: false,
    proofOfAddress2: false,
    sourceOfWealth1: false,
    sourceOfWealth2: false
  })
  const [uploadedFiles, setUploadedFiles] = useState({
    proofOfAddress1: null,
    proofOfAddress2: null,
    sourceOfWealth1: null,
    sourceOfWealth2: null
  })

  const { maxAllowedFileSizeMBs, validTypes } = props.documentLimits
  const allValidFileTypes = validTypes.join(',')

  const getSizeInMB = (size: number, includeUnit = true) => {
    const sizeInMB = size / 1024 / 1024
    return `${Math.round(sizeInMB * 100) / 100}${includeUnit ? 'MB' : ''}`
  }

  const handleDrop = (files, name: string) => {
    let uploadedFile: File
    if (files.length) {
      if (files && files.length > 1) {
        setUploadAndVerifiedError({ ...uploadAndVerifiedError, [name]: true })
        return
      }
      uploadedFile = files[0] as File
    } else {
      uploadedFile = files
    }
    // verify file size and extension
    const fileExtension = uploadedFile.name.split('.').pop() || ''
    const fileSize = getSizeInMB(Number(uploadedFile.size), false)

    if (!validTypes.includes(fileExtension)) {
      setUploadAndVerifiedError({ ...uploadAndVerifiedError, [name]: true })
      return
    }

    if (Number(fileSize) > maxAllowedFileSizeMBs) {
      setUploadAndVerifiedError({ ...uploadAndVerifiedError, [name]: true })
      return
    }
    setUploadAndVerifiedError({ ...uploadAndVerifiedError, [name]: false })
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

  const fileDelete = (name: string, keepSecond?: boolean, secondName?: string) => {
    if (keepSecond && secondName && uploadedFiles[secondName]) {
      const secondFile = uploadedFiles[secondName]
      const secondError = uploadAndVerifiedError[secondName]
      setUploadedFiles({ ...uploadedFiles, [name]: secondFile, [secondName]: null })
      setUploadAndVerified({ ...uploadAndVerified, [name]: true, [secondName]: false })
      setUploadAndVerifiedError({ ...uploadAndVerifiedError, [secondName]: secondError })
    } else {
      setUploadedFiles({ ...uploadedFiles, [name]: null })
      setUploadAndVerified({ ...uploadAndVerified, [name]: false })
      setUploadAndVerifiedError({ ...uploadAndVerifiedError, [name]: false })
    }
  }

  const getFileName = (name: string) => {
    if (uploadedFiles[name]) {
      return `${uploadedFiles[name].name}  - ${getSizeInMB(Number(uploadedFiles[name].size))}`
    }
    return undefined
  }

  const getCategory = (name: string) =>
    name.includes('proofOfAddress') ? 'PROOF_OF_ADDRESS' : 'PROOF_OF_INCOME'

  const submitUplaodedFiles = () => {
    const files: FileUploadItem[] = []
    // we had to do async converting files into base64
    const filesUpdate = async () => {
      return Promise.all(
        Object.entries(uploadedFiles).map(async (fileItem) => {
          const file = fileItem[1]
          if (file !== null) {
            files.push({
              category: getCategory(fileItem[0]),
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

  const disable =
    uploadedFiles.proofOfAddress1 === null ||
    uploadedFiles.sourceOfWealth1 === null ||
    Object.values(uploadAndVerifiedError).some((val) => val)

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
          <Text
            color='grey900'
            lineHeight='20px'
            size='14px'
            weight={500}
            style={{ marginBottom: '45px' }}
          >
            <FormattedMessage
              id='modals.interest.withdrawal.upload_documents.upload_and_verify.please_upload'
              defaultMessage='Please upload a high resolution file ({files}) of each item below. Max file size is {maxSize}MB each.'
              values={{
                files: allValidFileTypes,
                maxSize: maxAllowedFileSizeMBs
              }}
            />
          </Text>
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
              docNumber='1'
              fileUploaded={uploadAndVerified.proofOfAddress1}
              isProofOfAddress
              error={uploadAndVerifiedError.proofOfAddress1}
              fileName={getFileName('proofOfAddress1')}
              onFileDelete={() => fileDelete('proofOfAddress1', true, 'proofOfAddress2')}
              onFileDownload={() => fileDownload('proofOfAddress1')}
            />
          </DragAndDropContainer>
          {uploadAndVerified.proofOfAddress1 && (
            <DragAndDropContainerSecond>
              <DragAndDrop
                handleDrop={(files) => handleDrop(files, 'proofOfAddress2')}
                docNumber='2'
                fileUploaded={uploadAndVerified.proofOfAddress2}
                isOptional
                isProofOfAddress
                error={uploadAndVerifiedError.proofOfAddress2}
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
              handleDrop={(files) => handleDrop(files, 'sourceOfWealth1')}
              docNumber='1'
              fileUploaded={uploadAndVerified.sourceOfWealth1}
              error={uploadAndVerifiedError.sourceOfWealth1}
              fileName={getFileName('sourceOfWealth1')}
              onFileDelete={() => fileDelete('sourceOfWealth1', true, 'sourceOfWealth2')}
              onFileDownload={() => fileDownload('sourceOfWealth1')}
            />
          </DragAndDropContainer>
          {uploadAndVerified.sourceOfWealth1 && (
            <DragAndDropContainerSecond>
              <DragAndDrop
                handleDrop={(files) => handleDrop(files, 'sourceOfWealth2')}
                docNumber='2'
                fileUploaded={uploadAndVerified.sourceOfWealth2}
                isOptional
                error={uploadAndVerifiedError.sourceOfWealth2}
                fileName={getFileName('sourceOfWealth2')}
                onFileDelete={() => fileDelete('sourceOfWealth2')}
                onFileDownload={() => fileDownload('sourceOfWealth2')}
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
  documentLimits: InterestEDDDocumentsResponse
  nextStep: () => void
  previousStep: () => void
  submitData: (files) => void
}

export default UploadAndVerify
