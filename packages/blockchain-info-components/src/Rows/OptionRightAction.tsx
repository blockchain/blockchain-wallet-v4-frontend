import React, { useCallback } from 'react'
import styled from 'styled-components'

import { Icon } from 'blockchain-info-components'

const Row = styled.div`
  padding: 16px 40px;
  box-sizing: border-box;
  border-top: 1px solid ${(props) => props.theme.grey000};
  &:last-child {
    border-bottom: 1px solid ${(props) => props.theme.grey000};
  }
`
const FlexWrapper = styled(Row)<{ disabled?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0;
  padding-bottom: 0;
  cursor: ${(p) => (p.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(p) => (p.disabled ? '0.5' : '1')};

  & > div {
    height: 5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`

const OptionRightActionRow = ({ children, disabled, onClick }: Props) => {
  const onClickCallback = useCallback(() => {
    if (!disabled) {
      onClick()
    }
  }, [disabled, onClick])

  return (
    <FlexWrapper disabled={disabled} role='button' onClick={onClickCallback}>
      <div>{children}</div>
      <Icon name='chevron-right' size='25px' color='grey400' />
    </FlexWrapper>
  )
}

type Props = {
  children: React.ReactChild
  disabled?: boolean
  onClick: () => void
}

export default OptionRightActionRow
