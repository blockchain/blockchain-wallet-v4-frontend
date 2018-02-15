import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 5px 0;

  @media(min-width: 1200px) {
    justify-content: flex-end;
    padding: 0;
  }
`

const Success = props => (
  <Wrapper>
    <Text size='13px' weight={300}>
      <FormattedMessage id='scenes.transactions.bch.content.list.listitem.initial' defaultMessage='Value when sent: ' />
    </Text>
    <Text size='13px' weight={500}>{`${props.currency}${props.fiatAtTime}`}</Text>
  </Wrapper>
)

Success.propTypes = {
  currency: PropTypes.string.isRequired,
  fiatAtTime: PropTypes.string.isRequired
}

export default Success
