<script setup lang="ts">

const tasks = ref([
    { id: 1, title: 'Nuxtを触る', done: false },
    { id: 2, title: 'タスクアプリ作る', done: false },
    { id: 3, title: '復職に備える', done: false }
]);

const toggle = (task: any) => {
    task.done = !task.done
}
</script>

<template>
    <div>
        <h1>タスク一覧</h1>
        <ul>
            <li v-for="task in tasks" :key="task.id">
                <input type="checkbox" :checked="task.done" @change="toggle(task)" />
                <span :style="{ textDecoration: task.done ? 'line-through' : 'none' }">
                    {{ task.title }}
                </span>
            </li>
        </ul>
    </div>
</template>
