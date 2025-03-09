import {StoreItem} from '../domain/StoreItem.js';

class StoreService {

    getStoreItems = async () => {
        const storeItem = await StoreItem.find();
        console.log("store items: ", storeItem);
        return storeItem;
    }
}

export const storeService = new StoreService();

export {StoreService};