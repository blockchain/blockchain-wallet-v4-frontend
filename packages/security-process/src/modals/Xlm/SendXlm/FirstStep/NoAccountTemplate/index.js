import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { FormattedMessage } from 'react-intl'

import { Banner, Button, Text } from 'blockchain-info-components'
import { model } from 'data'
import { FormGroup } from 'components/Form'
import ModalIcon from '../ModalIcon'

const { CREATE_ACCOUNT_LEARN_MODAL } = model.components.sendXlm

export const NoAccountTemplate = () => (
  <React.Fragment>
    <FormGroup>
      <Banner type='info' data-e2e='sendXlmNoAccount'>
        <Text color='warning' size='12px'>
          <FormattedMessage
            id='modals.sendxlm.firststep.noaccount'
            defaultMessage='Minimum of 1 XLM needed for new accounts. Learn about Stellar’s minimum balance requirement.'
          />
        </Text>
        <ModalIcon modal={CREATE_ACCOUNT_LEARN_MODAL} />
      </Banner>
    </FormGroup>
    <FormGroup>
      <LinkContainer
        to={{
          pathname: '/swap',
          state: {
            from: 'BTC',
            to: 'XLM',
            amount: '0',
            fix: model.rates.FIX_TYPES.BASE_IN_FIAT
          }
        }}
      >
        <Button type='submit' nature='primary' uppercase fullwidth>
          <FormattedMessage
            id='modals.sendxlm.firststep.swap'
            defaultMessage='Swap for XLM'
          />
        </Button>
      </LinkContainer>
    </FormGroup>
  </React.Fragment>
)
