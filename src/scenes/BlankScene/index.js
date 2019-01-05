import React, { PureComponent } from 'react'

// Design
import { Container, Content, SafeAreaView, Text } from '../../components/Utils'

// Utils
import tl from '../../utils/i18n'

class BlankScene extends PureComponent {
  static navigationOptions = {
    header: null
  }

  render () {
    return (
      <SafeAreaView>
        <Container>
          <Content justify='space-between' flex={1}>
            <Text>{tl.t('ok')}</Text>
          </Content>
        </Container>
      </SafeAreaView>
    )
  }
}

export default BlankScene
