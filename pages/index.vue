<template>
  <h1>Welcome to the dashboard!</h1>
</template>
<script setup>
const user = useSupabaseUser();
const router = useRouter();

watchEffect(async () => {
  if (user.value) {
    await router.push("/user/" + user.value.id);
  }
});
</script>
