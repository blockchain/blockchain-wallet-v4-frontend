import { Box } from 'components/Box'
import { Button, Icon, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import React, { PureComponent } from 'react'

interface Props {

}
interface State {

}

class BorrowPax extends PureComponent<Props, State> {
  state = {}

  render () {
    return (
      <Box>
        <Icon name='pie' color='blue600' size='32px' />
        <Text size='20px' color='grey800' weight={600} style={{ marginTop: '16px' }}>
          <FormattedMessage id='scenes.borrow.borrowusd' defaultMessage='Borrow USD Pax Today' />
        </Text>
        <Text size='14px' color='grey600' weight={500} style={{ marginTop: '4px', lineHeight: 1.5 }}>
          <FormattedMessage id='scenes.borrow.getusdpax' defaultMessage='Get USD Pax directly from your Blockchain Wallet, use your bitcoin as collateral. You need to be Gold level to benefit from this new offering.' />
        </Text>
        <Button style={{ marginTop: '16px' }} nature='light' fullwidth>
          <FormattedMessage id='scenes.borrow.learnmore' defaultMessage='Learn More' />
        </Button>
      </Box>
    )
  }
}

export default BorrowPax