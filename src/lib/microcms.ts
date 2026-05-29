/**
 * microCMS client.
 *
 * Will be activated once the microCMS service is configured.
 * See /docs/microcms-schema.md for required APIs and fields.
 *
 * Until then, all content is sourced from /src/data/*.ts (static).
 * Swap call sites from data/* imports to these fetchers when ready.
 */

import { createClient } from "microcms-js-sdk";

const SERVICE_DOMAIN = import.meta.env.MICROCMS_SERVICE_DOMAIN;
const API_KEY = import.meta.env.MICROCMS_API_KEY;

export const microcmsEnabled =
  typeof SERVICE_DOMAIN === "string" &&
  SERVICE_DOMAIN.length > 0 &&
  typeof API_KEY === "string" &&
  API_KEY.length > 0;

export const microcms = microcmsEnabled
  ? createClient({
      serviceDomain: SERVICE_DOMAIN as string,
      apiKey: API_KEY as string,
    })
  : null;
