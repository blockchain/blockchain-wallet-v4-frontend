import React from 'react'
import styled from 'styled-components'
import { getData } from './selectors'
import { actions } from 'data'
import { connect } from 'react-redux'
import SfoxCheckout from './SfoxCheckout'
import { bindActionCreators, compose } from 'redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { TabMenuBuySellStatus } from 'components/Form'
import HorizontalMenu from 'components/HorizontalMenu'
import Success from './template.success'
import ui from 'redux-ui'

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
    this.determinePartner = this.determinePartner.bind(this)
  }
  componentWillMount () {
    this.props.kvStoreBuySellActions.fetchMetadataBuySell()
    this.props.formActions.initialize('buySellTabStatus', { status: 'buy' })
  }

  determinePartner (kvStore, type) {
    if (kvStore.sfox.account_token) {
      return <SfoxCheckout type={type} value={kvStore} />
    }
    if (kvStore.unocoin) {
      return <span>Unocoin</span>
    }
    if (kvStore.coinity) {
      return <span>Coinify</span>
    }
    return <span>just hodl</span>
  }

  onSubmit (e) {
    e.preventDefault()
    this.props.modalActions.showModal('SfoxExchangeData', { step: 'account' })
  }

  render () {
    const { data, type } = this.props

    let checkout = data.cata({
      Success: (value) => <Success type={type} value={value} onSubmit={this.onSubmit} {...this.props} {...this.state} />,
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
          {
            data.data && data.data.value.sfox.account_token
              ? this.determinePartner(data.data.value, type)
              : checkout
          }
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

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: { stateSelectionError: false } })
)

export default enhance(BuySellContainer)
