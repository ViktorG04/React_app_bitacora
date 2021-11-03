import CryptoJS from 'crypto-js';

const encrypt = (text) => {
    return CryptoJS.AES.encrypt(text,'aBc123vic').toString();
}

export default encrypt;