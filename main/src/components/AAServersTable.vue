<script>
import AABaseTable from 'components/AABaseTable.vue'
import { store } from 'assets/js/store.js'
import { FilterNode } from 'assets/js/filternode.js'

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
          name: 'space',
          label: '',
          style: 'width: 90%'
        }
      ]
    }
  },
  methods: {
    getName () {
      return 'AAServersTable'
    },
    getLoadingLabel () {
      return 'Loading servers data...' // Loading character data...
    },
    getNoResultsLabel () {
      return 'No servers matched.' // No characters matched.
    },
    getStoreProperty () {
      return store.servers // something like store.characters
    },
    getRefreshEventName () {
      return 'get-servers-table'
    },
    getFilterType () {
      return FilterNode.FILTER_WALLET // ?? not sure if this is needed for servers
    },
    getStoreFilter () {
      return store.servers.toolbarOptions.search
    },
    filterMethod () {
      return this.defaultFilterMethod()
    }
  }
}
</script>
