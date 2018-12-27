import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'
import { actions } from 'data'
import CoinWelcome from './CoinWelcome'

const Wrapper = styled.div`
  width: 100%;
  height: 90%;
  padding: 30px;
  box-sizing: border-box;
`
const NoBsv = styled.div`
  margin: 20px;
`
class EmptyContainer extends React.PureComponent {
  render () {
    const { coin, handleRequest } = this.props
    return coin === 'BSV' ? (
      <NoBsv>
        <Text size='14px'>
          <FormattedMessage
            id='scenes.transaction.content.empty.nobsv'
            defaultMessage='No Transactions Found'
          />
        </Text>
      </NoBsv>
    ) : (
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
  coin: PropTypes.oneOf(['BTC', 'BCH', 'BSV', 'ETH', 'XLM']).isRequired
}

export default connect(
  undefined,
  mapDispatchToProps
)(EmptyContainer)
