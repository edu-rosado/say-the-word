
export const getTokenPayload = token => {
    if (token) {
      try {
        return JSON.parse(atob(token.split('.')[1]));
      } catch (error) {
        // ignore
      }
    }
  
    return null;
  };
