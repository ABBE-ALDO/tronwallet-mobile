import React, { PureComponent } from 'react'
import { func } from 'prop-types'

const accountOptionComponent = (key, defaultData, Wrapper) =>
  class extends PureComponent {
    static propTypes = {
      onChangeData: func,
      onInvalid: func
    }

    static defaultProps = {
      onChangeData: () => {},
      onInvalid: () => {}
    }

    state = {
      accountData: defaultData
    }

    _changeData = (accountData, error) => {
      if (error) {
        this.props.onInvalid(error)
        return
      }

      this.setState({ accountData })
      this.props.onChangeData({ [key]: accountData })
    }

    render () {
      const { accountData } = this.state

      return (
        <Wrapper
          accountData={accountData}
          onChangeData={this._changeData}
        />
      )
    }
  }

export default accountOptionComponent
