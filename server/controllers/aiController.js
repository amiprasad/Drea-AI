import { clerkClient, getAuth } from '@clerk/express';
import sql from '../configs/db.js';
import axios from "axios";
import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs';
import OpenAI from "openai";
import { PDFParse } from 'pdf-parse';

const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const generateArticle = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        const { prompt, length } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({ success: false, message: "Limit reached. Upgrade to continue." })
        }

    const response = await AI.chat.completions.create({
        model: "gemini-3.5-flash-lite",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: length
    });

    const content = response.choices[0].message.content

    await sql `INSERT INTO creations (user_id, prompt, content, type)
    VALUES (${userId}, ${prompt}, ${content}, 'article')`;

    if(plan !== 'premium'){
        await clerkClient.users.updateUserMetadata(userId,{
            privateMetadata:{
                free_usage: free_usage + 1
            }
        })
    }

    res.json({success: true, content})

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

export const generateBlogTitle = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        const { prompt, length } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({ success: false, message: "Limit reached. Upgrade to continue." })
        }

    const response = await AI.chat.completions.create({
        model: "gemini-3.5-flash-lite",
        messages: [{role: "user", content: prompt}],
        temperature: 0.7,
        max_tokens: length
    });

    const content = response.choices[0].message.content

    await sql `INSERT INTO creations (user_id, prompt, content, type)
    VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;

    if(plan !== 'premium'){
        await clerkClient.users.updateUserMetadata(userId,{
            privateMetadata:{
                free_usage: free_usage + 1
            }
        })
    }

    res.json({success: true, content})

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

export const generateImage = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        const { prompt, publish } = req.body;
        const plan = req.plan;

        if (plan !== 'premium') {
            return res.json({success: false, message: "This feature is only available for premium user"})
        }

    const { data } = await axios.post(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
        {
            prompt: prompt
        },
        {
        headers: {
            Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json'
            }
        }
    )

    const base64Image = `data:image/jpeg;base64,${data.result.image}`

    const {secure_url, public_id} = await cloudinary.uploader.upload(base64Image)

    await sql `INSERT INTO creations (user_id, prompt, content, type, publish, cloudinary_public_id)
    VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false }, ${public_id})`;

    res.json({success: true, content: secure_url})

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

export const removeImageBackground = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        const image = req.file;
        const plan = req.plan;

        if (plan !== 'premium') {
            return res.json({success: false, message: "This feature is only available for premium user"})
        }

    const {secure_url, public_id} = await cloudinary.uploader.upload(image.path, {
        transformation: [
            {
                effect: 'background_removal',
                background_removal: 'remove_the_background'
            }
        ]
    })

    await sql `INSERT INTO creations (user_id, prompt, content, type, cloudinary_public_id)
    VALUES (${userId},'Remove background from image', ${secure_url}, 'image', ${public_id})`;

    res.json({success: true, content: secure_url})

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

export const removeImageObject = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        const { object } = req.body;
        const image = req.file;
        const plan = req.plan;

        if (plan !== 'premium') {
            return res.json({success: false, message: "This feature is only available for premium user"})
        }

    const {public_id} = await cloudinary.uploader.upload(image.path)

    const imageUrl = cloudinary.url(public_id,{
        transformation: [{effect: `gen_remove:prompt:${object}`}],
        resource_type: 'image'
    })

    await sql `INSERT INTO creations (user_id, prompt, content, type, cloudinary_public_id)
    VALUES (${userId},${`Remove ${object}`}, ${imageUrl}, 'image', ${public_id})`;

    res.json({success: true, content: imageUrl})

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

export const resumeReview = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        const resume = req.file;
        const plan = req.plan;

        if (plan !== 'premium') {
            return res.json({success: false, message: "This feature is only available for premium user"})
        }

    if(resume.size > 5*1024*1024){
        return res.json({success: false, message: "Resume file size exceeds allowed size (5MB)."})
    }

    const dataBuffer = fs.readFileSync(resume.path)
    const parser = new PDFParse({ data: dataBuffer });
    const pdfData = await parser.getText();

    await parser.destroy();

    const prompt = `Review the following resume and provide constructive feedback on it's strengths, weaknesses and areas for improvement. ResumeContent:\n\n${pdfData.text}`

    const response = await AI.chat.completions.create({
        model: "gemini-3.5-flash-lite",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000
    });

    const content = response.choices[0].message.content

    await sql `INSERT INTO creations (user_id, prompt, content, type)
    VALUES (${userId},'Review the uploaded resume', ${content}, 'resume-review')`;

    res.json({success: true, content})

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}