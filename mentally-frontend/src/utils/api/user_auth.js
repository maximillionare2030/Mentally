import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const api = axios.create({
    baseURL: API_BASE_URL,
});

export const signUp = async (nickname, email, password) => {
    try {
        const userData = {
            "email": email,
            "nickname": nickname, // corrected from email to nickname
            "password": password,
        };

        // Sending POST request to the API
        const response = await api.post("/user/signup", userData);

        // If successful, return the response message
        return response.data.message
    } catch (error) {
        console.error('Error signing up:', error.response?.data || error.message);

        // Access the "detail" field and return it
        return error.response?.data?.detail || error.message;  // Return the "detail" message if available
    }
};

export const logIn = async (email, password) => {
    const userData = {
        "email": email,
        "password": password
      }

      try {
        const response = await api.post("/user/login", userData);

        return response.data;
      } catch (error) {
        console.error('Error logging in:', error.response?.data || error.message);
        return error.response?.data?.detail || error.message;  // Return the "detail" message if available
      }

};

export const userPing = async (token) => {
    try {
        const response = await api.post("/user/ping", token);

        return response.data;
    } catch (err) {
        console.error('Error pinging:', err.response?.data || err.message);
        return false;
    }
};



export const getUserData = async (token) => {
    try {
        const response = await api.post("/user/get_user_data", {}, {
            headers: {
                'Authorization': token
            }
        });

        return response.data;
    } catch (err) {
        console.error('Error getting user data:', err.response?.data || err.message);
        return false;
    }
}

export const updateUserData = async (token, PHQ=null, anger=undefined, disgust=undefined, fear=undefined, happiness=undefined, sadness=undefined, surprise=undefined) => {
    try {
        // Prepare an object with only non-null/undefined fields
        const userData = {};

        if (PHQ !== undefined) userData.PHQ = PHQ;
        if (anger !== undefined) userData.anger = anger;
        if (disgust !== undefined) userData.disgust = disgust;
        if (fear !== undefined) userData.fear = fear;
        if (happiness !== undefined) userData.happiness = happiness;
        if (sadness !== undefined) userData.sadness = sadness;
        if (surprise !== undefined) userData.surprise = surprise;

        // Check if there's any data to send
        if (Object.keys(userData).length === 0) {
            throw new Error("No data to update.");
        }

        // Define the request headers
        const headers = {
            "Authorization": token,
        };

        console.log(userData);
        // Make the API call to update user data
        const response = await api.post("/user/update-mental-data", userData, { headers });

        // Check if the response was successful
        if (response.status === 200) {
            console.log("Data updated successfully:", response.data);
        } else {
            throw new Error("Failed to update data.");
        }
    } catch (error) {
        console.error("Error updating user data:", error);
    }
};



/**
 * @router.post('/update-mental-data')
async def update_mental_data(request: Request, data: MentalHealthData):
    headers = request.headers
    jwt = headers.get('Authorization')

    if not jwt:
        raise HTTPException(status_code=400, detail="Token not provided")
    
    try:
        # Verify the token
        user = auth.verify_id_token(jwt)
        uid = user['uid']

        # Get the existing mental_health_data
        user_data_ref = db.collection("users").document(uid)
        user_doc = user_data_ref.get()

        if user_doc.exists:
            current_data = user_doc.to_dict().get('mental_health_data', {})

            # Update the existing data with the new fields provided (excluding unset fields)
            updated_data = {**current_data, **data.dict(exclude_unset=True)}

            # Save the merged data back to Firestore
            user_data_ref.update({"mental_health_data": updated_data})
        else:
            raise HTTPException(status_code=404, detail="User not found")

    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid credentials: {str(e)}")

    return "Successfully updated data"
*/