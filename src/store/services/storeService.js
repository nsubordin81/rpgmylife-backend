import {StoreItem} from '../domain/StoreItem.js';

class StoreService {

    getStoreItems = async () => {
        const storeItem = await StoreItem.find();
        console.log("store items: ", storeItem);
        return storeItem;
    }

    createStoreItem = async (data) => {
        const storeItem = new StoreItem(data);
        await storeItem.save();
        return storeItem;
    }
}

export const storeService = new StoreService();

export {StoreService};