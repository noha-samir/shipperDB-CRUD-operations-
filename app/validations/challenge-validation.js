const Joi = require('joi');

// schema options
const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};

////////////////////////////////////////////////////////////////////////////////////

const paramsIdSchema = Joi.object().keys({
    challengeId: Joi.number().positive().integer().error(new Error("ID must be positive integer!!!")),
});

module.exports.validParamsId = function (req, res, next) {
    // validate request body against schema
    const { error, value } = paramsIdSchema.validate(req.params, options);
    if (error) {
        // on fail return comma separated errors
        let Err = new Error();
        Err.message = `Validation error: ${error.message}`;
        next(Err);
    } else {
        // on success replace req.body with validated value and trigger next middleware function
        req.body = value;
        next();
    }
}
////////////////////////////////////////////////////////////////////////////////////////

// create schema object
const challengeInsertionSchema = Joi.object().keys({
    name: Joi.string().error(new Error("Name must be string!!!")),
    visibilityType: Joi.number().positive().integer().error(new Error("visibilityType must be positive integer!!!")),
    description: Joi.string().error(new Error("description must be string!!!")),
    tags: Joi.string().error(new Error("tags must be string!!!")),
    location: Joi.string().error(new Error("location must be string!!!")),
    startDate : Joi.date().error(new Error("Invalid date format!!!")),
    endDate : Joi.date().error(new Error("Invalid date format!!!")),
    image: Joi.string().error(new Error("image must be string!!!")),
    isActive : Joi.boolean().error(new Error("isActive must be boolean!!!")),
    userId: Joi.number().positive().integer().error(new Error("userId must be positive integer!!!")),
});

module.exports.validChallengeInsertion = function (req, res, next) {
    // validate request body against schema
    const { error, value } = challengeInsertionSchema.validate(req.body, options);
    if (error) {
        // on fail return comma separated errors
        let Err = new Error();
        Err.message = `Validation error: ${error.message}`;
        next(Err);
    } else {
        // on success replace req.body with validated value and trigger next middleware function
        req.body = value;
        next();
    }
}
////////////////////////////////////////////////////////////////////////////////////////

// create schema object
const challengeModificationSchema = Joi.object().keys({
    id: Joi.number().positive().integer().error(new Error("ID must be positive integer!!!")),
    name: Joi.string().error(new Error("Name must be string!!!")),
    visibilityType: Joi.number().positive().integer().error(new Error("visibilityType must be positive integer!!!")),
    description: Joi.string().error(new Error("description must be string!!!")),
    tags: Joi.string().error(new Error("tags must be string!!!")),
    location: Joi.string().error(new Error("location must be string!!!")),
    startDate : Joi.date().error(new Error("Invalid date format!!!")),
    endDate : Joi.date().error(new Error("Invalid date format!!!")),
    image: Joi.string().error(new Error("image must be string!!!")),
    isActive : Joi.boolean().error(new Error("isActive must be boolean!!!")),
    userId: Joi.number().positive().integer().error(new Error("userId must be positive integer!!!")),
});

module.exports.validChallengeModification = function (req, res, next) {
    // validate request body against schema
    const { error, value } = challengeModificationSchema.validate(req.body, options);
    if (error) {
        // on fail return comma separated errors
        let Err = new Error();
        Err.message = `Validation error: ${error.message}`;
        next(Err);
    } else {
        // on success replace req.body with validated value and trigger next middleware function
        req.body = value;
        next();
    }
}