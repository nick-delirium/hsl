/* eslint-disable arrow-body-style */
import React from 'react'
import {
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native'
import { createStructuredSelector } from 'reselect'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { compose } from 'redux'
import get from 'lodash/get'
import fonts from '@/constants/Styles'
import { getPostsByCategory } from '@/Pages/Posts/reducer'
import { setSubCategories } from '@/Navigation/reducer'
import { events } from '@/analytics'

class SubCategories extends React.Component {
  onCatPress = (cat) => {
    const {
      subCategories, setSubCategoriesAction, fetchByCategory, categories, type,
    } = this.props
    const parentTypeId = categories.find((item) => item.slug === type)?.id

    const index = subCategories.indexOf(cat.id)
    if (index > -1) {
      subCategories.splice(index, 1)
    } else {
      subCategories.push(cat.id)
    }
    events.clickOnBlogCategory({ catName: cat.name, isSelected: index === -1 })
    setSubCategoriesAction(subCategories)
    const catIds = subCategories.join(',')
    const category = catIds || parentTypeId
    fetchByCategory(category, undefined, false, parentTypeId)
  }

  render() {
    const { categories, subCategories, type } = this.props
    const parentTypeId = categories.find((item) => item.slug === type)?.id
    const currentSubCategories = categories.filter((cat) => cat.parent === parentTypeId)
    return (
      <ScrollView
        horizontal
        contentContainerStyle={{ padding: 10, flexDirection: 'row', alignItems: 'center' }}
        showsHorizontalScrollIndicator={false}
      >
        {currentSubCategories && currentSubCategories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={{
              flex: 1,
              borderWidth: 1,
              padding: 10,
              borderRadius: 3,
              marginRight: 10,
              borderColor: '#333376',
              backgroundColor: subCategories.includes(cat.id) ? '#333376' : 'transparent',
            }}
            onPress={() => this.onCatPress(cat)}
          >
            <Text style={{ fontSize: fonts.normal, color: subCategories.includes(cat.id) ? '#fff' : '#333376' }}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchByCategory: (cat, limit, isRefresh, mainCategory) => {
    return dispatch(getPostsByCategory(cat, limit, isRefresh, mainCategory))
  },
  setSubCategoriesAction: (subCategories) => dispatch(setSubCategories(subCategories)),
})
const mapStateFromProps = createStructuredSelector({
  categories: (state) => get(state, 'url.categories'),
  subCategories: (state) => get(state, 'url.subCategories'),
})

const withConnect = connect(mapStateFromProps, mapDispatchToProps)

export default compose(
  withRouter,
  withConnect,
)(SubCategories)
