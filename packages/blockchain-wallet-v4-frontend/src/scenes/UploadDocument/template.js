import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Field, Form, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'

import { Button, Text } from 'blockchain-info-components'
import { FileInput } from 'components/Form'

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
const Title = styled(Text)`
  padding-bottom: 5px;
`

const UploadForm = styled(Form)`
  width: 100%;
  padding: 35px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white']};

  @media (min-width: 768px) {
    width: 550px;
  }
`

const UploadDocument = ({ documentType, handleSubmit, onSubmit }) => (
  <UploadForm onSubmit={handleSubmit}>
    <Title size='24px' weight={300}>
      <FormattedMessage
        id='scenes.uploaddoc.upload'
        defaultMessage='Please upload the following document: '
      />
    </Title>
    <Text weight={300}>{documentType}</Text>
    <Row>
      <Field
        accept='.jpg, .png'
        component={FileInput}
        data-e2e='documentUploadField'
        name='document'
      />
      <Button data-e2e='documentUploadButton' nature='primary' type='submit'>
        <Text color='white' weight={300}>
          <FormattedMessage
            id='scenes.uploaddoc.submit'
            defaultMessage='Upload'
          />
        </Text>
      </Button>
    </Row>
  </UploadForm>
)

UploadDocument.propTypes = {
  documentType: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default reduxForm({ form: 'uploadDocument' })(UploadDocument)
