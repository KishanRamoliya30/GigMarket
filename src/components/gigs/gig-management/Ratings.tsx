"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Rating as MuiRating,
  IconButton,
} from "@mui/material";
import CustomButton from "@/components/customUi/CustomButton";
import { useFormik } from "formik";
import * as Yup from "yup";
import { apiRequest } from "@/app/lib/apiCall";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import CustomTextField from "@/components/customUi/CustomTextField";
import { GigData } from "@/app/utils/interfaces";

interface Props {
  open: boolean;
  onClose: () => void;
  data: GigData;
  pendingStatus: string;
}

const PostGigReviewDialog: React.FC<Props> = ({
  open,
  onClose,
  data,
  pendingStatus,
}) => {
  const { user } = useUser();
  const validationSchema = Yup.object().shape({
    rating: Yup.number()
      .required("Rating is required")
      .min(1, "Minimum rating is 1")
      .max(5, "Maximum rating is 5"),

    review: Yup.string().required("Review is required"),

    issue: Yup.string().when("rating", {
      is: (val: number) => val < 3,
      then: (schema) => schema.required("Issue is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    improvementSuggestion: Yup.string().when("rating", {
      is: (val: number) => val < 3,
      then: (schema) => schema.required("Improvement suggestion is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    sincerityAgreement: Yup.boolean().when("rating", {
      is: (val: number) => val < 3,
      then: (schema) =>
        schema
          .oneOf([true], "You must agree to the sincerity clause")
          .required("Sincerity agreement is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const formik = useFormik({
    initialValues: {
      rating: null,
      review: "",
      issue: "",
      improvementSuggestion: "",
      sincerityAgreement: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      interface Payload {
        gigId: string;
        createdBy: string | undefined;
        providerId: string | undefined;
        rating: number | null;
        review: string;
        status: string;
        complaint?: {
          issue: string;
          improvementSuggestion: string;
          sincerityAgreement: boolean;
        };
      }

      const payload: Payload = {
        gigId: data._id,
        createdBy: data.userId,
        providerId: user?._id,
        rating: values.rating,
        review: values.review,
        status: pendingStatus,
      };

      if (values.rating !== null && values.rating < 3) {
        payload.complaint = {
          issue: values.issue,
          improvementSuggestion: values.improvementSuggestion,
          sincerityAgreement: values.sincerityAgreement,
        };
      }

      try {
        const res = await apiRequest(`ratings?${data._id}`, {
          method: "POST",
          data: JSON.stringify(payload),
        });

        if (res.success) {
          toast.success("Review submitted successfully.");
          await apiRequest(`gigs/${data._id}/changeStatus`, {
            method: "PATCH",
            data: JSON.stringify({
              status: pendingStatus,
              bidId: data.assignedToBid,
              description: values.review,
            }),
          });
          onClose();
        } else {
          toast.error(res.message || "Failed to submit review.");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(err.message || "Something went wrong.");
        } else {
          toast.error("Something went wrong.");
        }
      }
    },
  });

  const { values, handleChange, handleSubmit, touched, errors, setFieldValue } =
    formik;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="font-bold text-xl">
        <div className="flex gap-2 items-center justify-between p-[-8px]">
          <div>Leave a Review</div>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers className="space-y-4">
          <div className="text-gray-700 text-sm">
            Gig: <strong>{data.title}</strong>
          </div>

          <div>
            <label className="block font-semibold mb-1">
              <span className="flex items-center gap-1">
                Your Rating <span className="text-red-600">*</span>
              </span>
            </label>

            <MuiRating
              name="rating"
              value={values.rating}
              onChange={(_, val) => setFieldValue("rating", val)}
              precision={1}
              size="large"
            />
            {touched.rating && errors.rating && (
              <p className="text-[#d32f2f] text-[12px] ml-3">{errors.rating}</p>
            )}
            {values.rating && values.rating < 3 && (
              <p className="text-sm text-red-600 mt-1">
                Ratings below 3 will withhold payment. Please explain the issue.
              </p>
            )}
          </div>

          {values.rating && values.rating < 3 && (
            <div className="space-y-4  p-3 border border-red-200 rounded">
              <div>
                <CustomTextField
                  isAstrick
                  label="What was the issue?"
                  multiline
                  rows={4}
                  name="issue"
                  value={values.issue}
                  onChange={handleChange}
                  errorText={touched.issue && errors.issue ? errors.issue : ""}
                />
              </div>

              <div>
                <CustomTextField
                  isAstrick
                  label="What should the provider have done differently?"
                  multiline
                  rows={4}
                  name="improvementSuggestion"
                  value={values.improvementSuggestion}
                  onChange={handleChange}
                  errorText={
                    touched.improvementSuggestion &&
                    errors.improvementSuggestion
                      ? errors.improvementSuggestion
                      : ""
                  }
                />
              </div>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.sincerityAgreement}
                    onChange={handleChange}
                    name="sincerityAgreement"
                    color="error"
                  />
                }
                label={
                  <span className="text-xs">
                    I sincerely agree this review is honest. (1 strike = 2
                    weeks, 2 = 4 weeks, 3 = permanent ban)
                  </span>
                }
              />
              {touched.sincerityAgreement && errors.sincerityAgreement && (
                <p className="text-[#d32f2f] text-[12px] ml-3">
                  {errors.sincerityAgreement}
                </p>
              )}
            </div>
          )}

          <div>
            <CustomTextField
              isAstrick
              label="Write your review"
              multiline
              rows={4}
              name="review"
              value={values.review}
              onChange={handleChange}
              errorText={touched.review && errors.review ? errors.review : ""}
            />
          </div>
        </DialogContent>

        <DialogActions>
          <CustomButton
            sx={{ width: "150px", height: "45px" }}
            type="submit"
            label="Submit Review"
          />
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PostGigReviewDialog;
