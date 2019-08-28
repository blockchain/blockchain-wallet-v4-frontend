import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Field, reduxForm } from 'redux-form'
import { length, path, prop } from 'ramda'

import { actions, model } from 'data'
import { TabMenuBuySellStatus } from 'components/Form'
import HorizontalMenu from 'components/HorizontalMenu'
import Loading from 'components/BuySell/Loading'
import { hasAccount } from 'services/ExchangeService'
// import SfoxCheckout from './SfoxCheckout'
import CoinifyCheckout from './CoinifyCheckout'
import { getData, getFields } from './selectors'
import SelectPartner from './template'

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

class BuySellContainer extends React.PureComponent {
  state = {
    countrySelection: null
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

    // if (sfoxCountries.indexOf(country) >= 0) {
    //   showModal('SfoxExchangeData', { step: 'account' })
    // }
    if (coinifyCountries.includes(country)) {
      // set country in redux so we can skip KYC country selection
      setCountry(country)
      // open kyc modal with coinify step only set from this call
      setVerificationStep('coinify')
      showModal(KYC_MODAL, { isCoinify: true })
    }
  }

  /**
   * The idea here is that we will call .cata which passes a metadata value to a selectPartner method.
   * If there is a token (evidence of signup), show the Checkout view.
   * If not, open the tray and send user through the signup flow.
   */

  selectPartner = (buySell, options, type, value) => {
    // if (path(['sfox', 'account_token'], buySell)) {
    //   return {
    //     component: (
    //       <SfoxCheckout type={type} options={options} value={buySell} />
    //     ),
    //     partner: 'sfox'
    //   }
    // }
    const showSFOXTrades =
      type === 'order_history' && length(path(['sfox', 'trades'], buySell))

    if (path(['coinify', 'offline_token'], buySell) || showSFOXTrades) {
      return {
        component: (
          <CoinifyCheckout type={type} options={options} value={buySell} />
        ),
        partner: 'coinify'
      }
    }
    return {
      component: (
        <SelectPartner
          type={type}
          options={options}
          value={buySell}
          onSubmit={this.onSubmit}
          triggerCoinifyEmailVerification={this.triggerCoinifyEmailVerification}
          {...this.props}
          {...value}
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
        {hasAccount(path(['component', 'props', 'value'], view)) ? (
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
