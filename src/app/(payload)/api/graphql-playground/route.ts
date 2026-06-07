import config from "../../../../../payload.config";
import { GRAPHQL_PLAYGROUND_GET } from "@payloadcms/next/routes";
import { hasPayloadEnv, payloadEnvUnavailableResponse } from "@/lib/payload-env";

const graphqlPlaygroundGet = GRAPHQL_PLAYGROUND_GET(config);

export function GET(request: Request) {
  if (!hasPayloadEnv()) return payloadEnvUnavailableResponse();
  return graphqlPlaygroundGet(request);
}
