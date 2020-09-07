const pages = {
  all: {
    name: 'Все',
    path: '/',
    okbkSub: false,
  },
  // news: {
  //   name: 'Новости',
  //   path: '/news',
  //   okbkSub: false,
  // },
  partners: {
    name: 'Партнёры',
    path: '/partners',
    okbkSub: false,
  },
  events: {
    name: 'Мероприятия',
    path: '/events',
    okbkSub: false,
  },
  blogs: {
    name: 'Блоги',
    path: '/blogs',
    okbkSub: false,
  },
  programs: { // one 'm' in db
    name: 'Программы',
    path: '/programs',
    okbkSub: false,
  },
  // media: {
  //   name: 'Медиа',
  //   path: '/media',
  //   okbkSub: false,
  // },
  places: {
    name: 'Карта',
    path: '/places',
    okbkSub: false,
  },
  post: {
    name: '',
    path: '/post/:id',
    okbkSub: false,
  },
  event: {
    name: '',
    path: '/event/:slug',
    okbkSub: false,
  },
  search: {
    name: '',
    path: '/search',
    okbkSub: false,
  },
  okbk: {
    name: 'ОКБК',
    path: '/okbk',
    okbkSub: false,
  },
}

export const pageTitles = {
  [pages.all.path]: 'KORYOSARAM SYNERGY',
  [pages.events.path]: pages.events.name,
  // [pages.news.path]: pages.news.name,
  [pages.blogs.path]: pages.blogs.name,
  [pages.programs.path]: pages.programs.name,
  [pages.partners.path]: pages.partners.name,
  // [pages.media.path]: pages.media.name,
  [pages.places.path]: pages.places.name,
  [pages.okbk.path]: 'ОКБК: Новости',
}
export default pages

export const pagesWithSubcategories = [
  'blogs', 'partners',
]
