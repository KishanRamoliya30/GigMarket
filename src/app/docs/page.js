'use client';
import { RedocStandalone } from "redoc";
export default function SwaggerRedocPage() {
  return (
    <RedocStandalone
      specUrl="/api/docs"
      options={{
        theme: { colors: { primary: { main: "#007acc" } } },
        hideDownloadButton: false,
      }}
    />
  );
}