'use client'

import { createIssueSchema } from '@/schemas/validationSchemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Callout, Text, TextField } from '@radix-ui/themes'
import axios from 'axios'
import 'easymde/dist/easymde.min.css'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import SimpleMDE from 'react-simplemde-editor'
import { z } from 'zod'

type IssueForm = z.infer<typeof createIssueSchema>

const NewIssuePage = () => {
    const router = useRouter()
    const {
        register,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<IssueForm>({
        resolver: zodResolver(createIssueSchema)
    })
    const [error, setError] = useState('')

    return (
        <div className='max-w-xl'>
            {error ? (
                <Callout.Root color='red' className='mb-5'>
                    <Callout.Text>{error}</Callout.Text>
                </Callout.Root>
            ) : null}
            <form
                className='space-y-3'
                onSubmit={handleSubmit(async (data) => {
                    try {
                        await axios.post('/api/issues', data)
                        router.push('/issues')
                    } catch (error) {
                        setError('An unexpected error occured.')
                    }
                })}
            >
                <TextField.Root>
                    <TextField.Input
                        placeholder='Title for the issue'
                        {...register('title')}
                    />
                </TextField.Root>
                {errors.title ? (
                    <Text color='red' as='p'>
                        {errors.title.message}
                    </Text>
                ) : null}
                <Controller
                    name='description'
                    control={control}
                    render={({ field }) => (
                        <SimpleMDE
                            placeholder='Please describe the issue...'
                            {...field}
                        />
                    )}
                />
                {errors.description ? (
                    <Text color='red' as='p'>
                        {errors.description.message}
                    </Text>
                ) : null}
                <Button>Submit New Issue</Button>
            </form>
        </div>
    )
}

export default NewIssuePage
