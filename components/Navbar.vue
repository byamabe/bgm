<template>
  <div class="flex justify-between items-center bg-gray-800 p-4">
    <div class="ml-auto">
      <button
        v-if="user"
        @click="logOut()"
        class="text-white hover:text-gray-300"
      >
        Log Out
      </button>
    </div>
    <div class="flex flex-row-reverse">
      <div>
        <nuxt-link
          v-if="!user"
          to="/login"
          class="text-white hover:text-gray-300"
          >Login</nuxt-link
        >
      </div>
      <div>
        <nuxt-link
          v-if="!user"
          to="/register"
          class="text-white hover:text-gray-300"
          >Register</nuxt-link
        >
      </div>
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
