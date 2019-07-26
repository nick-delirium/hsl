import React from 'react'
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
} from 'react-native'
import get from 'lodash/get'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { getCategories } from '@/Navigation/reducer'
import CardArticle from '@/Pages/Posts/components/Articles/CardArticle'
import CardEvent from '@/Pages/Posts/components/Events/CardEvent'
import Article from '@/Pages/Posts/components/Articles/Article'
import Event from '@/Pages/Posts/components/Events/Event'
const height = Dimensions.get('window').height

class AllPosts extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      treshold: 0
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.posts.length !== this.props.posts.length) {
      this.refs._scrollRef.scrollToOffset({ offset: 0, animated: false })
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

  renderPost = (type) => {
    switch (type) {
      case 'event':
        return (
          <View style={styles.postWrapper}>
            <Event slug />
          </View>
        )
      default:
        return (
          <View style={styles.postWrapper}>
            <Article id />
          </View>
        )
    }
  }

  render() {
    const { posts, isLoading, isPostOpen, postType } = this.props

    const dataWithMedia = posts && posts.map((item) => {
      const mediaUrl = get(item, '_links.wp:featuredmedia.href', null)
        || `https://hansanglab.com/wp-json/wp/v2/media/${get(item, 'featured_media')}`
      return {
        ...item,
        mediaUrl,
      }
    })
    return (
      <View style={{ position: 'relative', flex: 1 }}>
        {isPostOpen && this.renderPost(postType)}
        <FlatList
          ref='_scrollRef'
          style={{ flex: 1 }}
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

const styles = StyleSheet.create({
  postWrapper: {
    position: 'absolute',
    top: 0,
    paddingBottom: 100,
    left: 0,
    zIndex: 9,
    height,
    backgroundColor: '#D1D0D0',
    flex: 1,
  }
})

const mapStateFromProps = createStructuredSelector({
  isLoading: (state) => get(state, 'search.isLoading'),
  isError: (state) => get(state, 'search.isError'),
  posts: (state) => get(state, 'search.searchResult'),
  categories: (state) => get(state, 'url.categories'),
  isPostOpen: (state) => get(state, 'url.isPostOpen'),
  postType: (state) => get(state, 'url.type'),
})

export default connect(
  mapStateFromProps,
)(AllPosts)
