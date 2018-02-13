import React from 'react'
import styled from 'styled-components'

import { Icon, SelectInput } from 'blockchain-info-components'
import { renderHeader, renderItem } from './services'

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
  const { source, target, elements, handleChangeSource, handleChangeTarget, handleSwap, ...rest } = props

  return (
    <Wrapper>
      <SelectInput elements={elements} value={source} onChange={handleChangeSource} templateHeader={renderHeader} templateItem={renderItem} {...rest} />
      <SwapIcon name='exchange-2' size='24px' weight={500} cursor onClick={handleSwap} />
      <SelectInput elements={elements} value={target} onChange={handleChangeTarget} templateHeader={renderHeader} templateItem={renderItem} {...rest} />
    </Wrapper>
  )
}

export default SelectBoxesAccounts
