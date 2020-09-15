import React from 'react'

import { useMedia } from 'services/ResponsiveService'
import FeaturesLarge from './template.large'
import FeaturesSmall from './template.small'

import { Props } from '.'

const Features = (
  props: Props & { showModal: (modal: 'SEND' | 'REQUEST') => void }
) => {
  const isTablet = useMedia('tablet')

  return isTablet ? <FeaturesSmall {...props} /> : <FeaturesLarge {...props} />
}

export default Features
