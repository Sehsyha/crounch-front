<template>
  <div>
    <h1>Listes</h1>
    <CreateList />
    <DisplayLists />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator';

import CreateList from '@/components/CreateList.vue';
import DisplayLists from '@/components/DisplayLists.vue';

@Component({
  components: {
    CreateList,
    DisplayLists,
  }
})
export default class Lists extends Vue { }
</script>
