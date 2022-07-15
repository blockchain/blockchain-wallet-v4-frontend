import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

import { BackIconWrapper, Bottom, TextWithMargin, TextWithMargins } from '../model'

const FlexWithMargins = styled(Flex)`
  margin: 103px auto auto;
`
const PinPluginInfo = (props) => {
  const handleBackArrow = () => {
    props.recoveryPhraseActions.setStep('CONFIRM_WORDS_SHORTCUT')
  }

  const goToHomePage = () => {
    props.history.push('/plugin/coinslist')
  }

  return (
    <Flex flexDirection='column'>
      <BackIconWrapper width={24} height={24} onClick={handleBackArrow} />
      <TextWithMargins color='white' size='20px' weight={600}>
        <FormattedMessage
          id='plugin.modals.recoveryphrase.pin.title'
          defaultMessage='Pin the Blockchain Extension!'
        />
      </TextWithMargins>
      <TextWithMargin color='grey400' size='14px' weight={500} lineHeight='150%'>
        <FormattedMessage
          id='plugin.modals.recoveryphrase.pin.body'
          defaultMessage='In Google Chrome, click the extension icon, find the Blockchain.com extension, and click the pin icon on the right.'
        />
      </TextWithMargin>
      <FlexWithMargins alignItems='center' gap={12}>
        <Text color='white' lineHeight='150%' size='14px' weight={500}>
          <FormattedMessage id='plugin.modals.recoveryphrase.pin.click' defaultMessage='Click' />
        </Text>
        <img src='' alt='Puzzle' />
        <Text color='white' lineHeight='150%' size='14px' weight={500}>
          <FormattedMessage
            id='plugin.modals.recoveryphrase.pin.andthen'
            defaultMessage='and then'
          />
        </Text>
        <img src='' alt='Pin' />
      </FlexWithMargins>
      <Bottom>
        <Button
          capitalize
          data-e2e='closeBackupSeedPhrase'
          fullwidth
          height='48px'
          nature='light'
          onClick={goToHomePage}
        >
          <Text color='grey900' size='16px' weight={600}>
            <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
          </Text>
        </Button>
      </Bottom>
    </Flex>
  )
}

export default PinPluginInfo
