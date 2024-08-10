const express = require('express');
const AppError = require('./AppError');
const app = express();
const z = require('zod');

app.use(express.json());

function validateUserDetailsMiddleware(req,res,next){
    const user = req.body;
   
    
    const schema = z.object({
        firstName: z.string({message:'first name should  be string'}).min(3,{message:'fistname should be minimum three character'}).max(12,{message:'firstname maximum should be 12 characters'}),
        lastName:z.string().min(3).max(10),
        email:z.string().email({message:'Email shoudl be @gmail.com domain'}),
        aadhaar:z.string().min(12).max(12),
        dob: z.string()
    })

    let isUserValidated = schema.safeParse(user);

    if(!isUserValidated.success){

        const errorMessages = isUserValidated.error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message
        }));
        


        return next(new AppError(JSON.stringify(errorMessages),400))
    }

    next();
}

// checking is aadhhar number a valid aadhaar or not
function isAadhaarValidMiddleware(req,res,next){

    const aadhaarNum = '345637863268';
    let aadhaarNumber = req.body.aadhaar;
    if (aadhaarNumber.length !== 12) {
        return next(new AppError('Aadhaar Number should be 12 digits', 400, 'INVALID_AADHAAR_LENGTH', {
            receivedLength: aadhaarNumber.length,
            requiredLength: 12
        }));
    } else if (aadhaarNum !== aadhaarNumber) {
        return next(new AppError('Invalid Aadhaar Number', 401, 'INVALID_AADHAAR_NUMBER', {
            providedAadhaar: aadhaarNumber
        }));
    }
    next()
   
}

function isUserAgeIsValidMiddleware(req,res,next){

    let dob = req.body.dob;
    let dateOfBirth = new Date(dob);
    const currentDate = new Date();

    let age = currentDate.getFullYear() - dateOfBirth.getFullYear();
    if(age < 18){
        return next(new AppError("Age is not valid for application regsitration",401,"INVALID_AGE",{requiredAge:18,providedAge:age}))
    }
    next();
}



app.get('/user-e-verfication',validateUserDetailsMiddleware,isAadhaarValidMiddleware,isUserAgeIsValidMiddleware,(req,res)=> {  

    res.send("valid user")
})



// Global error-handling middleware
function globalErrorHandler(err, req, res, next) {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // parse error messages if they are JSON stringified
    let errorDetails = err.message;
    try {
        errorDetails = JSON.parse(err.message);
    } catch (e) {
        // If parsing fails, assume the message is plain text
        errorDetails = err.message;
    }

    res.status(err.statusCode).json({
        status: err.status,
        errors: errorDetails,
        errorCode: err.errorCode || 'VALIDATION_ERROR',
        details: err.details || null,
        timestamp: new Date().toISOString(),
    });
}

app.use(globalErrorHandler);


app.use(globalErrorHandler)



const PORT = 4566;
app.listen(PORT,()=> {console.log(`server is running on ${PORT}`)})