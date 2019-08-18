import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  Share,
  TouchableOpacity,
} from 'react-native'
import { pageTitles, } from './constants/pages'
import SearchPanel from './Pages/Search/SearchPanel'

const Header = ({ navTitle, openDrawer, closePost, goBack, url, location, type, isPostOpen }) => {
  const isSearch = /search/.test(location)
  const isInsidePost = isPostOpen
  const isArticle = type === 'article'
  const shouldRenderSpecificTitle = isInsidePost || isSearch
  const specificTitle = isArticle ? navTitle.articleTitle : navTitle.eventTitle
  const specificUrl = isArticle ? url.articleUrl : url.eventUrl
  const title = shouldRenderSpecificTitle ? specificTitle : pageTitles[location].toUpperCase()
  const shouldRenderBackButton = shouldRenderSpecificTitle
  const shouldRenderSearch = (/news|blogs|programs|media|search/i.test(location) || location === '/') && !isPostOpen

  const onIconPress = shouldRenderBackButton ? (isInsidePost ? closePost : goBack) : openDrawer
  const share = async () => {
    try {
      await Share.share({
        message: `${specificTitle}\n${specificUrl}`,
      });
    } catch (error) {
      alert(error.message);
    }
  }
  return (
    <View style={styles.nav}>
        <View
          style={styles.container}
        >
          <TouchableOpacity
            onPress={onIconPress}
            style={styles.clickableZone}
          >
            {shouldRenderBackButton ? (
              <View
                style={styles.backIcon}
              >
                <Image
                  source={require(`./assets/images/back.png`)}
                  style={{ width: 19, height: 19 }}
                />
              </View>
            ) : (
              <Image
                source={require(`./assets/images/menu_icon.png`)}
                style={{ width: 38, height: 38 }}
              />
            )}
          <Text
            style={shouldRenderSpecificTitle ? styles.articleTitle : styles.navTitle}
          >
            {title && title.slice(0, 20)}
            {title && title.length > 20 && '...'}
          </Text>
        </TouchableOpacity>
        </View>
        {isInsidePost && (
          <View style={{ marginLeft: 'auto' }}>
            <TouchableOpacity
              onPress={share}
              style={{ paddingLeft: 3, paddingRight: 3, paddingTop: 9, paddingBottom: 9 }}
            >
              <Image
                source={require('./assets/images/share.png')}
                style={{ height: 16, width: 16}}
                resizeMode="contain"
              />
            </TouchableOpacity>
        </View>
        )}
        {shouldRenderSearch && <SearchPanel isSearch={isSearch} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 5,
  },
  clickableZone: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 9,
    paddingBottom: 9,
  },
  nav: {
    paddingTop: 45,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    backgroundColor: '#333376',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  articleTitle: {
    fontSize: 22,
    fontWeight: 'normal',
    color: 'rgba(255, 255, 255, 0.6)',
    paddingLeft: 10,
  },
  navTitle: {
    paddingLeft: 10,
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
})


export default Header
