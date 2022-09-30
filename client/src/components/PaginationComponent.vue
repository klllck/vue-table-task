<template>
  <div class="pagination-form">
    <div
      v-for="page in totalPages"
      :key="page"
      class="page-item"
      :class="{
        'page-item-current': currentPage === page,
      }"
      @click.prevent="changePage(page)"
    >
      {{ page }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: [String, Number],
    totalPages: Number,
  },
  data() {
    return {
      currentPage: 1,
      itemsOnPage: 10,
    };
  },
  methods: {
    changePage(page) {
      this.currentPage = page;
      this.$emit("changePage", {
        page: this.currentPage,
        limit: this.itemsOnPage,
      });
    },
  },
};
</script>

<style scoped>
.pagination-form {
  display: flex;
  margin-top: 1.5rem;
  align-content: center;
  justify-content: center;
}

.page-item {
  border: 2px solid #646cffaa;
  padding: 0.8rem;
  font-size: 1.2rem;
  cursor: pointer;
}

.page-item:first-child {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}

.page-item:last-child {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}

.page-item-current {
  background-color: #7f78ebaa;
  color: #fff;
}
</style>
