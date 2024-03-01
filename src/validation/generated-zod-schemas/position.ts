import * as z from "zod"
import { CompleteEmployee, RelatedEmployeeSchema } from "./index"

export const PositionSchema = z.object({
  id: z.number().int(),
  code: z.number().int(),
  name: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})


export interface Position extends z.infer<typeof PositionSchema>{}
export interface CompletePosition extends z.infer<typeof PositionSchema> {
  employees: CompleteEmployee[]
}

/**
 * RelatedPositionSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPositionSchema: z.ZodSchema<CompletePosition> = z.lazy(() => PositionSchema.extend({
  employees: RelatedEmployeeSchema.array(),
}))
