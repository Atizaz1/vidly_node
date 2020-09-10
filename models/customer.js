const Joi      = require('joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    isGold:
    {
        type:Boolean,
        default:false,
    },
    name:
    {
        type:String,
        required: true,
        minlength:5,
        maxlength:50,
    },
    phone:
    {
        type:String,
        required: true,
        minlength:5,
        maxlength:50,
    }
});

function validateCustomer(customer)
{
    const schema=Joi.object({
        isGold: Joi.boolean(),
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().required(),
    });

    return schema.validate(customer);
}

const Customer         = new mongoose.model('Customer', customerSchema);

exports.customerSchema = customerSchema;
exports.Customer       = Customer;
exports.validate       = validateCustomer;