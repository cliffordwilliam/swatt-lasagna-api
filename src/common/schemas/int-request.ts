import { z } from "zod";

export const IntRequest = z.coerce.number();
