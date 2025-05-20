import axios from "axios"

export const api = axios.create({
    // baseURL: "https://project-backend-ja-5p.onrender.com/api"
    baseURL: "http://localhost:8000/api"
})

// api.interceptors.response.use(
//   response => response,
//   async error => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
        
//         const { data } = await axios.post('/refresh-token', {}, {withCredentials: true});
//         console.log(data)
//         // sessionStorage.setItem('@ACCESS_TOKEN', data.accessToken);
//         // originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
//         // return api(originalRequest);
//       } catch (err) {
//         // logout se refresh falhar
//         sessionStorage.clear();
//         window.location.href = '/login';
//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );