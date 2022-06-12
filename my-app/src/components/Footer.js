import React from 'react'
import styled from 'styled-components/macro'

const Footer = () => {
	return (
		<>
			<FooterContainer>
				<p>👤</p>
				<p>🕒</p>
				<p>⚙️</p>
			</FooterContainer>
		</>
	)
}

export default Footer

const FooterContainer = styled.footer`
	display: flex;
	justify-content: space-around;
	background-color: #e8e8e8;
	margin-top: 20px;
	cursor: pointer;
`
