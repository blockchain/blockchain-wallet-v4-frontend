import React from 'react'
import styled from 'styled-components'
import { getData } from './selectors'
import { actions } from 'data'
import { connect } from 'react-redux'
import SfoxCheckout from './SfoxCheckout'
import CoinifyCheckout from './CoinifyCheckout'
import { bindActionCreators } from 'redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { TabMenuBuySellStatus } from 'components/Form'
import HorizontalMenu from 'components/HorizontalMenu'
import SelectPartner from './template.success'
import * as buySell from 'services/BuySellService'

const Wrapper = styled.div`
  width: 100%;
`
const CheckoutWrapper = styled.div`
  width: 100%;
  padding: 30px;
  font-size: 13px;
  font-weight: 300;
  box-sizing: border-box;
  color: ${props => props.theme['gray-5']};
  font-family: 'Montserrat', Helvetica, sans-serif;
`
const Menu = reduxForm({ form: 'buySellTabStatus' })(HorizontalMenu)

class BuySellContainer extends React.Component {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
    this.renderPartner = this.renderPartner.bind(this)
  }

  componentWillMount () {
    this.props.kvStoreBuySellActions.fetchMetadataBuySell()
    this.props.formActions.initialize('buySellTabStatus', { status: 'buy' })
  }

  /**
   * The idea here is that we will call .cata which passes a metadata value to a renderPartner method.
   * If there is a token (evidence of signup), show the Checkout view.
   * If not, open the tray and send user through the signup flow.
   */

  renderPartner (kvStoreValue, type) {
    if (kvStoreValue.sfox.account_token) {
      return <SfoxCheckout type={type} value={kvStoreValue} />
    }
    if (kvStoreValue.unocoin.token) { // TODO replace token
      return <span>Unocoin</span>
    }
    if (kvStoreValue.coinify.offline_token) {
      return <CoinifyCheckout type={type} value={kvStoreValue} />
    }
    return <SelectPartner type={type} value={kvStoreValue} onSubmit={this.onSubmit} {...this.props} />
  }

  onSubmit (e) {
    e.preventDefault()
    if (buySell.sfoxCountries.indexOf(this.props.country) >= 0) {
      this.props.modalActions.showModal('SfoxExchangeData', { step: 'account' })
    }
    if (buySell.unocoinCountries.indexOf(this.props.country) >= 0) {
      console.log('start unocoin')
    }
    if (buySell.coinifyCountries.indexOf(this.props.country) >= 0) {
      this.props.modalActions.showModal('CoinifyExchangeData', { step: 'account' })
    }
  }

  render () {
    const { data, type } = this.props

    let view = data.cata({
      Success: (value) => this.renderPartner(value.value, type),
      Failure: (message) => <div>failure: {message}</div>,
      Loading: () => <div>Loading...</div>,
      NotAsked: () => <div>not asked...</div>
    })

    return (
      <Wrapper>
        <Menu>
          <Field name='status' component={TabMenuBuySellStatus} />
        </Menu>
        <CheckoutWrapper>
          {view}
        </CheckoutWrapper>
      </Wrapper>
    )
  }
}

const mapStateToProps = state => ({
  data: getData(state),
  type: state.form.buySellTabStatus && state.form.buySellTabStatus.values.status,
  country: formValueSelector('selectPartner')(state, 'country'),
  stateSelection: formValueSelector('selectPartner')(state, 'state')
})

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch),
  kvStoreBuySellActions: bindActionCreators(actions.core.kvStore.buySell, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(BuySellContainer)
