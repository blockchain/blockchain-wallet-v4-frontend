import React from 'react'
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
const FlexWrapper = styled(Row)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0;
  padding-bottom: 0;
  cursor: pointer;

  & > div {
    height: 5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`

const OptionRightActionRow = ({ children, onClick }: Props) => {
  return (
    <FlexWrapper role='button' onClick={onClick}>
      <div>{children}</div>
      <Icon name='chevron-right' size='25px' color='grey400' />
    </FlexWrapper>
  )
}

type Props = {
  children: React.ReactChild
  onClick: () => void
}

export default OptionRightActionRow
