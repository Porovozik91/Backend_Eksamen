import jwt from "jsonwebtoken";

/* 
 Håndterer generering og fornyelse av JWT-tokens, 
 samt administrasjon av tilhørende cookies.
*/

const generateToken = (user, secret, expiresIn) => {
    const payload = {
        id: user.id,
        username: user.username,
        roleId: user.role_id,
        roleName: user.rolename
    };
    return jwt.sign(payload, secret, { expiresIn });
};

export const generateAccessToken = (user) => 
    generateToken(user, process.env.JWT_SECRET, "1h");

export const generateRefreshToken = (user) => 
    generateToken(user, process.env.JWT_REFRESH_SECRET, "7d");

const setTokenCookie = (res, token, cookieName, expiresIn) => {
    const cookieOptions = {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",  
        expires: new Date(Date.now() + expiresIn)
    };
    console.log(`Setting cookie: ${cookieName}, Secure: ${cookieOptions.secure}`);
    res.cookie(cookieName, token, cookieOptions);
};

export const refreshAccessToken = async (refreshToken, res) => {
    try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const newAccessToken = generateAccessToken(decodedRefresh);
        setTokenCookie(res, newAccessToken, "jwtToken", 3600000); 
        return newAccessToken;
    } catch (err) {
        console.error("Feil ved fornyelse av token", err);
        throw new Error("Ugyldig eller utløpt refresh token");
    }
};

export const setAuthCookies = (res, jwtToken, refreshToken) => {
    setTokenCookie(res, jwtToken, "jwtToken", 3600000);
    setTokenCookie(res, refreshToken, "refreshToken", 7 * 24 * 60 * 60 * 1000);
};

