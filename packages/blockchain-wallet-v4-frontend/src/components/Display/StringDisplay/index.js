import { FormattedMessage } from 'react-intl'
import { propOr } from 'ramda'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import { Remote } from 'blockchain-wallet-v4'

import { getRemotePropType } from 'utils/proptypes'

import { SkeletonRectangle, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`

const defaultError = (
  <FormattedMessage id='stringdisplay.deafulterror' defaultMessage='Error' />
)

class StringDisplayContainer extends React.PureComponent {
  render () {
    const { children, skeletonHeight, skeletonWidth, ...rest } = this.props
    return (
      <Wrapper {...rest}>
        {children.cata({
          Success: value => value,
          Failure: error => (
            <Text size='12px' weight={400} color='red600' className='error'>
              {propOr(defaultError, 'message', error)}
            </Text>
          ),
          Loading: () => (
            <SkeletonRectangle height={skeletonHeight} width={skeletonWidth} />
          ),
          NotAsked: () => (
            <SkeletonRectangle height={skeletonHeight} width={skeletonWidth} />
          )
        })}
      </Wrapper>
    )
  }
}

StringDisplayContainer.propTypes = {
  children: getRemotePropType(PropTypes.string).isRequired
}

StringDisplayContainer.defaultProps = {
  children: Remote.NotAsked,
  skeletonHeight: '14px',
  skeletonWidth: '60px'
}

export default StringDisplayContainer
