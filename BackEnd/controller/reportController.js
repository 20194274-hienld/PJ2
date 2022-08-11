const { Report } = require('../model/report')
const { Post } = require('../model/post')
const jwt = require("jsonwebtoken");

const report = async (req, res) => {
    if (req.headers.authorization) {
        let token = req.headers.authorization.split(' ')[1];
        let userId;
        jwt.verify(token, "lehien2001", function (err, decodedToken) {
            if (err) {
                return res.json({ status: false, msg: "Invalid token" })
            }
            userId = decodedToken.userID;
        });
        
        if (userId) {
            const { reportID } = req.body
            let report = await Report.findOne({ _id: reportID })
            if (report) {
                return res.json({ status: false, msg: 'This report is existed' })
            } else {
                let newReport = new Report({ post: reportID })
                let p = await newReport.save()
                return res.json({ status: true, msg: p})
            }
        } else return res.json({ status: false, msg: 'Invalid token' })
    }
}


const getAllReport = async(req, res)=>{
    let listReport = await Post.find({ report: true, isDeleted: false }).populate({path: 'createdBy', options: { select: 'username right' }})
    return res.json({ status: true, data: listReport })
}

// exports.report = report
exports.getAllReport= getAllReport;