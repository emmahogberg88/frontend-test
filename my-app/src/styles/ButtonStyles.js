import styled from 'styled-components/macro'

export const StyledButton = styled.button`
	width: ${props => props.width};
	border-radius: 15px;
	background: ${props => props.background};
	font-family: 'poppins';
	text-transform: uppercase;
	border: none;
	padding: ${props => props.padding};
	margin: ${props => props.margin};
	box-shadow: ${props => props.boxShadow}; <-------change
	font-size: 0.5rem;
	// font-size: ${props => props.fontSize};

	&:hover {
		background: var(--accentgreen);
		text-decoration: ${props => props.textDecoration};
	}
`
