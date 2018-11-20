import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import CoinWelcome from './CoinWelcome'

const Wrapper = styled.div`
  width: 100%;
  height: 90%;
  padding: 30px;
  box-sizing: border-box;
`

const Empty = props => {
  const { handleRequest, coin } = props

  return (
    <Wrapper>
      <CoinWelcome coin={coin} handleRequest={handleRequest} />
    </Wrapper>
  )
}

Empty.propTypes = {
  handleSend: PropTypes.func.isRequired,
  handleRequest: PropTypes.func.isRequired
}

export default Empty
