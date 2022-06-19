import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector, batch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Formik, Form, useField } from 'formik'
import * as Yup from 'yup'
import styled from 'styled-components/macro'

import LoadingAnimation from '../components/LoadingAnimation'
import { API_URL } from '../utils/utils'
import user from '../reducers/user'
import { OuterWrapper, InnerWrapper } from '../styles/GlobalStyles'
import { StyledButton } from '../styles/ButtonStyles'
import loginImage from "../styles/images/login-image.png"


const MyTextInput = ({ label, ...props }) => {
	const [field, meta] = useField(props)
	return (
		<InputContainer>
			<label htmlFor={props.id || props.name}>{label}</label>
			<input className='text-input' {...field} {...props} />
			{meta.touched && meta.error ? <StyledError className='error'>{meta.error}</StyledError> : null}
		</InputContainer>
	)
}

const Login = () => {
	const [mode, setMode] = useState('login')
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const userId = useSelector((store) => store.user.userId)
	console.log('userId', userId)
	const accessToken = useSelector((store) => store.user.accessToken)

	const handleLoginSuccess = (data) => {
		console.log('programs from user', data, data.program)
		batch(() => {
			dispatch(user.actions.setUserId(data.userId))
			dispatch(user.actions.setAccessToken(data.accessToken))
			dispatch(user.actions.setUserName(data.username))
			if (data.program) {
				dispatch(user.actions.setProgram(data.program))
			} else {
				dispatch(user.actions.setProgram([]))
			}
			dispatch(user.actions.setError(null))
		})
	}
	const handleLoginFailure = (data) => {
		batch(() => {
			dispatch(user.actions.setError(data.response))
			dispatch(user.actions.setUserId(null))
			dispatch(user.actions.setAccessToken(null))
			dispatch(user.actions.setUserName(null))
			dispatch(user.actions.setProgram(null))
		})
	}

	useEffect(() => {
		if (accessToken) {
			navigate('/mypage')
		}
	}, [accessToken, navigate, userId])

	let Schema = {}
	if (mode === 'register') {
		Schema = Yup.object().shape({
			username: Yup.string().required('Username is required'),
			password: Yup.string()
				.required('Password is required')
				.min(8, 'The password must contain at least 8 characters'),
			confirmPassword: Yup.string()
				.required('Please, fill in your password again')
				.oneOf([Yup.ref('password'), null], 'Passwords must match'),
		})
	} else if (mode === 'login') {
		Schema = Yup.object().shape({
			username: Yup.string().required('Username is required'),
			password: Yup.string()
				.required('Password is required')
				.min(8, 'The password must contain at least 8 characters'),
		})
	}

	return (
		<OuterWrapper>
			<InnerWrapper margin="0 auto">
				<StyledImage src={loginImage} />

				<TitleContainer>
					{mode === 'login' ? <StyledTitle>Login and start moving!</StyledTitle> : <StyledTitle>Register for Flex 'n Joy!</StyledTitle>}
					{mode === "register" ? <p>Flex 'n Joy gives you the opportunity to bring your workouts with you wherever you go, easily and effectively!</p> : null}
				</TitleContainer>

				<Formik
					initialValues={{ username: '', password: '', confirmPassword: '', email: '' }}
					validationSchema={Schema}
					onSubmit={(values, { setSubmitting, resetForm }) => {
						fetch(API_URL(mode), {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({ username: values.username, password: values.password }),
						})
							.then((res) => res.json())
							.then((data) => {
								console.log('data passed to function from fetch in', data)
								handleLoginSuccess(data)
								setMode('login')
							})
							.catch((err) => {
								handleLoginFailure(err)
							})
							.finally(() => {
								setSubmitting(false)
								resetForm()
							})
					}}
				>
					{({ isSubmitting }) => (
						<StyledForm>
							{isSubmitting && <LoadingAnimation />}

							<StyledInput label='Username' name='username' type='text' />

							{/* <StyledInput
                                    label="Email address"
                                    name="email"
                                    type="email" 
                                    /> */}

							<StyledInput label='Password' name='password' type='password' />

							{mode === 'register' ? (
								<StyledInput label='Confirm password' name='confirmPassword' type='password' />
							) : null}

							{mode === 'login' ? (
								<StyledButton
								background="var(--primary)"
								margin="1em 0 0"
								padding="6px 18px"
								boxShadow="0px 10px 13px -7px #808080"
								fontSize="10px"
								type='submit'>Login</StyledButton>
							) : (
								<StyledButton
								background="var(--primary)"
								margin="1em 0 0"
								padding="6px 18px"
								boxShadow="0px 10px 13px -7px #808080"
								fontSize="10px"
								type='submit'>Register</StyledButton>
							)}

							{mode === 'login' ? (
								<StyledButton
								background="transparent"
								margin="1em 0 0"
								padding="6px 18px"
								boxShadow="0px 10px 13px -7px #808080"
								textDecoration="underline"
								fontSize="10px"
								type='button' onClick={() => setMode('register')}>
									Not a member yet? Register here
								</StyledButton>
							) : (
								<StyledButton
								background="transparent"
								margin="1em 0 0"
								padding="6px 18px"
								boxShadow="0px 10px 13px -7px #808080"
								textDecoration="underline"
								fontSize="10px"
								type='button' onClick={() => setMode('login')}>
									Already a member? Login here
								</StyledButton>
							)}
						</StyledForm>
					)}
				</Formik>
			</InnerWrapper>
		</OuterWrapper>
	)
}

export default Login

const TitleContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	margin-bottom: 2rem;
`

const StyledImage = styled.img`
	width: 300px;
	height: auto;
`

const StyledTitle = styled.h1``

const StyledForm = styled(Form)`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background: var(--secondary);
	padding: 2rem;
	border-radius: 6px;
	box-shadow: 0px 10px 13px 0px #808080;
`
const InputContainer = styled.div`
	display: flex;
	flex-direction: column;

	label {
		justify-content: flex-start;
	}
`

const StyledInput = styled(MyTextInput)`
	max-width: 150px;
	margin: 0.5rem 0;
	text-align: center;
	border: none;
	border-radius: 10px;
	padding: 6px 10px;
	box-shadow: inset 0px 4px 4px 0px #ADADAd;

	&:focus {
		outline: none;
		border: 2px solid var(--accentgreen);
	}
`

const StyledError = styled.div`
	margin-bottom: 1.5rem;
	text-align: center;
	color: var(--accentlilac);
`

// const StyledSecondaryButton = styled.button`
// 	border-radius: 15px;
// 	font-family: 'poppins';
// 	text-transform: uppercase;
// 	background: transparent;
// 	border: none;
// 	padding: 6px 18px;
// 	margin-top: 1em;

// 	&:hover {
// 		text-decoration: underline;
// 	}
// `
