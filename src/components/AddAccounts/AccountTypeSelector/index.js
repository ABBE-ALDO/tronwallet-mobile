import React, { PureComponent } from 'react'
import { TabViewAnimated } from 'react-native-tab-view'
import { func } from 'prop-types'

// Design
import { View } from '../../Utils'

// Utils
import tl from '../../../utils/i18n'
import {
  DefaultAccountOption,
  HeaderTab
} from './tabs'
import PrivateKeyAccountOption from './PrivateKeyAccountOption'
import WatchAccountOption from './WatchAccountOption'

export class AccountTypeSelector extends PureComponent {
  static propTypes = {
    onChangeData: func
  }

  static defaultProps = {
    onChangeData: () => {}
  }

  static navigationOptions = {
    header: null
  }

  state = {
    index: 0,
    routes: [
      { key: 'default', title: tl.t('import.header.default') },
      { key: 'privateKey', title: tl.t('import.header.privateKey') },
      { key: 'watch', title: tl.t('import.header.watch') }
    ]
  }

  componentDidMount () {
    const { routes, index } = this.state
    this.props.onSelectType(routes[index].key)
  }

  _handleIndexChange = index => {
    const { routes } = this.state

    this.props.onSelectType(routes[index].key)
    this.setState({ index })
  }

  _renderScene = ({ route }) => {
    const { onChangeData } = this.props
    switch (route.key) {
      case 'privateKey':
        return (<PrivateKeyAccountOption onChangeData={onChangeData} />)
      case 'watch':
        return (<WatchAccountOption onChangeData={onChangeData} />)
      default:
        return (<DefaultAccountOption />)
    }
  }

  render () {
    return (
      <View style={{ height: 270 }}>
        <TabViewAnimated
          navigationState={this.state}
          renderScene={this._renderScene}
          renderHeader={HeaderTab}
          onIndexChange={this._handleIndexChange}
        />
      </View>
    )
  }
}

export default AccountTypeSelector
