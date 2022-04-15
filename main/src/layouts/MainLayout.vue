<template>
  <q-layout view="hHh Lpr lFf">
    <q-header>
      <!-- <q-bar class="main-toolbar">
        <q-space />
        <q-btn dense flat icon="minimize" @click="minimizeWindow()"/>
        <q-btn dense flat icon="crop_square" @click="maximizeWindow()" />
        <q-btn dense flat icon="close" @click="closeWindow()" />
      </q-bar> -->
      <q-toolbar class="main-toolbar">
        <q-btn flat dense round icon="menu" @click="toggleLeftDrawer" />
        <!-- <q-btn flat dense round :icon="darkModeIcon" @click="toggleDarkMode" /> -->

        <q-toolbar-title shrink class="ringbearer-font main-toolbar-title">
          <!-- ALT Army -->
          <!-- <q-item clickable to="/">
            <q-item-label class="text-h4 ringbearer-font main-toolbar-title">Alt Army</q-item-label>
          </q-item> -->
          Alt Army
        </q-toolbar-title>
        <q-space></q-space>
        <div>
          <MainToolBarButton
            icon="folder_open"
            tooltip="Open PluginData folder"
            @click="openPluginDataFolder()"
          ></MainToolBarButton>
        </div>
        <div>
          <MainToolBarButton
            icon="sync"
            tooltip="Refresh data"
            @click="loadPluginData()"
            v-if="this.pluginDataLoaded"
          ></MainToolBarButton>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered elevated overlay>
      <q-list>
        <q-item-label header>Menu</q-item-label>

        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container class="main-page-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style lang="sass">
.main-toolbar
  background  : $main-toolbar-background
  color       : $main-toolbar-text-icon

  .main-toolbar-title
    font-size : 20px
    user-select: none

.main-page-container
  background  : $main-container-background

.q-drawer__content
  background  : lighten($main-toolbar-background, 15%)
</style>

<script>
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import MainToolBarButton from 'components/MainToolBarButton.vue'
import { store, setViewLoadedFlags } from 'assets/js/store.js'
import { Logger } from 'assets/js/logger.js'

// import { useQuasar } from 'quasar'

const linksList = [
  {
    title: 'Characters',
    caption: 'Your character list',
    icon: 'people',
    link: 'characters'
  },
  {
    title: 'Wallet',
    caption: 'Your wallet items',
    icon: 'account_balance',
    link: 'wallet'
  },
  {
    title: 'Inventory',
    caption: 'Alt inventory',
    icon: 'inventory',
    link: 'inventory'
  },
  {
    title: '',
    separator: true
  },
  {
    title: 'Accounts',
    caption: 'Your account list',
    icon: 'account_circle',
    link: 'accounts'
  },
  {
    title: 'Servers',
    caption: 'Your server list',
    icon: 'public',
    link: 'servers'
  },
  {
    title: 'Notes',
    caption: 'Your notes list',
    icon: 'notes',
    link: 'notes'
  },
  {
    title: '',
    separator: true
  },
  {
    title: 'Docs',
    caption: 'Lotro wiki',
    icon: 'school',
    link: 'https://lotro-wiki.com/',
    external: true
  },
  {
    title: 'Forum',
    caption: 'Lotro forums',
    icon: 'record_voice_over',
    link: 'https://www.lotro.com/forums/',
    external: true
  },
  {
    title: 'Map',
    caption: 'Lotro google maps',
    icon: 'map',
    link: 'http://lotromap.net/terrainmap/google.html',
    external: true
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
    MainToolBarButton
  },
  methods: {
    openPluginDataFolder () {
      Logger.log('MainLayout.openPluginDataFolder')

      window.invoke('get-plugindata-folder').then((result) => {
        if (!result.canceled) {
          this.loadPluginData()
        } else {
          Logger.log('MainLayout.openPluginDataFolder', 'dialog canceled')
        }
      })
    },
    loadPluginData () {
      Logger.log('MainLayout.loadPluginData')
      window
        .invoke('get-plugindata')
        .then((pluginData) => {
          Logger.log('MainLayout.loadPluginData', 'data received')
          Logger.log(pluginData)

          store.dbLoaded = true
          this.pluginDataLoaded = true
          setViewLoadedFlags(false)

          window.document
            .querySelectorAll('.plugin-data-view')
            .forEach((el) => el.dispatchEvent(new Event('refresh')))
        })
    },
    minimizeWindow () {
      window.invoke('minimize-window')
    },
    maximizeWindow () {
      window.invoke('maximize-window')
    },
    closeWindow () {
      window.close()
    }
  },
  setup () {
    // const $q = useQuasar()
    // const darkModeIcon = ref($q.dark.isActive ? 'light_mode' : 'dark_mode')

    const leftDrawerOpen = ref(false)

    return {
      pluginDataLoaded: false,
      essentialLinks: linksList,
      leftDrawerOpen,
      // darkModeIcon,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
      // toggleDarkMode () {
      //   $q.dark.toggle()
      //   darkModeIcon.value = ($q.dark.isActive ? 'light_mode' : 'dark_mode')
      //   Logger.log('dark mode', $q.dark.isActive)
      // }
    }
  },
  data () {
    return {
      store
    }
  },
  beforeMount () {
    Logger.log('MainLayout.beforeMount')
    this.loadPluginData()
  }
})
</script>
