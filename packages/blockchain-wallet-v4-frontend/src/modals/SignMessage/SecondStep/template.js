import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button, Text } from 'blockchain-info-components'
import CopyClipboard from 'components/CopyClipboard'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`
const DetailRow = styled.div`
  display: flex;
  margin-bottom: 10px;
  align-items: flex-start;
  flex-direction: ${props => props.column ? 'column' : 'row'};
  > div:first-child { margin-right: 2px; }
`
const SubmitRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-top: 10px;
  width: 100%;
`
const ClickableText = styled(Text)`
  margin-right: 15px;
  cursor: pointer;
`

const SecondStep = props => {
  const { address, closeAll, message, resetForm, signedMessage } = props

  return (
    <Wrapper>
      <DetailRow>
        <Text size='14px' weight={400}>
          <FormattedMessage id='modals.signmessage.firststep.address' defaultMessage='Address:' />
        </Text>
        <Text size='14px' weight={300}>{address}</Text>
      </DetailRow>
      <DetailRow>
        <Text size='14px' weight={400}>
          <FormattedMessage id='modals.signmessage.secondstep.message' defaultMessage='Message:' />
        </Text>
        <Text size='14px' weight={300}>{message}</Text>
      </DetailRow>
      <DetailRow column>
        <Text size='14px' weight={400}>
          <FormattedMessage id='modals.signmessage.secondstep.signature' defaultMessage='Signature:' />
        </Text>
        <CopyClipboard address={signedMessage} />
      </DetailRow>
      <SubmitRow>
        <ClickableText size='14px' weight={300} onClick={resetForm}>
          <FormattedMessage id='modals.signmessage.reset' defaultMessage='Reset Form' />
        </ClickableText>
        <Button nature='primary' onClick={closeAll}>
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
