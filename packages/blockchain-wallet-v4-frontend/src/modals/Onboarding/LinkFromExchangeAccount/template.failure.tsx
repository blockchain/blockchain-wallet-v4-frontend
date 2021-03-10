import React from 'react'
import { FormattedMessage } from 'react-intl'

import {
  Button,
  Image,
  Link,
  Text,
  TextGroup
} from 'blockchain-info-components'

import { Props } from '.'
import { MainWrapperCentered, Status } from './styles'
import Conflict from './template.conflict'

const Failure: React.FC<Props & { close: () => void; error: any }> = props => {
  if (props.error.email) {
    return <Conflict {...props} close={props.close} />
  }
  return (
    <MainWrapperCentered>
      <div>
        <Image name='close-error' size='40px' />
        <Status style={{ marginTop: '20px' }}>
          <Text color='grey800' size='20px' weight={600}>
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
        <Link
          style={{ width: '100%' }}
          target='_blank'
          rel='noopener noreferrer'
          href='https://exchange.blockchain.com/trade'
        >
          <Button
            nature='empty-blue'
            height='56px'
            fullwidth
            onClick={props.close}
            data-e2e='linkBackToExchange'
            style={{ marginTop: '36px' }}
          >
            <Text color='blue600' size='16px' weight={500}>
              <FormattedMessage
                id='modals.onboarding.linkfromexchange.back_to_exchange'
                defaultMessage='Back to the Exchange'
              />
            </Text>
          </Button>
        </Link>
      </div>
    </MainWrapperCentered>
  )
}

export default Failure
