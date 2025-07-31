// app/api/docs/route.js
import { swaggerSpec } from '@/lib/swaggerSpec'; // Adjust path

export function GET() {
  return new Response(JSON.stringify(swaggerSpec), {
    headers: { 'Content-Type': 'application/json' },
  });
}