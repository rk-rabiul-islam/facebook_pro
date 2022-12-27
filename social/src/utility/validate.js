

/**
 *  Email validator
 */
export const isEmail = (email) => {
    return /^[^\.-/][a-z0-9-_\.]{1,}@[a-z0-9]{1,}\.[a-z\.]{2,}$/.test(email);
}


/**
 *  mobile validator
 */
export const isMobile = (mobile) => {
    return /^(01|8801|\+8801)[0-9]{9}$/.test(mobile);
}


/**
 *  data validator
 */
export const isString = (data) => {
    return /^[a-z@\.]{1,}$/.test(data);
}


/**
 *  Number validator
 */
export const isNumber = (Number) => {
    return /^[0-9\+]{1,}$/.test(Number);
}
