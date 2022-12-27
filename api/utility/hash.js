import bcrypt from 'bcryptjs';

/**
 * create a hash password
 */
export const hashPassword = (password) => {

    // slat gan
    const salt = bcrypt.genSaltSync(12);
    const hashpass = bcrypt.hashSync(password, salt);
    return hashpass;
}


/**
 * create a  password match
 */
export const passwordVerify = (password, hash) => {


    return bcrypt.compareSync(password, hash);
}