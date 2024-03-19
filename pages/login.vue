<template>
  <div>
    <h1>Log in to your account!</h1>
    <form @submit.prevent="login()">
      <div>
        <label for="email">Email</label>
        <input type="email" id="email" v-model="credentials.email" />
      </div>
      <div>
        <label for="password">Password</label>
        <input type="password" id="password" v-model="credentials.password" />
      </div>
      <div>
        <button type="submit">Submit</button>
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
