import joi from 'joi-browser'

export const validatePost = (payload:any)=>{
    const schema = {
        postTitle:joi.string().required(),
        postBody:joi.string().required()
    }

    return joi.validate(payload, schema)
}

