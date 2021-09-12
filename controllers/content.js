//jshint esversion:9

const Content = require("../models/Content")


module.exports.UploadNewContent = (async (req, res) => {
    const content = new Content(req.body.content)
    const category = await Categories.find({});
    for (let el in content.categories) {
        if (!category.includes(el)) {
            let newCat = new Categories(el);
            await newCat.save()
        }
    }
    await content.save();
    a
    
})
 
