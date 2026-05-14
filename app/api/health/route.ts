export async function GET() {
  return Response.json({
    status: "ok",
    env: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "unknown",
    version: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    timestamp: Date.now(),
  });
}
