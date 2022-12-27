// init 
const initialState = {
    msg: "",
    type: "error",
}



// create toast reducer
const toastReducer = (state = initialState, { type, payload }) => {

    switch (type) {
        case "":

            break;

        default:
            return state;
    }
}

// export default
export default toastReducer;