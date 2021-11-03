import CryptoJS from 'crypto-js';

const decrypt = (text) => {
    const bytes = CryptoJS.AES.decrypt(text, 'aBc123vic');
    return bytes.toString(CryptoJS.enc.Utf8);
}

export default decrypt;