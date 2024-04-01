<template>
  <div class="mx-auto max-w-sm">
    <h1 class="text-2xl font-bold mb-4">Create an account!</h1>
    <form
      @submit.prevent="register()"
      class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
    >
      <div class="mb-4">
        <label
          for="first-name"
          class="block text-gray-700 text-sm font-bold mb-2"
          >First Name</label
        >
        <input
          type="text"
          id="first-name"
          v-model="credentials.firstname"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div class="mb-4">
        <label for="surname" class="block text-gray-700 text-sm font-bold mb-2"
          >Surname</label
        >
        <input
          type="text"
          id="surname"
          v-model="credentials.surname"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
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
      <div class="mb-4">
        <label for="password" class="block text-gray-700 text-sm font-bold mb-2"
          >Repeat Password</label
        >
        <input
          type="password"
          id="repeat-password"
          v-model="credentials.passwordRepeat"
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
  firstName: "",
  surname: "",
  email: "",
  password: "",
  passwordRepeat: ""
});
// pages/register.vue

const client = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();

async function register() {
  const { firstName, surname, email, password, passwordRepeat } = credentials;
  if (password !== passwordRepeat) return;
  const { error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        surname,
        email
      },
      emailRedirectTo: "http://localhost:3000/login"
    }
  });
  if (error) {
    alert("Something went wrong !");
    return;
  }
  alert("Open the email we sent you to verify your account!");
}

watchEffect(async () => {
  if (user.value) {
    await router.push("/");
  }
});
</script>
