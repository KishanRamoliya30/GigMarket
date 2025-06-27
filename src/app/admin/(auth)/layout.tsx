import { Grid } from "@mui/material";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Grid
      container
      sx={{
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid size={{ xs: 11, sm: 8, md: 4 }}>{children}</Grid>
    </Grid>
  );
}
