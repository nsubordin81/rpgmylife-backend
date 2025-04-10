import { mongoose } from "mongoose"

const StoreItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    price: { type: Number, required: true, min: 1 },
    requiredLevel: { type: String, required: true },
    purchased: { type: Boolean, default: false },
    notes: { type: String, required: false },
  },
  {
    timestamps: true,
  }
)

export const storeitems = mongoose.model("StoreItem", StoreItemSchema)
