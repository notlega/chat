import { useEffect } from 'react';
import { useFormik } from 'formik';
import { z } from 'zod';
import {
  Checkbox,
  FormLabel,
  TextField,
  Typography,
  Button,
  Link,
} from '@mui/material';
import { toFormikValidationSchema } from 'zod-formik-adapter';

import hello from '../styles/hello.png';
import MyComponent from '../components/centeredDiv';

interface Values {
  email: string;
  password: string;
}

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const validationSchema = z.object({
  email: z.string().email({ message: 'Must be a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .trim(),
});

const LoginForm = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validateOnBlur: true,
    validateOnChange: true,
    validateOnMount: true,
    validationSchema: toFormikValidationSchema(validationSchema),
    onSubmit: (values: Values) => {
      alert(JSON.stringify(values, null, 2));
      console.log(values);
      console.log(hello);
    },
  });

  return (
    <MyComponent>
      {/* <img src={hello} alt="hello" width="1000" height="300" /> */}
      <form onSubmit={formik.handleSubmit}>
        <Typography variant="h6" sx={{ m: 1 }}>
          This is a PropNex Friends Exclusive Content. Do log in with your
          Email/Password.
        </Typography>
        <div>
          <TextField
            sx={{ m: 2, width: '30%' }}
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
          <TextField
            sx={{ m: 2, width: '30%' }}
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
        {/* <Typography variant="h5">Password</Typography> */}
        <div>
          <Checkbox {...label} />
          <FormLabel>Remember me</FormLabel>
          {/* sx={{display:"flex", justifyContent:"flex-end"}} */}
          <Link href="#" sx={{ m: 2 }}>
            Forget Password
          </Link>
        </div>
        <div>
          <Button type="submit" variant="contained" sx={{ m: 2 }}>
            Login
          </Button>
        </div>
        {/* <button type="submit">Login</button>  */}
      </form>
    </MyComponent>
  );
};

export default LoginForm;