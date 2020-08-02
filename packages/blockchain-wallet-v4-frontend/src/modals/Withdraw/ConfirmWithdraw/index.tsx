import { bindActionCreators, compose, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import React, { PureComponent } from 'react'

import { actions, selectors } from 'data'
import { BeneficiaryType, WalletFiatType } from 'core/types'
import { Button, HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import { displayFiatToFiat } from 'core/exchange'
import { ErrorCartridge } from 'components/Cartridge'
import { fiatToString } from 'core/exchange/currency'
import { FlyoutWrapper, Row, Title, Value } from 'components/Flyout'
import { Form } from 'components/Form'
import { FormattedMessage } from 'react-intl'
import { InjectedFormProps, reduxForm } from 'redux-form'
import { RootState } from 'data/rootReducer'
import { WithdrawCheckoutFormValuesType } from 'data/types'
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
const ErrorContainer = styled(FlyoutWrapper)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 0px;
  margin-top: 0px;
`

class ConfirmWithdraw extends PureComponent<
  InjectedFormProps<{}, Props> & Props
> {
  state = {}

  render () {
    return (
      <Form
        onSubmit={e => {
          e.preventDefault()
          this.props.withdrawActions.handleCustodyWithdraw(
            this.props.formValues.amount,
            this.props.beneficiary,
            this.props.fiatCurrency
          )
        }}
      >
        <FlyoutWrapper>
          <Top>
            <Icon
              name='arrow-left'
              size='20px'
              role='button'
              style={{ marginRight: '16px' }}
              onClick={() =>
                this.props.withdrawActions.setStep({
                  beneficiary: this.props.beneficiary,
                  fiatCurrency: this.props.fiatCurrency,
                  step: 'ENTER_AMOUNT'
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
        <FlyoutWrapper>
          <Button
            data-e2e='withdrawCustody'
            disabled={this.props.submitting}
            fullwidth
            height='48px'
            nature='primary'
            size='16px'
            type='submit'
          >
            {this.props.submitting ? (
              <HeartbeatLoader height='20px' width='20px' color='white' />
            ) : (
              <FormattedMessage
                id='buttons.withdraw_value'
                defaultMessage='Withdraw {value}'
                values={{
                  value: fiatToString({
                    value: this.props.amount,
                    unit: this.props.fiatCurrency
                  })
                }}
              />
            )}
          </Button>
          <Button
            onClick={() =>
              this.props.withdrawActions.setStep({
                beneficiary: this.props.beneficiary,
                fiatCurrency: this.props.fiatCurrency,
                step: 'ENTER_AMOUNT'
              })
            }
            data-e2e='cancelWithdrawCustody'
            height='48px'
            fullwidth
            nature='light-red'
            size='16px'
            style={{ marginTop: '16px' }}
          >
            <FormattedMessage id='buttons.cancel' defaultMessage='Cancel' />
          </Button>
        </FlyoutWrapper>
        {this.props.error && !this.props.submitting && (
          <ErrorContainer>
            <ErrorCartridge>{this.props.error}</ErrorCartridge>
          </ErrorContainer>
        )}
      </Form>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  formValues: selectors.form.getFormValues('custodyWithdrawForm')(
    state
  ) as WithdrawCheckoutFormValuesType
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  withdrawActions: bindActionCreators(actions.components.withdraw, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  amount: string
  beneficiary: BeneficiaryType
  fiatCurrency: WalletFiatType
  handleClose: () => void
}
export type Props = OwnProps & ConnectedProps<typeof connector>

const enhance = compose(
  reduxForm<{}, Props>({ form: 'confirmCustodyWithdraw' }),
  connector
)

export default enhance(ConfirmWithdraw) as React.ComponentClass<OwnProps>
