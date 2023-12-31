'use client'

import ErrorMessage from '@/components/ErrorMessage'
import Spinner from '@/components/Spinner'
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
    const [isSubmiting, setIsSubmiting] = useState(false)

    const onSubmit = handleSubmit(async (data) => {
        try {
            setIsSubmiting(true)
            await axios.post('/api/issues', data)
            router.push('/issues')
        } catch (error) {
            setIsSubmiting(false)
            setError('An unexpected error occured.')
        }
    })

    return (
        <div className='max-w-xl'>
            {error ? (
                <Callout.Root color='red' className='mb-5'>
                    <Callout.Text>{error}</Callout.Text>
                </Callout.Root>
            ) : null}
            <form className='space-y-3' onSubmit={onSubmit}>
                <TextField.Root>
                    <TextField.Input
                        placeholder='Title for the issue'
                        {...register('title')}
                    />
                </TextField.Root>
                <ErrorMessage>{errors.title?.message}</ErrorMessage>
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
                <ErrorMessage>{errors.description?.message}</ErrorMessage>
                <Button disabled={isSubmiting}>
                    Submit New Issue {isSubmiting ? <Spinner /> : null}
                </Button>
            </form>
        </div>
    )
}

export default NewIssuePage
