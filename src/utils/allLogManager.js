/* 
en custom funkjson: aktiverer/deaktiverer logging 
*/

export const allLogManager = () => { 
    const originalLog = console.log;
    const originalError = console.error;

    if (process.env.LOGGING_ENABLED === "production") {
        console.log = () => {};  
        console.error = () => {}; 
    } else {
        console.log = originalLog;
        console.error = originalError;
    }
};


// holde koden dry, debugging og overvåking
export const responseLog = (res, statusCode, message) => {
    console.log(`[Response] Status: ${statusCode}, Message:`, message);
    return res.status(statusCode).json(message);
};
