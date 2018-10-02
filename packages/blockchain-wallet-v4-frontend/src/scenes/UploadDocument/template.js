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
const UploadZone = styled(Dropzone)`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  border: 2px dotted ${props => props.theme['gray-4']};
  border-radius: 8px;
  margin-top: 8px;
  padding: 8px;
`

const UploadDocument = ({ documentType, onDropAccepted }) => (
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
      <Button nature='primary'>Upload</Button>
    </UploadZone>
  </Wrapper>
)

UploadDocument.propTypes = {
  documentType: PropTypes.string.isRequired,
  onDropAccepted: PropTypes.func.isRequired
}

export default UploadDocument
