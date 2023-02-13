import axios from "axios";

class UserService {
    deleteUser(id) {
        axios.get('http://localhost:4000/users/deleteUser/' + id)
        .then(() => {
            console.log('User Deleted Successfully');
        })
        .catch((error) => {
            console.log(error)
        })
    }
}

export default UserService;