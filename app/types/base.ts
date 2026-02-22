import z from 'zod'

export const BaseSchema = z.object({
    id: z.uuid(),
    link: z.url(),
    thLevel: z.number().int().min(1).max(18),
    createdAt: z.date(),
    imgUrl: z.url(),
})

export type Base = z.infer<typeof BaseSchema>