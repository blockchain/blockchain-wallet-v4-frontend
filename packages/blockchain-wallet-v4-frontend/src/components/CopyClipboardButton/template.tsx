import { IconButton } from 'blockchain-info-components'
import CopyToClipBoard from 'react-copy-to-clipboard'
import React from 'react'
import styled from 'styled-components'

interface CopyButtonProps {
  active: boolean
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
    font-size: ${props => (props.active ? '18px' : '20px')};
    color: ${props =>
      props.active ? props.theme['success'] : props.theme.grey400};
  }
`

interface CopyClipboardProps {
  active: boolean
  address: string
  handleClick: () => void
}

const CopyClipboard = (props: CopyClipboardProps) => {
  const { active, address, handleClick } = props

  return (
    <CopyToClipBoard text={address} onCopy={handleClick}>
      <CopyButton
        active={active}
        name={active ? 'check' : 'copy-clipboard'}
        color='grey100'
        data-e2e='copyClipboardCopyButton'
      />
    </CopyToClipBoard>
  )
}

export default CopyClipboard
