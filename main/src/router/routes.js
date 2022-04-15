import MainLayout from 'layouts/MainLayout.vue'
import Index from 'pages/Index.vue'
import Error404 from 'pages/Error404.vue'

import AACharactersPage from 'src/pages/AACharactersPage.vue'
import AAWalletPage from 'src/pages/AAWalletPage.vue'
import AltInventoryPage from 'src/pages/AltInventoryPage.vue'
import AAAccountsPage from 'src/pages/AAAccountsPage.vue'
import AAServersPage from 'src/pages/AAServersPage.vue'
import AAAllNotesPage from 'src/pages/AAAllNotesPage.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', component: Index },
      { path: 'characters', component: AACharactersPage },
      { path: 'wallet', component: AAWalletPage },
      { path: 'inventory', component: AltInventoryPage },
      { path: 'accounts', component: AAAccountsPage },
      { path: 'servers', component: AAServersPage },
      { path: 'notes', component: AAAllNotesPage }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: Error404
  }
]

// const routes = [
//   {
//     path: '/',
//     component: () => import('layouts/MainLayout.vue'),
//     children: [
//       { path: '', component: () => import('pages/Index.vue') },
//       { path: 'characters', component: () => import('src/pages/v1/AACharactersPage.vue') },
//       { path: 'wallet', component: () => import('src/pages/v1/AAWalletPage.vue') },
//       { path: 'inventory', component: () => import('src/pages/v1/AltInventoryPage.vue') }
//     ]
//   },

//   // Always leave this as last one,
//   // but you can also remove it
//   {
//     path: '/:catchAll(.*)*',
//     component: () => import('pages/Error404.vue')
//   }
// ]

export default routes
