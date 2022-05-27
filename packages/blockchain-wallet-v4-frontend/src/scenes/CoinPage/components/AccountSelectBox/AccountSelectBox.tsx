import React, { useMemo } from 'react'

import { StyledSelectBox } from './AccountSelectBox.styles'
import { AccountSelectBoxComponent } from './AccountSelectBox.types'

const AccountSelectBox: AccountSelectBoxComponent = ({ items, label, onChange, value }) => {
  const key: string = useMemo(() => {
    return value ? JSON.stringify(value) : ''
  }, [value])

  return (
    <StyledSelectBox
      key={key}
      meta={{}}
      label={label}
      input={{
        onBlur: () => {},
        onChange,
        value
      }}
      elements={[
        {
          group: '',
          items
        }
      ]}
    />
  )
}

export default AccountSelectBox
