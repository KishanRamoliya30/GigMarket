import * as Yup from "yup";

export const CreteGigSchema = Yup.object({
  title: Yup.string().required("This field is required"),
  description: Yup.string().required("This field is required"),
  tier: Yup.string().required("This field is required"),
  price: Yup.number().required("This field is required").min(0),
  time: Yup.number().required("This field is required").min(0),
  keywords: Yup.array().min(1, "At least one keyword is required"),
  releventSkills: Yup.array().min(1, "At least one skill is required"),
  certification: Yup.mixed()
    .test("required", "This field is required", (value) => {
      return value instanceof File || (value && typeof value === "object");
    })
    .nullable(),
  gigImage: Yup.mixed()
    .required("This field is required")
    .test("fileType", "Only image files are allowed", (value) => {
      if (value instanceof File) {
        return value.type.startsWith("image/");
      }
      if (value && typeof value === "object" && "type" in value) {
        return (
          typeof value.type === "string" && value.type.startsWith("image/")
        );
      }
      return false;
    })
    .nullable(),
});