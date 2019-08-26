import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import { actions } from 'data'
import { Button } from 'blockchain-info-components'

const ActionButton = styled(Button).attrs({ nature: 'primary' })`
  font-weight: 600;
  padding-top: 18px;
  padding-bottom: 18px;
  height: fit-content;
`

export const InProgress = ({ verifyIdentity }) => (
  <ActionButton onClick={verifyIdentity}>
    <FormattedMessage
      id='scenes.exchange.getstarted.status.inprogress.button1'
      defaultMessage='Continue Where You Left Off'
    />
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
