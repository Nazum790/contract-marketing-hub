const cron = require("node-cron");
const UserContract = require("../models/UserContract");

const startContractCompletionCron = () => {
    // runs every hour
    cron.schedule("0 * * * *", async () => {
        try {
            const now = new Date();

            const contractsToComplete = await UserContract.find({
                status: "active",
                endDate: { $lte: now },
            });

            if (contractsToComplete.length === 0) return;

            for (const contract of contractsToComplete) {
                contract.status = "completed";
                contract.completedAt = now;
                await contract.save();
            }

            console.log(
                `[CRON] ${contractsToComplete.length} contract(s) marked as completed`
            );
        } catch (error) {
            console.error("[CRON ERROR]", error.message);
        }
    });
};

module.exports = startContractCompletionCron;