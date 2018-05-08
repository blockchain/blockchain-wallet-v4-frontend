import React from 'react'
import styled from 'styled-components'
import { getData } from './selectors'
import { actions } from 'data'
import { connect } from 'react-redux'
import SfoxCheckout from './SfoxCheckout'
import CoinifyCheckout from './CoinifyCheckout'
import { bindActionCreators, compose } from 'redux'
import { Field, reduxForm } from 'redux-form'
import { TabMenuBuySellStatus } from 'components/Form'
import HorizontalMenu from 'components/HorizontalMenu'
import SelectPartner from './template.success'
import Loading from './template.loading'
import ui from 'redux-ui'

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
`
const Menu = reduxForm({ form: 'buySellTabStatus' })(HorizontalMenu)

class BuySellContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.renderPartner = this.renderPartner.bind(this)
    this.submitEmail = this.submitEmail.bind(this)
  }

  componentDidMount () {
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
      return <SfoxCheckout type={type} options={options} value={buySell} />
    }
    if (buySell.unocoin.token) { // TODO replace token
      return <span>Unocoin</span>
    }
    if (buySell.coinify.offline_token) {
      return <CoinifyCheckout type={type} options={options} value={buySell} />
    }
    return <SelectPartner type={type} options={options} value={buySell} onSubmit={this.onSubmit} submitEmail={this.submitEmail} {...this.props} />
  }

  submitEmail () {
    // TODO: submit the email address somewhere
    this.props.updateUI({ submittedEmail: true })
  }

  render () {
    const { data, type } = this.props

    let view = data.cata({
      Success: (value) => this.renderPartner(value.buySell.value, value.options, type),
      Failure: (message) => <div>failure: {message}</div>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
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

const mapStateToProps = state => getData(state)

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch),
  kvStoreBuySellActions: bindActionCreators(actions.core.kvStore.buySell, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: { submittedEmail: false } })
)

export default enhance(BuySellContainer)
