export const contacts = [
  {
    isEmail: 1,
    path: 'info@hansanglab.com',
    text: '(общие вопросы)',
  },
  {
    isEmail: 1,
    path: 'mira@hansanglab.com',
    text: '(сотрудничество)',
  },
  {
    isEmail: 0,
    path: 'www.hansanglab.com',
    text: ''
  }
]

export const social = [
  {
    name: 'fb',
    iosUrl: 'fb://profile/985427298317404',
    andrUrl: 'intent://#Intent;package=com.facebook.katana;scheme=fb://profile/985427298317404;end',
    image: require('../assets/images/social/fb.png'),
    url: 'https://www.facebook.com/hansanglab',
  },
  {
    name: 'inst',
    iosUrl: 'instagram://user?username=hansanglab',
    anrdUrl: 'intent://instagram.com/_u/hansanglab/#Intent;package=com.instagram.android;scheme=https;end',
    image: require('../assets/images/social/inst.png'),
    url: 'https://www.instagram.com/hansanglab/',
  },
  {
    name: 'vk',
    iosUrl: 'vk://vk.com/hansanglab',
    anrdUrl: 'intent://vk.com/hansanglab#Intent;package=com.vkontakte.android;scheme=vkontakte;end',
    image: require('../assets/images/social/vk.png'),
    url: 'https://vk.com/hansanglab'
  },
  {
    name: 'yt',
    iosUrl: 'vnd.youtube://www.youtube.com/channel/UC5BDXrYkDYDb-ENhEzUtWEQ',
    anrdUrl: 'intent://www.youtube.com/channel/UC5BDXrYkDYDb-ENhEzUtWEQ#Intent;package=com.google.android.youtube;scheme=https;end',
    image: require('../assets/images/social/yt.png'),
    url: 'https://www.youtube.com/channel/UC5BDXrYkDYDb-ENhEzUtWEQ',
  }
]
