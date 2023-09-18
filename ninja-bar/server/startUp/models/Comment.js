import { Schema, model } from "mongoose";

// Модель для сравнения БД в моке и МонгоДБ
// Без урл и ид
// В userId применена связь разных БД
// timestamps изменён для оперирования сразу на ФЭ
// В pageId применена ссылка на разные модели (нагуглил)
// timestamps: { createdAt: created_at } Минина даёт баг

// если последнее изменение - реквайред с тру на фалс или наоборот, то нодемон не подхватывает изменения!!! БАГ
// видимо из-за кеша
// а если последнее изменение - комментарий, после изменения реквайредов, то - подхватывает!!!

const schema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    pageId: {
      type: Schema.Types.ObjectId,
      refPath: "onModel",
      required: false,
    },
    onModel: {
      type: String,
      required: false,
      enum: ["Pizza", "Drink", "Sauce"],
    },
  },
  {
    timestamps: true,
  }
);
//
const Comment = model("Comment", schema);

export default Comment;
