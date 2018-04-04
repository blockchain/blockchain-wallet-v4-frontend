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

  renderPartner (buySell, options, type) {
    if (buySell.sfox.account_token) {
      return <SfoxCheckout type={type} value={buySell} />
    }
    if (buySell.unocoin.token) { // TODO replace token
      return <span>Unocoin</span>
    }
    if (buySell.coinify.offline_token) {
      return <CoinifyCheckout type={type} value={buySell} />
    }
    return <SelectPartner type={type} value={buySell} options={options} {...this.props} />
  }

  render () {
    const { data, type } = this.props

    let view = data.cata({
      Success: (value) => this.renderPartner(value.buySell.value, value.options, type),
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
