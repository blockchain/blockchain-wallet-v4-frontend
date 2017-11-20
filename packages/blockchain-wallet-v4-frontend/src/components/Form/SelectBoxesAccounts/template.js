import React from 'react'
import styled from 'styled-components'
import { Icon, SelectInput } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  & > :first-child { width: 45%; }
  & > :last-child { width: 45%; }
`
const SwapIcon = styled(Icon)`
  &:hover { color: ${props => props.theme['brand-primary']}; }
`

const SelectBoxesAccounts = (props) => {
  const { items, source, target, handleSelectSource, handleSelectTarget, handleSwap, ...rest } = props

  return (
    <Wrapper>
      <SelectInput elements={items} value={source} onChange={handleSelectSource} {...rest} />
      <SwapIcon name='exchange-2' size='24px' weight={500} cursor onClick={handleSwap} />
      <SelectInput elements={items} value={target} onChange={handleSelectTarget} {...rest} />
    </Wrapper>
  )
}

export default SelectBoxesAccounts
