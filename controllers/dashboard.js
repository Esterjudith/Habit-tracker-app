const Habit = require("../models/Habit");


module.exports = {
    getDashboard: async (req, res) => {
        try {

            const habits = await Habit.find({ user: req.user.id });
            //Sending habits data from mongodb and user data to ejs template
            res.render("dashboard.ejs", { habits: habits, user: req.user });

        } catch (err) {
            console.log(err);
        }
    },
    createHabit: async (req, res) => {
        try {

            await Habit.create({
                habit: req.body.habit,
                icon: req.body.icon,
                increment: req.body.increment,
                unit: req.body.unit,
                user: req.user.id,

            });
            console.log("Habit has been added!");
            res.redirect("/dashboard");
        } catch (err) {
            console.log(err);
        }
    },
    addProgress: async (req, res) => {
        try {
            const habit = await Habit.findOne({ _id: req.params.id }).lean()
            const increment = habit.increment
            await Habit.findOneAndUpdate({
                _id: req.params.id,

            },
                {
                    $inc: { progress: increment },
                },
            )
            console.log(`Progress: ${increment}`)
            res.redirect(`/dashboard/${req.params.id}`)
        } catch (err) {
            console.log(err)
        }
    },
    deleteProgress: async (req, res) => {
        try {
            const habit = await Habit.findOne({ _id: req.params.id }).lean()
            const decrement = habit.increment
            await Habit.findOneAndUpdate({
                _id: req.params.id,

            },
                {
                    $inc: { progress: decrement },
                },
            )
            console.log(`Progress -1`)
            res.redirect(`/dashboard/${req.params.id}`)
        } catch (err) {
            console.log(err)
        }
    },
    deleteHabit: async (req, res) => {
        try {
            // Find post by id
            await Habit.remove({ _id: req.params.id });
            console.log("Deleted habit");
            res.redirect("/dashboard");
        } catch (err) {
            res.redirect("/dashboard");
        }
    },
}