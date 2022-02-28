import React from 'react'
import { Icon } from '@blockchain-com/constellation'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Link } from 'blockchain-info-components'

import { Flex } from '../../../../components/Flex'
import { AboutSection, AboutSectionComponent } from '.'

const aboutSectionStoriesMeta: ComponentMeta<AboutSectionComponent> = {
  argTypes: {
    actions: {
      defaultValue: [
        <Link key={1}>
          <Flex gap={8} alignItems='center'>
            <Icon name='link' size='sm' color='blue600' />
            Official Website
          </Flex>
        </Link>,

        <Link key={2}>
          <Flex gap={8} alignItems='center'>
            <Icon name='link' size='sm' color='blue600' />
            Whitepaper
          </Flex>
        </Link>
      ]
    },
    content: {
      defaultValue:
        'Solana (SOL) is a highly functional open source project that banks on blockchain technology’s permissionless nature to provide decentralized finance (DeFi) solutions. While the idea and initial work on the project began in 2017, Solana was officially launched in March 2020 by the Solana Foundation with headquarters in Geneva, Switzerland.'
    },
    title: {
      defaultValue: 'About Solana'
    }
  },
  component: AboutSection,
  title: 'Pages/CoinPage/AboutSection'
}

export const Template: ComponentStory<AboutSectionComponent> = (args) => <AboutSection {...args} />

export const Solana = Template.bind({})
Solana.args = {
  content:
    'Solana (SOL) is a highly functional open source project that banks on blockchain technology’s permissionless nature to provide decentralized finance (DeFi) solutions. While the idea and initial work on the project began in 2017, Solana was officially launched in March 2020 by the Solana Foundation with headquarters in Geneva, Switzerland.',
  title: 'About Solana'
}

export const Bitcoin = Template.bind({})
Bitcoin.args = {
  content:
    'The world’s first cryptocurrency, Bitcoin is stored and exchanged securely on the internet through a digital ledger known as a blockchain. Bitcoins are divisible into smaller units known as satoshis — each satoshi is worth 0.00000001 bitcoin.',
  title: 'About Bitcoin'
}

export const Dogecoin = Template.bind({})
Dogecoin.args = {
  content:
    'Dogecoin (DOGE) was created in 2013 as a lighthearted alternative to traditional cryptocurrencies like Bitcoin. The Dogecoin name and Shiba Inu logo are based on a meme. Unlike Bitcoin, which is designed to be scarce, Dogecoin is intentionally abundant — 10,000 new coins are mined every minute and there is no maximum supply.',
  title: 'About Dogecoin'
}

export default aboutSectionStoriesMeta
