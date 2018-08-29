import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Remote } from 'blockchain-wallet-v4'

import { getRemotePropType } from 'utils/proptypes'

import { FlatLoader, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 5px;
  box-sizing: border-box;
`

class StringDisplayContainer extends React.PureComponent {
  render () {
    const { data, ...rest } = this.props
    return (
      <Wrapper {...rest}>
        {data.cata({
          Success: value => <Text className='text'>{value}</Text>,
          Failure: message => (
            <Text size='12px' weight={300} color='red' className='error'>
              {message}
            </Text>
          ),
          Loading: () => <FlatLoader width='50px' height='14px' />,
          NotAsked: () => <FlatLoader width='50px' height='14px' />
        })}
      </Wrapper>
    )
  }
}

StringDisplayContainer.propTypes = {
  data: getRemotePropType(PropTypes.string).isRequired
}

StringDisplayContainer.defaultProps = {
  data: Remote.NotAsked
}

export default StringDisplayContainer
