import Axios from 'axios'

Axios.defaults.headers.common.Accept = 'application/json';

Axios.interceptors.response.use((response) => {
	return response;
}, function (error) {
	const response = error.response;
	return Promise.reject(response);
});

Axios.interceptors.request.use((config) => {
	return config;
}, function (error) {
	return Promise.reject(error);
});
