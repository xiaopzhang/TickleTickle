const requiredPayloadEnv = ["DATABASE_URL", "PAYLOAD_SECRET"] as const;

export function getMissingPayloadEnv() {
  return requiredPayloadEnv.filter((key) => !process.env[key]);
}

export function hasPayloadEnv() {
  return getMissingPayloadEnv().length === 0;
}

export function payloadEnvUnavailableResponse() {
  return Response.json(
    {
      error: "Payload CMS is not configured",
      missing: getMissingPayloadEnv(),
      message: "Set DATABASE_URL and PAYLOAD_SECRET before using /admin or Payload API routes."
    },
    { status: 503 }
  );
}
