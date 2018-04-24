import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button, Separator, Text } from 'blockchain-info-components'
import CopyClipboard from 'components/CopyClipboard'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
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
const MessageText = styled(Text)`
  background-color: ${props => props.theme['gray-1']};
`

const SecondStep = props => {
  const { address, closeAll, message, resetForm, signedMessage } = props

  return (
    <Wrapper>
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
        <MessageText>
          {message}
        </MessageText>
      </Row>
      <Row>
        <CopyClipboard address={signedMessage} />
      </Row>
      <Separator />
      <SubmitRow>
        <ClickableText weight={300} onClick={resetForm}>
          <FormattedMessage id='modals.signmessage.reset' defaultMessage='Reset Form' />
        </ClickableText>
        <Button onClick={closeAll} nature='primary' uppercase>
          <FormattedMessage id='modals.signmessage.secondstep.done' defaultMessage='Done' />
        </Button>
      </SubmitRow>
    </Wrapper>
  )
}

SecondStep.propTypes = {
  address: PropTypes.string.isRequired,
  closeAll: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  resetForm: PropTypes.func.isRequired,
  signedMessage: PropTypes.string.isRequired
}

export default SecondStep
