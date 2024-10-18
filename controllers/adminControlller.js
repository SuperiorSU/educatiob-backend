const teacherSchema = require('../model/teacherModel')
const studentSchema = require('../model/studentModel')

exports.getAllTeachers = async(req, res)=>{
    try{
        const teachers = await teacherSchema.find();
        return res.status(200).json({
            success: true,
            allTeachers: teachers
        })
    }
    catch(err){
        return res.json({
            success: false,
            message: err.message
        })
    }
}

exports.getTeacher = async(req, res)=>{
    try{
        const teacher = await teacherSchema.findById(req.params.id);
        return res.status(200).json({
            success: true,
            teacher: teacher
        })
    }
    catch(err){
        return res.json({
            success: false,
            message: err.message
        })
    }
}

exports.deleteTeacher = async(req,res)=>{
    try{
        const teacher = await teacherSchema.findOneAndDelete({_id:req.params.id});
        return res.status(200).json({
            success: true,
            message: "Teacher deleted successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message: 'Cannot delete the teacher'
        })
    }
}

// students 


exports.getAllStudent = async(req, res)=>{
    try{
        const student = await studentSchema.find();
        return res.status(200).json({
            success: true,
            allStudents: student
        })
    }
    catch(err){
        return res.json({
            success: false,
            message: err.message
        })
    }
}

exports.getStudent = async(req, res)=>{
    try{
        const student = await studentSchema.findById(req.params.id);
        return res.status(200).json({
            success: true,
            student: student
        })
    }
    catch(err){
        return res.json({
            success: false,
            message: err.message
        })
    }
}

exports.deleteStudent = async(req,res)=>{
    try{
        const student = await studentSchema.findOneAndDelete({_id:req.params.id});
        return res.status(200).json({
            success: true,
            message: "Teacher deleted successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message: 'Cannot delete the teacher'
        })
    }
}
