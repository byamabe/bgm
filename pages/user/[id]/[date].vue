<template>
  <div class="grid grid-cols-1 sm:grid-cols-1 gap-4">
    <line-chart
      v-if="chartData"
      :data="chartData"
      :options="chartOptions"
    ></line-chart>
    <div class="bg-gray-200 p-4">Chart Placeholder</div>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <h1 class="text-lg font-bold text-gray-800 mb-4">
          Glucose Entries for {{ $route.params.date }}
        </h1>
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Level</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in dailyGlucoseData" :key="entry.id">
              <td>{{ new Date(entry.time).toLocaleTimeString() }}</td>
              <td>{{ entry.level }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h1 class="text-lg font-bold text-gray-800 mb-4">
          Meal Entries for {{ $route.params.date }}
        </h1>
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Item</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in dailyMealData" :key="entry.id">
              <td>{{ new Date(entry.time).toLocaleTimeString() }}</td>
              <td>{{ entry.item }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <h1 class="text-lg font-bold text-gray-800 mb-4">
          Activity Entries for {{ $route.params.date }}
        </h1>
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Activity</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in dailyActivityData" :key="entry.id">
              <td>{{ new Date(entry.time).toLocaleTimeString() }}</td>
              <td>{{ entry.activity }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script setup>
definePageMeta({
  middleware: "auth"
});

import LineChart from "../../../components/LineChart.vue"; // Import the LineChart component
import { ref } from "vue";
const client = useSupabaseClient();
const route = useRoute();
const chartData = ref(null);
onUpdated(async () => {
  console.log("on updated", route.params.date);
  const dateParts = route.params.date.split("-"); // Split the date string into parts
  const formattedDate = `${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`; // Reformat the date string to yyyy-mm-dd
  const utcString = new Date(formattedDate)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  const utcString2 = new Date(
    new Date(formattedDate).getTime() + 24 * 60 * 60 * 1000
  )
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  const { data: newDailyGlucoseData, error } = await client
    .from("glucose")
    .select("*")
    .eq("user", userId)
    .gte("time", utcString)
    .lt("time", utcString2)
    .order("time", { ascending: false });

  if (error) {
    throw new Error("Error fetching data: " + error.message);
  }

  let data = newDailyGlucoseData.map((item) => ({
    x: item.time,
    y: item.level
  }));
  data = data.reverse();

  chartData.value = {
    datasets: [
      {
        label: "Glucose Level",
        data: data,
        borderColor: "rgb(75, 192, 192)"
      }
    ]
  };
});

const chartOptions = {
  type: "line",
  scales: {
    x: {
      ticks: {
        source: "data"
      },
      time: {
        unit: "minute"
      }
    }
  }
};

const utcString = new Date(formattedDate)
  .toISOString()
  .slice(0, 19)
  .replace("T", " ");
const utcString2 = new Date(
  new Date(formattedDate).getTime() + 24 * 60 * 60 * 1000
)
  .toISOString()
  .slice(0, 19)
  .replace("T", " ");

onMounted(() => {
  let data = dailyGlucoseData.value.map((item) => ({
    x: item.time,
    y: item.level
  }));
  data = data.reverse();
  console.log("data", data);
  chartData.value = {
    //labels: data.map((item) => item.x),
    datasets: [
      {
        label: "Glucose Level",
        data: data,
        borderColor: "rgb(75, 192, 192)"
      }
    ]
  };
});

const dateParts = route.params.date.split("-"); // Split the date string into parts
const formattedDate = `${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`; // Reformat the date string to yyyy-mm-dd
const userId = route.params.id; // Get the user ID from the route
console.log(
  "new Date(formattedDate).toISOString(",
  new Date(formattedDate).toISOString()
);

const getUTCDateString = (inputDate) => {
  const dateObj = new Date(inputDate);
  return new Date(
    Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate())
  ).toISOString();
};

console.log("getUTCDateString(formattedDate)", getUTCDateString(formattedDate));

const fetchData = async (dataType) => {
  const { data, error } = await client
    .from(dataType)
    .select("*")
    .eq("user", userId)
    .gte("time", utcString)
    .lt("time", utcString2)
    .order("time", { ascending: false });

  if (error) {
    throw new Error("Error fetching data: " + error.message);
  }

  return data;
};

var currentTimestamp = new Date().toISOString();

const { data: dailyGlucoseData, error } = useAsyncData(
  "glucoseDaily",
  async () => {
    return fetchData("glucose");
  }
);

const { data: dailyMealData, error2 } = useAsyncData("mealDaily", async () => {
  return fetchData("meal");
});

const { data: dailyActivityData, error3 } = useAsyncData(
  "activityDaily",
  async () => {
    return fetchData("activity");
  }
);
</script>
