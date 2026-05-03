<!-- Golden file: must stay clean under this package's ESLint test config (@vedmant/vue-start-tag-single-line). -->
<template>
  <div class="p-4">
    <NuxtLink v-if="show" to="/example" class="text-gray-900 hover:text-primary-600 hover:underline">
      Example
    </NuxtLink>
  </div>
</template>

<script setup>
const show = true
</script>
