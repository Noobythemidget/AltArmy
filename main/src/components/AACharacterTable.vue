<script>
import AABaseTable from 'components/AABaseTable.vue'
import { FilterNode } from 'assets/js/filternode.js'
import { store } from 'assets/js/store.js'
// import { Logger } from 'assets/js/logger.js'

export default {
  extends: AABaseTable,
  setup () {
    return {
      columns: [
        {
          name: 'name',
          required: true,
          label: 'Name',
          field: 'name',
          align: 'left',
          sortable: true,
          style: 'width: 10%;'
        },
        {
          name: 'level',
          label: 'Level',
          field: 'level',
          align: 'left',
          sortable: true,
          style: 'width: 10%;'
        },
        {
          name: 'account',
          label: 'Account',
          field: 'account',
          align: 'left',
          sortable: true,
          style: 'width: 10%;'
        },
        {
          name: 'server',
          label: 'Server',
          field: 'server',
          align: 'left',
          sortable: true,
          style: 'width: 10%;'
        },
        {
          name: 'race',
          label: 'Race',
          field: 'race',
          align: 'left',
          sortable: true,
          style: 'width: 10%;'
        },
        {
          name: 'class',
          label: 'Class',
          field: 'class',
          align: 'left',
          sortable: true,
          style: 'width: 10%;'
        },
        {
          name: 'last_updated',
          label: 'Updated',
          field: 'last_updated',
          align: 'left',
          sortable: true
        }
      ]
    }
  },
  methods: {
    getName () {
      return 'AACharacterTable'
    },
    getLoadingLabel () {
      return 'Loading character data...' // Loading character data...
    },
    getNoResultsLabel () {
      return 'No characters matched.' // No characters matched.
    },
    getStoreProperty () {
      return store.characters // something like store.characters
    },
    getRefreshEventName () {
      return 'get-all-characters'
    },
    getFilterType () {
      return FilterNode.FILTER_CHARACTERS
    }
  }
}
</script>
