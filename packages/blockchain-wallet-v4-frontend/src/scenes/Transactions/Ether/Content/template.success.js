import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Empty from './Empty'
import List from './List'

const Wrapper = styled.div`
  display: flex;
`

const Success = props => (
  <Wrapper>
    {props.isEmpty && <Empty />}
    {!props.isEmpty && <List transactions={props.transactions} />}
  </Wrapper>
)

Success.propTypes = {
  isEmpty: PropTypes.bool.isRequired,
  transactions: PropTypes.array.isRequired
}

export default Success
