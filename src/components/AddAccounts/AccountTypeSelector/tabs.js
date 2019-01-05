import React from 'react'
import TabBar from 'react-native-tab-view/src/TabBar'

import tl from '../../../utils/i18n'
import { Colors, FontSize } from '../../DesignSystem'
import { View, Text } from '../../Utils'

export const HeaderTab = props => (
  <TabBar
    {...props}
    indicatorStyle={{
      width: '15%',
      height: 1,
      marginLeft: '7%'
    }}
    tabStyle={{
      padding: 8
    }}
    labelStyle={{
      fontFamily: 'Rubik-Medium',
      fontSize: FontSize.tiny,
      letterSpacing: 0.65,
      lineHeight: 12
    }}
    style={{
      backgroundColor: Colors.dusk,
      elevation: 0,
      shadowOpacity: 0
    }}
  />
)

export const DefaultAccountOption = () => (
  <View flex={1} align='center' justify='center'>
    <Text size='average' color={Colors.secondaryText}>{tl.t('import.onlyTypeAccount')}</Text>
  </View>
)
