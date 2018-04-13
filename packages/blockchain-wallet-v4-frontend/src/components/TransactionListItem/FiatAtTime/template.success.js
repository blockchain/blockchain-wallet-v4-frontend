import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const Success = props => (
  <Wrapper>
    <Text size='12px' weight={300}>
      <FormattedMessage id='scenes.transactions.bitcoin.content.list.listitem.initial' defaultMessage={`Value when ${props.type}: `} />
    </Text>
    <Text size='12px' weight={200}>{`${props.currency}${props.fiatAtTime}`}</Text>
  </Wrapper>
)

Success.propTypes = {
  currency: PropTypes.string.isRequired,
  fiatAtTime: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
}

export default Success
