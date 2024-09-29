//this creates our own error to give clear error to users
export const createError = (status,message)=>{
    const err = new Error()
    err.status = status
    err.message = message
    return err;
} 