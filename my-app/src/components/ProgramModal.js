import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { program } from '../reducers/program'
import styled from 'styled-components/macro'
import { Formik, Form, useField } from 'formik'
import * as Yup from 'yup'

import ui from '../reducers/ui'
import { API_URL } from '../utils/utils'

const MyTextInput = ({ label, ...props }) => {
	const [field, meta] = useField(props)
	return (
		<>
			<label htmlFor={props.id || props.name}>{label}</label>
			<input className='text-input' {...field} {...props} />
			{meta.touched && meta.error ? <StyledError className='error'>{meta.error}</StyledError> : null}
		</>
	)
}

const MyCheckbox = ({ label, ...props }) => {
	const [field, meta] = useField({ ...props, type: 'radio' })
	return (
		<>
			<label htmlFor={props.id || props.name}>{label}</label>
			<input className='radio-input' {...field} {...props} type='radio' />

			{meta.touched && meta.error ? <StyledError className='error'>{meta.error}</StyledError> : null}
		</>
	)
}

const ProgramModal = ({ showModal, setShowModal }) => {
	//refactor to use store instead of sending props to MyPage..
	const [programId, setProgramId] = useState('')
	const userId = useSelector((store) => store.user.userId)
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const closeModal = () => {
		setShowModal((prev) => !prev)
	}

	const handleData = (data) => {
		dispatch(program.actions.setProgramName(data.response))
		dispatch(program.actions.setProgramType(data.response))
		dispatch(program.actions.setProgramId(data.response))
		setProgramId(data.response._id)
		console.log('hello', data.response._id)
		navigate(`/addprogram/${data.response._id}`) //<---------------------change!
	}

	const Schema = Yup.object().shape({
		programName: Yup.string().required('Program name is required'),
		programType: Yup.string().required('You have to choose a program type'),
	})

	return (
		<>
			{showModal ? (
				<ModalContainer showModal={showModal}>
					<StyledModal>
						<CloseButton onClick={closeModal}>x</CloseButton>
						<Formik
							initialValues={{
								programName: '',
								programType: '',
							}}
							validationSchema={Schema}
							onSubmit={(values, { setSubmitting, resetForm }) => {
								fetch(API_URL(`program/${userId}`), {
									method: 'POST',
									headers: {
										'Content-Type': 'application/json',
									},
									body: JSON.stringify({
										programName: values.programName,
										programType: values.programType,
									}),
								})
									.then((res) => res.json())
									.then((data) => {
										// console.log(data)
										handleData(data)
										// console.log(data.response._id)
									})
									.catch((err) => {
										console.log(err)
									})
									.finally(() => {
										setSubmitting(false)
										resetForm()
										// window.location.reload()
									})
							}}
						>
							{({ isSubmitting }) => (
								<StyledForm>
									<StyledInput label='Program name' name='programName' type='text' />

									<MyCheckbox label='Weights' name='programType' value='weights' />

									<MyCheckbox label='Cardio' name='programType' value='cardio' />

									<StyledButton type='submit'>Add program</StyledButton>
								</StyledForm>
							)}
						</Formik>
					</StyledModal>
				</ModalContainer>
			) : null}
		</>
	)
}

export default ProgramModal

const ModalContainer = styled.div`
  position: fixed;
  z-index: 1
  margin-top: 100px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background: rgb(0,0,0,0.2); // <-------------- change
  `

const StyledModal = styled.div`
	background: white;
	margin: auto;
	padding: 20px;
	border: 1px solid #888;
	width: 80%;
`

const CloseButton = styled.button``

const StyledForm = styled(Form)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin: 2rem 0 0;
`

const StyledInput = styled(MyTextInput)`
	max-width: 150px;
	margin: 0.5rem 0;
	text-align: center;
`

const StyledError = styled.div``

const StyledButton = styled.button`
	width: 150px;
	margin: 5px;
	padding: 5px;
`
