import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link } from 'blockchain-info-components'

const Wrapper = styled.div`
  padding: 0px 5px;
  background-color: ${props => props.selected && props.theme['brand-quaternary']};
  border: ${props => props.selected && `1px solid ${props.theme['brand-secondary']}`};
  border-radius: ${props => props.selected && '2px'};
`

const Success = props => {
  const { coin, fiat, selected, handleClick } = props

  return (
    <Wrapper selected={selected}>
      <Link size='14px' weight={400} color='brand-secondary' onClick={handleClick}>
        {`${coin} = ${fiat}`}
      </Link>
    </Wrapper>
  )
}

Success.propTypes = {
  coin: PropTypes.string.isRequired,
  fiat: PropTypes.string.isRequired,
  selected: PropTypes.bool
}

Success.defaultProps = {
  selected: false
}

export default Success
