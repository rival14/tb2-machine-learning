import axios from 'axios';
// import {showToast} from '~/utilities/util';
// import { useDispatch } from "react-redux";

// if (typeof window !== 'undefined') {
//   var token = localStorage.getItem('token') || null;
// }

//apply base url for axios
export const API_URL = 'http://192.168.1.7:3000/';
// const dispatch = useDispatch();

export const axiosApi = axios.create({
  baseURL: API_URL,
});

// axiosApi.interceptors.request.use(
//   async axiosConfig => {
//     const httpConfig = {...axiosConfig};
//     const token = localStorage.getItem('token') || null;
//     // console.log(token)
//     // if (token && isTokenExpired(token)) {
//     //   return await refreshToken().then(async (data) => {
//     //     console.log(data)
//     //     const { token: newToken } = data;
//     //     await localStorage.setItem('token', newToken);
//     //     httpConfig.headers.Authorization = `Bearer ${newToken}`;
//     //     return Promise.resolve(httpConfig);
//     //   });
//     // }
//     if (token) {
//       httpConfig.headers.Authorization = `Bearer ${token}`;
//     }
//     return httpConfig;
//   },
//   error => {
//     Promise.reject(error);
//   },
// );

// axiosApi.interceptors.response.use(
//   response => {
//     if (!response.data.status) {
//       if (
//         response.data.message == 'Token is Expired' ||
//         response.data.message == 'Token is Invalid' ||
//         response.data.message == 'Authorization Token not found'
//       ) {
//         // dispatch(logoutUser(res, props.history));
//         localStorage.removeItem('authUser');
//         localStorage.removeItem('token');
//         showToast('Your Session Has Expired. Please Login.');
//         setTimeout(() => {
//           window.location.replace(window.location.origin + '/my-account');
//         }, 1500);
//         return response;
//       }
//       response.data.message ? showToast(response.data.message, 'error') : null;
//       return response;
//     }
//     return response;
//   },

//   error => Promise.reject(error),
// );

export async function get(url, config = {}) {
  return await axiosApi.get(url, {...config}).then(response => response.data);
}

export async function post(url, data, config = {}) {
  return await axiosApi
    .post(url, {...data}, {...config})
    .then(response => response.data);
}

export async function put(url, data, config = {}) {
  return await axiosApi
    .put(url, {...data}, {...config})
    .then(response => response.data);
}

export async function postFormData(url, data, config = {}) {
  return await axiosApi
    .post(url, data, {...config})
    .then(response => response.data);
}

export async function del(url, config = {}) {
  return await axiosApi
    .delete(url, {...config})
    .then(response => response.data);
}

export async function download(url, filename, config = {responseType: 'blob'}) {
  return await axiosApi.get(url, {...config}).then(response => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
  });
}
