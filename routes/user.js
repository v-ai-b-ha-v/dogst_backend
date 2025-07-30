const authenticate = require('../middleware/authenticate');
const express = require('express');
const User = require('../models/User');
const { getPetType, bonusXP, calculateXP, getLevel, getXPToNextLevel, streakXP } = require('../utils/logic');
const { generalLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

const getCurrentUser = async (req, res) => {
    try {

        const user = await User.findOne({
            uid: req.user.uid
        });

        if (!user) {
            console.log("nahi hai user !!");
            return res.status(404).json({ error: "User not found" });
        }

        if (!user.userTargetScreenTime || user.userTargetScreenTime <= 0) {
            console.log("User is NOT initialized!");
            return res.status(404).json({ error: "User not initialized" });
        }
        const reqXP = getXPToNextLevel(user.xp);
        const level = getLevel(user.xp);

        const userObj = user.toObject();


        userObj.reqXP = reqXP;
        userObj.level = level;

        res.json(userObj);

    } catch (e) {
        console.error('Error fetching user:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

router.get('/lastUpdated', authenticate, async (req, res) => {

    try {
        const { uid } = req.user;
        let user = await User.findOne({ uid });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.json({ lastUpdated: user.lastUpdated });

    } catch (e) {
        console.error('Error in /init:', e.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

});

router.get('/me', authenticate, getCurrentUser);

router.post('/init', generalLimiter, authenticate, async (req, res) => {

    try {
        const { uid, email } = req.user;

        const { name, userTargetScreenTime } = req.body;

        if (!userTargetScreenTime || typeof userTargetScreenTime !== 'number') {
            return res.status(400).json({ error: 'userTargetScreenTime is required and must be a number' });
        }

        // check if user is there
        let user = await User.findOne({ uid });

        if (!user) {
            // if not , create new user
            user = await User.create({
                uid: uid,
                email: email,
                name: name,
                userTargetScreenTime: userTargetScreenTime,
                lastUpdated: new Date()
            });
        }


        return res.status(200).json({ message: 'User initialized', user });

    } catch (e) {
        console.error('Error in /init:', e.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

});

router.post('/updateStats', generalLimiter, authenticate, async (req, res) => {

    try {

        console.log("update stats tested");
        console.log("Incoming body:", req.body);

        const uid = req.user.uid;


        const user = await User.findOne({ uid });

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        const { screenTimeToday, prevDayScreenTime, currentScreenTime } = req.body;

        const indianDateString = (d) => new Date(d).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

        const currentDate = indianDateString(new Date());
        const lastUpdated = user.lastUpdated ? indianDateString(user.lastUpdated) : null;



        console.log(`${currentDate} and ${lastUpdated}`);


        if (screenTimeToday !== undefined && currentDate === lastUpdated) {

            console.log(screenTimeToday);

            user.lastUpdated = new Date();

            user.screenTimeToday = screenTimeToday;

            await user.save();

            const reqXP = getXPToNextLevel(user.xp);
            const level = getLevel(user.xp);

            const userObj = user.toObject();


            userObj.reqXP = reqXP;
            userObj.level = level;

            console.log(userObj);

            return res.json(userObj);
        }


        if (prevDayScreenTime !== undefined && currentScreenTime !== undefined) {


            const xpEarned = bonusXP(prevDayScreenTime);


            const targetAchieved = calculateXP(prevDayScreenTime, user.userTargetScreenTime);

            console.log(targetAchieved);

            if (targetAchieved === 0) {
                user.streak = 0;
            } else {
                user.streak += 1;
            }

            const streakBonus = streakXP(user.streak);

            const prevLevel = getLevel(user.xp);

            const totalNewXP = xpEarned + targetAchieved + streakBonus;

            user.xp += totalNewXP;

            const newLevel = getLevel(user.xp);

            let petEvolved = false;


            if (newLevel != prevLevel) {

                const newPetType = getPetType(newLevel);

                if (newPetType !== user.petType) {
                    user.petType = newPetType;
                    petEvolved = true;
                }

            }

            const reqXP = getXPToNextLevel(user.xp);

            user.screenTimeToday = currentScreenTime;
            user.lastUpdated = new Date();
            await user.save();



            return res.json({
                message: `XP awarded: Bonus ${xpEarned} + Target ${targetAchieved}`,
                bonusXP: xpEarned,
                streakBonus: streakBonus,
                targetXP: targetAchieved,
                level: newLevel,
                petEvolved: petEvolved,
                streak: user.streak,
                petType: user.petType,
                requiredXP: reqXP,
                uid: user.uid,
                name: user.name,
                screenTimeToday: user.screenTimeToday,
                userTargetScreenTime: user.userTargetScreenTime,
                xp: user.xp,
                lastUpdated: user.lastUpdated,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,


            });
        }

        return res.status(400).json({ error: 'Invalid request body' });



    } catch (error) {
        console.error('Error in /updateStats:', error.message);
        res.status(500).json({ error: 'Server error' });
    }

});

router.get('/leaderboard', generalLimiter, authenticate, async (req, res) => {
    try {

        console.log("User wants to view leaderboard");

        const allUsers = await User.find()
            .sort({ xp: -1 })
            .select('name xp');

        res.json(allUsers);
    } catch (error) {
        console.error('Error in /leaderboard:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/delete', authenticate, async (req, res) => {

    try {

        const uid = req.user.uid;
        console.log("🧩 UID from Firebase token:", uid);

        const result = await User.deleteOne({ uid });
        console.log("🗑️ Mongo delete result:", result);

        return res.status(200).json({ message: "Deleted from Database" });

    } catch (e) {

        return res.status(500).json({ message: 'Failed to delete user data' });

    }
}


);



module.exports = router;
