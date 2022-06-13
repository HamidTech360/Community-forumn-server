import joi from 'joi-browser'

export const validateUser = (payload:any)=>{
    const schema = {
        email:joi.string()
    }
    return joi.validate(payload, schema)
}