<script setup lang="ts">

const route = useRoute();
const { data: user, error } = await useAsyncData<User>(
    `user-${route.params.id}`,
    () => $fetch<User>(`/api/users/${route.params.id}`)
);

if (error.value) {
    throw createError({
        statusCode: error.value.status,
        statusText: error.value.statusText
    })
}

</script>

<template>
    <div>
        <h1>ユーザ詳細</h1>

        <p>id: {{ user?.id }}</p>
        <p>name: {{ user?.name }}</p>
    </div>
</template>
