import { actions, model, selectors } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { getData, getFields } from './selectors'
import { hasAccount } from 'services/ExchangeService'
import { includes, isNil, length, path, prop } from 'ramda'
import { TabMenuBuySellStatus } from 'components/Form'
import CoinifyCheckout from './CoinifyCheckout'
import HorizontalMenu from 'components/HorizontalMenu'
import Loading from 'components/BuySell/Loading'
import React from 'react'
import styled from 'styled-components'

import KycGetStarted from './KycGetStarted'
import PromoCards from './PromoCards'

const { KYC_MODAL } = model.components.identityVerification

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`
const CheckoutWrapper = styled.div`
  width: 100%;
  font-size: 13px;
  font-weight: 400;
  padding: 30px 30px;
  box-sizing: border-box;
  height: calc(100% - 56px);
  color: ${props => props.theme['gray-5']};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  flex-direction: row;
  display: flex;
  @media (min-height: 800px) {
    height: 70%;
  }
  @media (max-width: 480px) {
    padding: 20px;
  }
`
const Menu = reduxForm({ form: 'buySellTabStatus' })(HorizontalMenu)

// Temp list of EU countries to funnel to PIT
const pitFunnelCountries = [
  'AT',
  'BE',
  'BG',
  'CH',
  'CY',
  'CZ',
  'DE',
  'DK',
  'EE',
  'ES',
  'FI',
  'FR',
  'GB',
  'GF',
  'GG',
  'GI',
  'GP',
  'GR',
  'HR',
  'HU',
  'IE',
  'IM',
  'IS',
  'IT',
  'JE',
  'LI',
  'LT',
  'LU',
  'LV',
  'MC',
  'MF',
  'MQ',
  'MT',
  'NL',
  'NO',
  'PL',
  'PM',
  'PT',
  'RE',
  'RO',
  'SE',
  'SI',
  'SK',
  'SM',
  'YT'
]

class BuySellContainer extends React.PureComponent {
  state = {
    countrySelection: null,
    showCoinifyView: false
  }

  componentDidMount () {
    this.props.formActions.initialize('buySellTabStatus', { status: 'buy' })
    this.props.data.map(data =>
      this.props.formActions.change(
        'selectPartner',
        'country',
        data.countryCode
      )
    )
  }

  onSubmit = () => {
    const {
      identityActions,
      modalActions,
      coinifyActions,
      fields,
      data
    } = this.props
    const { showModal } = modalActions
    const { setVerificationStep } = identityActions
    const { setCountry } = coinifyActions
    const { country } = fields
    const { coinifyCountries } = data.getOrFail('Missing partner countries.')

    if (coinifyCountries.includes(country)) {
      // set country in redux so we can skip KYC country selection
      setCountry(country)
      // open kyc modal with coinify step only set from this call
      setVerificationStep('coinify')
      showModal(KYC_MODAL, { isCoinify: true })
    }
  }

  handleShowCoinify = () => {
    this.setState({ showCoinifyView: true })
  }

  /**
   * The idea here is that we will call .cata which passes a metadata value to a selectPartner method.
   * If there is a token (evidence of signup), show the Checkout view.
   * If not, open the tray and send user through the signup flow.
   */
  selectPartner = (buySell, options, type, value) => {
    const showSFOXTrades =
      type === 'order_history' && length(path(['sfox', 'trades'], buySell))

    const hasTokenOrTrades =
      !isNil(path(['coinify', 'offline_token'], buySell)) || showSFOXTrades

    if (hasTokenOrTrades && this.state.showCoinifyView) {
      return {
        component: (
          <CoinifyCheckout type={type} options={options} value={buySell} />
        ),
        partner: 'coinify'
      }
    }

    if (
      includes(prop('countryCode', value), pitFunnelCountries) ||
      this.state.showCoinifyView
    ) {
      return {
        component: (
          <KycGetStarted onSubmit={this.onSubmit} {...this.props} {...value} />
        ),
        partner: 'coinify'
      }
    }

    return {
      component: (
        <PromoCards
          currentTier={this.props.currentTier}
          handleShowCoinify={this.handleShowCoinify}
        />
      ),
      partner: ''
    }
  }

  render () {
    const { data, fields } = this.props

    const view = data.cata({
      Success: value =>
        this.selectPartner(
          path(['buySell', 'value'], value),
          value.options,
          prop('type', fields),
          value
        ),
      Failure: message => <div>failure: {message}</div>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })

    return (
      <Wrapper>
        {hasAccount(path(['component', 'props', 'value'], view)) &&
        this.state.showCoinifyView ? (
          <Menu>
            <Field
              name='status'
              component={TabMenuBuySellStatus}
              partner={prop('partner', view)}
            />
          </Menu>
        ) : null}
        <CheckoutWrapper>{prop('component', view)}</CheckoutWrapper>
      </Wrapper>
    )
  }
}

const mapStateToProps = state => ({
  currentTier: selectors.modules.profile.getCurrentTier(state),
  data: getData(state),
  fields: getFields(state)
})

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  coinifyActions: bindActionCreators(actions.components.coinify, dispatch),
  identityActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  )
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BuySellContainer)
