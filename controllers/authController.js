const login = async (req, res) => {
    return res.status(200).json("This is the login page..")
}

const register = async (req, res) => {
    return res.status(200).json("This is the registration page..")
}

module.exports = {
    login, 
    register
}
