import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuth = defineStore('auth', () => {
  const profile = ref(null);
  // const token = ref(null);
  // const isLoggedIn = ref(false);
  // const image = ref(null);

  // Function to handle user data
  const handleUserData = (data) => {
    profile.value = data;
    // token.value = data?.token;
    // isLoggedIn.value = true;
    // image.value = data?.image;
  };

  // Expose state and actions
  return {
    profile,
    // token,
    // isLoggedIn,
    // image,
    handleUserData,
  };
}, {
  persist: true
}); 