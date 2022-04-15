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
          style: 'width: 20%;'
        },
        {
          name: 'quantity',
          label: 'Quantity',
          field: 'quantity',
          align: 'left',
          sortable: true,
          style: 'width: 100%;',
          format: (val, row) => val.toLocaleString()
        }
      ]
    }
  },
  methods: {
    getName () {
      return 'AltInventoryTable'
    },
    getLoadingLabel () {
      return 'Loading inventory data...' // Loading character data...
    },
    getNoResultsLabel () {
      return 'No inventory items matched.' // No characters matched.
    },
    getStoreProperty () {
      return store.inventory // something like store.characters
    },
    getRefreshEventName () {
      return 'get-alt-inventory'
    },
    getFilterType () {
      return FilterNode.FILTER_INVENTORY
    }
  }
}
</script>
