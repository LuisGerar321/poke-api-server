import axios from "axios";
import axiosRetry from "axios-retry";

const axiosClient = axios.create({
  timeout: 15000,
});

axiosRetry(axiosClient, {
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 500;
  },
});

export default axiosClient;
