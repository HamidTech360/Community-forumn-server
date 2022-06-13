import joi from 'joi-browser'

export const validateComment = (payload:any)=>{
    const schema = {
        comment:joi.string().required()
    }

    return joi.validate(payload, schema)
}