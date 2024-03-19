<template>
  <div
    class="p-12 bg-gray-100 w-full h-full min-h-screen flex flex-col items-center"
  >
    <UModal v-model="isOpen">
      <div class="p-4">
        <!-- Glucose form -->
        <form
          v-if="formType === 'glucose'"
          @submit.prevent="addGlucoseReading"
          @input="validateGlucoseLevel"
        >
          <div>
            <label for="level">Blood Glucose Level</label>
            <input
              type="number"
              id="level"
              v-model="newGlucoseLevel"
              :class="{ invalid: glucoseLevelError }"
            />
            <span v-if="glucoseLevelError" class="error-message"
              >Please enter a valid positive number.</span
            >
          </div>
          <div>
            <label for="dateTime">Date &amp; Time</label>
            <input type="datetime-local" id="time" v-model="newTime" />
            <span v-if="dateError" class="error-message"
              >Please enter a valid time.</span
            >
          </div>
          <div>
            <UButton type="submit">Add Glucose Reading</UButton>
          </div>
        </form>

        <!-- Meal form -->
        <form
          v-else-if="formType === 'meal'"
          @submit.prevent="addMeal"
          @input="validateMeal"
        >
          <div>
            <label for="item">Meal item</label>
            <input
              type="string"
              id="item"
              v-model="newMeal"
              :class="{ invalid: mealError }"
            />
            <span v-if="mealError" class="error-message"
              >Please enter a valid meal item.</span
            >
          </div>
          <div>
            <label for="description" class="align-top">Meal Description</label>
            <textarea id="description" v-model="newDescription" />
          </div>
          <div>
            <label for="dateTime">Date &amp; Time</label>
            <input type="datetime-local" id="time" v-model="newTime" />
            <span v-if="dateError" class="error-message"
              >Please enter a valid time.</span
            >
          </div>
          <div>
            <UButton type="submit">Add Meal</UButton>
          </div>
        </form>

        <!-- Activity form -->
        <form
          v-else-if="formType === 'activity'"
          @submit.prevent="addActivity"
          @input="validateActivity"
        >
          <div>
            <label for="item">Activity</label>
            <input
              type="string"
              id="item"
              v-model="newActivity"
              :class="{ invalid: activityError }"
            />
            <span v-if="activityError" class="error-message"
              >Please enter a valid activity.</span
            >
          </div>
          <div>
            <label for="description" class="align-top"
              >Activity Description</label
            >
            <textarea id="description" v-model="newDescription" />
          </div>
          <div>
            <label for="dateTime">Date &amp; Time</label>
            <input type="datetime-local" id="time" v-model="newTime" />
            <span v-if="dateError" class="error-message"
              >Please enter a valid time.</span
            >
          </div>
          <div>
            <UButton type="submit">Add Activity</UButton>
          </div>
        </form>
      </div>
    </UModal>
    <div class="prose mb-12">
      <h1>
        <span class="font-medium font-bold"
          >{{ userName }}'s Blood Glucose Level</span
        >
      </h1>
    </div>

    <div class="flex flex-row justify-center flex-grow w-full">
      <div class="mr-4 p-8 bg-white rounded-md w-[30ch] flex flex-col">
        <UButton
          class="p-3 justify-center"
          label="Open"
          @click="openModal('glucose')"
          >Add&nbsp;Glucose&nbsp;Reading</UButton
        >
        <div @click="toggleTable" style="cursor: pointer">
          <h3>
            Readings <span>{{ showTable ? "▼" : "►" }}</span>
          </h3>
        </div>

        <div v-if="showTable">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Glucose Level</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in glucoseData" :key="item.id">
                <td>{{ formatTime(item.time) }}</td>
                <td>{{ item.level }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <UButton
          class="p-3 justify-center"
          label="Open"
          @click="openModal('meal')"
          >Add&nbsp;Meal</UButton
        >
        <div @click="toggleMealTable" style="cursor: pointer">
          <h3>
            Meals <span>{{ showMealTable ? "▼" : "►" }}</span>
          </h3>
        </div>

        <div v-if="showMealTable">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Meal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in mealData" :key="item.id">
                <td>{{ formatTime(item.time) }}</td>
                <td>{{ item.item }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <UButton
          class="p-3 justify-center"
          label="Open"
          @click="openModal('activity')"
          >Add&nbsp;Activity</UButton
        >
        <div @click="toggleActivityTable" style="cursor: pointer">
          <h3>
            Activities <span>{{ showTable ? "▼" : "►" }}</span>
          </h3>
        </div>

        <div v-if="showActivityTable">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Activity</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in activityData" :key="item.id">
                <td>{{ formatTime(item.time) }}</td>
                <td>{{ item.activity }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- All the lessons for the course listed here -->
      </div>

      <div class="p-12 bg-white rounded-md w-full">
        <h2>Daily Reading</h2>
        <p>This is a reading</p>
        <NuxtPage />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const formType = ref("");
const newGlucoseLevel = ref("");
const newMeal = ref("");
const newActivity = ref("");
const newDescription = ref("");
const newTime = ref(new Date().toISOString()); // Default to current time without seconds
const glucoseLevelError = ref(false);
const mealError = ref(false);
const activityError = ref(false);
const dateError = ref(false);
const showTable = ref(false);
const showMealTable = ref(false);
const showActivityTable = ref(false);

// const entry = reactive({
//   level: "",
//   dateTime: ""
// });

const user = useSupabaseUser();
const client = useSupabaseClient();
const isOpen = ref(false);
const query = ref("");

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
};

const { data: glucoseData, error } = useAsyncData("glucose", async () => {
  console.log("here????", user.value.id);
  const { data, error } = await client
    .from("glucose")
    .select("*")
    .eq("user", user.value.id)
    .order("time", { ascending: false }); // Sort by 'time' field in ascending order;
  console.log("UHHHH????");

  if (error) {
    throw new Error("Error fetching data: " + error.message);
  }
  console.log("THEERE????", data);

  return data;
});

const { data: mealData } = useAsyncData("meal", async () => {
  const { data, error } = await client
    .from("meal")
    .select("*")
    .eq("user", user.value.id)
    .order("time", { ascending: false }); // Sort by 'time' field in ascending order;

  // if (mealError) {
  //   throw new Error("Error fetching data: " + mealError.message);
  // }

  return data;
});

const { data: activityData } = useAsyncData("activity", async () => {
  const { data, error } = await client
    .from("activity")
    .select("*")
    .eq("user", user.value.id)
    .order("time", { ascending: false }); // Sort by 'time' field in ascending order;

  // if (mealError) {
  //   throw new Error("Error fetching data: " + mealError.message);
  // }

  return data;
});

console.log("user", user.value.id);
let userName = user.value.user_metadata.first_name;
console.log("username", userName);
if (!userName || userName.length() == 0) {
  userName = user.value.email.split("@")[0];
}
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function openModal(type: string) {
  isOpen.value = true;
  const theTime: Date = new Date(); // Your date object
  const formattedDateTime: string = formatDate(theTime);
  newTime.value = formattedDateTime;
  console.log("newTime.value", newTime.value);
  formType.value = type;
}

// async function submit() {
//   isOpen.value = false;
//   const { level, dateTime } = entry;
//   console.log("level", level);
//   console.log("dateTime", dateTime);
//   // const { error } = await client.auth.signInWithPassword({ email, password });
//   // if (!error) return router.push("/");
//   // console.log(error);
// }

const toggleTable = () => {
  showTable.value = !showTable.value;
};

const toggleMealTable = () => {
  showMealTable.value = !showMealTable.value;
};

const toggleActivityTable = () => {
  showActivityTable.value = !showActivityTable.value;
};

definePageMeta({
  middleware: "auth"
});

const addGlucoseReading = async () => {
  if (newGlucoseLevel.value !== "") {
    const glucoseValue = parseFloat(newGlucoseLevel.value);
    console.log("newTime.value", newTime.value);
    const utcString = new Date(newTime.value)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    if (!isNaN(glucoseValue) && glucoseValue > 0) {
      const newEntry = {
        user: user.value.id,
        level: newGlucoseLevel.value,
        time: utcString + "Z"
      };
      isOpen.value = false;

      const { data: savedData, error: saveError } = await client
        .from("glucose")
        .insert([newEntry]);

      if (saveError) {
        console.error("Error saving data:", saveError.message);
      } else {
        let index = glucoseData.value.findIndex(
          (item) => new Date(item.time) < new Date(newEntry.time)
        );
        if (index === -1) index = glucoseData.value.length;
        glucoseData.value.splice(index, 0, newEntry);
        newGlucoseLevel.value = "";
      }
    }
  } else {
    console.error(
      "Invalid glucose level. Please enter a valid positive number."
    );
  }
};

const addMeal = async () => {
  if (newMeal.value !== "") {
    console.log("newTime.value", newTime.value);

    // Convert the PST time to UTC
    const utcString = new Date(newTime.value)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const newEntry = {
      user: user.value.id,
      item: newMeal.value,
      description: newDescription.value,
      time: utcString + "Z"
    };
    isOpen.value = false;

    const { data: savedData, error: saveError } = await client
      .from("meal")
      .insert([newEntry]);

    if (saveError) {
      console.error("Error saving data:", saveError.message);
    } else {
      let index = mealData.value.findIndex(
        (item) => new Date(item.time) < new Date(newEntry.time)
      );
      if (index === -1) index = mealData.value.length;
      mealData.value.splice(index, 0, newEntry);
      newMeal.value = "";
      newDescription.value = "";
    }
  } else {
    console.error("Invalid meal. Please enter a valid meal.");
  }
};

const addActivity = async () => {
  if (newActivity.value !== "") {
    const utcString = new Date(newTime.value)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const newEntry = {
      user: user.value.id,
      activity: newActivity.value,
      description: newDescription.value,
      time: utcString + "Z"
    };
    isOpen.value = false;

    const { data: savedData, error: saveError } = await client
      .from("activity")
      .insert([newEntry]);

    if (saveError) {
      console.error("Error saving data:", saveError.message);
    } else {
      let index = activityData.value.findIndex(
        (item) => new Date(item.time) < new Date(newEntry.time)
      );
      if (index === -1) index = activityData.value.length;
      activityData.value.splice(index, 0, newEntry);
      newActivity.value = "";
      newDescription.value = "";
    }
  } else {
    console.error("Invalid activity. Please enter a valid activity.");
  }
};

const validateGlucoseLevel = () => {
  const glucoseValue = parseFloat(newGlucoseLevel.value);
  glucoseLevelError.value = isNaN(glucoseValue) || glucoseValue <= 0;
  dateError.value = !newTime;
};

const validateMeal = () => {
  const meal = newMeal.value;
  mealError.value = !meal || meal.length === 0;
  dateError.value = !newTime;
};

const validateActivity = () => {
  const activity = newActivity.value;
  activityError.value = !activity || activity.length === 0;
  dateError.value = !newTime;
};
</script>
