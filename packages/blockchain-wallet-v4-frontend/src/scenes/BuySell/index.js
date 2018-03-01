import React from 'react'
import styled from 'styled-components'
import { getData } from './selectors'
import { actions } from 'data'
import { connect } from 'react-redux'
import SfoxCheckout from './SfoxCheckout'
import { bindActionCreators } from 'redux'
import { Field, reduxForm } from 'redux-form'
import { TabMenuBuySellStatus } from 'components/Form'
import HorizontalMenu from 'components/HorizontalMenu'

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
  componentWillMount () {
    this.props.kvStoreBuySellActions.fetchMetadataBuySell()
  }

  componentDidMount () {
    this.props.formActions.initialize('buySellTabStatus', { status: 'buy' })
  }

  render () {
    const { data, type } = this.props

    // TODO: determine partner to load
    let checkout = data.cata({
      Success: () => <SfoxCheckout type={type} />,
      Failure: (message) => <div>{message}</div>,
      Loading: () => <div>Loading...</div>,
      NotAsked: () => <div />
    })

    return (
      <Wrapper>
        <Menu>
          <Field name='status' component={TabMenuBuySellStatus} />
        </Menu>
        <CheckoutWrapper>
          { checkout }
        </CheckoutWrapper>
      </Wrapper>
    )
  }
}

const mapStateToProps = state => ({
  data: getData(state),
  type: state.form.buySellTabStatus && state.form.buySellTabStatus.values.status
})

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch),
  kvStoreBuySellActions: bindActionCreators(actions.core.kvStore.buySell, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(BuySellContainer)
