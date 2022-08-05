import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Button, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

import {
  BackIconWrapper,
  Bottom,
  FlexWithMargin,
  TextWithMargin,
  TextWithMargins,
  TextWrapper
} from '../model'

const ShortcutInfo = (props) => {
  const isAppleDevice = navigator.platform.indexOf('Mac') === 0 || navigator.platform === 'iPhone'

  const handleBackArrow = () => {
    props.recoveryPhraseActions.setStep('CONFIRM_WORDS_SUCCESS')
  }

  return (
    <Flex flexDirection='column'>
      <BackIconWrapper width={24} height={24} onClick={handleBackArrow} />
      <TextWithMargins color='white' size='20px' weight={600}>
        <FormattedMessage
          id='plugin.modals.recoveryphrase.shortcut.title'
          defaultMessage='Keyboard shorcut'
        />
      </TextWithMargins>
      <TextWithMargin color='grey400' size='14px' weight={500} lineHeight='150%'>
        <FormattedMessage
          id='plugin.modals.recoveryphrase.shortcut.body'
          defaultMessage='You can open Blockchain at any time by using this keyboard shortcut'
        />
      </TextWithMargin>
      <FlexWithMargin alignItems='center' gap={20}>
        {isAppleDevice ? <img src='' alt='Key IOS Shift' /> : <img src='' alt='Key Shift' />}
        {isAppleDevice ? <img src='' alt='Key Option' /> : <img src='' alt='Key Control' />}
        <img src='' alt='Key B' />
      </FlexWithMargin>
      <TextWrapper alignItems='center'>
        <Text color='white' lineHeight='150%' size='14px' weight={500}>
          <FormattedMessage
            id={`plugin.modals.recoveryphrase.shortcut.buttons.${
              isAppleDevice ? 'apple' : 'nonApple'
            }.text`}
            defaultMessage={`${
              isAppleDevice ? 'Try: Shift + Command + B' : 'Try: Shift + Control + B'
            }`}
          />
        </Text>
      </TextWrapper>
      <Bottom>
        <Button
          capitalize
          data-e2e='goToPipPlugin'
          fullwidth
          height='48px'
          nature='light'
          onClick={() => props.recoveryPhraseActions.setStep('CONFIRM_WORDS_PIN')}
        >
          <Text color='grey900' size='16px' weight={600}>
            <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
          </Text>
        </Button>
      </Bottom>
    </Flex>
  )
}

export default ShortcutInfo
