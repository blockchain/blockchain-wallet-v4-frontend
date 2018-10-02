import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import Dropzone from 'react-dropzone'

import { Button, Text } from 'blockchain-info-components'

const Title = styled(Text)`
  padding-bottom: 5px;
`

const Wrapper = styled.div`
  width: 100%;
  padding: 35px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white']};

  @media (min-width: 768px) {
    width: 550px;
  }
`
const UploadButton = styled(Button)`
  margin-top: 16px;
`
const UploadZone = styled(Dropzone)`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  border: 2px dotted ${props => props.theme['gray-4']};
  border-radius: 8px;
  margin-bottom: 16px;
  margin-top: 16px;
  padding: 16px;
  cursor: pointer;
`

const UploadDocument = ({ documentType, files, onDropAccepted, onSubmit }) => (
  <Wrapper>
    <Title size='24px' weight={300}>
      <FormattedMessage
        id='scenes.uploaddoc.upload'
        defaultMessage='Please upload the following document: '
      />
    </Title>
    <Text weight={300}>{documentType}</Text>
    <UploadZone accept='image/jpeg, image/png' onDropAccepted={onDropAccepted}>
      <Text weight={300}>
        Try dropping some files here, or click to select files to upload.
      </Text>
    </UploadZone>
    {files.map(file => (
      <Text>{`${file.name} - ${file.size} bytes`}</Text>
    ))}
    <UploadButton nature='primary' onClick={onSubmit}>
      Upload
    </UploadButton>
  </Wrapper>
)

UploadDocument.propTypes = {
  documentType: PropTypes.string.isRequired,
  files: PropTypes.array.isRequired,
  onDropAccepted: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default UploadDocument
