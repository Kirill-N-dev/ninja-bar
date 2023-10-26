import { Schema, model } from "mongoose";

// Модель для сравнения БД в моке и МонгоДБ

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    img_url: [{ type: String, required: true }],
    ingredients: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["pizzas", "drinks", "sauces"],
    },
  },
  { timestamps: true }
);

const Goods = model("Goods", schema);
export default Goods;
