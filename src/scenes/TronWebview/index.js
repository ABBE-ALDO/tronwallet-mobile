import React, { Component } from 'react'

import withContext from '../../utils/hocs/withContext'

import { PageWrapper } from './elements'

import Header from './../../components/Navigation/Header'
import * as Utils from './../../components/Utils'
import tl from './../../utils/i18n'

import WebViewHome from './WebViewHome'
import SearchDapps from './SearchDapps'
import WebView from './WebView'

class TronWebView extends Component {
  _onSearch = (url) => {
    this._webView.open(url)
    this._home.syncData()
  }

  render () {
    return (
      <Utils.SafeAreaView>
        <PageWrapper>
          <Header
            title={tl.t('dapps.title')}
            onBack={() => this.props.navigation.goBack()}
          />
          <WebViewHome ref={ref => (this._home = ref)} onPress={url => this._webView.open(url)} />
          <WebView
            ref={ref => (this._webView = ref)}
            accounts={this.props.context.accounts}
            onRequestSearch={() => {
              this._search.open()
              this._home.syncData()
            }}
            onClose={() => this._home.syncData()}
          />
        </PageWrapper>
        <SearchDapps ref={ref => (this._search = ref)} onSearch={this._onSearch} />
      </Utils.SafeAreaView>
    )
  }
}

export default withContext(TronWebView)
