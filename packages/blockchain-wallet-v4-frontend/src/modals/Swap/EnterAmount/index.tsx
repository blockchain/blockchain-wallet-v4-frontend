import { Button, Icon, SpinningLoader, Text } from 'blockchain-info-components'
import { compose } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { RootState } from 'data/rootReducer'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

import { AmountTextBox } from 'components/Exchange'
import { Props as BaseProps } from '..'
import { FiatType } from 'core/types'
import { FlyoutWrapper } from 'components/Flyout'
import { formatCoin } from 'core/exchange/currency'
import { formatTextAmount } from 'services/ValidationHelper'
import { InitSwapFormValuesType, SwapAmountFormValues } from 'data/types'
import { Option, StyledForm, TopText } from '../components'
import { Row } from 'blockchain-wallet-v4-frontend/src/scenes/Exchange/ExchangeForm/Layout'
import { selectors } from 'data'

const SubTopText = styled.div`
  display: flex;
  align-items: center;
`

const AmountRow = styled(Row)`
  position: relative;
  padding: 24px;
  justify-content: center;
  border: 0px;
`
const QuoteRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const normalizeAmount = (
  value,
  prevValue /* allValues: SwapAmountFormValues */
) => {
  if (isNaN(Number(value)) && value !== '.' && value !== '') return prevValue
  return formatTextAmount(
    value,
    /* allValues && allValues.fix === 'FIAT' */ false
  )
}
class EnterAmount extends PureComponent<Props> {
  state = {}

  componentDidMount () {
    this.props.swapActions.fetchQuote()
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.swapActions.setStep({ step: 'PREVIEW_SWAP' })
  }

  render () {
    if (
      !this.props.initSwapFormValues?.BASE ||
      !this.props.initSwapFormValues?.COUNTER
    ) {
      return this.props.swapActions.setStep({ step: 'INIT_SWAP' })
    }

    const { BASE, COUNTER } = this.props.initSwapFormValues

    return (
      <>
        <FlyoutWrapper>
          <TopText spaceBetween>
            <SubTopText>
              <Icon
                role='button'
                name='arrow-left'
                cursor
                size='24px'
                color='grey600'
                onClick={() =>
                  this.props.swapActions.setStep({
                    step: 'INIT_SWAP'
                  })
                }
              />{' '}
              <Text
                size='20px'
                color='grey900'
                weight={600}
                style={{ marginLeft: '16px' }}
              >
                <FormattedMessage
                  id='copy.new_swap'
                  defaultMessage='New Swap'
                />
              </Text>
            </SubTopText>
            {this.props.quoteR.cata({
              Success: val => (
                <Text size='14px' color='grey900' weight={500}>
                  1 {BASE.coin} = {formatCoin(val.rate)} {COUNTER.coin}
                </Text>
              ),
              Failure: () => (
                <Text size='14px' color='red600'>
                  <FormattedMessage
                    id='copy.oops'
                    defaultMessage='Oops. Something went wrong.'
                  />
                </Text>
              ),
              Loading: () => (
                <SpinningLoader borderWidth='4px' height='14px' width='14px' />
              ),
              NotAsked: () => (
                <SpinningLoader borderWidth='4px' height='14px' width='14px' />
              )
            })}
          </TopText>
        </FlyoutWrapper>
        <StyledForm onSubmit={this.handleSubmit}>
          <Option
            role='button'
            onClick={() =>
              this.props.swapActions.setStep({
                step: 'COIN_SELECTION',
                options: {
                  side: 'BASE'
                }
              })
            }
          >
            {JSON.stringify(this.props.initSwapFormValues.BASE)}
          </Option>
          <Option
            role='button'
            onClick={() =>
              this.props.swapActions.setStep({
                step: 'COIN_SELECTION',
                options: {
                  side: 'COUNTER'
                }
              })
            }
          >
            {JSON.stringify(this.props.initSwapFormValues.COUNTER)}
          </Option>
          <FlyoutWrapper style={{ paddingTop: '0px' }}>
            <AmountRow id='amount-row'>
              {/* {fix === 'FIAT' && (
                <Text size={'56px'} color='textBlack' weight={500}>
                  {Currencies[fiatCurrency].units[fiatCurrency].symbol}
                </Text>
              )} */}
              <Field
                data-e2e='swapAmountInput'
                name='amount'
                component={AmountTextBox}
                // validate={[maximumAmount, minimumAmount]}
                normalize={normalizeAmount}
                // onUpdate={resizeSymbol.bind(null, fix === 'FIAT')}
                maxFontSize='56px'
                placeholder='0'
                fiatActive
                {...{
                  autoFocus: true,
                  hideError: true
                }}
              />
              {/* {fix === 'CRYPTO' && (
                <Text size={'56px'} color='textBlack' weight={500}>
                  {cryptoCurrency}
                </Text>
              )} */}
            </AmountRow>

            <QuoteRow>
              <div />
              {this.props.ratesR.cata({
                Success: val => (
                  <Text
                    color='grey600'
                    size='14px'
                    weight={500}
                    data-e2e='swapQuoteAmount'
                  >
                    {val[this.props.walletCurrency as FiatType].last *
                      Number(this.props.swapAmountFormValues?.amount || 0)}
                  </Text>
                ),
                Failure: () => (
                  <Text size='14px' weight={500}>
                    <FormattedMessage
                      id='copy.oops'
                      defaultMessage='Oops! Something went wrong.'
                    />
                  </Text>
                ),
                Loading: () => <div />,
                NotAsked: () => <div />
              })}
              <Icon
                color='blue600'
                cursor
                name='vertical-arrow-switch'
                role='button'
                size='24px'
                data-e2e='swapSwitchIcon'
              />
            </QuoteRow>
            <Button
              nature='primary'
              data-e2e='previewSwap'
              type='submit'
              jumbo
              fullwidth
              style={{ marginTop: '24px' }}
            >
              <FormattedMessage
                id='buttons.preview_swap'
                defaultMessage='Preview Swap'
              />
            </Button>
          </FlyoutWrapper>
        </StyledForm>
      </>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  const initSwapFormValues = selectors.form.getFormValues('initSwap')(
    state
  ) as InitSwapFormValuesType
  return {
    initSwapFormValues,
    swapAmountFormValues: selectors.form.getFormValues('swapAmount')(
      state
    ) as SwapAmountFormValues,
    // hmm, rethink this...
    ratesR: selectors.core.data.misc.getRatesSelector(
      initSwapFormValues?.BASE?.coin || 'BTC',
      state
    ),
    quoteR: selectors.components.swap.getQuote(state),
    walletCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
  }
}

const connector = connect(mapStateToProps)

type OwnProps = BaseProps & { handleClose: () => void }
export type Props = OwnProps & ConnectedProps<typeof connector>

const enhance = compose(
  reduxForm<{}, Props>({ form: 'swapAmount', destroyOnUnmount: false }),
  connector
)

export default enhance(EnterAmount) as React.ComponentClass<OwnProps>
