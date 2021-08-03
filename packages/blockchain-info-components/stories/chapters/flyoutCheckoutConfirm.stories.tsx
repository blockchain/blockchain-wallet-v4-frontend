import React from 'react'

import {
  FlyoutContainer,
  FlyoutContent,
  FlyoutFooter,
  FlyoutHeader,
  AmountSubHeader,
  Button,
  CheckoutRow,
  Text,
  TextGroup,
  Link
} from '../../src'

export default {
  title: 'Flyouts/CheckoutConfirm',
  args: {
    'data-e2e': 'foooo',
    title: '10.0000 BTC',
    subTitle: '$100'
  },
}

export const Default = (args) => (
  <FlyoutContainer>
    <FlyoutHeader
      data-e2e="foooo"
      mode="back"
      onClick={() => {}}
    >
      Buy Bitcoin
    </FlyoutHeader>
    <FlyoutContent mode='top'>
      <AmountSubHeader {...args} />
      <CheckoutRow
        title={'Exchange Rate'}
        text={'$30,000 / BTC'}
        toolTip={(
          <>Blockchain.com provides the best market price we receive and applies a spread.</>
        )}
      />
      <CheckoutRow
        title={'Exchange Rate'}
        text={'$30,000 / BTC'}
        toolTip={(
          <>Blockchain.com provides the best market price we receive and applies a spread.</>
        )}
      />
      <CheckoutRow
        title={'Exchange Rate'}
        text={'$30,000 / BTC'}
        toolTip={(
          <>Blockchain.com provides the best market price we receive and applies a spread.</>
        )}
      />
      <CheckoutRow
        title={'Exchange Rate'}
        text={'$30,000 / BTC'}
        toolTip={(
          <>Blockchain.com provides the best market price we receive and applies a spread.</>
        )}
      />
    </FlyoutContent>
    <FlyoutFooter>
      <Button
        fullwidth
        nature="primary"
      >
        Continue
      </Button>
    </FlyoutFooter>
  </FlyoutContainer>
)