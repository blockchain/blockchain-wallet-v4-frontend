import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import React, { PureComponent } from 'react'

import { actions } from 'data'
import { BeneficiaryType, WalletFiatType } from 'core/types'
import { displayFiatToFiat } from 'core/exchange'
import { FlyoutWrapper, Row, Title, Value } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import styled from 'styled-components'

const Top = styled(Text)`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`
const AmountContainer = styled.div`
  margin-top: 40px;
  margin-bottom: 24px;
  display: flex;
`

class ConfirmWithdraw extends PureComponent<Props> {
  state = {}

  render () {
    return (
      <div>
        <FlyoutWrapper>
          <Top>
            <Icon
              name='arrow-left'
              size='20px'
              role='button'
              style={{ marginRight: '16px' }}
              onClick={() =>
                this.props.withdrawActions.setStep({
                  step: 'ENTER_AMOUNT',
                  fiatCurrency: this.props.fiatCurrency
                })
              }
            />
            <Text size='20px' weight={600} color='grey800'>
              <FormattedMessage
                id='copy.confirm_withdrawal'
                defaultMessage='Confirm Withdrawal'
              />
            </Text>
          </Top>
          <AmountContainer>
            <CoinDisplay
              color='grey800'
              size='32px'
              weight={600}
              coin={this.props.fiatCurrency}
            >
              {this.props.amount}
            </CoinDisplay>
            &nbsp;
            <Text color='grey800' size='32px' weight={600}>
              {this.props.fiatCurrency}
            </Text>
          </AmountContainer>
        </FlyoutWrapper>
        <Row>
          <Title>
            <FormattedMessage id='copy.from' defaultMessage='From' />
          </Title>
          <Value>{this.props.fiatCurrency} Wallet</Value>
        </Row>
        <Row>
          <Title>
            <FormattedMessage id='copy.to' defaultMessage='To' />
          </Title>
          <Value>{this.props.beneficiary.name}</Value>
        </Row>
        <Row>
          <Title>
            <FormattedMessage id='copy.fee' defaultMessage='Fee' />
          </Title>
          <Value>0.00 {this.props.fiatCurrency}</Value>
        </Row>
        <Row>
          <Title>
            <FormattedMessage id='copy.total' defaultMessage='Total' />
          </Title>
          <Value>
            {displayFiatToFiat({ value: this.props.amount })}{' '}
            {this.props.fiatCurrency}
          </Value>
        </Row>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  withdrawActions: bindActionCreators(actions.components.withdraw, dispatch)
})

const connector = connect(null, mapDispatchToProps)

type OwnProps = {
  amount: string
  beneficiary: BeneficiaryType
  fiatCurrency: WalletFiatType
  handleClose: () => void
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(ConfirmWithdraw)
