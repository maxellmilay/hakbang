import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'

if (
    !process.env.AWS_REGION ||
    !process.env.AWS_ACCESS_KEY_ID ||
    !process.env.AWS_SECRET_ACCESS_KEY
) {
    throw new Error('Missing AWS configuration')
}

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
})

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    const { fileName } = req.body

    const command = new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
    })

    try {
        await s3Client.send(command)
        res.status(200).json({ message: 'File deleted successfully' })
    } catch (error) {
        console.error('Error deleting file:', error)
        res.status(500).json({ message: 'Error deleting file' })
    }
}
