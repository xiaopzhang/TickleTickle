import config from "../../../../../payload.config";
import { GRAPHQL_POST } from "@payloadcms/next/routes";
import { hasPayloadEnv, payloadEnvUnavailableResponse } from "@/lib/payload-env";

const graphqlPost = GRAPHQL_POST(config);

export function POST(request: Request) {
  if (!hasPayloadEnv()) return payloadEnvUnavailableResponse();
  return graphqlPost(request);
}
