const pages = {
  all: {
    name: 'Все',
    path: '/',
  },
  news: {
    name: 'Новости',
    path: '/news',
  },
  events: {
    name: 'Мероприятия',
    path: '/events',
  },
  blogs: {
    name: 'Блоги',
    path: '/blogs',
  },
  programs: { //one 'm' in db
    name: 'Программы',
    path: '/programs',
  },
  media: {
    name: 'Медиа',
    path: '/media',
  },
  //map here 

  // invite: {
  //   name: 'Пригласить друга',
  //   path: '/invite',
  // },
  post: {
    name: '',
    path: '/post/:id',
  },
  event: {
    name: '',
    path: '/event/:slug',
  }
}

export default pages