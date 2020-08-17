import { Button, Image, Text, TextGroup } from 'blockchain-info-components'
import { Content, Status } from './styles'
import { FormattedMessage } from 'react-intl'
import { Props } from '.'
import React from 'react'

const Failure: React.FC<Props & { close: () => void; error: any }> = props => {
  return (
    <Content>
      <Image name='close-error' size='50px' />
      <Status>
        <Text color='white' size='24px' weight={600}>
          <FormattedMessage
            id='modals.onboarding.linkfromexchange.failureheader'
            defaultMessage='Connection Error'
          />
        </Text>
        <Text color='white' weight={500}>
          <FormattedMessage
            id='modals.onboarding.linkfromexchange.failure'
            defaultMessage='We could not connect your Wallet to Exchange. Please go back to Exchange and try again.'
          />
        </Text>
        <TextGroup inline>
          <Text size='13px' color='white'>
            Err:{' '}
          </Text>
          <Text size='13px' color='white'>
            {props.error.description}
          </Text>
        </TextGroup>
      </Status>
      <Button
        nature='empty-blue'
        height='56px'
        fullwidth
        onClick={props.close}
        data-e2e='linkDone'
      >
        <Text color='white' size='16px' weight={500}>
          <FormattedMessage id='buttons.done' defaultMessage='Done' />
        </Text>
      </Button>
    </Content>
  )
}

export default Failure
