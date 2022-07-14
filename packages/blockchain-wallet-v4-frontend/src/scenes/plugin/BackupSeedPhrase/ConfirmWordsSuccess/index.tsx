import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Button, Text } from 'blockchain-info-components'
import { Icon } from 'blockchain-info-components/src/Icons'
import { Flex } from 'components/Flex'

import {
  BackIconWrapper,
  Bottom,
  ChevronRightIconWrapper,
  LinkWrapper,
  TextWithMargin,
  TextWithMargins
} from '../model'

const ConfirmWordsSuccess = (props) => {
  const handleBackArrow = () => {
    props.recoveryPhraseActions.setStep('CONFIRM_WORDS')
  }

  return (
    <Flex flexDirection='column'>
      <BackIconWrapper width={24} height={24} onClick={handleBackArrow} />
      <TextWithMargins color='white' size='20px' weight={600}>
        <FormattedMessage
          id='plugin.modals.recoveryphrase.successconfirm.title'
          defaultMessage='You are all done!'
        />
      </TextWithMargins>
      <TextWithMargin color='grey400' size='14px' weight={500} lineHeight='150%'>
        <FormattedMessage
          id='plugin.modals.recoveryphrase.successconfirm.body'
          defaultMessage='Follow along with product updates or reach out if you have any questions'
        />
      </TextWithMargin>
      <LinkWrapper size='16px' weight={600} target='_blank' href='https://support.blockchain.com/'>
        <Icon name='twitter' size='18px' />
        <FormattedMessage
          id='plugin.modals.recoveryphrase.successconfirm.followtwitter'
          defaultMessage='Follow us on Twitter'
        />
        <ChevronRightIconWrapper color={`${(props) => props.theme.grey400}`} height={28} />
      </LinkWrapper>
      <LinkWrapper size='16px' weight={600} target='_blank' href='https://support.blockchain.com/'>
        <Icon name='info' size='18px' />
        <FormattedMessage
          id='plugin.modals.recoveryphrase.successconfirm.helpcenter'
          defaultMessage='Visit the help center'
        />
        <ChevronRightIconWrapper color={`${(props) => props.theme.grey400}`} height={28} />
      </LinkWrapper>
      <Bottom>
        <Button
          capitalize
          data-e2e='goToShortcut'
          fullwidth
          height='48px'
          nature='light'
          onClick={() => props.recoveryPhraseActions.setStep('CONFIRM_WORDS_SHORTCUT')}
        >
          <Text color='grey900' size='16px' weight={600}>
            <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
          </Text>
        </Button>
      </Bottom>
    </Flex>
  )
}

export default ConfirmWordsSuccess
