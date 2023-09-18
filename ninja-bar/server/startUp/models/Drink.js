import { Schema, model } from "mongoose";

// Модель для сравнения БД в моке и МонгоДБ
// Без урл и ид
const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: false,
    },
    img_url: {
      type: String,
      required: true,
    },
    ingredients: {
      type: Array,
      required: false,
    },
    weight: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Drink = model("Drink", schema);
export default Drink;
