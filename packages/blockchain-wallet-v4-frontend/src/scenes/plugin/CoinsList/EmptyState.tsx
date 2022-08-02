import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { actions } from 'data'

const Wrapper = styled.div`
  position: relative;
  text-align: center;
  & > * {
    margin: 0 auto;
  }
`

const ButtonStyled = styled(Button)`
  background: ${(p) => p.theme.white};
  border-color: ${(p) => p.theme.white};
  color: ${(props) => props.theme.exchangeLogin};
`

const EmptyState = ({ routerActions }) => (
  <AutoSizer>
    {({ height, width }) => (
      <Wrapper style={{ height, width }}>
        <div>
          <Text color='white' size='14px' weight={500}>
            Receive
          </Text>
        </div>
        <ButtonStyled
          onClick={() => routerActions.push('/plugin/funding')}
          style={{ marginTop: '150px' }}
          data-e2e='coinview-empty-add-crypto-btn'
        >
          <FormattedMessage id='copy.add_crypto' defaultMessage='Add Crypto' />
        </ButtonStyled>
      </Wrapper>
    )}
  </AutoSizer>
)

const mapDispatchToProps = (dispatch) => ({
  routerActions: bindActionCreators(actions.router, dispatch)
})

export default connect(null, mapDispatchToProps)(EmptyState)
