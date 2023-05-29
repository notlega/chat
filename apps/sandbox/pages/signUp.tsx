import { useFormik } from 'formik';
import { z } from 'zod';
import { TextField, Typography, Button} from '@mui/material';
import hello from "../styles/hello.png";
import MyComponent from '../components/centeredDiv';
import { toFormikValidationSchema } from 'zod-formik-adapter';

interface Values {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const validationSchema = z.object({
    fullName: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: 'Must be a valid email.' }).trim(),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .trim(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
    })  ;

const SignUpForm = () => {
    const formik = useFormik({
        initialValues: {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validateOnBlur: true,
        validateOnChange: true,
        validateOnMount: true,
        validationSchema: toFormikValidationSchema(validationSchema),
        onSubmit: (values: Values) => {
            alert(JSON.stringify(values, null, 2));
            console.log(values)
            console.log(hello)
        }
    })
    return (
        <MyComponent> 
            <form onSubmit={formik.handleSubmit}>
            <Typography variant="h4" sx={{m:1, fontWeight:'bold'}}>PropNex Friends Registration Form</Typography>
            <Typography variant="h6" sx={{m:1, mx:'20%'}}>Enjoy FREE membership and unlock an amazing lifetime membership and receive exclusive invites to our property launches, events, parties and awesome lifestyle deals, rewards and 24/7 access to PropNex TV.</Typography>
            <div>
            <TextField sx={{ m:2, width:'30%'}}
                id="fullName"
                name="fullName"
                type="fullName"
                label="Full Name"
                variant="filled"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.fullName}
            />
            {formik.touched.fullName && formik.errors.fullName ? (
                <div>{formik.errors.fullName}</div>
            ) : null}
            </div>
            <div>
            <TextField sx={{ m:2, width:'30%'}}
                id="email"
                name="email"
                type="email"
                label="Email"
                variant="filled"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
                <div>{formik.errors.email}</div>
            ) : null}
            </div>
            
            <div>
            <TextField sx={{ m:2, width:'30%'}}
                id="password"
                name="password"
                type="password"
                label="Password"
                variant="filled"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
            /> 
            {formik.touched.password && formik.errors.password ? (
                <div>{formik.errors.password}</div>
            ) : null}
            </div>
            <div>
            <TextField sx={{ m:2, width:'30%'}}
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                variant="filled"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
            /> 
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                <div>{formik.errors.confirmPassword}</div>
            ) : null}
            </div>

            <div>
                <Button type="submit" variant="contained" sx={{m:2}}>Sign Up</Button>
            </div>
            {/* <button type="submit">Login</button>  */}
            
        </form>
        </MyComponent>
    )
}

export default SignUpForm;