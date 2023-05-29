import React from 'react';
import { useFormik } from 'formik';
import { TextField, Typography, Button, Link} from '@mui/material';
import { styled } from '@mui/system';
import hello from "../styles/hello.png";

interface Values {
    email: string;
    password: string;
}

const MyComponent = styled('div')({
    // color: 'darkslategray',
    // backgroundColor: 'aliceblue',
    padding: 80,
    borderRadius: 4,
    textAlign: 'center',
    
  });

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const AdminLoginForm = () => {
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('*Required'),
            password: Yup.string().min(8, 'Must be 8 characters or more').required('*Required'),
        }),
        onSubmit: (values: Values) => {
            alert(JSON.stringify(values, null, 2));
            console.log(values)
            console.log(hello)
        }
    })
    return (
        <MyComponent>
            {/* <img src={hello} alt="hello" width="1000" height="300" /> */}
            <form onSubmit={formik.handleSubmit}>
            <Typography variant="h6" sx={{m:1}}>Agent Login. Do log in with your Email/Password.</Typography>
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
                <div><Typography sx={{color:'red'}}>{formik.errors.email}</Typography></div>
            ) : null}
            </div>
            
            <div>
            <TextField fullWidth sx={{ m:2, }}
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
                <div><Typography sx={{color:'red'}}>{formik.errors.password}</Typography></div>
            ) : null}
            </div>
            <div>
                <Link href="#" sx={{m : 2}}>Forget Password? Reset Here</Link>
            </div>
            <div>
                <Button type="submit" variant="contained" sx={{m:2}}>Login</Button>
            </div>
            {/* <button type="submit">Login</button>  */}
            
        </form>
        </MyComponent>
    )
}

export default AdminLoginForm;