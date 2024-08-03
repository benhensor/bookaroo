import React from 'react'
import styled from 'styled-components'

export default function Arrow({ isClicked }) {
	return (
		<ArrowWrapper
			$isClicked={isClicked}
			aria-expanded={isClicked ? true : false}
		>
			<svg
				width="12"
				height="8"
				viewBox="0 0 12 8"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M1.5 1.5L6.5 6.5L11.5 1.5"
					stroke="black"
					strokeWidth="2"
				/>
			</svg>
		</ArrowWrapper>
	)
}

const ArrowWrapper = styled.div`
	position: relative;
	top: -2px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-left: var(--sm);
	width: 1.2rem;
	height: 0.8rem;
	transition: transform 0.12s ease-in-out;
	transform: ${({ $isClicked }) =>
		$isClicked ? 'rotate(-180deg)' : 'rotate(0deg)'};
	svg {
		path {
			transition: var(--fast);
			stroke: ${({ $isClicked }) =>
				$isClicked ? 'var(--accentGreen)' : 'var(--dkGreen)'};
		}
	}
`
