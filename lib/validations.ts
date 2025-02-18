import {z} from 'zod'

export const signUpSchema = z.object({
    fullName: z.string().min(3),
    email: z.string().email(),
    universityId: z.coerce.number(),
    universityIdCard: z.string().nonempty("University Card is required"),
    password: z.string().min(8)
})

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})

export const bookSchema = z.object({
    title: z.string().trim().min(2).max(100),
    description: z.string().trim().min(10),
    author: z.string().trim().min(2).max(100),
    genre: z.string().trim().min(2).max(50),
    rating: z.coerce.number().min(1).max(5),
    totalCopies: z.coerce.number().int().positive().lte(10000),
    availableCopies: z.coerce.number().int().positive(),
    coverUrl: z.string().nonempty(),
    coverColor: z.string().trim().regex(/^#[0-9a-f]{3,6}$/i),
    videoUrl: z.string().nonempty(),
    summary: z.string().trim().min(10)
})
.superRefine((data, ctx) => {
    if(data.availableCopies > data.totalCopies){
        ctx.addIssue({
            path: ["availableCopies"],
            message: "Kopjet ne dispozicion nuk mund te jene me te medha se te gjitha kopjet e bera",
            code: z.ZodIssueCode.custom
        })
    }
})