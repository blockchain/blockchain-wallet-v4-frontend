import { Button, Image, Text, TextGroup } from 'blockchain-info-components'
import { Content, Status } from './styles'
import { FormattedMessage } from 'react-intl'
import { Props } from '.'
import Conflict from './template.conflict'
import React from 'react'

const Failure: React.FC<Props & { close: () => void; error: any }> = props => {
  if (props.error.email) {
    return <Conflict {...props} close={props.close} />
  }
  return (
    <Content>
      <Image name='close-error' size='50px' />
      <Status>
        <Text color='grey600' size='24px' weight={600}>
          <FormattedMessage
            id='modals.onboarding.linkfromexchange.failureheader'
            defaultMessage='Connection Error'
          />
        </Text>
        <Text color='grey600' weight={500}>
          <FormattedMessage
            id='modals.onboarding.linkfromexchange.failure'
            defaultMessage='We could not connect your Wallet to Exchange. Please go back to Exchange and try again.'
          />
        </Text>
        <TextGroup inline>
          <Text size='13px' color='grey600'>
            Err:{' '}
          </Text>
          <Text size='13px' color='grey600'>
            {props.error && props.error.description}
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
        <Text color='blue600' size='16px' weight={500}>
          <FormattedMessage id='buttons.done' defaultMessage='Done' />
        </Text>
      </Button>
    </Content>
  )
}

export default Failure
