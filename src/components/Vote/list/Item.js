import React from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components'
import capitalize from 'lodash/capitalize'

import * as Utils from '../../Utils'
import { formatNumber } from '../../../utils/numberUtils'
import formatUrl from '../../../utils/formatUrl'
import RankBadge from './LeftBadge'
import { Colors } from './../../DesignSystem'
import tl from './../../../utils/i18n'

const Gradient = styled(LinearGradient).attrs({
  start: { x: 0, y: 0.5 },
  end: { x: 1, y: 1 },
  colors: [Colors.primaryGradient[0], Colors.primaryGradient[1]]
})`
  border-width: 1px;
  border-radius: 5px;
  border-color: transparent;
`

const BadgeWrapper = styled.View`
  position: relative;
  height: 16px;
  min-width: 60px;
  border-radius: 5px;
  border-width: 1px;
  border-color: transparent;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
`

const Badge = () => (
  <BadgeWrapper>
    <Gradient style={[StyleSheet.absoluteFill, styles.badge]} />
    <Utils.Text size='tiny'>{tl.t('votes.official')}</Utils.Text>
  </BadgeWrapper>
)

const VoteItem = ({ item, index, disabled, voteCount, openModal, official }) => {
  return (
    <TouchableOpacity disabled={disabled} onPress={openModal}>
      <Utils.VoteRow>
        <Utils.Row justify='space-between' align='center'>
          <Utils.Row align='center'>
            <RankBadge
              voted={voteCount && voteCount > 0}
              index={item.rank}
            />
            <Utils.Column>
              <Utils.Text size='smaller' secondary>
                {item.name ? item.name : formatUrl(item.url)}
              </Utils.Text>
              <Utils.Text lineHeight={20} size='xsmall'>
                {formatNumber(item.votes)}
              </Utils.Text>
            </Utils.Column>
          </Utils.Row>
          <Utils.Column align='flex-end'>
            {official && (<Badge />)}
            <Utils.Text>{voteCount || 0}</Utils.Text>
          </Utils.Column>
        </Utils.Row>
      </Utils.VoteRow>
    </TouchableOpacity>
  )
}

VoteItem.propTypes = {
  item: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  votes: PropTypes.number
}

export default VoteItem

export const GradientCard = ({ item, index, disabled, voteCount, openModal, official }) => (
  <TouchableOpacity disabled={disabled} onPress={openModal}>
    <Gradient style={styles.card} >
      <Utils.Row align='center'>
        <Utils.Column>
          <Utils.Text size='small'>
            {item.name ? item.name : formatUrl(item.url)}
          </Utils.Text>
          <Utils.Text lineHeight={20} size='xsmall'>
            {formatNumber(item.votes)}
          </Utils.Text>
        </Utils.Column>
      </Utils.Row>
      <Utils.Column align='flex-end' justify='center'>
        <Utils.Text size='smaller'>{capitalize(tl.t('votes.title'))}</Utils.Text>
        <Utils.Text size='smaller'>{voteCount || 0}</Utils.Text>
      </Utils.Column>
    </Gradient>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'transparent'
  },
  card: {
    flex: 1,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginVertical: 20
  }
})
