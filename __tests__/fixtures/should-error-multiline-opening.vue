<!-- Intentional violation: opening tag should be one line (≤5 attrs, &lt;300 chars). Checked via scripts/verify-vue-start-tag-rule.cjs -->
<template>
  <div class="p-4">
    <NuxtLink
      v-if="show"
      to="/example"
      class="text-gray-900 hover:text-primary-600 hover:underline"
    >
      Example
    </NuxtLink>
  </div>
</template>

<script setup>
const show = true
</script>
