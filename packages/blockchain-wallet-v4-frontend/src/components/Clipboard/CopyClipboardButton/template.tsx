import React from 'react'
import CopyToClipBoard from 'react-copy-to-clipboard'
import styled from 'styled-components'

import { IconButton } from 'blockchain-info-components'

import { OwnProps, State } from '.'

interface CopyButtonProps {
  active: boolean
  color?: string
  size?: string
}

const CopyButton = styled(IconButton)<CopyButtonProps>`
  width: 30px;
  min-width: 0;
  height: 30px;
  border: none;
  background: transparent;
  &:hover {
    border: none;
    background: transparent;
  }
  > span {
    margin-top: ${props => (props.active ? '-2px' : '-5px;')};
    margin-right: 0 !important;
    font-size: ${props => (props.active ? '18px' : props.size || '20px')};
    color: ${props =>
      props.active
        ? props.theme['success']
        : props.color
        ? props.theme[props.color]
        : props.theme.grey400};
  }
`

type CopyClipboardProps = OwnProps['alertActions'] &
  State & {
    handleClick: () => void
  }

const CopyClipboard = (props: CopyClipboardProps) => {
  const { active, color, handleClick, size, textToCopy } = props

  return (
    <CopyToClipBoard text={textToCopy} onCopy={handleClick}>
      <CopyButton
        active={active}
        color={color}
        data-e2e='copyClipboardCopyButton'
        name={active ? 'check' : 'copy-clipboard'}
        size={size}
      />
    </CopyToClipBoard>
  )
}

export default CopyClipboard
