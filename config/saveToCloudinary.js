const { uploadImage } = require("../middleware/uploadImages");
async function HandleSaveImage(img) {
  const imageObj = {
    public_id: "",
    url: "",
  };

  try {
    const uploadResult = await uploadImage(img);
    imageObj.public_id = uploadResult.public_id;
    imageObj.url = uploadResult.secure_url;
  } catch (err) {
    return err;
  }
  return imageObj;
}
module.exports = HandleSaveImage;
