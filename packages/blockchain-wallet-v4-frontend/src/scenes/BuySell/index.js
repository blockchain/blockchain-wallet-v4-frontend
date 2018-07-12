import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { Field, reduxForm } from 'redux-form'
import ui from 'redux-ui'
import { path, prop } from 'ramda'

import { actions } from 'data'
import { TabMenuBuySellStatus } from 'components/Form'
import HorizontalMenu from 'components/HorizontalMenu'
import Loading from 'components/BuySell/Loading'
import { hasAccount } from 'services/ExchangeService'
import SfoxCheckout from './SfoxCheckout'
import CoinifyCheckout from './CoinifyCheckout'
import { getData, getFields } from './selectors'
import SelectPartner from './template.success'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`
const CheckoutWrapper = styled.div`
  width: 100%;
  font-size: 13px;
  font-weight: 300;
  padding: 30px 30px;
  box-sizing: border-box;
  height: calc(100% - 56px);
  color: ${props => props.theme['gray-5']};
  font-family: 'Montserrat', Helvetica, sans-serif;
  flex-direction: row;
  display: flex;
  @media(min-height: 800px) {
    height: 70%;
  }
  @media (max-width: 480px) {
    padding: 20px;
  }
`
const Menu = reduxForm({ form: 'buySellTabStatus' })(HorizontalMenu)

class BuySellContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.selectPartner = this.selectPartner.bind(this)
    this.submitEmail = this.submitEmail.bind(this)
  }

  componentDidMount () {
    this.props.formActions.initialize('buySellTabStatus', { status: 'buy' })
    this.props.data.map(data => this.props.formActions.change('selectPartner', 'country', data.countryCode))
  }

  /**
   * The idea here is that we will call .cata which passes a metadata value to a selectPartner method.
   * If there is a token (evidence of signup), show the Checkout view.
   * If not, open the tray and send user through the signup flow.
   */

  selectPartner (buySell, options, type) {
    if (path(['sfox', 'account_token'], buySell)) {
      return {
        component: <SfoxCheckout type={type} options={options} value={buySell} />,
        partner: 'sfox'
      }
    }
    if (path(['unocoin', 'token'], buySell)) { // TODO replace token
      return {
        component: <span>Unocoin</span>,
        partner: ''
      }
    }
    if (path(['coinify', 'offline_token'], buySell)) {
      return {
        component: <CoinifyCheckout type={type} options={options} value={buySell} />,
        partner: 'coinify'
      }
    }
    return {
      component: <SelectPartner type={type} options={options} value={buySell}
        onSubmit={this.onSubmit} submitEmail={this.submitEmail} {...this.props} />,
      partner: ''
    }
  }

  submitEmail () {
    this.props.updateUI({ submittedEmail: true })
    let email = encodeURIComponent(path(['fields', 'email'], this.props))
    let country = path(['fields', 'country'], this.props)
    let state = path(['fields', 'country'], this.props) === 'US' ? path(['fields', 'stateSelection', 'name'], this.props) : undefined
    let url = 'https://docs.google.com/forms/d/e/1FAIpQLSeYiTe7YsqEIvaQ-P1NScFLCSPlxRh24zv06FFpNcxY_Hs0Ow/viewform?entry.1192956638=' + email + '&entry.644018680=' + country + '&entry.387129390=' + state
    window.open(url, '_blank')
  }

  render () {
    const { data, fields } = this.props

    const view = data.cata({
      Success: (value) => this.selectPartner(path(['buySell', 'value'], value), value.options, path(['type'], fields), fields),
      Failure: (message) => <div>failure: {message}</div>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })

    return (
      <Wrapper>
        {
          hasAccount(path(['component', 'props', 'value'], view))
            ? <Menu>
              <Field name='status' component={TabMenuBuySellStatus} partner={prop('partner', view)} />
            </Menu>
            : null
        }
        <CheckoutWrapper>
          {prop('component', view)}
        </CheckoutWrapper>
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
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: { submittedEmail: false } })
)

export default enhance(BuySellContainer)
