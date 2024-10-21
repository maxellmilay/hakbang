// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

if (
    !process.env.NEXT_PUBLIC_AWS_REGION ||
    !process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID ||
    !process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY
) {
    throw new Error('Missing AWS configuration')
}

const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    },
})

export async function POST(request: NextRequest) {
    try {
        const { fileName, fileType } = await request.json()

        if (!fileName) {
            return NextResponse.json(
                { error: 'fileName is required' },
                { status: 400 }
            )
        }

        const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME
        const region = 'us-east-1'

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            ContentType: fileType,
        })

        const signedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 3600,
            signableHeaders: new Set(['host']),
        })

        // Construct the actual file URL
        const actualFileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`

        return NextResponse.json({ signedUrl, actualFileUrl })
    } catch (error) {
        console.error('Error generating URLs:', error)
        return NextResponse.json(
            { error: 'Error generating URLs' },
            { status: 500 }
        )
    }
}
