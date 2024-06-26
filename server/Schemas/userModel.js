import { Schema, model } from 'mongoose'
const userModel = new Schema({
  fullName: {
    type: String,
    required: [true, "Name is required"],
    minlength: [5, "Name must be of atleast 5 characters"],
    maxLength: [50, "Name must be of atmost 50 characters"],
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  subscription: {
    id: String,
    status: String,
  },
  avatar: {
    public_id: {
      type: String,
    },
    secure_url: {
      type: String
    }
  },
  role:{
    type:String,
    enum:['USER','ADMIN'],
    default:'USER'
  },
  ForgetPasswordToken:{
    type:String
  },
  ForgetPasswordExpiry:{
    type:Date,
  }
// },{
//   timestamps:true
// }
})
const user = model('users', userModel)
export default user