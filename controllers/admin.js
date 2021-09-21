
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const Content = require("../models/Content")
const {createObject,getObject,upload} = require("../aws/aws")
const Categories = require("../models/Categories")

module.exports.adminDashBoard = ((req,res)=>{
    
    res.render("admin/dashboard")
    
})


module.exports.newContentForm= ((req,res) =>{
    res.render("admin/newcontent")
})

module.exports.uploadNewContent = (async (req, res, next) => {
    const content = new Content(req.body.content)
    const category = await Categories.find({});
    for (let el in content.categories) {
        if (!category.includes(el)) {
            let newCat = new Categories(el);
            await newCat.save()
        }
    }
    await content.save();
    
    const params = {Bucket:process.env.BUCKET,Key:(content._id).toString(), 
         Body:req.files[0].buffer, ContentType: req.files[0].mimetype, ACL: 'public-read'}
       
    createObject(params)

    res.redirect("/admin/allcontent")

})

module.exports.showAllContent = (async (req,res)=>{
    
    const allContent = await Content.find({})
    for(let content of allContent){
        const params = {Bucket:process.env.BUCKET,Key:(content._id).toString(),}
        
        
    }
    console.log(allContent)
    res.render("admin/allcontent",{allContent})
})


module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const content =await Content.findById(id)
    content.aws =getObject({Bucket:proccess.env.BUCKET,Key:id,})
    if (!content) {
        req.flash('error', 'Cannot find that content!');
        return res.redirect('/admin/allcontent');}
    res.render("admin/edit", {content})
}