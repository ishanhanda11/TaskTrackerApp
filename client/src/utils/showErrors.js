import toast from "react-hot-toast";

export const showErrors = (error) => {
  const errors =
    error.response?.data?.errors;

  if (errors) {
    Object.values(errors)
      .flat()
      .forEach((msg) =>
        toast.error(msg)
      );

    return;
  }

  toast.error(
    error.response?.data?.message ||
    "Something went wrong"
  );
};