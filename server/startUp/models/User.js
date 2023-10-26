import { Schema, model } from "mongoose";

// Модель для сравнения БД в моке и МонгоДБ
// Без урл и ид
const schema = new Schema(
  {
    name: {
      type: String,
    },
    surname: {
      type: String,
    },
    patronymic: {
      type: String,
    },
    phone: {
      type: Number,
      unique: true,
    },
    password: {
      type: String,
    },
    sex: {
      type: String,
    },
    region: {
      type: String,
    },
    city: {
      type: String,
    },
    street: {
      type: String,
    },
    apartment: {
      type: String,
    },
    license: {
      type: Boolean,
    },
    isSeller: { type: Boolean },
    cart: [
      {
        id: String,
        pcs: Number,
        _id: false,
      },
    ],
    /* onModel: {
      type: String,
      enum: ["Pizza", "Drink", "Sauce"],
    }, */
  },
  { timestamps: true }
);

const User = model("User", schema);
export default User;
