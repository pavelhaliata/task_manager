import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel,
    Grid,
    TextField,
    Typography
} from "@material-ui/core";
import {useFormik} from 'formik';
import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import * as Yup from 'yup';
import {authActions, authSelectors} from "./";
import {useDispatchedActions} from "../../hooks/useAppDispatch";


export const Login = React.memo(() => {
    const {loginAsync} = useDispatchedActions(authActions)

    const navigate = useNavigate();
    
    const isLoggedIn = useSelector(authSelectors.isLoggedIn)

    useEffect(()=>{
        isLoggedIn && navigate('/')
    }, [isLoggedIn, navigate])

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
      onSubmit: async values => {
        const action = await loginAsync(values)
        console.log(action)
          // !!! Досмотреть видос Димыча рефакторинг санок, про валидацию input
      },
    });


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
