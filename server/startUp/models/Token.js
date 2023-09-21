import { Schema, model } from "mongoose";

// Модель для сравнения БД в моке и МонгоДБ
// Без урл и ид
// Токены принято хранить в БД, чтобы избежать взлома
// В user применена связь разных БД

const schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
// Выше был нерабочий код Минина timestamps: { createdAt: created_at }
const Token = model("Token", schema);
export default Token;
