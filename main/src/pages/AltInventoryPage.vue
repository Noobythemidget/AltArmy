<template>
  <q-page class="plugin-data-view view-page">
    <AltInventoryTable class="view-page-table" :expandButtonClicked="expandButtonClicked" title="Alt Inventory" icon="inventory">
      <template v-slot="slot">
        <div class="expanded-row">
          <AALocationsView :locations="slot.props.row.tree"></AALocationsView>
        </div>
      </template>
    </AltInventoryTable>
  </q-page>
</template>

<script>
import AltInventoryTable from 'components/AltInventoryTable.vue'
import AALocationsView from 'components/AALocationsView.vue'
import { Logger } from 'assets/js/logger.js'
import { mergeLocationsJson } from 'assets/js/util.js'

export default {
  name: 'AltInventoryPage',
  components: {
    AltInventoryTable,
    AALocationsView
  },
  methods: {
    expandButtonClicked (props) {
      Logger.log('AltInventoryPage.expandButtonClicked')
      props.expand = !props.expand
      if (props.expand && !props.row.tree) {
        props.row.tree = mergeLocationsJson(props.row.locations)
      }
    }
  }
}

</script>
