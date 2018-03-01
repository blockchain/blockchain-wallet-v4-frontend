import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { reduxForm } from 'redux-form'
import { Text, Button, IconButton, Link } from 'blockchain-info-components'
import { } from 'services/FormHelper'
import Dropzone from 'react-dropzone'

import CameraContainer from './camera'
import TitleStrings from './strings'

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`
const ColLeft = styled.div`
  width: 40%;
`
const ColRight = styled.div`
  width: 60%;
`
const InputContainer = styled.div`
  border: 1px solid #ebebeb;
  max-height: 360px;
  height: 360px;
`
const InputForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`
const OrHorizontalLine = styled.div`
  span:before {
    top: 50%;
    width: 40%;
    height: 1px;
    left: 0;
    right: initial;
  }
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
  height: 100%;
`
const UploadSuccess = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`
const UploadStatus = styled.div`
  display: flex;
  justify-content: space-between;
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
const SuccessText = styled(Text)`margin: 30px 0px; `

const Verify = (props) => {
  console.log('verify template', props)
  const { onDrop, file, data, toggleCamera, showCamera, setPhoto, photo, resetUpload, submitForUpload } = props
  const idType = data.verificationStatus.required_docs[0]

  const renderInputOptions = () => {
    return (
      <CustomDropzone accept='image/jpeg, image/png' onDrop={onDrop} disableClick>
        <InputForm>
          <ButtonContainer>
            <IconButton nature='primary' name='camera' onClick={toggleCamera}>
              <FormattedMessage id='sfoxexchangedata.upload.camera' defaultMessage='Capture Using Camera' />
            </IconButton>
            <OrHorizontalLine>
              <FormattedMessage id='sfoxexchangedata.upload.or' defaultMessage='OR' />
            </OrHorizontalLine>
            <Dropzone style={{ border: 'none', height: 'initial' }} onDrop={onDrop}>
              <IconButton name='up-arrow-in-circle'>
                <FormattedMessage id='sfoxexchangedata.upload.uploadfromdevice' defaultMessage='Upload From Device' />
              </IconButton>
            </Dropzone>
          </ButtonContainer>
        </InputForm>
      </CustomDropzone>
    )
  }

  return (
    <Row>
      <ColLeft>
        <TitleStrings idType={idType} />
      </ColLeft>
      <ColRight>
        <UploadStatus>
          <Text size='14px'>
            <FormattedMessage id='sfoxexchangedata.upload.selectmethod' defaultMessage='Select Upload Method' />
          </Text>
          <Text size='14px'>
            <FormattedMessage id='sfoxexchangedata.upload.selectmethod' defaultMessage='Upload Step ' />
            { 1 }
            <FormattedMessage id='sfoxexchangedata.upload.of' defaultMessage=' of ' />
            { data.verificationStatus.required_docs.length }
          </Text>
        </UploadStatus>
        <InputContainer>
          {
            file
              ? <UploadSuccess>
                <Text size='20px' color='success'>
                  <FormattedMessage id='sfoxexchangedata.upload.uploadsuccess' defaultMessage='Successfully Uploaded!' />
                </Text>
                <SuccessText size='16px'>
                  <FormattedMessage id='sfoxexchangedata.upload.sentforreview' defaultMessage='Document will be sent for review.' />
                </SuccessText>
                <img style={{ height: '180px' }} src={file.preview} alt='Your document' />
              </UploadSuccess>
              : photo
                ? <UploadSuccess>
                  <Text size='20px' color='success'>
                    <FormattedMessage id='sfoxexchangedata.upload.uploadsuccess' defaultMessage='Successfully Uploaded!' />
                  </Text>
                  <SuccessText size='16px'>
                    <FormattedMessage id='sfoxexchangedata.upload.imgsentforreview' defaultMessage='Image will be sent for review.' />
                  </SuccessText>
                  <img style={{ height: '180px' }} src={photo} id='photo' alt='Your photo' />
                </UploadSuccess>
                : showCamera
                  ? <CameraContainer setPhoto={setPhoto} ref={instance => { this.camera = instance }} />
                  : renderInputOptions()
          }
        </InputContainer>
        {
          file || photo
            ? <SubmitContainer>
              <Button fullwidth nature='primary' onClick={submitForUpload}>
                <FormattedMessage id='sfoxexchangedata.upload.submitforreview' defaultMessage='Submit For Review' />
              </Button>
              <Link size='13px' onClick={resetUpload}>
                <FormattedMessage id='sfoxexchangedata.upload.tryagain' defaultMessage='Try Again' />
              </Link>
            </SubmitContainer>
            : showCamera
              ? <SubmitContainer>
                <IconButton name='camera' fullwidth nature='primary' onClick={() => { this.camera.handleStartClick() }}>
                  <FormattedMessage id='sfoxexchangedata.upload.capture' defaultMessage='Capture' />
                </IconButton>
              </SubmitContainer>
              : null
        }
      </ColRight>
    </Row>
  )
}

export default reduxForm({ form: 'sfoxUpload' })(Verify)
