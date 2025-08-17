export function useSuccessPopup() {
  const showSuccessPopup = ref(false);
  const successText = ref('');

  const handleSuccessPopup = (successTargetText) => {
    showSuccessPopup.value = true;
    // successText.value = successTargetText;
    // console.log(successTargetText);
  };

  return {
    // successText,
    showSuccessPopup,
    handleSuccessPopup
  };
};
