import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Text } from 'blockchain-info-components'

const ClickableText = styled(Text)`
  cursor: pointer;
`

const OptionItem = ({ id, defaultMessage, onClick }) => (
  <ClickableText size='small' onClick={onClick}>
    <FormattedMessage id={id} defaultMessage={defaultMessage} />
  </ClickableText>
)

export default OptionItem
