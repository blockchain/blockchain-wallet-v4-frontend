import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { reduxForm } from 'redux-form'
import { Text, Button, IconButton, Link, Icon } from 'blockchain-info-components'
import { } from 'services/FormHelper'
import { flex } from 'services/StyleService'
import Dropzone from 'react-dropzone'

import CameraContainer from './camera'
import TitleStrings from './strings'
import { Row, ColLeft, ColRight, ColLeftInner, PartnerHeader } from 'components/BuySell/Signup'

const LockIcon = styled(Icon)`
  font-size: 24px;
  margin-left: 7px;
`

const InputContainer = styled.div`
  max-height: 300px;
  height: 200px;
`
const InputForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`
const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    button {
      margin: 20px 0px;
    }
`
const CustomDropzone = styled(Dropzone)`
  height: 200px;
  border: 1px solid #5F5F5F;
  border-radius: 2px;
`
const UploadSuccess = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`
const SubmitContainer = styled.div`
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  button {
    margin-bottom: 10px;
  }
`
const SuccessText = styled(Text)`margin: 20px 0px; `
const Wrapper = styled.div`

`
const InnerDropzone = styled(Dropzone)`
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: 20px 50px;
`
const CameraLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 300;
  margin-top: 15px;
`

const Upload = (props) => {
  const { onDrop,
    file,
    data,
    toggleCamera,
    showCamera,
    setPhoto,
    photo,
    resetUpload,
    submitForUpload } = props
  const idType = data.verificationStatus.required_docs[0]

  const renderInputOptions = () => {
    return (
      <Wrapper>
        <CustomDropzone accept='image/jpeg, image/png' onDrop={onDrop} disableClick>
          <InputForm>
            <ButtonContainer>
              <InnerDropzone style={{ border: 'none', height: 'initial' }} onDrop={onDrop}>
                <Text color='gray-3' size='14px' weight={300}>
                  <FormattedMessage id='sfoxexchangedata.upload.dragorbrowse' defaultMessage='Drag a document here or browse for a document to upload.' />
                </Text>
                <Button nature='primary'>
                  <FormattedMessage id='sfoxexchangedata.upload.selectfile' defaultMessage='Select File' />
                </Button>
              </InnerDropzone>
            </ButtonContainer>
          </InputForm>
        </CustomDropzone>
        { !showCamera ? <CameraLink onClick={toggleCamera}> <FormattedMessage id='sfoxexchangedata.upload.usecamera' defaultMessage='Use Camera Instead' /> </CameraLink> : null }
      </Wrapper>
    )
  }

  let camera = null
  return (
    <Row>
      <ColLeft>
        <ColLeftInner>
          <PartnerHeader style={{ ...flex('row align/center') }}>
            <FormattedMessage id='sfoxexchangedata.upload.title' defaultMessage='The Hidden Details' />
            <LockIcon name='lock-filled' />
          </PartnerHeader>
          <TitleStrings idType={idType} />
        </ColLeftInner>
        <InputContainer>
          {
            file
              ? <UploadSuccess>
                <SuccessText size='16px'>
                  <FormattedMessage id='sfoxexchangedata.upload.sentforreview' defaultMessage='Click submit to send the document for approval.' />
                </SuccessText>
                <img style={{ height: '180px' }} src={file.preview} alt='Your document' />
              </UploadSuccess>
              : photo
                ? <UploadSuccess>
                  <SuccessText size='16px'>
                    <FormattedMessage id='sfoxexchangedata.upload.imgsentforreview' defaultMessage='Click submit to send the image for approval.' />
                  </SuccessText>
                  <img style={{ height: '180px' }} src={photo} id='photo' alt='Your photo' />
                </UploadSuccess>
                : showCamera
                  ? <CameraContainer setPhoto={setPhoto} ref={instance => { camera = instance }} />
                  : renderInputOptions()
          }
          {
            showCamera && !photo
              ? <SubmitContainer>
                <IconButton name='camera' fullwidth nature='primary' onClick={() => { camera.handleStartClick() }}>
                  <FormattedMessage id='sfoxexchangedata.upload.capture' defaultMessage='Capture' />
                </IconButton>
              </SubmitContainer>
              : null
          }
        </InputContainer>
      </ColLeft>
      <ColRight>
        <SubmitContainer>
          <Button fullwidth nature='primary' onClick={submitForUpload} disabled={!photo && !file}>
            <FormattedMessage id='sfoxexchangedata.upload.submitforreview' defaultMessage='Submit For Review' />
          </Button>
          <Link size='13px' onClick={resetUpload}>
            <FormattedMessage id='sfoxexchangedata.upload.tryagain' defaultMessage='Try Again' />
          </Link>
        </SubmitContainer>
      </ColRight>
    </Row>
  )
}

export default reduxForm({ form: 'sfoxUpload' })(Upload)
