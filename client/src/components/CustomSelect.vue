<template>
  <select v-model="modelValue" @change="changeOption" class="select">
    <option disabled>Выберите опцию</option>
    <option v-for="option in options" :value="option" class="option">
      {{ option }}
    </option>
  </select>
</template>

<script>
export default {
  props: {
    modelValue: [String, Number],
    options: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    changeOption(event) {
      this.$emit(
        "update:modelValue",
        Object.keys(this.options).find((key) => this.options[key] === event.target.value)
      );
    },
  },
};
</script>

<style scoped>
.select {
  width: 30%;
  border: 2px solid #646cff;
  border-radius: 4px;
  padding: 10px 2px;
  margin: 10px 8px 20px 0;
  font-size: 1.1rem;
  font-weight: 300;
}

option {
  background-color: #efefef;
}

.option {
  padding: 1.2rem;
  background: #fff;
}
</style>
