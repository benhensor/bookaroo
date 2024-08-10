import jwt from 'jsonwebtoken'

const authenticate = (req, res, next) => {
	const token = req.header('Authorization')
	if (!token)
		return res.status(401).json({ error: 'No token, authorization denied' })

	try {
		// Ensure the token is in the correct format
		const tokenParts = token.split(' ')
		if (tokenParts[0] !== 'Bearer' || !tokenParts[1]) {
			return res.status(400).json({ error: 'Token format is not valid' })
		}
		const decoded = jwt.verify(tokenParts[1], process.env.JWT_SECRET)

		if (!decoded.id) {
			return res.status(400).json({ error: 'Token is not valid' })
		}
		req.user = { id: decoded.id }
		next()
	} catch (error) {
		console.error('Error during token verification:', error.message)
		res.status(400).json({ error: 'Token is not valid' })
	}
}

export default authenticate
