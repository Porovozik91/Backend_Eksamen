import bcrypt from "bcryptjs";
import { getUserByUsername, createUser, getUserWithRole, getRoleByRolename} from "../models/userAuthModels.js"; 
import { generateAccessToken, setAuthCookies, generateRefreshToken } from "../utils/jwtTokenManager.js"; 
import { responseLog } from "../utils/allLogManager.js";

// Registrering /Sikkerhet- krypterer passord og kjører algoritmen ti ganger
export const signUp = async (req, res) => {
  const { username, password, role } = req.body;
  console.log(req.body);

  try {
    const roleResult = await getRoleByRolename(role);
    if (!roleResult) return responseLog(res, 400, { message: `Fant ikke ${role} rolle i db.`  });

    const existingUser = await getUserByUsername(username);
    if (existingUser) return responseLog(res, 409, { message: "Brukernavnet er tatt, velg en annen" });

    const hashedPassword = await bcrypt.hash(password, 10); 

    await createUser(username, hashedPassword, roleResult.id);

    return responseLog(res, 201, { message: "Registrering er velykket!" });
  } catch (err) {
    console.error("Feil ved Registrering:", err);
    return responseLog(res, 500, { message: "Kunne ikke registrere brukeren, prøv igjen." });
  }
};

// Pålogging/ --jwt- beskytte endpunkter--sikkerlagring av jwt---
export const signIn = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await getUserWithRole(username);
      if (!user) {
      return responseLog(res, 401, { message: "Brukeren eksisterer ikke" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return responseLog(res, 401, { message: "Feil passord" });
    }

    const jwtToken = generateAccessToken(user);
    const refreshJwtToken = generateRefreshToken(user);

    setAuthCookies(res, jwtToken, refreshJwtToken);

    return responseLog(res, 200, { token: jwtToken });
  } catch (err) {
    console.error("Feil ved pålogging:", err);
    return responseLog(res, 500, { message: "Noe gikk galt, prøv igjen." });
  }
};

// Utlogging --tømmer jwt eksistens---
export const signOut = (req, res) => {
  try {
    res.clearCookie("jwtToken");
    res.clearCookie("refreshToken");
    return responseLog(res, 200, { message: "Brukeren er logget ut!" });
  } catch (err) {
    console.error("Feil ved utlogging:", err);
    return responseLog(res, 500, { message: "Kunne ikke logge ut brukeren" });
  }
};
