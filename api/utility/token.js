
import jwt from 'jsonwebtoken';

/**
 * Create jwt token
 */

export const createToken = (payload, exp) => {

    // create new token
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: exp

    });

}

/**
 * Jwt verify
 */
export const tokenVerify = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}