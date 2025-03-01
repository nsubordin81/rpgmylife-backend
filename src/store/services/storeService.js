import {StoreItem} from '../domain/StoreItem.js';

class StoreService {

    static async getStoreItems() {
        return await StoreItem.find();
    }
}

export const storeService = new StoreService();

export {StoreService};