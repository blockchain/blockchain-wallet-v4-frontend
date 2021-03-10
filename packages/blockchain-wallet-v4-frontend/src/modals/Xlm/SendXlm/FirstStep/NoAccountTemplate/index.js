import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Banner, Button, Text } from 'blockchain-info-components'
import { FormGroup } from 'components/Form'
import { model } from 'data'

import ModalIcon from '../ModalIcon'

const { CREATE_ACCOUNT_LEARN_MODAL } = model.components.sendXlm

export const NoAccountTemplate = ({ swapActions }) => (
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
      <Button
        type='submit'
        nature='primary'
        uppercase
        fullwidth
        onClick={() => swapActions.showModal()}
      >
        <FormattedMessage
          id='modals.sendxlm.firststep.swap'
          defaultMessage='Swap for XLM'
        />
      </Button>
    </FormGroup>
  </React.Fragment>
)
