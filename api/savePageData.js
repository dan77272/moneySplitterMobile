
const Page = require('../models/Page')

async function savePageDataHandler(req, res) {
    
    if (req.method === 'POST') {
        const { id, groupName, people, members, payment, reason, transactions, count } = req.body;
        console.log(req.body)
        try {
            const pageData = new Page({ id: id, groupName, people, members, payment: payment, reason: reason, transactions, count });
            await pageData.save();
            res.status(200).json({ message: 'Page data saved successfully' });
        } catch (error) {
            console.error('Error saving page data:', error);
            res.status(500).json({ message: 'Error saving page data', error: error.message });
        }
    }else if(req.method === 'PUT'){
        try{
            const {id, groupName, people, members, payment, reason, transactions, pageId, count } = req.body;
            const update = { groupName, people, members, payment, reason, transactions, count }
            const updatedPageData = await Page.findOneAndUpdate({id: pageId}, update, {new: true}).lean()
            if (updatedPageData) {
                res.status(200).json({ message: 'Page data updated successfully', data: updatedPageData });
            } else {
                res.status(404).json({ message: 'Page not found' });
            }
        } catch (error) {
            console.error('Error saving page data:', error);
            res.status(500).json({ message: 'Error saving page data', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}

module.exports = savePageDataHandler
