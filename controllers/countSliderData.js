const Slider = require("../models/Slider");

const countSliderData=async()=>{
    try {
        const totalSliders = await Slider.countDocuments(); 
    } catch (error) {
           
    }

}