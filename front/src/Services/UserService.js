import axios from "axios";
const UserService={}

UserService.inscription = function(data){

        return axios.post('http://127.0.0.1:3001/users/inscription',data)


}
UserService.login = function(data){

        return axios.post('http://127.0.0.1:3001/users/login',data)


}
UserService.applyUserSettings = function(headers, data){

        return axios.post('http://127.0.0.1:3001/users/applyUserSettings', data, headers)
}

UserService.applyCompanySettings = function(headers, data){

        return axios.post('http://127.0.0.1:3001/users/applyCompanySettings', data, headers)
}

UserService.getAdmin = function(headers){
        return axios.get('http://127.0.0.1:3001/users/getAdmin', headers)
}
UserService.getTokenValidation = function(headers){
        return axios.get("http://localhost:3001/users/getTokenValidation", headers)
}

export default UserService;