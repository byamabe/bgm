<template>
  <div>data</div>
</template>
<script setup>
definePageMeta({
  middleware: "auth"
});
// const course = useGlucose();
// const route = useRoute();

// definePageMeta({
//   middleware: function ({ params }, from) {
//     const course = useGlucose();

//     const chapter = course.chapters.find(
//       (chapter) => chapter.slug === params.chapterSlug
//     );
//     if (!chapter) {
//       throw abortNavigation(
//         createError({
//           statusCode: 404,
//           message: "Chapter not found"
//         })
//       );
//     }

//     const lesson = chapter.lessons.find(
//       (lesson) => lesson.slug === params.lessonSlug
//     );

//     if (!lesson) {
//       throw abortNavigation(
//         createError({
//           statusCode: 404,
//           message: "Lesson not found"
//         })
//       );
//     }
//   }
// });
</script>
