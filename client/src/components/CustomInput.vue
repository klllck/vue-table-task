<template>
  <input :value="modelValue" @input="updateInput" class="input" type="text" />
</template>

<script>
export default {
  props: {
    modelValue: [String, Number],
  },
  methods: {
    updateInput(event) {
      this.$emit("update:modelValue", event.target.value);
    },
  },
};
</script>

<style scoped>
.input {
  width: 90%;
  border: 2px solid #646cff;
  border-radius: 4px;
  padding: 10px 15px;
  margin: 10px 0 20px 0;
  font-size: 1.2rem;
  font-weight: 300;
}
</style>
