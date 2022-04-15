<template>
  <div>
    <div class="text-center">
      <q-img  v-if="isFreep"
              :src="require('assets/images/'+ characterClass +'-icon.png')"
              loading="eager"
              width="128px"
              height="128px"></q-img>
    </div>
    <div class="text-center" style="font-size: 26px;">
      <div>Level: {{ level }}</div>
      <div>{{ race }}</div>
      <div v-if="characterClass !== 'Beorning'">{{ characterClass }}</div>
    </div>
  </div>
</template>

<script>
export default {
  // name: 'ComponentName',
  props: {
    characterClass: {
      type: String,
      required: true
    },
    level: {
      type: Number,
      required: true
    },
    race: {
      type: String,
      required: true
    },
    isFreep: {
      type: Boolean,
      default: true
    }
  },
  setup () {
    return {}
  }
}
</script>
