import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Text } from 'blockchain-info-components'

const OptionItem = ({ id, defaultMessage, onClick }) => (
  <Text size='small' onClick={onClick}>
    <FormattedMessage id={id} defaultMessage={defaultMessage} />
  </Text>
)

export default OptionItem
