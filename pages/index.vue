<template>
  <h1 class="text-4xl font-bold text-center mb-8">
    Welcome to the GlucoVision!
  </h1>
  <p class="text-xl text-gray-700 text-center mb-4">
    Take Control of Your Health: Track Your Blood Sugar & Understand Your Body
  </p>
  <p class="text-base text-gray-600 mb-8">
    Feeling lost in a sea of finger pricks and confusing results? You're not
    alone. But what if there was a way to simplify blood sugar tracking and gain
    real insights into how your body reacts to food and activity? Introducing
    GlucoVision, the revolutionary web app that puts you in charge of your
    health.
  </p>
  <ul class="list-disc pl-4 space-y-2">
    <li class="text-gray-700">
      Effortless Tracking: Log your blood glucose readings with ease, all in one
      place.
    </li>
    <li class="text-gray-700">
      Meal & Activity Insights: Discover how what you eat and how you move
      affect your sugar levels.
    </li>
    <li class="text-gray-700">
      Visual Trends: See clear patterns emerge with beautiful and intuitive data
      visualizations.
    </li>
    <li class="text-gray-700">
      Empowered Decisions: Make informed choices about your diet and lifestyle
      with actionable insights.
    </li>
  </ul>
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
