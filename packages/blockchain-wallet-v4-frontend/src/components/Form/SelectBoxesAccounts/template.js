import React from 'react'
import styled from 'styled-components'
import { SelectInput } from 'blockchain-info-components'

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`

const SelectBoxesAccounts = (props) => {
  const { items, source, target, handleSelectSource, handleSelectTarget, ...rest } = props

  return (
    <Row>
      {source
      ? <SelectInput elements={items} onclick={handleSelectSource} {...rest} />
      : <SelectInput elements={items} onclick={handleSelectSource} {...rest} />
      }
      {target
        ? <SelectInput elements={items} onclick={handleSelectTarget} {...rest} />
        : <SelectInput elements={items} onclick={handleSelectTarget} {...rest} />
      }
    </Row>
  )
}

export default SelectBoxesAccounts
