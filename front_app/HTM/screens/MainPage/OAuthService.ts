import { OAuth2Client } from "google-auth-library"

export default class OAuthService {
	static getAccountFromIdToken = async (
		clientId: string,
		idToken: string
	): Promise<{
		id: string
		email: string
	} | null> => {
		const client = new OAuth2Client(clientId)
		const ticket = await client.verifyIdToken({
			idToken: idToken,
			audience: clientId
		})
		const payload = ticket.getPayload()
		return payload && payload.email
			? {
					id: payload.sub,
					email: payload.email
			  }
			: null
	}
}
