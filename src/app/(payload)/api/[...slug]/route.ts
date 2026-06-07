import config from "../../../../../payload.config";
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT
} from "@payloadcms/next/routes";
import { hasPayloadEnv, payloadEnvUnavailableResponse } from "@/lib/payload-env";

export const maxDuration = 60;

const handlers = {
  DELETE: REST_DELETE(config),
  GET: REST_GET(config),
  OPTIONS: REST_OPTIONS(config),
  PATCH: REST_PATCH(config),
  POST: REST_POST(config),
  PUT: REST_PUT(config)
};

type RouteArgs = {
  params: Promise<{ slug?: string[] }>;
};

export function GET(request: Request, args: RouteArgs) {
  if (!hasPayloadEnv()) return payloadEnvUnavailableResponse();
  return handlers.GET(request, args);
}

export function POST(request: Request, args: RouteArgs) {
  if (!hasPayloadEnv()) return payloadEnvUnavailableResponse();
  return handlers.POST(request, args);
}

export function DELETE(request: Request, args: RouteArgs) {
  if (!hasPayloadEnv()) return payloadEnvUnavailableResponse();
  return handlers.DELETE(request, args);
}

export function PATCH(request: Request, args: RouteArgs) {
  if (!hasPayloadEnv()) return payloadEnvUnavailableResponse();
  return handlers.PATCH(request, args);
}

export function PUT(request: Request, args: RouteArgs) {
  if (!hasPayloadEnv()) return payloadEnvUnavailableResponse();
  return handlers.PUT(request, args);
}

export function OPTIONS(request: Request, args: RouteArgs) {
  if (!hasPayloadEnv()) return payloadEnvUnavailableResponse();
  return handlers.OPTIONS(request, args);
}
