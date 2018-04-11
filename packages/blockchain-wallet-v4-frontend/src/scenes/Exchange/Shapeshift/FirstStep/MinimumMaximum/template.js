import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Link, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

  & > * { margin-left: 5px; }
`

const MinimumMaximum = props => {
  const { isBalanceBelowMin, minimum, sourceCoin } = props
  return isBalanceBelowMin
    ? (
      <Wrapper>
        <Text weight={300} size='12px'>
          <FormattedMessage id='scenes.exchangebox.firststep.use1' defaultMessage='😢 ' />
        </Text>
        <Text weight={300} size='12px'>
          {minimum} {sourceCoin}
        </Text>
        <Text weight={300} size='12px'>
          <FormattedMessage id='scenes.exchangebox.firststep.use1' defaultMessage=' required to exchange' />
        </Text>
      </Wrapper>
    )
    : (
      <Wrapper>
        <Text weight={300} size='12px'>
          <FormattedMessage id='scenes.exchangebox.firststep.use1' defaultMessage='Use' />
        </Text>
        <Link size='12px' weight={300} onClick={props.handleClickMinimum}>
          <FormattedMessage id='scenes.exchangebox.firststep.min' defaultMessage='minimum' />
        </Link>
        <Text weight={300} size='12px'>
          <FormattedMessage id='scenes.exchangebox.firststep.use2' defaultMessage='| Use' />
        </Text>
        <Link size='12px' weight={300} onClick={props.handleClickMaximum}>
          <FormattedMessage id='scenes.exchangebox.firststep.max' defaultMessage='maximum' />
        </Link>
      </Wrapper>
    )
}

MinimumMaximum.propTypes = {
  handleClickMinimum: PropTypes.func.isRequired,
  handleClickMaximum: PropTypes.func.isRequired
}

export default MinimumMaximum
