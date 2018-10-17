import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { propOr } from 'ramda'
import { FormattedMessage } from 'react-intl'

import { Remote } from 'blockchain-wallet-v4'

import { getRemotePropType } from 'utils/proptypes'

import { FlatLoader, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`
const Loader = styled(FlatLoader)`
  width: 50px;
  height: 14px;
  margin: 5px 0;
`

const defaultError = (
  <FormattedMessage id='stringdisplay.deafulterror' defaultMessage='Error' />
)

class StringDisplayContainer extends React.PureComponent {
  render () {
    const { children, ...rest } = this.props
    return (
      <Wrapper {...rest}>
        {children.cata({
          Success: value => value,
          Failure: error => (
            <Text size='12px' weight={300} color='red' className='error'>
              {propOr(defaultError, 'message', error)}
            </Text>
          ),
          Loading: () => <Loader />,
          NotAsked: () => <Loader />
        })}
      </Wrapper>
    )
  }
}

StringDisplayContainer.propTypes = {
  children: getRemotePropType(PropTypes.string).isRequired
}

StringDisplayContainer.defaultProps = {
  children: Remote.NotAsked
}

export default StringDisplayContainer
