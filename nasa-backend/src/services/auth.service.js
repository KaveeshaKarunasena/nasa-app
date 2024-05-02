import { hash as _hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import accountModel from '../models/account.model.js';
import emailService from './email.service.js';

function createPasswordHash(password) {
  return _hash(password, 10);
}

async function validatePassword(password, hash) {
  return await compare(password, hash);
}

async function signToken(password, hash, payload) {
  const isValidPassword = await validatePassword(password, hash);
  if (!isValidPassword) {
    throw 'Invalid Password';
  } else {
    const token = await jwt.sign(payload, process.env.APP_SECRET, {
      expiresIn: process.env.APP_ACCESS_TOKEN_EXP_SECS,
    });
    return {
      token,
      life: process.env.APP_ACCESS_TOKEN_EXP_SECS,
    };
  }
}

async function verifyToken(token) {
  const payload = await jwt.verify(token, APP_SECRET, {
    expiresIn: process.env.APP_ACCESS_TOKEN_EXP_SECS,
  });
  return payload;
}

//login fuction
async function login(email, password) {
  const acc = await accountModel.findOne({ email: email });

  if (!acc) {
    throw 'Account Not Found';
  }
  //generate the jwt access token by calling getToken function
  const token = await signToken(password, acc.password, {
    id: acc._id.toString(),
    email: acc.email,
    role: acc.role,
  });
  return token;
}

//register accounts
async function register(dto) {
  try {
    //verify the email that provided with the email token using redis service
    dto.email = await emailService.verifyEmailToken(dto.email, dto.email_token);

    const existUser = await accountModel.findOne({ email: dto.email });
    if (existUser) {
      throw 'Account already exist for this email address';
    }

    //creates hash password and assing it to password
    const pass_hash = await createPasswordHash(dto.password);
    let cpyUser = { ...dto };
    cpyUser.password = pass_hash;

    const newUser = await accountModel.create(cpyUser);
    return newUser;
  } catch (err) {
    throw err;
  }
}

const checkEmail = async userEmail => {
  try {
    const existUser = await accountModel.findOne({ email: userEmail });
    if (!existUser) {
      throw 'The email is not found';
    }

    return { res: 'Email found' };
  } catch (err) {
    throw err;
  }
};

const resetPassword = async (email, newPassword) => {
  try {
    const pass_hash = await createPasswordHash(newPassword);
    const updatedAccount = await accountModel.findOneAndUpdate(
      { email: email },
      { password: pass_hash },
      { new: true },
    );
    if (updatedAccount) {
      return { res: 'Update successful', account: updatedAccount };
    } else {
      throw 'Password update failed';
    }
  } catch (err) {
    throw err;
  }
};

export default {
  verifyToken,
  signToken,
  validatePassword,
  createPasswordHash,
  login,
  register,
  checkEmail,
  resetPassword,
};
