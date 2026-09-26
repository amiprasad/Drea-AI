import { clerkClient, getAuth } from "@clerk/express";
// middlewares to check userId and has PremimumPlan

export const auth = async (req, res, next) => {
    try {
        const { isAuthenticated, userId, has } = getAuth(req);

        if (!isAuthenticated || !userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const hasPremiumPlan = has({plan: 'premium'});

        const user = await clerkClient.users.getUser(userId);

        if(!hasPremiumPlan && user.privateMetadata.free_usage){
            req.free_usage = user.privateMetadata.free_usage
        } else {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: 0
                }
            })
            req.free_usage = 0;
        }

        req.plan = hasPremiumPlan ? 'premium' : 'free';
        next()
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}