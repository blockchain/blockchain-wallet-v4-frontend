import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { Field, reduxForm } from 'redux-form'
import ui from 'redux-ui'
import { path } from 'ramda'

import { actions } from 'data'
import { TabMenuBuySellStatus } from 'components/Form'
import HorizontalMenu from 'components/HorizontalMenu'
import Loading from 'components/BuySell/Loading'
import { hasAccount } from 'services/ExchangeService'
import SfoxCheckout from './SfoxCheckout'
import CoinifyCheckout from './CoinifyCheckout'
import { getData } from './selectors'
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
`
const Menu = reduxForm({ form: 'buySellTabStatus' })(HorizontalMenu)

class BuySellContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = { partner: '' }
    this.renderPartner = this.renderPartner.bind(this)
    this.submitEmail = this.submitEmail.bind(this)
  }

  componentDidMount () {
    this.props.formActions.initialize('buySellTabStatus', { status: 'buy' })
    this.props.data.map(data => this.props.formActions.change('selectPartner', 'country', data.countryCode))
  }

  /**
   * The idea here is that we will call .cata which passes a metadata value to a renderPartner method.
   * If there is a token (evidence of signup), show the Checkout view.
   * If not, open the tray and send user through the signup flow.
   */

  renderPartner (buySell, options, type) {
    if (path(['sfox', 'account_token'], buySell)) {
      this.setState({ partner: 'sfox' })
      return <SfoxCheckout type={type} options={options} value={buySell} />
    }
    if (path(['unocoin', 'token'], buySell)) { // TODO replace token
      this.setState({ partner: '' })
      return <span>Unocoin</span>
    }
    if (path(['coinify', 'offline_token'], buySell)) {
      this.setState({ partner: 'coinify' })
      return <CoinifyCheckout type={type} options={options} value={buySell} />
    }
    this.setState({ partner: '' })
    return <SelectPartner type={type} options={options} value={buySell}
      onSubmit={this.onSubmit} submitEmail={this.submitEmail} {...this.props} />
  }

  submitEmail () {
    // TODO: submit the email address somewhere
    this.props.updateUI({ submittedEmail: true })
  }

  render () {
    const { data, type } = this.props

    const view = data.cata({
      Success: (value) => this.renderPartner(path(['buySell', 'value'], value), value.options, type),
      Failure: (message) => <div>failure: {message}</div>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })

    return (
      <Wrapper>
        {
          hasAccount(view.props.value)
            ? <Menu>
              <Field name='status' component={TabMenuBuySellStatus} partner={this.state.partner} />
            </Menu>
            : null
        }
        <CheckoutWrapper>
          {view}
        </CheckoutWrapper>
      </Wrapper>
    )
  }
}

const mapStateToProps = state => getData(state)

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: { submittedEmail: false } })
)

export default enhance(BuySellContainer)
