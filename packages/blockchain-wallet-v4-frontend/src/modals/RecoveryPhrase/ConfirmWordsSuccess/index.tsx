import { Button, Icon, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { Props } from '../index'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  padding: 40px;
`
const IconWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`
const ContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const ConfirmWordsSuccess: React.FC<Props> = props => {
  return (
    <Wrapper>
      <IconWrapper>
        <Icon
          cursor
          name='close'
          size='20px'
          color='grey600'
          role='button'
          onClick={() => props.handleClose()}
        />
      </IconWrapper>
      <ContentWrapper>
        <Icon
          name='checkmark-circle-filled'
          color='green400'
          size='72px'
          style={{ marginBottom: '25px' }}
        />

        <Text
          color='grey800'
          size='20px'
          weight={600}
          style={{ lineHeight: 1.7 }}
        >
          <FormattedMessage
            id='modals.recoveryphrase.success'
            defaultMessage='Success!'
          />
        </Text>
        <Text
          size='14px'
          color='grey500'
          weight={500}
          style={{ lineHeight: 1.7 }}
        >
          <FormattedMessage
            id='modals.recoveryphrase.success.body'
            defaultMessage='Your Wallet is now backed up.'
          />
        </Text>

        <Button
          capitalize
          data-e2e='continueToSend'
          fullwidth
          height='48px'
          nature='primary'
          size='16px'
          onClick={props.handleClose}
          style={{ marginTop: '40px' }}
        >
          <FormattedMessage
            id='modals.recoveryphrase.success.body'
            defaultMessage='Continue to Send'
          />
        </Button>
      </ContentWrapper>
    </Wrapper>
  )
}

export default ConfirmWordsSuccess
