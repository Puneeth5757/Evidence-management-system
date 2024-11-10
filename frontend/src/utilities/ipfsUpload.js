import axios from 'axios';

const uploadToIPFS = async (file) => {
  const API_KEY = process.env.REACT_APP_PINATA_API_KEY;
  const API_SECRET = process.env.REACT_APP_PINATA_SECRET_API_KEY;

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

    if (response.data && response.data.IpfsHash) {
      return response.data; // Returns the CID (IpfsHash)
    } else {
      throw new Error('Pinata did not return a valid CID.');
    }
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    throw error; // Rethrow error to be handled in the calling component
  }
};

export default uploadToIPFS;
