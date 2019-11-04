import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import CoinWelcome from './CoinWelcome'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

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
  coin: PropTypes.string.isRequired
}

export default connect(
  undefined,
  mapDispatchToProps
)(EmptyContainer)
