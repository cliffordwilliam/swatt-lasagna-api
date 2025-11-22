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
import {
  PersonCreateRequest,
  PersonCreateResponse,
  PersonUpdateRequest,
  PersonUpdateResponse,
  PersonFilter,
  PersonListResponse,
  PersonGetResponse,
} from "../../person/schemas/person";

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

    "/person": {
      get: {
        summary: "List persons",
        requestParams: {
          query: PersonFilter,
        },
        responses: {
          200: {
            description: "List persons response",
            content: {
              "application/json": { schema: PersonListResponse },
            },
          },
        },
      },
      post: {
        summary: "Create person",
        requestBody: {
          content: {
            "application/json": { schema: PersonCreateRequest },
          },
        },
        responses: {
          200: {
            description: "Person created",
            content: {
              "application/json": { schema: PersonCreateResponse },
            },
          },
        },
      },
    },

    "/person/{id}": {
      get: {
        summary: "Get person by ID",
        requestParams: {
          path: z.object({
            id: z.number().meta({ description: "Person ID" }),
          }),
        },
        responses: {
          200: {
            description: "Person details",
            content: {
              "application/json": { schema: PersonGetResponse },
            },
          },
        },
      },

      patch: {
        summary: "Update a person",
        requestParams: {
          path: z.object({
            id: z.number().meta({ description: "Person ID" }),
          }),
        },
        requestBody: {
          content: {
            "application/json": { schema: PersonUpdateRequest },
          },
        },
        responses: {
          200: {
            description: "Person updated",
            content: {
              "application/json": { schema: PersonUpdateResponse },
            },
          },
        },
      },
    },
  },
});
