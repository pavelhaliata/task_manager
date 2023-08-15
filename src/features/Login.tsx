import React, {useEffect} from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {Button,Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Grid, TextField, Typography} from "@material-ui/core";
import { loginAsync } from "../app/auth_reducer";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { AppRootState } from "../app/store";
import {useNavigate} from "react-router-dom";


export const Login = React.memo(() => {
    console.log('render login')
    const navigate = useNavigate();
    const isLoggedIn = useSelector<AppRootState, boolean>(state => state.authData.isLoggedIn)
    const dispatch = useDispatch<any>()

    const formik = useFormik({
      initialValues: {
        email: '',
        password: '',
        rememberMe: false
      },
      validationSchema: Yup.object({
        email: Yup.string().email('Invalid email address').required('Required'),
        password: Yup.string().required('Required'),
        rememberMe: Yup.boolean()
      }),
      onSubmit: values => {
        dispatch(loginAsync(values))
      },
    });

    useEffect(()=>{
        isLoggedIn && navigate('/')
    }, [isLoggedIn, navigate])

    return (
        <>
          <Grid container justifyContent="center">
            <Grid item lg={4} sm={6} xs={12}>
              <form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
                <FormControl fullWidth>
                  <FormLabel>Sign in:</FormLabel>
                  <FormGroup>
                   <TextField label="Enter your email" type="email" {...formik.getFieldProps('email')}/>
                    {formik.touched.email && formik.errors.email ? 
                    <FormHelperText variant="outlined" error>{formik.errors.email}</FormHelperText> : <FormHelperText variant="outlined">email</FormHelperText>}
                    <TextField label="Enter your pass" type="password" {...formik.getFieldProps('password')}/>
                    {formik.touched.password && formik.errors.password ? 
                    <FormHelperText variant="outlined" error>{formik.errors.password}</FormHelperText> : <FormHelperText variant="outlined">password</FormHelperText>}
                    <FormControlLabel control={<Checkbox color="primary" checked={formik.values.rememberMe} {...formik.getFieldProps('rememberMe')}/>}
                                      label={<Typography color="textSecondary">Remember
                                        me</Typography>}/>
                    <Button type={"submit"} color="primary" variant="outlined" fullWidth>sign in</Button>
                  </FormGroup>
                </FormControl>
              </form>
            </Grid>
          </Grid>
        </>
    );
});