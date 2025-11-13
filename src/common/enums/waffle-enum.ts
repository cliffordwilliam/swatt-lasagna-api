import z from "zod";

export const WaffleEnum = z.enum(["sweet", "sour", "belgian"]);
