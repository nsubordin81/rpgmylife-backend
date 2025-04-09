import express from "express"
import {
  getStoreItems,
  createStoreItem,
  purchaseStoreItem,
} from "./storeController.js"

const router = express.Router()

// I need a route for getting store items
router.get("/", getStoreItems)

// I need a route for purchasing store items
router.put("/purchase", purchaseStoreItem)
// I need a route for removing store items

// I need a route for adding store items
router.post("/", createStoreItem)

export { router as storeRoutes }
