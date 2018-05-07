import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import EmptyTx from 'components/EmptyTx'
import Empty from './Empty'
import List from './List'

const Wrapper = styled.div`
  display: flex;
`

const Success = props => (
  <Wrapper>
    {props.transactions.length === 0
      ? props.search ? <EmptyTx /> : <Empty />
      : <List transactions={props.transactions} />
    }
  </Wrapper>
)

Success.propTypes = {
  isEmpty: PropTypes.bool.isRequired,
  transactions: PropTypes.array.isRequired
}

export default Success
