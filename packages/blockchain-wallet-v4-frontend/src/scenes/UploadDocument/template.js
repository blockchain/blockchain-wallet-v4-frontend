import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import Dropzone from 'react-dropzone'
import { FasIdBadge, FasIdCard, FasPassport } from '@blockchain-com/components'

import {
  Button,
  HeartbeatLoader,
  Link,
  Text,
  TextGroup
} from 'blockchain-info-components'

const FileContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  border: 1px solid ${props => props.theme['brand-tertiary']};
  border-radius: 4px;
  padding: 4px;
  width: 100%;
`
const FileInfo = styled.div`
  display: flex;
  flex-direction: column;
`
const FilesList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`
const Icons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  & > * {
    fill: ${props => props.theme['brand-primary']};
  }
`
const IdContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-right: 20px;

  & > * {
    padding-bottom: 12px;
  }
`
const UploadButton = styled(Button)`
  margin-top: 16px;
`
const UploadZone = styled(Dropzone)`
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  background-color: ${props => props.theme['white']};
  border: 1px solid ${props => props.theme['brand-tertiary']};
  border-radius: 8px;
  padding: 8px;
`
const UploadZoneContainer = styled.div`
  padding: 16px;
  border: 1px dashed ${props => props.theme['brand-tertiary']};
  border-radius: 8px;
`
const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 35px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white-blue']};

  @media (max-width: 760px) {
    flex-direction: column;
  }
`

const isMobile = window.matchMedia('(max-width: 760px)')

const UploadDocument = ({
  deleteFileAt,
  documentType,
  files,
  onDropAccepted,
  onSubmit,
  openDropzone,
  setDropzoneRef,
  submitted,
  uploaded
}) => (
  <Wrapper>
    <TextContainer>
      <Text color='brand-primary' size='20px' weight={300}>
        <FormattedMessage id='scenes.uploaddoc.hello' defaultMessage='Hello!' />
      </Text>
      <Text color='brand-primary' size='20px' weight={300}>
        <FormattedMessage
          id='scenes.uploaddoc.verify'
          defaultMessage='We need to verify your identity in order to allow buys, 
          sells or exchanges.'
        />
      </Text>
      <Text color='brand-primary' size='20px' weight={300}>
        <FormattedMessage
          id='scenes.uploaddoc.doc'
          defaultMessage='Please upload the following document: '
        />
      </Text>
      <Text color='brand-primary' size='20px' weight={300}>
        {documentType}
      </Text>
      <Link>
        <FormattedMessage
          id='scenes.uploaddoc.need'
          defaultMessage='Why do you need this?'
        />
      </Link>
    </TextContainer>
    <UploadZoneContainer>
      <UploadZone
        accept='image/jpeg, application/pdf, image/png'
        disableClick
        onDropAccepted={onDropAccepted}
        innerRef={setDropzoneRef}
      >
        {files.length === 0 ? (
          <Fragment>
            {isMobile.matches ? (
              <Link onClick={openDropzone} weight={300}>
                <FormattedMessage
                  id='scenes.uploaddoc.browsefiles'
                  defaultMessage='Browse files'
                />
              </Link>
            ) : (
              <Fragment>
                <Text color='brand-primary' size='20px' weight={300}>
                  <FormattedMessage
                    id='scenes.uploaddoc.dragdrop'
                    defaultMessage='Drag &amp; Drop'
                  />
                </Text>
                <TextGroup inline>
                  <Text color='brand-primary' weight={300}>
                    <FormattedMessage
                      id='scenes.uploaddoc.placefiles'
                      defaultMessage='Place your files here, '
                    />
                  </Text>
                  <Link onClick={openDropzone} weight={300}>
                    <FormattedMessage
                      id='scenes.uploaddoc.browse'
                      defaultMessage='or browse'
                    />
                  </Link>
                </TextGroup>
              </Fragment>
            )}
            <Icons>
              <IdContainer>
                <FasPassport />
                <Text color='brand-primary' size='12px' weight={300}>
                  <FormattedMessage
                    id='scenes.uploaddoc.passport'
                    defaultMessage='Passport'
                  />
                </Text>
              </IdContainer>
              <IdContainer>
                <FasIdBadge />
                <Text color='brand-primary' size='12px' weight={300}>
                  <FormattedMessage
                    id='scenes.uploaddoc.drivinglicense'
                    defaultMessage='Driving license'
                  />
                </Text>
              </IdContainer>
              <IdContainer>
                <FasIdCard />
                <Text color='brand-primary' size='12px' weight={300}>
                  <FormattedMessage
                    id='scenes.uploaddoc.idcard'
                    defaultMessage='ID Card'
                  />
                </Text>
              </IdContainer>
            </Icons>
          </Fragment>
        ) : (
          <Fragment>
            <FilesList>
              {files.map((file, index) => (
                <FileContainer key={index}>
                  <FileInfo>
                    <Text color='brand-primary' size='12px' weight={200}>
                      {file.name}
                    </Text>
                    <Text color='brand-primary' size='12px' weight={200}>
                      {`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                    </Text>
                  </FileInfo>
                  <Text
                    color='gray-3'
                    cursor='pointer'
                    onClick={() => deleteFileAt(index)}
                    size='12px'
                    weight={300}
                  >
                    <FormattedMessage
                      id='scenes.uploaddoc.deletedoc'
                      defaultMessage='Delete'
                    />
                  </Text>
                </FileContainer>
              ))}
            </FilesList>
            <Link cursor='pointer' onClick={openDropzone} weight={300}>
              <FormattedMessage
                id='scenes.uploaddoc.browsecomputer'
                defaultMessage='Browse my computer'
              />
            </Link>
          </Fragment>
        )}
        <Text color='gray-3' size='14px' weight={300}>
          <FormattedMessage
            id='scenes.uploaddoc.filesize'
            defaultMessage='Please upload a JPG, PNG or PDF up to 3MB in size.'
          />
        </Text>
        {files.length > 0 && (
          <UploadButton nature='primary' onClick={onSubmit}>
            {submitted && !uploaded ? (
              <HeartbeatLoader height='20px' width='20px' color='white' />
            ) : (
              <FormattedMessage
                id='scenes.uploaddoc.uploadnow'
                defaultMessage='Upload Now'
              />
            )}
          </UploadButton>
        )}
      </UploadZone>
    </UploadZoneContainer>
  </Wrapper>
)

UploadDocument.propTypes = {
  deleteFileAt: PropTypes.func.isRequired,
  documentType: PropTypes.string.isRequired,
  files: PropTypes.array.isRequired,
  onDropAccepted: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  openDropzone: PropTypes.func.isRequired,
  setDropzoneRef: PropTypes.func.isRequired,
  submitted: PropTypes.bool.isRequired,
  uploaded: PropTypes.bool.isRequired
}

export default UploadDocument
