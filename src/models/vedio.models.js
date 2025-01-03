import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
  {
      videoFiles: {
          types: String,
          required: true,
      },
      thumbnails: {
        types: String,
        required: true,
      },
      title: {
        types: String,
        required: true,
      },
      description: {
        types: String,
        required: true,
      },
      duration: {
        type: Number,
        required: true
      },
      view: {
        type: Number,
        default: 0
      },
      isPublished: {
        type: Boolean,
        default: true
      },
      owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
  },

  {
    timestamps: true
  }
)

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Vedio", videoSchema)