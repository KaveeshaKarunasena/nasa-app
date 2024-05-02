import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AccountSchema = new Schema(
  {
    fname: {
      type: String,
      require: true,
    },
    lname: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    deleted_at: {
      type: Number,
    },
  },
  { timestamps: true },
);

const Account = mongoose.model('Account', AccountSchema);
export default Account;
