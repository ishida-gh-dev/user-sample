<script setup lang="ts">

const name = ref("");
const age = ref(0);
const updateName = ref<Record<number, string>>({});
const updateAge = ref<Record<number, number>>({});

const {
    users,
    loading,
    errorMessage,
    fieldErrors,
    successMessage,
    deletingId,
    updatingId,
    addUser,
    deleteUser,
    updateUser
} = useUsers()

watchEffect(() => {
    users.value.forEach((user) => {
        if (!(user.id in updateName.value)) {
            updateName.value[user.id] = user.name;
        }
        if (!(user.id in updateAge.value)) {
            updateAge.value[user.id] = user.age;
        }
    });
});

</script>

<template>
    <div>
        <h1>ユーザ一覧</h1>

        <p v-if="errorMessage" style="color: red">
            {{ errorMessage }}
        </p>
        <p v-if="successMessage" style="color: green">
            {{ successMessage }}
        </p>
        <ul>
            <li v-for="user in users" :key="user.id">
                <NuxtLink :to="`/users/${user.id}`">
                    {{ user.name }}
                </NuxtLink>
                {{ user.age }}
                <button @click="deleteUser(user.id)" :disabled="user.id === deletingId"
                    style="margin-left: 8px;">&nbsp;{{
                        user.id === deletingId ? "削除中…" :
                            "削除" }}</button>
                <form>
                    <input type="text" v-model="updateName[user.id]">
                    <input type="text" v-model="updateAge[user.id]">
                    <button @click.prevent="updateUser(user.id, updateName[user.id], updateAge[user.id])"
                        :disabled="user.id === updatingId" style="margin-left: 8px;">&nbsp;{{ user.id === updatingId ?
                            "更新中…" : "更新" }}</button>
                </form>
            </li>
        </ul>
        <form @submit.prevent="addUser(name, age)">
            <table>
                <tbody>
                    <tr>
                        <td>名前</td>
                        <td><input type="text" id="addName" v-model="name"></td>
                        <div v-if="fieldErrors.name" style="color:red">
                            {{ fieldErrors.name[0] }}
                        </div>
                    </tr>
                    <tr>
                        <td>年齢</td>
                        <td><input type="text" id="addAge" v-model="age"></td>
                        <div v-if="fieldErrors.age" style="color:red">
                            {{ fieldErrors.age[0] }}
                        </div>
                    </tr>
                </tbody>
            </table>
            <br />
            <button type="submit" :disabled="loading">{{ loading ? "登録中…" : "登録" }}</button>
        </form>
    </div>
</template>
