import prisma from '@/../prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { createIssueSchema } from '../../../schemas/validationSchemas'

export const POST = async (request: NextRequest) => {
    const body = await request.json()

    const validation = createIssueSchema.safeParse(body)

    if (!validation.success) {
        return NextResponse.json(validation.error.format(), { status: 400 })
    }

    const generatedIssue = await prisma.issue.create({
        data: {
            title: body.title,
            description: body.description
        }
    })

    return NextResponse.json(generatedIssue, { status: 201 })
}
