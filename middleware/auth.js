// middleware/auth.js
export default defineNuxtRouteMiddleware((to, _from) => {
  const user = useSupabaseUser();
  console.log("user", user.value);

  console.log("to", to);

  if (!user.value) {
    if (to.href === "/") return navigateTo(to);
    return navigateTo("/login");
  }
});
