import { Button, Icon, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import { Props } from '../index'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100%;
`

const ConfirmWordsSuccess: React.FC<Props> = () => {
  return (
    <Wrapper>
      <FlyoutWrapper>
        <Icon name='checkmark-in-circle' color='green400' size='72px' />
        <Text color='grey600' size='20px' weight={600}>
          <FormattedMessage
            id='modals.recoveryphrase.success'
            defaultMessage='Success'
          />
        </Text>

        <Text color='grey600' weight={500}>
          <FormattedMessage
            id='modals.recoveryphrase.backupyourwallet.content.one'
            defaultMessage='Your backup phrase will allow you to recover your crypto if you lose access to your wallet.'
          />
        </Text>
        <Text color='grey600' weight={500} style={{ marginTop: '30px' }}>
          <FormattedMessage
            id='modals.recoveryphrase.backupyourwallet.content.two'
            defaultMessage='Please write down these 12 words in order and keep them somwhere safe. Never share it with anyone. Your backup phrase is the key to recovering your crypto if you ever lose your password.'
          />
        </Text>
        <Button
          capitalize
          data-e2e='skipBackup'
          fullwidth
          height='48px'
          nature='light'
          size='16px'
        >
          <FormattedMessage
            id='modals.recoveryphrase.backupyourwallet.later'
            defaultMessage='Do This Later'
          />
        </Button>
      </FlyoutWrapper>
    </Wrapper>
  )
}

export default ConfirmWordsSuccess
