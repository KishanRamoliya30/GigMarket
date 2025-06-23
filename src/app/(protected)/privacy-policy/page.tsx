"use client";

import React from "react";
import { Box, Typography, Container, Divider } from "@mui/material";
import { privacyPolicyContent } from "./content";

const PrivacyPolicyPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Privacy Policy
      </Typography>

      <Typography variant="body2" color="text.secondary" gutterBottom>
        Last update: {privacyPolicyContent.lastUpdated}
      </Typography>

      <Typography variant="body1" paragraph>
        {privacyPolicyContent.intro}
      </Typography>

      <Divider sx={{ my: 4 }} />

      {privacyPolicyContent.sections.map((section, index) => (
        <Box key={index} sx={{ mb: 5 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {index + 1}. {section.title}
          </Typography>
          <Typography variant="body1" component="div" sx={{ whiteSpace: "pre-line" }}>
            {section.content}
          </Typography>
        </Box>
      ))}
    </Container>
  );
};

export default PrivacyPolicyPage;
