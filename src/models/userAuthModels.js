import executeQuery from "../utils/executeQuery.js";

// Henter rolle Id etter rolle-navn
export const getRoleByRolename = async (roleName) => {
  const query = "SELECT id FROM roles WHERE rolename = ?";
  const rows = await executeQuery(query, [roleName]);
  return rows[0]; 
};


// Henter bruker etter brukernavn
export const getUserByUsername = async (username) => {
  const query = "SELECT * FROM users WHERE username = ?";
  const rows = await executeQuery(query, [username]);
  return rows[0]; 
};

// Oppretter ny bruker
export const createUser = async (username, password, roleId) => {
  const query = "INSERT INTO users (username, password, roleId) VALUES (?, ?, ?)";
  await executeQuery(query, [username, password, roleId]);
};

// Henter bruker med rolle
export const getUserWithRole = async (username) => {
  const query = `
    SELECT users.id, users.username, users.password, users.roleId, roles.rolename
    FROM users
    JOIN roles ON users.roleId = roles.id
    WHERE users.username = ?`;
  const rows = await executeQuery(query, [username]);
  return rows[0]; 
};




