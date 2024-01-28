const Group  = require("../models/Group");

 async function groupHandler(req, res){
    if(req.method === 'POST'){
        try{
            const {groupSize, groupName} = req.body
            const group = new Group({groupSize: groupSize, groupName: groupName})
            await group.save()
            res.status(201).json({message: "Group created successfully", group})
        }catch(error){
            console.error('Error:', error);
            res.status(500).json({
                message: "Error creating group",
                error: error.message  // Send the error message
            });
        }
    }
}

module.exports = groupHandler