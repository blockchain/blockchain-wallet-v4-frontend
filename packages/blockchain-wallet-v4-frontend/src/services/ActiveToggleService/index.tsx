import React, { ReactElement } from 'react'

import { Icon, Image } from 'blockchain-info-components'

type Props = { isActive: boolean }
export const ActiveToggle = ({ isActive }: Props): ReactElement => {
  return (
    <>
      {isActive ? (
        <Icon
          name='checkmark-circle-filled'
          size='24px'
          color='green600'
          role='button'
          style={{ justifyContent: 'flex-start' }}
        />
      ) : (
        <Image
          name='circle-empty'
          width='24px'
          height='24px'
          style={{ justifyContent: 'flex-start' }}
        />
      )}
    </>
  )
}
