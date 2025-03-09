import {storeService} from '../services/storeService.js';

export const getStoreItems = async (req, res) => {
    try {
        console.log("getting store items");
        const items = await storeService.getStoreItems();
        console.log("store items: ", items);
        res.json(items)
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const createStoreItem = async (req, res) => {
    //do a bit of input validation first
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({message: 'Name and price are required'});
    }
    try {
        const item = await storeService.createStoreItem(req.body);
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}