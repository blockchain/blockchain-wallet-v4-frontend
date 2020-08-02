import { IcoMoonType } from 'blockchain-info-components/src/Icons/Icomoon'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { WalletFiatType, WithdrawResponseType } from 'core/types'

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 56px;
  box-sizing: border-box;
`
const Title = styled(Text)`
  margin: 32px 0px 24px 0px;
`

class WithdrawalDetails extends PureComponent<Props> {
  state = {}

  render () {
    return (
      <Wrapper>
        <div>
          <Icon
            size='72px'
            color='fiat'
            name={this.props.fiatCurrency.toLowerCase() as keyof IcoMoonType}
          />
          <Title weight={600} size='20px' lineHeight='150%'>
            <FormattedMessage
              id='modals.withdraw.success'
              defaultMessage='Success! We are withdrawing the cash from your {currency} Wallet now. The funds should be in your bank in 1-3 business days.'
              values={{
                currency: this.props.fiatCurrency
              }}
            />
          </Title>
          <Button
            fullwidth
            height='48px'
            data-e2e='withdrawReload'
            nature='primary'
            size='16px'
            onClick={() => this.props.handleClose()}
          >
            <FormattedMessage id='buttons.close' defaultMessage='Close' />
          </Button>
        </div>
      </Wrapper>
    )
  }
}

type OwnProps = {
  fiatCurrency: WalletFiatType
  handleClose: () => void
  withdrawal: WithdrawResponseType
}

export type Props = OwnProps

export default WithdrawalDetails
