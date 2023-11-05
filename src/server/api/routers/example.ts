import {z} from "zod"
import {createTRPCRouter, publicProcedure} from "@/server/api/trpc"

export const exampleRouter = createTRPCRouter({
    hello: publicProcedure
        .input(z.object({text: z.string()}))
        .query(({input}) => {
            return {
                greeting: `Hello ${input.text}`,
            }
        }),
    getAll: publicProcedure.input(z.object({
        pageIndex: z.number(),
        pageSize: z.number(),
    })).query(async ({ctx, input}) => {
        const persons = await ctx.prisma.person.findMany({
            skip: input.pageIndex * input.pageSize,
            take: input.pageSize
        })
        const total = await ctx.prisma.person.count()

        return {
            pageCount: Math.ceil(total / input.pageSize),
            persons,
        }
    }),
})
