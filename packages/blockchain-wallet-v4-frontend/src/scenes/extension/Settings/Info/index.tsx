import React from 'react'
import { Icon } from '@blockchain-com/constellation'
import { IconChevronRightV2 } from '@blockchain-com/icons'
import styled from 'styled-components'

import { Flex } from 'components/Flex'

import { SettingsHeading } from '..'
import { SettingsList } from '../Overal'

const GeneralSetting = styled.a`
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0em;
  text-align: left;
  color: #98a1b2;
  text-decoration: none;
  cursor: pointer;
`
class AboutLink {
  public path: string

  public label: string

  constructor(path, label) {
    this.path = path
    this.label = label
  }
}

export const Info = () => {
  const aboutSettings = [
    new AboutLink('https://www.blockchain.com/legal/privacy', 'Privacy'),
    new AboutLink('https://www.blockchain.com/legal/terms', 'Terms of service'),
    new AboutLink('https://www.blockchain.com/about', 'About Blockchain.com'),
    new AboutLink('https://support.blockchain.com/hc/en-us', 'Support')
  ]
  return (
    <>
      <SettingsHeading>About</SettingsHeading>
      <SettingsList>
        {aboutSettings.map((setting: AboutLink) => (
          <GeneralSetting key={setting.label} href={setting.path} target='_blank'>
            <Flex justifyContent='space-between' alignItems='center'>
              {setting.label}
              <Icon color='white800' label='IconBack' size='md'>
                <IconChevronRightV2 />
              </Icon>
            </Flex>
          </GeneralSetting>
        ))}
      </SettingsList>
    </>
  )
}
