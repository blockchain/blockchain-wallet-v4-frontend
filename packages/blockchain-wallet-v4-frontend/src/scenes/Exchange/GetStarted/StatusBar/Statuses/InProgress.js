import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import { actions } from 'data'
import { Button, Text } from 'blockchain-info-components'

const ActionButton = styled(Button).attrs({ nature: 'primary' })`
  font-weight: 600;
  padding-top: 18px;
  padding-bottom: 18px;
  height: fit-content;
  max-width: 327px;
  width: 50%;

  @media (max-width: 69.375rem) {
    width: 45%;
  }

  @media (max-width: 61.25rem) {
    width: 100%;
  }
`

export const InProgress = ({ verifyIdentity }) => (
  <ActionButton onClick={verifyIdentity}>
    <Text color='white' size='16px' weight={600}>
      <FormattedMessage
        id='scenes.exchange.getstarted.status.inprogress.button1'
        defaultMessage='Continue Where You Left Off'
      />
    </Text>
  </ActionButton>
)

const mapDispatchToProps = dispatch => ({
  verifyIdentity: () =>
    dispatch(actions.components.identityVerification.verifyIdentity())
})

export default connect(
  undefined,
  mapDispatchToProps
)(InProgress)
