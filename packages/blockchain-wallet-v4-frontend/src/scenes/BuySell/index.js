import React from 'react'
import styled from 'styled-components'
import { getData } from './selectors'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import SfoxCheckout from './SfoxCheckout'

const Wrapper = styled.div`
  width: 100%;
  padding: 30px;
  font-size: 13px;
  font-weight: 300;
  color: ${props => props.theme['gray-5']};
  font-family: 'Montserrat', Helvetica, sans-serif;
`
const CheckoutWrapper = styled.div`
  width: 50%;
`

class BuySellContainer extends React.Component {
  componentWillMount () {
    this.props.kvStoreBuySellActions.fetchMetadataBuySell()
  }

  render () {
    const { data } = this.props

    // TODO: determine partner to load
    let checkout = data.cata({
      Success: () => <SfoxCheckout />,
      Failure: (message) => <div>{message}</div>,
      Loading: () => <div>Loading...</div>,
      NotAsked: () => <div />
    })

    return (
      <Wrapper>
        <CheckoutWrapper>
          { checkout }
        </CheckoutWrapper>
      </Wrapper>
    )
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  kvStoreBuySellActions: bindActionCreators(actions.core.kvStore.buySell, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(BuySellContainer)
