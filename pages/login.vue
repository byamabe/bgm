<template>
  <div class="mx-auto max-w-sm">
    <h1 class="text-2xl font-bold mb-4">Log in to your account!</h1>
    <form
      @submit.prevent="login()"
      class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
    >
      <div class="mb-4">
        <label for="email" class="block text-gray-700 text-sm font-bold mb-2"
          >Email</label
        >
        <input
          type="email"
          id="email"
          v-model="credentials.email"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div class="mb-4">
        <label for="password" class="block text-gray-700 text-sm font-bold mb-2"
          >Password</label
        >
        <input
          type="password"
          id="password"
          v-model="credentials.password"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div class="flex items-center justify-between">
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</template>
<script setup>
const credentials = reactive({
  email: "",
  password: ""
});
// pages/login.vue

const client = useSupabaseClient();
const router = useRouter();
const user = useSupabaseUser();

async function login() {
  const { email, password } = credentials;
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (!error) return router.push("/");
  console.log(error);
}

watchEffect(async () => {
  if (user.value) {
    await router.push("/user/" + user.value.id);
  }
});
</script>
