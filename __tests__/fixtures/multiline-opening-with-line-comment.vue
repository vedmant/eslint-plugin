<!-- Intentional: multiline opening tag with // inside :class; autofix must use /* */ so one line stays valid. Checked by vue-start-tag-line-comment.test.cjs -->
<template>
  <div class="p-4">
    <div
      class="w-full"
      :class="{
        'foo': true,
        // 'bar': false,
      }"
    >
      x
    </div>
  </div>
</template>

<script setup>
</script>
