import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Icon, Text } from 'blockchain-info-components'

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 100px;
  margin-top: 15px;
  background-color: ${props => props.theme['brand-quaternary']};
  border: 1px solid #DDD;
`

const ExchangeStepper = (props) => {
  const { step } = props

  return (
    <Header>
      <Icon name='cart' color='gray-5' size='3.75em' />
      <Text>
        <FormattedMessage id='scenes.home.exchangeStepper.title' defaultMessage='Complete the following steps to buy & sell bitcoin.' />
      </Text>
      <div>
        Step 1
      </div>
    </Header>
  )
}

ExchangeStepper.propTypes = {
  step: PropTypes.number.isRequired
}

export default ExchangeStepper
