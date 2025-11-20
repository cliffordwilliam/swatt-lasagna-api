import { z } from "zod";
import { createDocument } from "zod-openapi";
import {
  ItemCreateRequest,
  ItemUpdateRequest,
  ItemListResponse,
  ItemGetResponse,
  ItemCreateResponse,
  ItemUpdateResponse,
  ItemFilter,
} from "../../item/schemas/item";

export default createDocument({
  openapi: "3.1.0",
  info: {
    title: "Swatt Lasaga API",
    version: "1.0.0",
  },
  paths: {
    "/item": {
      get: {
        summary: "List items",
        requestParams: {
          query: ItemFilter,
        },
        responses: {
          200: {
            description: "List items response",
            content: {
              "application/json": { schema: ItemListResponse },
            },
          },
        },
      },
      post: {
        summary: "Create item",
        requestBody: {
          content: {
            "application/json": { schema: ItemCreateRequest },
          },
        },
        responses: {
          200: {
            description: "Item created",
            content: {
              "application/json": { schema: ItemCreateResponse },
            },
          },
        },
      },
    },

    "/item/{id}": {
      get: {
        summary: "Get item by ID",
        requestParams: {
          path: z.object({
            id: z.number().meta({ description: "Item ID" }),
          }),
        },
        responses: {
          200: {
            description: "Item details",
            content: {
              "application/json": { schema: ItemGetResponse },
            },
          },
        },
      },

      patch: {
        summary: "Update an item",
        requestParams: {
          path: z.object({
            id: z.number().meta({ description: "Item ID" }),
          }),
        },
        requestBody: {
          content: {
            "application/json": { schema: ItemUpdateRequest },
          },
        },
        responses: {
          200: {
            description: "Item updated",
            content: {
              "application/json": { schema: ItemUpdateResponse },
            },
          },
        },
      },
    },
  },
});
