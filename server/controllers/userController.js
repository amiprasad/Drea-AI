import { getAuth } from "@clerk/express";
import sql from "../configs/db.js";
import { v2 as cloudinary } from "cloudinary";

export const getUserCreation = async (req, res) => {
    try {
        const {userId} = req.auth()

        const creations = await sql`SELECT * FROM creations WHERE user_id=${userId} ORDER BY created_at DESC`;
        res.json({success: true, creations});

    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const getPublishedCreation = async (req, res) => {
    try {
        const {userId} = req.auth()

        const creations = await sql`SELECT * FROM creations WHERE publish=true ORDER BY created_at DESC`;
        res.json({success: true, creations});

    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const toggleLikeCreation = async (req, res) => {
    try {
        const {userId} = getAuth(req)
        const {id} = req.body

        const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`

        if(!creation){
            return res.json({ success: false, message: "Creation not found"})
        }

        const currentLikes = creation.likes;
        const userIdStr = userId.toString();
        let updateLikes;
        let message;

        if(currentLikes.includes(userIdStr)){
            updateLikes = currentLikes.filter((user)=>user !== userIdStr);
            message = 'Creation Unliked'
        }else{
            updateLikes = [...currentLikes, userIdStr]
            message = 'Creation Liked'
        }

        const formattedArray = `{${updateLikes.join(',')}}`

        await sql`UPDATE creations SET likes = ${formattedArray}::text[] WHERE id=${id}`

        res.json({success:true, message})
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const deleteCreations = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { ids } = req.body

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.json({
                success: false,
                message: 'No creations selected'
            })
        }

        const numericIds = ids.map(Number)

        if (numericIds.some((id) => !Number.isInteger(id))) {
            return res.json({
                success: false,
                message: 'Invalid creation ID'
            })
        }

        for (const id of numericIds) {
            const [creation] = await sql`SELECT cloudinary_public_id FROM creations WHERE id = ${id} AND user_id = ${userId}`

            if (!creation) continue

            if (creation.cloudinary_public_id) {
                const { result } = await cloudinary.uploader.destroy(
                    creation.cloudinary_public_id,
                    { resource_type: 'image' }
                )

                if (result !== 'ok' && result !== 'not found') {
                    throw new Error(`Cloudinary deletion failed for creation ${id}`)
                }
            }

            await sql`DELETE FROM creations WHERE id = ${id} AND user_id = ${userId} `
        }

        res.json({
            success: true,
            message: 'Creations deleted'
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}