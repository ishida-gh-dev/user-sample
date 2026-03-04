import type { ApiResponse } from "~/types/api";

export const useUsers = () => {
  const { data: users } = useAsyncData<User[]>(
    "users",
    () => $fetch<User[]>("/api/users"),
    { default: () => [] },
  );

  const errorMessage = ref("");
  const loading = ref(false);
  const successMessage = ref("");
  const deletingId = ref<number | null>(null);
  const updatingId = ref<number | null>(null);
  const fieldErrors = ref<Record<string, string[]>>({});

  const addUser = async (name: string, age: number) => {
    errorMessage.value = "";
    successMessage.value = "";
    loading.value = true;
    fieldErrors.value = {};
    try {
      const newUser = await $fetch<ApiResponse<User>>("/api/users", {
        method: "POST",
        body: { name, age },
      });
      if (!newUser.data) {
        throw new Error("登録失敗");
      }
      showSuccess("登録しました！");
      users.value.push(newUser.data);
      fieldErrors.value = {};
    } catch (error: any) {
      if (error?.data?.data?.fieldErrors) {
        fieldErrors.value = error.data.data.fieldErrors;
      } else {
        errorMessage.value =
          error?.data?.statusMessage || "エラーが発生しました";
      }
    } finally {
      loading.value = false;
      deletingId.value = null;
    }
  };
  const deleteUser = async (id: number) => {
    errorMessage.value = "";
    successMessage.value = "";
    deletingId.value = id;

    try {
      await $fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      showSuccess("削除しました！");
      const index = users.value.findIndex((u) => u.id === id);
      if (index !== -1) {
        users.value.splice(index, 1);
      }
    } catch (error: any) {
      errorMessage.value = error?.data?.statusMessage || "エラーが発生しました";
    } finally {
      deletingId.value = null;
    }
  };
  const updateUser = async (id: number, name: string, age: number) => {
    updatingId.value = id;

    try {
      const updatedUser = await $fetch<ApiResponse<User>>(`/api/users/${id}`, {
        method: "PATCH",
        body: { name, age },
      });
      showSuccess("更新しました！");
      console.log("updatedUser: ", updatedUser);
      const index = users.value.findIndex((u) => u.id === id);
      if (index !== -1 && updatedUser.data) {
        users.value.splice(index, 1, updatedUser.data);
        console.log("users: ", users);
      }
    } catch (e) {
      alert("更新に失敗しました");
    } finally {
      updatingId.value = null;
    }
  };
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  const showSuccess = (message: string) => {
    successMessage.value = message;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      successMessage.value = "";
      timeoutId = null;
    }, 3000);
  };

  return {
    users,
    loading,
    errorMessage,
    fieldErrors,
    successMessage,
    deletingId,
    updatingId,
    addUser,
    deleteUser,
    updateUser,
  };
};
