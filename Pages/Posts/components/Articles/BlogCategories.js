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

class BlogCategories extends React.Component {
  onCatPress = (cat) => {
    const { subCategories, setSubCategoriesAction, fetchByCategory } = this.props
    const index = subCategories.indexOf(cat.id)
    if (index > -1) {
      subCategories.splice(index, 1)
    } else {
      subCategories.push(cat.id)
    }
    setSubCategoriesAction(subCategories)
    const catIds = subCategories.join(',')
    const category = catIds || 4
    fetchByCategory(category, undefined, false, 4)
  }

  render() {
    const { categories, subCategories } = this.props
    const blogCategories = categories.filter((cat) => cat.parent === 4)
    return (
      <ScrollView
        horizontal
        contentContainerStyle={{ padding: 10, flexDirection: 'row', alignItems: 'center' }}
        showsHorizontalScrollIndicator={false}
      >
        {blogCategories && blogCategories.map((cat) => (
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
)(BlogCategories)
