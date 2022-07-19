import React from 'react'
import { Icon } from '@blockchain-com/constellation'
import { IconArrowUpRight, IconReceive } from '@blockchain-com/icons'
import styled from 'styled-components'

import { Flex } from 'components/Flex'

interface ITransactionIconProps {
  size?: string
  type: string
}

const hasBorder = (type: string) => ['sent', 'received'].includes(type)

const IconBorder = styled(Flex)`
  border: 2px solid ${(props) => props.theme.white};
  border-radius: 14px;
  background: transparent;
  width: 36px;
  height: 36px;
`

const iconMap = {
  received: <IconReceive />,
  sent: <IconArrowUpRight />
}

const TransactionIcon: React.FC<ITransactionIconProps> = ({ size, type }) => {
  const renderIcon = () => (
    <Icon label={type} color='white900' size={size || hasBorder(type) ? 'md' : 'lg'}>
      {iconMap[type]}
    </Icon>
  )

  return hasBorder(type) ? (
    <IconBorder justifyContent='center' alignItems='center'>
      {renderIcon()}
    </IconBorder>
  ) : (
    renderIcon()
  )
}

export default TransactionIcon
