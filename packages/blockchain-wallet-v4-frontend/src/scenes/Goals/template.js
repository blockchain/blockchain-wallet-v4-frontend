import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  background-color ${props => props.theme['red']};
  padding: 15px;
  box-sixing: border-box;
`

const Actions = props => (
  <Wrapper>
    { props.error === 'invalid_link' &&
      <Text size='18px' weight={300} color='white'>
        <FormattedMessage id='scenes.actions.goals.invalidlink' defaultMessage='The link provided is invalid.' />
      </Text>
    }
  </Wrapper>
)

Actions.propTypes = {
  error: PropTypes.string
}

Actions.defaultProps = {
  error: ''
}

export default Actions
