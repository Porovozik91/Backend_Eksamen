import jwt from "jsonwebtoken";
import { refreshAccessToken } from "../utils/jwtTokenManager.js";
import { responseLog } from "../utils/allLogManager.js";

// Autentisering og tilgangskontroll.
const authMiddleware = (...allowedRoles) => {
    return async (req, res, next) => {
        const token = req.cookies.jwtToken;

        if (!token) {
            return responseLog(res, 401, { message: "Mangler token" });  
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.roleName)) {
                return responseLog(res, 403, {
                    message: `Tilgang nektet. Du har ikke ${allowedRoles.join(", ")} rolle.`,
                }); 
            }

            return next();  
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                const refreshToken = req.cookies.refreshToken;
                if (!refreshToken) {
                    return responseLog(res, 403, { message: "Mangler refresh token" }); 
                }

                try {
                    const newAccessToken = await refreshAccessToken(refreshToken, res);
                    return responseLog(res, 200, { message: "Token fornyet", newAccessToken }); 
                } catch (refreshErr) {
                    return responseLog(res, 403, { message: refreshErr.message }); 
                }
            }

            return responseLog(res, 403, { message: "Ugyldig token" }); 
        }
    };
};

export default authMiddleware;



