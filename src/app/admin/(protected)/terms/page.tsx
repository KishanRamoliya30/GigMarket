"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Box, Typography, Paper } from "@mui/material";
import { apiRequest } from "@/app/lib/apiCall";
import CustomButton from "@/components/customUi/CustomButton";
const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  {
    ssr: false,
  }
);

export default function TermsAndServicesPage() {
  const editorRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("<p>Loading terms...</p>");

  useEffect(() => {
    const fetchTerms = async () => {
      const res = await apiRequest<{ content: string }>("terms");
      if (res.ok && res.data?.content) {
        setContent(res.data.content);
      } else {
        setContent("<p>Enter your terms and services here...</p>");
        console.error(res.error);
      }
      setLoading(false);
    };

    fetchTerms();
  }, []);

  const handleSave = async () => {
    const html = editorRef.current?.getContent();
    const res = await apiRequest("admin/terms", {
      method: "POST",
      data: { htmlContent: html },
    });

    if (res.ok) {
      alert("Terms saved successfully.");
    } else {
      alert(res.error ?? "Failed to save.");
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Terms & Services
      </Typography>

      <Paper sx={{ p: 2 }}>
        {!loading && (
          <Editor
            apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
            onInit={(_, editor) => (editorRef.current = editor)}
            initialValue={content}
            init={{
              height: 400,
              menubar: false,
              plugins: ["lists link table code fontfamily fontsize"],
              toolbar:
                "undo redo | formatselect fontfamily fontsize | bold italic underline | alignleft aligncenter alignright | bullist numlist | link table | code",
              font_family_formats:
                "Arial=arial,helvetica,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino;",
              font_size_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
              branding: false,
            }}
          />
        )}

        <CustomButton
          label={"Save"}
          type="submit"
          disabled={loading}
          onClick={handleSave}
        />
      </Paper>
    </Box>
  );
}
