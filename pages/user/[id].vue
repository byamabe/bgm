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
          class="bg-white rounded-lg p-4 shadow-md"
        >
          <div class="mb-4">
            <label for="level" class="block font-bold"
              >Blood Glucose Level</label
            >
            <input
              type="number"
              id="level"
              v-model="newGlucoseLevel"
              :class="{ invalid: glucoseLevelError }"
              class="w-full border-2 rounded p-2"
            />
            <span v-if="glucoseLevelError" class="text-red-500 mt-2 block"
              >Please enter a valid positive number.</span
            >
          </div>
          <div class="mb-4">
            <label for="dateTime" class="block font-bold">Date & Time</label>
            <input
              type="datetime-local"
              id="time"
              v-model="newTime"
              class="w-full border-2 rounded p-2"
            />
            <span v-if="dateError" class="text-red-500 mt-2 block"
              >Please enter a valid time.</span
            >
          </div>
          <div>
            <UButton
              type="submit"
              class="bg-blue-500 text-white px-4 py-2 rounded"
              >Add Glucose Reading</UButton
            >
          </div>
        </form>

        <!-- Meal form -->
        <form
          v-else-if="formType === 'meal'"
          @submit.prevent="addMeal"
          @input="validateMeal"
          class="bg-white rounded-lg p-4 shadow-md"
        >
          <div class="mb-4">
            <label for="item" class="block font-bold">Meal item</label>
            <input
              type="string"
              id="item"
              v-model="newMeal"
              :class="{ invalid: mealError }"
              class="w-full border-2 rounded p-2"
            />
            <span v-if="mealError" class="text-red-500 mt-2 block"
              >Please enter a valid meal item.</span
            >
          </div>
          <div class="mb-4">
            <label for="description" class="block font-bold"
              >Meal Description</label
            >
            <textarea
              id="description"
              v-model="newDescription"
              class="w-full border-2 rounded p-2"
            ></textarea>
          </div>
          <div class="mb-4">
            <label for="dateTime" class="block font-bold">Date & Time</label>
            <input
              type="datetime-local"
              id="time"
              v-model="newTime"
              class="w-full border-2 rounded p-2"
            />
            <span v-if="dateError" class="text-red-500 mt-2 block"
              >Please enter a valid time.</span
            >
          </div>
          <div>
            <UButton
              type="submit"
              class="bg-blue-500 text-white px-4 py-2 rounded"
              >Add Meal</UButton
            >
          </div>
        </form>

        <!-- Activity form -->
        <form
          v-else-if="formType === 'activity'"
          @submit.prevent="addActivity"
          @input="validateActivity"
          class="bg-white rounded-lg p-4 shadow-md"
        >
          <div class="mb-4">
            <label for="item" class="block font-bold">Activity</label>
            <input
              type="string"
              id="item"
              v-model="newActivity"
              :class="{ invalid: activityError }"
              class="w-full border-2 rounded p-2"
            />
            <span v-if="activityError" class="text-red-500 mt-2 block"
              >Please enter a valid activity.</span
            >
          </div>
          <div class="mb-4">
            <label for="description" class="block font-bold"
              >Activity Description</label
            >
            <textarea
              id="description"
              v-model="newDescription"
              class="w-full border-2 rounded p-2"
            ></textarea>
          </div>
          <div class="mb-4">
            <label for="dateTime" class="block font-bold">Date & Time</label>
            <input
              type="datetime-local"
              id="time"
              v-model="newTime"
              class="w-full border-2 rounded p-2"
            />
            <span v-if="dateError" class="text-red-500 mt-2 block"
              >Please enter a valid time.</span
            >
          </div>
          <div>
            <UButton
              type="submit"
              class="bg-blue-500 text-white px-4 py-2 rounded"
              >Add Activity</UButton
            >
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
        <div></div>
        <UButton
          class="p-3 justify-center"
          label="Open"
          @click="openModal('meal')"
          >Add&nbsp;Meal</UButton
        >
        <div></div>
        <UButton
          class="p-3 justify-center"
          label="Open"
          @click="openModal('activity')"
          >Add&nbsp;Activity</UButton
        >
        <div>
          <h1>Days with Entries:</h1>
          <table>
            <thead>
              <tr>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="day in daysWithEntries" :key="day">
                <router-link
                  :to="`/user/${$route.params.id}/${formatRouteDate(day)}`"
                  :class="{
                    active: $route.params.date === formatRouteDate(day)
                  }"
                  >{{ formatRouteText(day) }}</router-link
                >
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="p-12 bg-white rounded-md w-full">
        <h2 v-if="$route.params.date">Daily Reading</h2>
        <h2 v-else>
          Select a day with entries to see your daily glucose reading
        </h2>
        <NuxtPage :key="pageKey" />
      </div>
    </div>
  </div>
</template>
<style>
.active {
  background-color: yellow; /* Specify the styling you want for the active link */
}
</style>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import "@vuepic/vue-datepicker/dist/main.css";
const route = useRoute();

const daysWithEntries = ref<string[]>([]);
const pageKey = ref(0);

const forcePageRerender = () => {
  pageKey.value += 1;
};
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

const user = useSupabaseUser();
const client = useSupabaseClient();
const isOpen = ref(false);
const userId = route.params.id; // Get the user ID from the route

const formatRouteText = (date) => {
  console.log("formatRouteText", date);
  const dateParts = date.split("/");

  return `${dateParts[0]}/${dateParts[1]}/${dateParts[2]}`;
};

const formatRouteDate = (date) => {
  console.log("formatRouteDate", date);
  const dateParts = date.split("/");

  return `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
};

onMounted(async () => {
  const { data, error } = await client
    .from("glucose")
    .select("*")
    .eq("user", userId)
    .select("time");

  console.log("data", data);
  console.log("error", error);

  const uniqueDatesSet = new Set<string>();
  data?.forEach((entry: { time: string }) => {
    const utcDate = new Date(entry.time);
    console.log("utcDate", utcDate);
    const formattedDate = utcDate.toLocaleDateString().split("T")[0]; // Extract 'yyyy-mm-dd' from ISO string
    console.log("formattedDate", formattedDate);
    uniqueDatesSet.add(formattedDate);
  });

  const sortedDates = Array.from(uniqueDatesSet).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  daysWithEntries.value = sortedDates;
});

let userName = user.value.user_metadata.first_name;
console.log("userdata", user.value);

if (!userName || userName.length == 0) {
  userName = user.value.user_metadata.surname;
}

if (!userName || userName.length == 0) {
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
  formType.value = type;
}

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
        time: utcString
      };
      isOpen.value = false;
      console.log("NEWENTRY", newEntry);

      const { data: savedData, error: saveError } = await client
        .from("glucose")
        .insert([newEntry]);

      if (saveError) {
        console.error("Error saving data:", saveError.message);
      } else {
        // Check if the date of the new entry is not in the daysWithEntries list
        const formattedDate = new Date(newEntry.time)
          .toLocaleDateString()
          .split("T")[0];
        if (!daysWithEntries.value.includes(formattedDate)) {
          daysWithEntries.value = [formattedDate, ...daysWithEntries.value];
        }
        console.log("preCALL FORDX");
        forcePageRerender;
        pageKey.value += 1;
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
      newMeal.value = "";
      newDescription.value = "";
      pageKey.value += 1;
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
      newActivity.value = "";
      newDescription.value = "";
      pageKey.value += 1;
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
