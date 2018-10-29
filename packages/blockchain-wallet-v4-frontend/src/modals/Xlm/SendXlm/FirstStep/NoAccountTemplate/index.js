import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { FormattedMessage } from 'react-intl'

import { Banner, Button, Text } from 'blockchain-info-components'
import { FormGroup } from 'components/Form'

export const NoAccountTemplate = () => (
  <React.Fragment>
    <FormGroup>
      <Banner type='info'>
        <Text color='warning' size='12px'>
          <FormattedMessage
            id='modals.sendxlm.firststep.noaccount'
            defaultMessage='This account is currently inactive. To activate it, deposit at least one lumen (XLM) into your wallet.'
          />
        </Text>
      </Banner>
    </FormGroup>
    <FormGroup>
      <LinkContainer
        to={{ pathname: '/exchange', state: { from: 'BTC', to: 'XLM' } }}
      >
        <Button type='submit' nature='primary' uppercase fullwidth>
          <FormattedMessage
            id='modals.sendxlm.firststep.exchange'
            defaultMessage='Exchange for Lumen'
          />
        </Button>
      </LinkContainer>
    </FormGroup>
  </React.Fragment>
)
