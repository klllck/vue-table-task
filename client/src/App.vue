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
  </div>
  <h2 v-else>По такому запросу данных не найдено</h2>
  <PaginationComponent :totalPages="totalPages" @changePage="changePage" />
</template>

<script>
import CustomInput from "./components/CustomInput.vue";
import CustomSelect from "./components/CustomSelect.vue";
import PaginationComponent from "./components/PaginationComponent.vue";
import axios from "axios";
import moment from "moment";

export default {
  components: {
    CustomInput,
    CustomSelect,
    PaginationComponent,
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
      totalPages: 0,
    };
  },
  methods: {
    changePage(event) {
      const page = event["page"];
      const limit = event["limit"];
      this.fetchData(page, limit);
    },
    async fetchData(page, limit) {
      try {
        const response = await axios.get("http://localhost:5000/api/main", {
          params: {
            _page: page,
            _limit: limit,
          },
        });
        this.totalPages = Math.ceil(response.data.rowsCount / response.data.itemsOnPage);
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

.disable {
  pointer-events: none;
  border: 2px solid #8d8989;
  background-color: #ccc9c9;
}
</style>
