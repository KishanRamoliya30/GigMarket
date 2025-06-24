"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Container, Divider } from "@mui/material";
import DOMPurify from "dompurify";
import { apiRequest } from "@/app/lib/apiCall";

const TermsConditions = () => {
  const [contentHtml, setContentHtml] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await apiRequest("terms"); 
        const sanitizedHtml = DOMPurify.sanitize(data.data.content);
        setContentHtml(sanitizedHtml);

        setLastUpdated(new Date(data.data.updatedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }));
      } catch (error) {
        console.error("Failed to load terms:", error);
      }
    };

    fetchContent();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Terms of Service
      </Typography>

      {lastUpdated && (
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Last update: {lastUpdated}
        </Typography>
      )}

      <Divider sx={{ my: 4 }} />

      <Box
        sx={{ typography: "body1" }}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </Container>
  );
};

export default TermsConditions;