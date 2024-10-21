import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { NextResponse } from 'next/server'

// Ensure AWS environment variables are set
if (
    !process.env.NEXT_PUBLIC_AWS_REGION ||
    !process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID ||
    !process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY ||
    !process.env.NEXT_PUBLIC_S3_BUCKET_NAME
) {
    throw new Error('Missing AWS configuration')
}

// Create the S3 client
const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    },
})

// Export the DELETE method for the API route
export async function DELETE(request: Request) {
    try {
        const { fileName } = await request.json() // Parse the JSON body

        if (!fileName) {
            return NextResponse.json(
                { message: 'File name is required' },
                { status: 400 }
            )
        }

        const command = new DeleteObjectCommand({
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
            Key: fileName,
        })

        await s3Client.send(command)

        return NextResponse.json(
            { message: 'File deleted successfully' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error deleting file:', error)
        return NextResponse.json(
            { message: 'Error deleting file' },
            { status: 500 }
        )
    }
}
