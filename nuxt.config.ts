// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@vueuse/nuxt", "@nuxtjs/supabase"],
  devtools: { enabled: true },
  supabase: {
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      exclude: ["/*"]
    }
  },
  build: {
    transpile: ["@vuepic/vue-datepicker"]
  },
  plugins: ["~/plugins/datepicker.js"]
});
