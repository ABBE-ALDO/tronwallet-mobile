
import React from 'react'
import { storiesOf } from '@storybook/react-native'
// import styled from 'styled-components'
import Button from './index'

storiesOf('Buttons')
  // .addDecorator(getStory => <Content>{getStory()}</Content>)
  .add('Default', () => (<Button />))
