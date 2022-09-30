<template>
  <div class="filters-form">
    <CustomSelect v-model="sortedColumnName" :options="headers" />
    <CustomSelect
      v-model="filterCondition"
      :options="conditions"
      :class="{
        disable: sortedColumnName === '',
      }"
    />
    <CustomInput
      v-model="searchQuery"
      :class="{
        disable: sortedColumnName === '',
      }"
    />
  </div>
  <div v-if="searchQueryResult.length > 0">
    <table class="table">
      <thead>
        <tr>
          <th style="cursor: default">Дата</th>
          <th
            v-for="(header, idx) in headers"
            :key="idx"
            @click="setSortedColumn(header)"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in searchQueryResult" :key="item.id">
          <td>{{ humanizeDate(item.date) }}</td>
          <td>{{ item.title }}</td>
          <td>{{ item.amount }}</td>
          <td>{{ item.distance }}</td>
        </tr>
      </tbody>
    </table>
    <div class="pagination-form">
      <div
        v-if="currentPage > 1"
        @click="currentPage--"
        class="page-item"
        :class="{
          'page-item-current': currentPage === page,
        }"
      >
        {{ "<" }}
      </div>
      <div
        v-for="page in totalPages"
        :key="page"
        class="page-item"
        :class="{
          'page-item-current': currentPage === page,
        }"
        @click="changePage(page)"
      >
        {{ page }}
      </div>
      <div
        v-if="currentPage < totalPages"
        @click="currentPage++"
        class="page-item"
        :class="{
          'page-item-current': currentPage === page,
        }"
      >
        {{ ">" }}
      </div>
    </div>
  </div>
  <h2 v-else>По такому запросу данных не найдено</h2>
</template>

<script>
import axios from "axios";
import moment from "moment";
import CustomInput from "./CustomInput.vue";
import CustomSelect from "./CustomSelect.vue";

export default {
  components: {
    CustomInput,
    CustomSelect,
  },
  data() {
    return {
      headers: {
        title: "Название",
        amount: "Количество",
        distance: "Расстояние",
      },
      conditions: {
        contains: "Содержит",
        equals: "=",
        more: ">",
        less: "<",
      },
      data: [],
      sortDirection: 1,
      sortedColumnName: "",
      filterCondition: "contains",
      searchQuery: "",
      currentPage: 1,
      totalPages: 0,
      itemsOnPage: 5,
    };
  },
  methods: {
    changePage(page) {
      this.currentPage = page;
      this.fetchData();
    },
    async fetchData() {
      try {
        const response = await axios.get("http://localhost:5000/api/main", {
          params: {
            page: this.currentPage,
            limit: this.itemsOnPage,
          },
        });
        this.totalPages = Math.ceil(response.data.rowsCount / this.itemsOnPage);
        this.data = response.data.rows;
      } catch (error) {
        console.log(error);
      }
    },
    humanizeDate(date) {
      return moment(date).format("hh:mm:ss, Do MMM YYYY");
    },
    setSortedColumn(columnName) {
      this.sortedColumnName = Object.keys(this.headers).find(
        (key) => this.headers[key] === columnName
      );
      this.sortDirection *= -1;
    },
    sortTableByColumn(columnName, direction) {
      switch (columnName) {
        case "title": {
          return direction === 1
            ? (a, b) => b[columnName].localeCompare(a[columnName])
            : (a, b) => a[columnName].localeCompare(b[columnName]);
        }
        case "amount": {
          return direction === 1
            ? (a, b) => b[columnName] - a[columnName]
            : (a, b) => a[columnName] - b[columnName];
        }
        case "distance": {
          return direction === 1
            ? (a, b) => b[columnName] - a[columnName]
            : (a, b) => a[columnName] - b[columnName];
        }
        default:
          break;
      }
    },
    filterTableByCondition(columnName, condition) {
      switch (condition) {
        case "contains":
          return (item) =>
            item[columnName].toString().toLowerCase().includes(this.searchQuery);
        case "equals":
          return (item) => item[columnName] == this.searchQuery;
        case "more":
          return (item) => item[columnName] > this.searchQuery;
        case "less":
          return (item) => item[columnName] < this.searchQuery;
        default:
          break;
      }
    },
  },
  computed: {
    sortedColumns() {
      if (this.sortedColumnName === "") return this.data;
      return this.data.sort(
        this.sortTableByColumn(this.sortedColumnName, this.sortDirection)
      );
    },
    searchQueryResult() {
      if (this.sortedColumnName === "") return this.data;
      return this.sortedColumns.filter(
        this.filterTableByCondition(this.sortedColumnName, this.filterCondition)
      );
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
.filters-form {
  display: flex;
  justify-content: center;
  align-items: center;
}

.table {
  width: 100%;
  max-width: 100%;
  border-collapse: collapse;
}

.table tr {
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.table tr:hover {
  background-color: #f5f5f5;
  transition: background-color 0.2s;
}

.table td {
  padding: 1.2rem;
}

.table th {
  background-color: #fafafa;
  padding: 1.2rem;
  border-bottom: 2px solid #646cffaa;
  cursor: pointer;
}

h2 {
  color: red;
  text-align: center;
}

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

.disable {
  pointer-events: none;
  border: 2px solid #8d8989;
  background-color: #ccc9c9;
}
</style>
