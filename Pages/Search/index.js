import React from 'react'
import {
  View,
  FlatList,
} from 'react-native'
import get from 'lodash/get'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { getCategories } from '@/Navigation/reducer'
import CardArticle from '@/Pages/Posts/components/Articles/CardArticle'
import CardEvent from '@/Pages/Posts/components/Events/CardEvent'

class AllPosts extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      treshold: 0
    }
  }

  renderCardItem = ({ item }) => {
    const { categories, type } = this.props
    if (type === 'events') {
      return (
        <CardEvent
          key={item.id}
          id={item.id}
          description={item.description}
          title={item.title}
          dateStart={item.start_date} //utc_start_date
          dateEnd={item.end_date}
          image={get(item, `image.url`)}
          organizer={item.organizer} //array [0].organizer, url
          url={item.website}
          place={item.venue}
          slug={item.slug}
          allDay={item.allDay}
          categories={item.categories}
          tags={item.tags}
          cost={item.cost} //cost_details
        />
      )
    }
    return (
      <CardArticle
        key={item.id}
        id={item.id}
        data={item}
        title={item.title.rendered}
        descr={item.excerpt.rendered || item.description}
        mediaUrl={item.mediaUrl ? item.mediaUrl : null}
        categories={categories.filter(cat => (item.categories.includes(cat.id)))}
        content={get(item, 'content.rendered')}
        type={type}
      />
    )
  }

  _keyExtractor = (item) => `_${item.id}`

  render() {
    const { posts, isLoading } = this.props
    
    const dataWithMedia = posts && posts.map((item) => {
      const mediaUrl = get(item, '_links.wp:featuredmedia.href', null) 
        || `https://hansanglab.com/wp-json/wp/v2/media/${get(item, 'featured_media')}`
      return {
        ...item,
        mediaUrl,
      }
    })
    return (
      <View style={{ marginTop: 15 }}>
        <FlatList
          data={dataWithMedia}
          renderItem={this.renderCardItem}
          onRefresh={this.refreshData}
          refreshing={isLoading}
          keyExtractor={this._keyExtractor}
          onEndReached={this.loadMoreData}
          removeClippedSubviews
          onEndReachedThreshold={5}
        />
      </View>
    )
  }
}

const mapStateFromProps = createStructuredSelector({
  isLoading: (state) => get(state, 'search.isLoading'),
  isError: (state) => get(state, 'search.isError'),
  posts: (state) => get(state, 'search.searchResult'),
  categories: (state) => get(state, 'url.categories'),
})

export default connect(
  mapStateFromProps,
)(AllPosts)
