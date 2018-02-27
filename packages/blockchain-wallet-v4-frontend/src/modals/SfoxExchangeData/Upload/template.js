import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { } from 'components/Form'
import { Text, Button, IconButton, Icon } from 'blockchain-info-components'
import { } from 'services/FormHelper'
import Dropzone from 'react-dropzone'

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
const ColLeftInner = styled.div`
  width: 80%;
`
const Title = styled.div`
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 20px;
`
const Subtitle = styled.div`
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 15px;
`
const Info = styled.div`
  font-size: 14px;
  margin-bottom: 10px;
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
const IdInfo = Info.extend`margin-bottom: 3px;`
const AlertInfo = Info.extend`margin-top: 10px;`

const Verify = (props) => {
  const { onDrop, onClickUpload, file } = props
  let dropzoneRef

  const renderInputOptions = () => {
    return (
      <CustomDropzone accept='image/jpeg, image/png' onDrop={onDrop} disableClick>
        <InputForm>
          <ButtonContainer>
            <IconButton nature='primary' name='camera'>
              <FormattedMessage id='sfoxexchangedata.upload.camera' defaultMessage='Capture Using Camera' />
            </IconButton>
            <OrHorizontalLine>
              <FormattedMessage id='sfoxexchangedata.upload.or' defaultMessage='OR' />
            </OrHorizontalLine>
            <Dropzone style={{ border: 'none', height: 'initial' }} onDrop={onDrop}>
              <IconButton nature='' name='up-arrow-in-circle'>
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
        <ColLeftInner>
          <Title>
            <FormattedMessage id='sfoxexchangedata.upload.title' defaultMessage='Upload Documents' />
          </Title>
          <Subtitle>
            <FormattedMessage id='sfoxexchangedata.upload.subtitle' defaultMessage='Photo ID Verification' />
          </Subtitle>
          <Info>
            <FormattedMessage id='sfoxexchangedata.upload.info' defaultMessage='To verify your identity and confirm your country of residence, please upload one of the following government-issued forms of ID:' />
          </Info>
          <IdInfo>
            <FormattedMessage id='sfoxexchangedata.upload.license' defaultMessage='- State-issued driver’s license' />
          </IdInfo>
          <IdInfo>
            <FormattedMessage id='sfoxexchangedata.upload.passport' defaultMessage='- Passport' />
          </IdInfo>
          <IdInfo>
            <FormattedMessage id='sfoxexchangedata.upload.govid' defaultMessage='- State or government-issued identification card' />
          </IdInfo>
          <AlertInfo>
            <Text weight={400}>
              <Icon name='alert' size='18px' color='error' />
              <FormattedMessage id='sfoxexchangedata.upload.selfies' defaultMessage='Selfies are not a valid form of ID Verification' />
            </Text>
          </AlertInfo>
        </ColLeftInner>
      </ColLeft>
      <ColRight>
        <Text size='14px'>
          <FormattedMessage id='sfoxexchangedata.upload.selectmethod' defaultMessage='Select Upload Method' />
        </Text>
        <InputContainer>
          {
            file
              ? <UploadSuccess>
                <img style={{ height: '250px', width: 'auto' }} src={file.preview} />
              </UploadSuccess>
              : renderInputOptions()
          }
        </InputContainer>
      </ColRight>
    </Row>
  )
}

export default reduxForm({ form: 'sfoxVerify' })(Verify)
