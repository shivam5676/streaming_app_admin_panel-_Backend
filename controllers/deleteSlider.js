const Slider = require("../models/Slider");

exports.deleteSlider = async (req, res, next) => {
    const { id } = req.params;
    console.log(id)
    try {
      const deleteResponse = await Slider.findByIdAndDelete(id);
      if(!deleteResponse){
        return res.status(400).json({msg:"could not deleted the slider ..try again "})
      }
      return res.status(200).json({msg:"slider deleted successfullly"})
      console.log(deleteResponse);
    } catch (err) {
        return res.status(500).json({msg:"something went wrong",err:err})
    }
  };