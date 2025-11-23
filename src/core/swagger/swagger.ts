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
import {
  OrderCreateRequest,
  OrderCreateResponse,
  OrderGetResponse,
  OrderUpdateRequest,
  OrderUpdateResponse,
  OrderFilter,
  OrderListResponse,
} from "../../order/schemas/order";
import {
  PersonPhoneCreateRequest,
  PersonPhoneCreateResponse,
  PersonPhoneUpdateRequest,
  PersonPhoneUpdateResponse,
  PersonPhoneFilter,
  PersonPhoneListResponse,
  PersonPhoneGetResponse,
} from "../../person-phone/schemas/person-phone";
import {
  PersonAddressCreateRequest,
  PersonAddressCreateResponse,
  PersonAddressUpdateRequest,
  PersonAddressUpdateResponse,
  PersonAddressFilter,
  PersonAddressListResponse,
  PersonAddressGetResponse,
} from "../../person-address/schemas/person-address";

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

    "/order": {
      get: {
        summary: "List orders",
        requestParams: {
          query: OrderFilter,
        },
        responses: {
          200: {
            description: "List orders response",
            content: {
              "application/json": { schema: OrderListResponse },
            },
          },
        },
      },
      post: {
        summary: "Create order",
        requestBody: {
          content: {
            "application/json": { schema: OrderCreateRequest },
          },
        },
        responses: {
          200: {
            description: "Order created",
            content: {
              "application/json": { schema: OrderCreateResponse },
            },
          },
        },
      },
    },

    "/order/{id}": {
      get: {
        summary: "Get order by ID",
        requestParams: {
          path: z.object({
            id: z.number().meta({ description: "Order ID" }),
          }),
        },
        responses: {
          200: {
            description: "Order details",
            content: {
              "application/json": { schema: OrderGetResponse },
            },
          },
        },
      },
      patch: {
        summary: "Update an order",
        requestParams: {
          path: z.object({
            id: z.number().meta({ description: "Order ID" }),
          }),
        },
        requestBody: {
          content: {
            "application/json": { schema: OrderUpdateRequest },
          },
        },
        responses: {
          200: {
            description: "Order updated",
            content: {
              "application/json": { schema: OrderUpdateResponse },
            },
          },
        },
      },
    },

    "/person-phone": {
      get: {
        summary: "List person phones",
        requestParams: {
          query: PersonPhoneFilter,
        },
        responses: {
          200: {
            description: "List person phones response",
            content: {
              "application/json": { schema: PersonPhoneListResponse },
            },
          },
        },
      },
      post: {
        summary: "Create person phone",
        requestBody: {
          content: {
            "application/json": { schema: PersonPhoneCreateRequest },
          },
        },
        responses: {
          200: {
            description: "Person phone created",
            content: {
              "application/json": { schema: PersonPhoneCreateResponse },
            },
          },
        },
      },
    },

    "/person-phone/{id}": {
      get: {
        summary: "Get person phone by ID",
        requestParams: {
          path: z.object({
            id: z.number().meta({ description: "Phone ID" }),
          }),
        },
        responses: {
          200: {
            description: "Person phone details",
            content: {
              "application/json": { schema: PersonPhoneGetResponse },
            },
          },
        },
      },
      patch: {
        summary: "Update a person phone",
        requestParams: {
          path: z.object({
            id: z.number().meta({ description: "Phone ID" }),
          }),
          query: z.object({
            personId: z.number().meta({ description: "Person ID" }),
          }),
        },
        requestBody: {
          content: {
            "application/json": { schema: PersonPhoneUpdateRequest },
          },
        },
        responses: {
          200: {
            description: "Person phone updated",
            content: {
              "application/json": { schema: PersonPhoneUpdateResponse },
            },
          },
        },
      },
    },

    "/person-address": {
      get: {
        summary: "List person addresses",
        requestParams: {
          query: PersonAddressFilter,
        },
        responses: {
          200: {
            description: "List person addresses response",
            content: {
              "application/json": { schema: PersonAddressListResponse },
            },
          },
        },
      },
      post: {
        summary: "Create person address",
        requestBody: {
          content: {
            "application/json": { schema: PersonAddressCreateRequest },
          },
        },
        responses: {
          200: {
            description: "Person address created",
            content: {
              "application/json": { schema: PersonAddressCreateResponse },
            },
          },
        },
      },
    },

    "/person-address/{id}": {
      get: {
        summary: "Get person address by ID",
        requestParams: {
          path: z.object({
            id: z.number().meta({ description: "Address ID" }),
          }),
        },
        responses: {
          200: {
            description: "Person address details",
            content: {
              "application/json": { schema: PersonAddressGetResponse },
            },
          },
        },
      },
      patch: {
        summary: "Update a person address",
        requestParams: {
          path: z.object({
            id: z.number().meta({ description: "Address ID" }),
          }),
          query: z.object({
            personId: z.number().meta({ description: "Person ID" }),
          }),
        },
        requestBody: {
          content: {
            "application/json": { schema: PersonAddressUpdateRequest },
          },
        },
        responses: {
          200: {
            description: "Person address updated",
            content: {
              "application/json": { schema: PersonAddressUpdateResponse },
            },
          },
        },
      },
    },
  },
});
