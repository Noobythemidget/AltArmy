<template>
  <q-page class="plugin-data-view view-page">
    <AAWalletTable class="view-page-table" :expandButtonClicked="expandButtonClicked" title="Wallet" icon="account_balance">
      <template v-slot="slot">
        <div class="expanded-row">
          <AALocationsView :locations="slot.props.row.tree"></AALocationsView>
        </div>
      </template>
    </AAWalletTable>
  </q-page>
</template>

<script>
import AAWalletTable from 'components/AAWalletTable.vue'
import AALocationsView from 'components/AALocationsView.vue'
import { Logger } from 'assets/js/logger.js'
import { mergeLocationsJson } from 'assets/js/util.js'

export default {
  name: 'AAWalletPage',
  components: {
    AAWalletTable,
    AALocationsView
  },
  methods: {
    expandButtonClicked (props) {
      Logger.log('AAWalletPage.expandButtonClicked')
      props.expand = !props.expand
      if (props.expand && !props.row.tree) {
        props.row.tree = mergeLocationsJson(props.row.locations)
      }
    }
  }
}

</script>
