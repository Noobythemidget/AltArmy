<template>
  <!-- <q-btn :icon="icon" text-color="accent" color="secondary" padding="sm" flat round dense> -->
  <q-btn :icon="icon" padding="sm" flat round dense>
    <AATooltip :text="tooltip"></AATooltip>
  </q-btn>
</template>

<script>
import { defineComponent } from 'vue'
import AATooltip from 'components/AATooltip.vue'

export default defineComponent({
  name: 'MainToolBarButton',
  components: {
    AATooltip
  },
  props: {
    icon: {
      type: String,
      required: true
    },
    tooltip: {
      type: String,
      required: true
    }
  },
  setup () {
    return {}
  }
})
</script>
