import { Box, Typography, Container, Divider } from "@mui/material";
import DOMPurify from "isomorphic-dompurify";
import { apiRequest } from "@/app/lib/apiCall";

const TermsConditions = async () => {
  try {
    const data = await apiRequest("terms"); 
    const sanitizedHtml = DOMPurify.sanitize(data.data.content);
    const lastUpdated = new Date(data.data.updatedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    </Container>
    );
  }catch (error) {
        console.error("Failed to load terms:", error);

    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Terms of Service
        </Typography>
        <Typography variant="body2" color="error">
          Failed to load terms. Please try again later. {error instanceof Error ? error.message : "Unknown error"}
        </Typography>
      </Container>
    );
  }


};

export default TermsConditions;