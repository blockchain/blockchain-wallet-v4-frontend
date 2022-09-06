import React, { useEffect, useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

import { CircularProgress, CircularProgressComponent } from '.'

export default {
  component: CircularProgress,
  title: 'Components/CircularProgress'
} as ComponentMeta<CircularProgressComponent>

const Template: ComponentStory<CircularProgressComponent> = (args) => <CircularProgress {...args} />

export const Default = Template.bind({})

export const WithTimerLoop = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timeout = setInterval(() => {
      setProgress((prev) => prev + 10)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (progress === 100) {
      setProgress(0)
    }
  }, [progress])

  return (
    <Flex alignItems='center' gap={6}>
      <CircularProgress value={progress} />
      <Text color='grey900' weight={500}>
        {' '}
        New quote in{' '}
        {`0:${(10 - progress / 10).toLocaleString('en-US', {
          minimumIntegerDigits: 2
        })}`}
      </Text>
    </Flex>
  )
}

Default.args = {
  value: 60
}
