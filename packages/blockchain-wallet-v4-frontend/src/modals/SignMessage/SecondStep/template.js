import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { Button, Separator, Text } from 'blockchain-info-components'
import { TextArea } from 'components/Form'
import CopyClipboard from 'components/CopyClipboard'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
`
const SubmitRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
`
const ClickableText = styled(Text)`
  cursor: pointer;
`

const SecondStep = props => {
  const { address, closeAll, handleSubmit, invalid, resetForm, submitting } = props

  return (
    <Wrapper override onSubmit={handleSubmit}>
      <Row>
        <Text weight={300}>
          <FormattedMessage id='modals.signmessage.secondstep.address' defaultMessage='Address:' />
        </Text>
        <Text weight={200}>{address}</Text>
      </Row>
      <Row>
        <Text weight={300}>
          <FormattedMessage id='modals.signmessage.secondstep.message' defaultMessage='Message:' />
        </Text>
        <Field name='message' component={TextArea} disabled placeholder='Thanks for accepting bitcoin!' />
      </Row>
      <Row>
        <CopyClipboard address={address} />
      </Row>
      <Separator />
      <SubmitRow>
        <ClickableText weight={300} onClick={resetForm}>
          <FormattedMessage id='modals.signmessage.reset' defaultMessage='Reset Form' />
        </ClickableText>
        <Button onClick={closeAll} nature='primary' uppercase disabled={submitting || invalid}>
          <FormattedMessage id='modals.signmessage.secondstep.done' defaultMessage='Done' />
        </Button>
      </SubmitRow>
    </Wrapper>
  )
}

SecondStep.propTypes = {
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default reduxForm({ form: 'signMessage', destroyOnUnmount: false })(SecondStep)
