import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { actions } from 'data'
import CoinWelcome from './CoinWelcome'

const Wrapper = styled.div`
  width: 100%;
  height: 90%;
  padding: 30px;
  box-sizing: border-box;
`
class EmptyContainer extends React.PureComponent {
  render () {
    const { coin, handleRequest } = this.props
    return (
      <Wrapper>
        <CoinWelcome coin={coin} handleRequest={handleRequest} />
      </Wrapper>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

EmptyContainer.propTypes = {
  coin: PropTypes.oneOf(['BTC', 'BCH', 'ETH', 'XLM']).isRequired
}

export default connect(
  undefined,
  mapDispatchToProps
)(EmptyContainer)
