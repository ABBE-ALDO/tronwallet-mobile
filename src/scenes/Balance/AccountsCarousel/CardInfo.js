import React from 'react'
import { View } from 'react-native'
import { Motion, spring } from 'react-motion'
import { CardInfoText } from './elements'
import { VerticalSpacer } from '../../../components/Utils'
import { Colors } from '../../../components/DesignSystem'

const CardInfo = ({ label, value, precision = 0 }) => (
  <View>
    <CardInfoText color={Colors.greyBlue}>{label}</CardInfoText>
    <Motion
      defaultStyle={{ power: 0 }}
      style={{ power: spring(value) }}
    >
      {value => (
        <React.Fragment>
          <VerticalSpacer size='small' />
          <CardInfoText color={Colors.primaryText}>{`${value.power.toFixed(precision)}`}</CardInfoText>
        </React.Fragment>
      )}
    </Motion>
  </View>
)

export default CardInfo
