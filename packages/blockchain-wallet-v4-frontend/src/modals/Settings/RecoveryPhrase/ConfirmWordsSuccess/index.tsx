import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'

import { Props } from '../index'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`
const IconWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 40px;
`
const ContentWrapper = styled(FlyoutWrapper)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 70%;
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
            id='modals.recoveryphrase.success.close'
            defaultMessage='Close'
          />
        </Button>
      </ContentWrapper>
    </Wrapper>
  )
}

export default ConfirmWordsSuccess
