import { Schema, model } from "mongoose";

// Модель для сравнения БД в моке и МонгоДБ
// Без урл и ид
const schema = new Schema(
  {
    name: {
      type: String,
      /* required: true, */
    },
    surname: {
      type: String,
      /*  required: true, */
    },
    lastname: {
      type: String,
      /*   required: true, */
    },
    age: {
      type: Number,
      /*  required: true, */
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      /*  required: true, */
    },
    sex: {
      type: String,
      /*  required: true, */
      enum: ["мужской", "женский", "другой"],
    },
    profession: {
      type: Array,
      /*  required: true, */
    },
    country: {
      type: String,
      /*  required: true, */
    },
    region: {
      type: String,
      /*  required: true, */
    },
    city: {
      type: String,
      /*   required: true, */
    },
    street: {
      type: String,
      /*  required: true, */
    },
    apartment: {
      type: Number,
      /*   required: true, */
    },
    tel: {
      type: Number,
      /*  required: true, */
    },
  },
  { timestamps: true }
);
const User = model("User", schema);
export default User;
