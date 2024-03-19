<template>
  <div>
    <div>
      <button v-if="user" @click="logOut()">Log Out</button>
    </div>
    <div>
      <nuxt-link v-if="!user" to="/login">Login</nuxt-link>
    </div>
    <div>
      <nuxt-link v-if="!user" to="/register">Register</nuxt-link>
    </div>
  </div>
</template>

<script setup>
const client = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();

async function logOut() {
  const { error } = await client.auth.signOut();
  console.log("error", error);
  if (error) return;
  await router.push("/login");
}
</script>
<style scoped>
nav {
  display: flex;
  justify-content: flex-end;
}
</style>
