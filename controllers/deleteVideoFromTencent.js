const tencentcloud = require("tencentcloud-sdk-nodejs");
const VodClient = tencentcloud.vod.v20180717.Client;

// Initialize the client with your Tencent Cloud credentials
const clientConfig = {
    credential: {
        secretId: "IKID67v3DII5iEYikhhmy37DKH8tUxGi4FG6", // Replace with your Tencent Cloud SecretId
        secretKey: "87uDH7mNm3DA5ta6RcaMxKVUIsENIFBt", // Replace with your Tencent Cloud SecretKey
    },
    region: "ap-hongkong", // Correct region
    profile: {
        httpProfile: {
            endpoint: "vod.tencentcloudapi.com",
        },
    },
};

const client = new VodClient(clientConfig);

// Function to delete a video by FileId
function deleteVideo(fileId) {
    return new Promise((resolve, reject) => {
        const params = {
            FileId: fileId, // The ID of the media file you want to delete
        };

        client.DeleteMedia(params, (err, response) => {
            if (err) {
                console.error("Error deleting video:", err);
                reject(err);
            } else {
                console.log("Video deleted successfully:", response);
                resolve(response);
            }
        });
    });
}

// Example usage
const deleteVideoFromTencent = async (fileId) => {
    try {
        const response = await deleteVideo(fileId);
        console.log("Delete response:", response);
        return {msg:"file deleted from tencent server",status:true};
    } catch (error) {
        console.error("Error deleting video:", error);
        return {msg:"Error deleting video:",status:false,err:error};
    }
}

module.exports = deleteVideoFromTencent
