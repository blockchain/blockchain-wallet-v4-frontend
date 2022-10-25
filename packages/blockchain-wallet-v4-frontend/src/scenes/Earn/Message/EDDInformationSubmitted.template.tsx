import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex, IconTimeout, PaletteColors } from '@blockchain-com/constellation'

import { Link, Text } from 'blockchain-info-components'

import { MessageContainer, SubmitButton } from './Message.model'

const EDDInformationSubmitted = ({ handleClick }: OwnPropsType) => {
  return (
    <MessageContainer $borderColor='primary'>
      <Flex alignItems='center' gap={16}>
        <IconTimeout color={PaletteColors['grey-700']} size='large' />
        <Flex flexDirection='column' justifyContent='space-between' gap={4}>
          <Text color='grey900' size='12px' weight={600}>
            <FormattedMessage
              defaultMessage='Documents under review'
              id='scenes.earn.edd-information-submitted.title'
            />
          </Text>
          <Text color='grey900' size='14px' weight={500}>
            <FormattedMessage
              defaultMessage='We’ve successfully received your documents! A Blockchain.com team member is reviewing it now and will get back to you soon.'
              id='scenes.earn.edd-information-submitted.subtitle'
            />
          </Text>
        </Flex>
      </Flex>
      <Link
        href='https://support.blockchain.com/hc/en-us/requests/new?ticket_form_id=360001711712'
        target='_blank'
      >
        <SubmitButton data-e2e='eddInformationSubmitted' nature='white-blue' onClick={handleClick}>
          <FormattedMessage
            defaultMessage='Contact Support'
            id='scenes.earn.edd-information-submitted.upgradenow'
          />
        </SubmitButton>
      </Link>
    </MessageContainer>
  )
}

type OwnPropsType = {
  handleClick: () => void
}

export default EDDInformationSubmitted
