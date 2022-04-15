import { reactive } from 'vue'

export const store = reactive({
  dbLoaded: false, // only set to true once, when db is populated with data
  characters: {
    loaded: {
      page: false,
      table: false
    },
    rows: [],
    toolbarOptions: {
      search: '',
      dropdownOptions: [
        { label: 'Account', options: [] },
        { label: 'Server', options: [] },
        { label: 'Race', options: [] },
        { label: 'Class', options: [] }
      ]
    }
  },
  inventory: {
    loaded: {
      page: false,
      table: false
    },
    rows: [],
    toolbarOptions: {
      search: '',
      dropdownOptions: [
        { label: 'Account', options: [] },
        { label: 'Server', options: [] }
        // { label: 'Race', options: [] },
        // { label: 'Class', options: [] }
      ]
    }
  },
  wallet: {
    loaded: {
      page: false,
      table: false
    },
    rows: [],
    toolbarOptions: {
      search: '',
      dropdownOptions: [
        { label: 'Account', options: [] },
        { label: 'Server', options: [] }
        // { label: 'Race', options: [] },
        // { label: 'Class', options: [] }
      ]
    }
  },
  accounts: {
    loaded: {
      page: false,
      table: false
    },
    rows: [],
    toolbarOptions: {
      search: '',
      dropdownOptions: [
        // { label: 'Account', options: [] },
        // { label: 'Server', options: [] }
        // { label: 'Race', options: [] },
        // { label: 'Class', options: [] }
      ]
    }
  },
  servers: {
    loaded: {
      page: false,
      table: false
    },
    rows: [],
    toolbarOptions: {
      search: '',
      dropdownOptions: [
        // { label: 'Account', options: [] },
        // { label: 'Server', options: [] }
        // { label: 'Race', options: [] },
        // { label: 'Class', options: [] }
      ]
    }
  },
  all_notes: {
    loaded: {
      page: false,
      table: false
    },
    rows: [],
    toolbarOptions: {
      search: '',
      dropdownOptions: []
    }
  }

})

export function setViewLoadedFlags (flag) {
  store.characters.loaded.page = flag
  store.characters.loaded.table = flag
  store.inventory.loaded.page = flag
  store.inventory.loaded.table = flag
}
