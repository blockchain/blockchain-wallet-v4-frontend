import { actions } from 'data'
import { Button, Text } from 'blockchain-info-components'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

const ActionButton = styled(Button).attrs({ nature: 'primary' })`
  font-weight: 600;
  width: 264px;
  height: 48px;
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
