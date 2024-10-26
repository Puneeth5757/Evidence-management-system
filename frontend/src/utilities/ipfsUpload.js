import axios from 'axios';

const uploadToIPFS = async (file) => {
    const API_KEY = process.env.REACT_APP_PINATA_API_KEY; // Use environment variable for API key
    const API_SECRET = process.env.REACT_APP_PINATA_SECRET_API_KEY; // Use environment variable for API secret

    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
    
    const formData = new FormData();
    formData.append('file', file);

    const headers = {
        'pinata_api_key': API_KEY,
        'pinata_secret_api_key': API_SECRET,
        'Content-Type': 'multipart/form-data',
    };

    try {
        const response = await axios.post(url, formData, { headers });
        return response.data; // This will include the CID of the pinned file
    } catch (error) {
        console.error('Error uploading file to IPFS:', error);
        throw error;
    }
};

export default uploadToIPFS;
