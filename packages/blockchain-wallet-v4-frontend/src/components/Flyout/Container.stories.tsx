import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Button } from 'blockchain-info-components'

import Container from './Container'
import Content from './Content'
import Footer from './Footer'
import Header from './Header'
import SubHeader from './SubHeader'

export default {
  component: Container,
  title: 'Flyouts/Container'
} as ComponentMeta<typeof Container>

const Template: ComponentStory<typeof Container> = (args) => <Container {...args} />

export const Default = Template.bind({})
Default.args = {
  children: (
    <>
      <Header data-e2e='foo' mode='back' onClick={() => {}}>
        <h2>This is a base flyout container</h2>
      </Header>
      <Content mode='middle'>
        <p>
          You&apos;ll typically put FlyoutHeader, FlyoutContent, and FlyoutFooter in me to get
          nicely styled flyout that works out of the box!
        </p>
      </Content>
      <Footer>
        <Button data-e2e='foooo' nature='primary' fullwidth>
          Action Button!{' '}
          <span role='img' aria-label='Rock on emoji'>
            🤘
          </span>
        </Button>
      </Footer>
    </>
  )
}

export const DefaultSubHeader = Template.bind({})
DefaultSubHeader.args = {
  children: (
    <>
      <Header data-e2e='foo' mode='back' onClick={() => {}}>
        <h2>This is a base flyout container</h2>
      </Header>
      <SubHeader data-e2e='foooo' subTitle='Sub sub title here!' title='I am a sub header title' />
      <Content mode='top'>
        <p style={{ padding: '20px 40px' }}>
          You&apos;ll typically put FlyoutHeader, FlyoutContent, and FlyoutFooter in me to get
          nicely styled flyout that works out of the box!
        </p>
      </Content>
      <Footer>
        <Button data-e2e='foooo' nature='primary' fullwidth>
          Action Button!{' '}
          <span role='img' aria-label='Rock on emoji'>
            🤘
          </span>
        </Button>
      </Footer>
    </>
  )
}
