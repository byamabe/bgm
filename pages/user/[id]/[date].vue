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

const userId = route.params.id; // Get the user ID from the route

const formatDate = (dateString) => {
  const dateParts = dateString.split("-");
  return `${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`;
};

const getUTCStrings = (dateString) => {
  const formattedDate = formatDate(dateString);
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

  return { utcString, utcString2 };
};

function mergeArrays(glucose, meals) {
  const merged = [...glucose, ...meals]; // Combine the two arrays

  // Sort the merged array in ascending order based on the x values
  merged.sort((a, b) => {
    return new Date("1970/01/01 " + a.x) - new Date("1970/01/01 " + b.x);
  });

  let lastGlucose = null; // Track the last known glucose value

  for (let i = 0; i < merged.length; i++) {
    if (meals.some((m) => m.x === merged[i].x) && i > 0) {
      const prevGlucose = glucose.find((g) => g.x === merged[i - 1].x);
      let nextGlucose = glucose.find((g) => g.x === merged[i + 1]?.x); // Use optional chaining

      if (!nextGlucose && lastGlucose) {
        nextGlucose = { x: lastGlucose.x, y: lastGlucose.y };
      }

      merged[i].y =
        (prevGlucose.y + (nextGlucose ? nextGlucose.y : prevGlucose.y)) / 2;

      // Update lastGlucose to the current glucose value
      lastGlucose = nextGlucose;
    } else {
      lastGlucose = glucose.find((g) => g.x === merged[i].x);
    }
  }

  return merged;
}

// onUpdated(async () => {
//   console.log("onUpdated 1");
//   const { utcString, utcString2 } = getUTCStrings(route.params.date);

//   const { data: newDailyGlucoseData, error } = await client
//     .from("glucose")
//     .select("*")
//     .eq("user", userId)
//     .gte("time", utcString)
//     .lt("time", utcString2)
//     .order("time", { ascending: false });

//   if (error) {
//     console.log("onUpdate error 1", error.message);
//     throw new Error("Error fetching data: " + error.message);
//   }

//   let data = newDailyGlucoseData.map((item) => ({
//     x: new Date(item.time).toLocaleTimeString(),
//     y: item.level
//   }));
//   data = data.reverse();
//   let meal = dailyMealData.value.map((item) => ({
//     x: new Date(item.time).toLocaleTimeString(),
//     y: 33,
//     r: 10
//   }));
//   meal = meal.reverse();
//   console.log("glucose", data);
//   console.log("data", meal);

//   const mergedArray = mergeArrays(data, meal);

//   chartData.value = {
//     datasets: [
//       {
//         type: "line",
//         label: "Glucose Level",
//         data: mergedArray,
//         borderColor: "rgb(75, 192, 192)"
//       },
//       {
//         type: "bubble",
//         label: "Meals",
//         data: meal,
//         borderColor: "rgb(255, 0, 0)",
//         backgroundColor: "rgb(255, 99, 132)",
//         options: {
//           elements: {
//             point: {
//               pointStyle: "triangle",
//               radius: 10
//             }
//           }
//         }
//       }
//     ]
//   };
// });

const chartOptions = {
  type: "line",
  scales: {
    x: {
      min: "00:00:00",
      ticks: {
        source: "data"
      }
    }
  }
};

const { utcString, utcString2 } = getUTCStrings(route.params.date);

onMounted(() => {
  console.log("onMounted");
  console.log("dailyGlucoseData", dailyGlucoseData);
  console.log("dailyMealData", dailyMealData);
  let glucose = dailyGlucoseData.value.map((item) => ({
    x: new Date(item.time).toLocaleTimeString(),
    y: item.level
  }));
  glucose = glucose.reverse();
  let meal = dailyMealData.value.map((item) => ({
    x: new Date(item.time).toLocaleTimeString(),
    y: item.item,
    r: 10
  }));
  meal = meal.reverse();
  console.log("glucose", glucose);
  console.log("meal", meal);

  const mergedArray = mergeArrays(glucose, meal);
  chartData.value = {
    //labels: data.map((item) => item.x),
    datasets: [
      {
        label: "Glucose Level",
        data: mergedArray,
        borderColor: "rgb(75, 192, 192)"
      },
      {
        type: "bubble",
        label: "Meals",
        data: meal,
        borderColor: "rgb(255, 0, 0)",
        backgroundColor: "rgb(255, 99, 132)",
        options: {
          elements: {
            point: {
              pointStyle: "triangle",
              radius: 10
            }
          }
        }
      }
    ]
  };
});

const dateParts = route.params.date.split("-"); // Split the date string into parts
const formattedDate = `${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`; // Reformat the date string to yyyy-mm-dd
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
