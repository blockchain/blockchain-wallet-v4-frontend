import React from 'react'
import { IntlProvider } from 'react-intl'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { AppleAndGooglePayBannerViewComponent } from '.'
import { AppleAndGooglePayBannerView } from './AppleAndGooglePayBannerView'

export default {
  component: AppleAndGooglePayBannerView,
  decorators: [(Story) => <IntlProvider locale='en'>{Story()}</IntlProvider>],
  title: 'Pages/Home/Banners/AppleAndGooglePayBannerView'
} as ComponentMeta<AppleAndGooglePayBannerViewComponent>

const Template: ComponentStory<AppleAndGooglePayBannerViewComponent> = (args) => (
  <AppleAndGooglePayBannerView {...args} />
)

export const Default = Template.bind({})
