import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/utils'
import {
  WalletFiatType,
  WithdrawResponseType
} from 'blockchain-wallet-v4/src/types'

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
  margin: 32px 0px 4px 0px;
`
const SubTitle = styled(Text)`
  text-align: center;
  line-height: 150%;
  margin-bottom: 32px;
`
const IconContainer = styled.div`
  display: inline-flex;
  position: relative;
  justify-content: center;
`
const SuccessIcon = styled(Icon)`
  padding: 6px;
  border-radius: 50%;
  position: absolute;
  top: -16px;
  right: -22px;
  background: ${props => props.theme.white};
`

class WithdrawalDetails extends PureComponent<Props> {
  state = {}

  render() {
    return (
      <Wrapper>
        <div>
          <IconContainer>
            <Icon size='72px' color='USD' name={this.props.fiatCurrency} />
            <SuccessIcon
              name='checkmark-circle-filled'
              color='USD'
              size='28px'
            />
          </IconContainer>
          <Title weight={600} size='20px'>
            {fiatToString({
              value: this.props.withdrawal.amount.value,
              unit: this.props.withdrawal.amount.symbol
            })}{' '}
            {this.props.withdrawal.amount.symbol}
          </Title>
          <SubTitle size='14px' color='grey600' weight={500}>
            <FormattedMessage
              id='modals.withdraw.success'
              defaultMessage='Success! We are withdrawing the cash from your {currency} Wallet now. The funds should be in your bank in 1-3 business days.'
              values={{
                currency: this.props.fiatCurrency
              }}
            />
          </SubTitle>
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
